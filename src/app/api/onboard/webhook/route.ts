import { waitUntil } from '@vercel/functions'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPaymentReceivedEmail } from '@/lib/emails'
import { getAppBaseUrl } from '@/lib/urls'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const submissionId = session.metadata?.submissionId
    const checkoutType = session.metadata?.type // 'setup' | 'developer' | undefined

    if (!submissionId) {
      return new Response('No submissionId', { status: 400 })
    }

    // Atomic payment claim. Stripe retries the event for ~24h on non-2xx
    // responses, and operators can resend from the dashboard. The
    // .is('paid_at', null) filter ensures the payment fields + receipt
    // email only fire on the FIRST delivery. The provision trigger below
    // runs unconditionally based on provisioned_at — so a duplicate event
    // arriving before provisioning has run will still kick it off.
    const { data: paidRow, error: payErr } = await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        amount_cents: session.amount_total,
      })
      .eq('id', submissionId)
      .is('paid_at', null)
      .select('id, paid_at, provisioned_at')
      .maybeSingle()

    if (payErr) {
      console.error('[webhook] paid claim error', { submissionId, error: payErr })
      // Don't return 500 — Stripe would retry forever. Return 200 and let
      // operator triage from logs.
      return new Response('OK (db error logged)', { status: 200 })
    }

    // Resolve current provisioned_at — either from the claim (first time,
    // freshly updated row) or by re-reading the row (duplicate event path).
    let provisionedAt: string | null
    const wasDuplicate = !paidRow

    if (paidRow) {
      // First-time delivery: log payment + send receipt.
      provisionedAt = paidRow.provisioned_at

      await supabaseAdmin
        .schema('cimaasites')
        .from('provisioning_logs')
        .insert({
          submission_id: submissionId,
          step: 'payment_received',
          status: 'done',
          message: 'Payment confirmed by Stripe',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })

      sendPaymentReceiptInBackground(submissionId).catch((err) => {
        console.error('[webhook] sendPaymentReceivedEmail error:', err)
      })
    } else {
      // Duplicate event: don't re-update payment fields, don't re-send
      // receipt. But we DO need to know if provisioning has happened so we
      // can re-trigger if it never ran.
      const { data: existing } = await supabaseAdmin
        .schema('cimaasites')
        .from('onboarding_submissions')
        .select('paid_at, provisioned_at')
        .eq('id', submissionId)
        .maybeSingle()

      provisionedAt = existing?.provisioned_at ?? null

      console.warn('[webhook] duplicate event for already-paid submission', {
        sessionId: session.id,
        submissionId,
        originalPaidAt: existing?.paid_at ?? null,
        provisionedAt,
      })
    }

    // ALWAYS evaluate the provision trigger based on provisioned_at, not on
    // first-vs-duplicate. The provision route's own atomic claim guarantees
    // only one run actually executes even if we trigger multiple times.
    const isSetup = checkoutType === 'setup' || checkoutType === 'developer'

    if (provisionedAt) {
      console.log('[webhook] already provisioned, skipping provision trigger', {
        submissionId,
        provisionedAt,
      })
    } else if (!isSetup) {
      console.log('[webhook] non-setup checkout — skipping provision trigger', {
        submissionId,
        checkoutType,
      })
    } else {
      // baseUrl is now always defined — getAppBaseUrl falls back through env →
      // host header → hardcoded prod. The previous null-check is no longer
      // needed but the URL value is still worth logging so a misconfigured env
      // var (or unexpected host header) is visible in `triggering_provision`.
      const baseUrl = getAppBaseUrl(request)
      const provisionUrl = `${baseUrl}/api/onboard/provision`
      console.log('[webhook] triggering_provision', {
        submissionId,
        checkoutType,
        provisionUrl,
        wasDuplicate,
        timestamp: new Date().toISOString(),
      })

      // Don't await — Stripe webhook must return 200 fast. But also don't let
      // Vercel kill the serverless function the instant we return: wrap the
      // promise in waitUntil() so the platform keeps the dispatch fetch alive
      // until /api/onboard/provision has at least received the request and
      // claimed the row (which is sub-second; the slow provisioning runs in
      // that route's own function). Without waitUntil, Vercel tore down this
      // function mid-fetch and the provision route never saw the request —
      // confirmed for Adama Test 7.
      waitUntil(
        fetch(provisionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId }),
        })
          .then(async (res) => {
            console.log('[webhook] provision_trigger_response', {
              submissionId,
              status: res.status,
              ok: res.ok,
              statusText: res.statusText,
              provisionUrl,
              timestamp: new Date().toISOString(),
            })
            if (!res.ok) {
              const body = await res.text().catch(() => '<unreadable>')
              console.error('[webhook] provision_trigger_non_ok_body', {
                submissionId,
                status: res.status,
                provisionUrl,
                body: body.slice(0, 500),
              })
            }
          })
          .catch((err: unknown) => {
            const isErr = err instanceof Error
            console.error('[webhook] provision_trigger_failed', {
              submissionId,
              provisionUrl,
              error: isErr ? err.message : String(err),
              stack: isErr ? err.stack : undefined,
              timestamp: new Date().toISOString(),
            })
          })
      )

      // Sync log — proves the fetch was at least scheduled before this
      // function returns. Vercel can terminate fire-and-forget promises
      // once the response is sent; this lets us see in logs whether we
      // even got to the dispatch.
      console.log('[webhook] provision_fetch_dispatched', { submissionId })
    }
  }

  if (event.type === 'invoice.paid') {
    // Recurring monthly payment — log only
    const invoice = event.data.object
    const customerId = invoice.customer as string | null

    if (customerId) {
      const { data: ownerSubmission } = await supabaseAdmin
        .schema('cimaasites')
        .from('onboarding_submissions')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (ownerSubmission?.id) {
        await supabaseAdmin
          .schema('cimaasites')
          .from('provisioning_logs')
          .insert({
            submission_id: ownerSubmission.id,
            step: 'recurring_payment',
            status: 'done',
            message: `Recurring payment received: ${invoice.amount_paid} cents`,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          })
      } else {
        // Recurring invoice for a customer we don't have an onboarding row
        // for (e.g., legacy clients pre-cimaasites). Informational, not a
        // problem — keep visible but stop screaming as a warning.
        console.log('[webhook] invoice.paid recurring (no provision needed)', {
          stripe_customer_id: customerId,
        })
      }
    }
  }

  return new Response('OK', { status: 200 })
}

async function sendPaymentReceiptInBackground(submissionId: string) {
  const { data: paidSubmission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('contact_name, business_name, email, plan')
    .eq('id', submissionId)
    .single()

  if (paidSubmission?.email) {
    await sendPaymentReceivedEmail({
      email: paidSubmission.email,
      contactName:
        paidSubmission.contact_name || paidSubmission.business_name,
      businessName: paidSubmission.business_name,
      plan: paidSubmission.plan,
    })
  }
}
