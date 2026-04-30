import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPaymentReceivedEmail } from '@/lib/emails'

export const runtime = 'nodejs'

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

    await supabaseAdmin
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

    // Best-effort: notify customer that payment was received. Fire-and-forget
    // so we don't delay the webhook response — Stripe times out around 10s.
    sendPaymentReceiptInBackground(submissionId).catch((err) => {
      console.error('[webhook] sendPaymentReceivedEmail error:', err)
    })

    // Trigger provisioning for setup/developer checkouts (not recurring invoices).
    // Use a host-header fallback so this works even when NEXT_PUBLIC_APP_URL is
    // missing in the deploy env (which silently broke this fetch in prod).
    const isSetup = checkoutType === 'setup' || checkoutType === 'developer'

    if (isSetup) {
      const host = request.headers.get('host')
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (host ? `https://${host}` : null)

      if (!baseUrl) {
        console.error(
          '[webhook] cannot trigger provision — no NEXT_PUBLIC_APP_URL and no host header',
          { submissionId }
        )
      } else {
        const provisionUrl = `${baseUrl}/api/onboard/provision`
        console.log('[webhook] triggering provision', {
          submissionId,
          checkoutType,
          provisionUrl,
        })

        // Fire-and-forget. Do NOT await — Stripe webhook must respond fast.
        fetch(provisionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId }),
        })
          .then((res) => {
            console.log('[webhook] provision trigger response', {
              submissionId,
              status: res.status,
            })
          })
          .catch((err) => {
            console.error('[webhook] failed to trigger provision', {
              submissionId,
              provisionUrl,
              error: err instanceof Error ? err.message : String(err),
            })
          })
      }
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
        console.warn(
          `invoice.paid: no submission found for stripe_customer_id=${customerId}; skipping log`
        )
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
