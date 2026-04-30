import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { sendIntakeLink } from '@/lib/emails'

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
      'id, contact_name, email, business_name, plan, status, intake_token, business_description, selected_layout, layout_notes, created_at'
    )
    .eq('id', submissionId)
    .single()

  if (fetchError || !submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (submission.status !== 'pending') {
    return Response.json(
      {
        error: `Already sent or further along (status: ${submission.status})`,
      },
      { status: 400 }
    )
  }

  // Backfill a token if the row predates the migration default.
  let intakeToken = submission.intake_token
  if (!intakeToken) {
    intakeToken = randomBytes(16).toString('hex')
    const { error: tokenError } = await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({ intake_token: intakeToken })
      .eq('id', submission.id)
    if (tokenError) {
      console.error('intake_token backfill error:', tokenError)
      return Response.json(
        { error: 'Could not assign intake token' },
        { status: 500 }
      )
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cimaasites.ai'
  const intakeUrl = `${appUrl}/intake/${intakeToken}`

  const emailResult = await sendIntakeLink(submission, intakeUrl)
  if (!emailResult.success) {
    // Log and continue — we still mark the row as intake_sent so the admin
    // can manually share the link from the Detail panel if needed.
    console.error('sendIntakeLink error:', emailResult.error)
  }

  const sentAt = new Date().toISOString()
  const { error: updateError } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'intake_sent',
      current_step: 'intake',
      intake_sent_at: sentAt,
    })
    .eq('id', submission.id)

  if (updateError) {
    console.error('intake_sent update error:', updateError)
    return Response.json(
      { error: 'Email queued but status update failed', intakeUrl },
      { status: 500 }
    )
  }

  return Response.json({
    success: true,
    intakeUrl,
    emailSent: emailResult.success,
    emailError: emailResult.success ? null : emailResult.error,
  })
}
