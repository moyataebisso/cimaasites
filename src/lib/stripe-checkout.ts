import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export type CheckoutPlan = 'basic' | 'pro' | 'developer'

export interface CreateCheckoutInput {
  submissionId: string
  plan: CheckoutPlan
  email: string
  businessName: string
  successUrl?: string
  cancelUrl?: string
}

export interface CreateCheckoutResult {
  url: string
  sessionId: string
}

/**
 * Creates a Stripe Checkout session for a Cimaa Sites onboarding submission and
 * persists the resulting session id + url back onto onboarding_submissions.
 *
 * - developer plan: one-time payment
 * - basic / pro: setup fee + recurring monthly subscription invoiced together
 */
export async function createCheckoutSession(
  input: CreateCheckoutInput
): Promise<CreateCheckoutResult> {
  const { submissionId, plan, email, businessName } = input

  const successUrl =
    input.successUrl ||
    `${process.env.NEXT_PUBLIC_APP_URL}/building/${submissionId}?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl =
    input.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/get-started?cancelled=true`

  let session

  if (plan === 'developer') {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        { price: process.env.STRIPE_DEVELOPER_PRICE_ID, quantity: 1 },
      ],
      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        submissionId,
        plan,
        businessName,
        type: 'developer',
      },
    })
  } else {
    const setupPriceId =
      plan === 'basic'
        ? process.env.STRIPE_BASIC_SETUP_PRICE_ID
        : process.env.STRIPE_PRO_SETUP_PRICE_ID

    const monthlyPriceId =
      plan === 'basic'
        ? process.env.STRIPE_BASIC_MONTHLY_PRICE_ID
        : process.env.STRIPE_PRO_MONTHLY_PRICE_ID

    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        { price: setupPriceId, quantity: 1 },
        { price: monthlyPriceId, quantity: 1 },
      ],
      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        submissionId,
        plan,
        businessName,
        type: 'setup',
      },
    })
  }

  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL')
  }

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      stripe_session_id: session.id,
      checkout_url: session.url,
    })
    .eq('id', submissionId)

  return { url: session.url, sessionId: session.id }
}
