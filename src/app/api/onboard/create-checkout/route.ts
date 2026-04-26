import {
  createCheckoutSession,
  type CheckoutPlan,
} from '@/lib/stripe-checkout'

const VALID_PLANS: CheckoutPlan[] = ['basic', 'pro', 'developer']

export async function POST(request: Request) {
  const { submissionId, plan, email, businessName } = await request.json()

  if (!VALID_PLANS.includes(plan)) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const { url } = await createCheckoutSession({
    submissionId,
    plan,
    email,
    businessName,
  })

  return Response.json({ url })
}
