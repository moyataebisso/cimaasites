import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const { submissionId, plan, email, businessName } = await request.json()

  const priceId =
    plan === 'basic'
      ? process.env.STRIPE_BASIC_PRICE_ID
      : plan === 'pro'
        ? process.env.STRIPE_PRO_PRICE_ID
        : process.env.STRIPE_DEV_PRICE_ID

  const mode = plan === 'developer' ? ('payment' as const) : ('subscription' as const)

  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/building/${submissionId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/get-started?cancelled=true`,
    metadata: {
      submissionId,
      plan,
      businessName,
    },
  })

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({ stripe_session_id: session.id })
    .eq('id', submissionId)

  return Response.json({ url: session.url })
}
