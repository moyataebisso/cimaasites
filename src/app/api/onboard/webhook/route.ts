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

    // Best-effort: notify customer that payment was received and build is starting.
    // Do NOT block provisioning if the email fails.
    try {
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
    } catch (err) {
      console.error('sendPaymentReceivedEmail error:', err)
    }

    // Only run full provisioning for setup payments (not recurring invoices)
    const isSetup = checkoutType === 'setup' || checkoutType === 'developer'

    if (isSetup) {
      // Fire and forget provisioning
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/onboard/provision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }),
      }).catch(console.error)
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
