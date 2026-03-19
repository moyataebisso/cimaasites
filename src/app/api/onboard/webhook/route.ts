import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Fire and forget provisioning
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/onboard/provision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId }),
    }).catch(console.error)
  }

  return new Response('OK', { status: 200 })
}
