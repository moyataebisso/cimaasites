import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const { submissionId, plan, email, businessName } = await request.json()

  // Setup fee line items + subscription for Basic/Pro
  // Developer is a one-time payment only
  if (plan === 'developer') {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_DEVELOPER_PRICE_ID, quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/building/${submissionId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/get-started?cancelled=true`,
      metadata: {
        submissionId,
        plan,
        businessName,
        type: 'developer',
      },
    })

    await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({ stripe_session_id: session.id })
      .eq('id', submissionId)

    return Response.json({ url: session.url })
  }

  // Basic or Pro: setup fee + recurring subscription
  const setupPriceId = plan === 'basic'
    ? process.env.STRIPE_BASIC_SETUP_PRICE_ID
    : process.env.STRIPE_PRO_SETUP_PRICE_ID

  const monthlyPriceId = plan === 'basic'
    ? process.env.STRIPE_BASIC_MONTHLY_PRICE_ID
    : process.env.STRIPE_PRO_MONTHLY_PRICE_ID

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      // One-time setup fee (invoiced immediately with the subscription)
      { price: setupPriceId, quantity: 1 },
      // Recurring monthly
      { price: monthlyPriceId, quantity: 1 },
    ],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/building/${submissionId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/get-started?cancelled=true`,
    metadata: {
      submissionId,
      plan,
      businessName,
      type: 'setup',
    },
  })

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({ stripe_session_id: session.id })
    .eq('id', submissionId)

  return Response.json({ url: session.url })
}
