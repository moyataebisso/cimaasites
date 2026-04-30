import { supabaseAdmin } from '@/lib/supabase'
import { sendIntakeComplete } from '@/lib/emails'
import {
  createCheckoutSession,
  type CheckoutPlan,
} from '@/lib/stripe-checkout'

const VALID_PLANS: CheckoutPlan[] = ['basic', 'pro', 'developer']

export async function POST(request: Request) {
  const password = request.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const submissionId: string | undefined =
    body.submission_id || body.submissionId

  if (!submissionId) {
    return Response.json(
      { error: 'submission_id is required' },
      { status: 400 }
    )
  }

  const { data: submission, error: fetchError } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select(
      'id, contact_name, email, business_name, plan, status, intake_token'
    )
    .eq('id', submissionId)
    .single()

  if (fetchError || !submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 })
  }
  if (submission.status !== 'intake_done') {
    return Response.json(
      {
        error: `Submission is ${submission.status}, must be intake_done to send payment link`,
      },
      { status: 400 }
    )
  }
  if (!VALID_PLANS.includes(submission.plan as CheckoutPlan)) {
    return Response.json({ error: 'Submission has invalid plan' }, { status: 400 })
  }
  if (!submission.intake_token) {
    return Response.json(
      { error: 'Submission has no intake token' },
      { status: 400 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cimaasites.ai'

  let session
  try {
    session = await createCheckoutSession({
      submissionId: submission.id,
      plan: submission.plan as CheckoutPlan,
      email: submission.email,
      businessName: submission.business_name,
      successUrl: `${appUrl}/intake/${submission.intake_token}/paid`,
      cancelUrl: `${appUrl}/intake/${submission.intake_token}`,
    })
  } catch (err) {
    console.error('createCheckoutSession error:', err)
    return Response.json(
      { error: 'Could not create checkout session' },
      { status: 500 }
    )
  }

  // Stamp approved_at so the existing dashboard treats this as approved-for-payment.
  const { error: updateError } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
    })
    .eq('id', submission.id)

  if (updateError) {
    console.error('approved status update error:', updateError)
    // Continue — checkout URL is still valid; admin can re-send.
  }

  // Best-effort: email the customer.
  const emailResult = await sendIntakeComplete(submission, session.url)
  if (!emailResult.success) {
    console.error('sendIntakeComplete error:', emailResult.error)
  }

  return Response.json({
    success: true,
    checkoutUrl: session.url,
    emailSent: emailResult.success,
    emailError: emailResult.success ? null : emailResult.error,
  })
}
