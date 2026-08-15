import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminPassword } from '@/lib/admin-auth'
import { sendCheckoutLinkEmail } from '@/lib/emails'

export async function POST(request: Request) {
  const denied = requireAdminPassword(request)
  if (denied) return denied

  const body = await request.json()
  const submissionId: string | undefined = body.submissionId

  if (!submissionId) {
    return Response.json({ error: 'submissionId is required' }, { status: 400 })
  }

  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select(
      'id, status, contact_name, business_name, email, plan, checkout_url'
    )
    .eq('id', submissionId)
    .single()

  if (!submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (submission.status !== 'approved') {
    return Response.json(
      {
        error: `Submission is ${submission.status}, must be approved to resend checkout link`,
      },
      { status: 400 }
    )
  }

  if (!submission.checkout_url) {
    return Response.json(
      { error: 'Submission has no checkout URL — re-approve to generate one' },
      { status: 400 }
    )
  }

  try {
    await sendCheckoutLinkEmail({
      email: submission.email,
      contactName: submission.contact_name || submission.business_name,
      businessName: submission.business_name,
      plan: submission.plan,
      checkoutUrl: submission.checkout_url,
    })
  } catch (err) {
    console.error('sendCheckoutLinkEmail error:', err)
    return Response.json(
      { error: 'Could not send email. Try again.' },
      { status: 500 }
    )
  }

  return Response.json({ success: true })
}
