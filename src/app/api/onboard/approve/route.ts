import { supabaseAdmin } from '@/lib/supabase'
import { sendSiteLiveEmail, sendYouNewClientEmail } from '@/lib/emails'

export async function POST(request: Request) {
  const { submissionId } = await request.json()

  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('*')
    .eq('id', submissionId)
    .single()

  if (!submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 })
  }

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'live',
      approved_at: new Date().toISOString(),
      live_at: new Date().toISOString(),
      client_live_url: submission.client_preview_url,
    })
    .eq('id', submissionId)

  await supabaseAdmin
    .schema('cimaasites')
    .from('clients')
    .insert({
      submission_id: submissionId,
      business_name: submission.business_name,
      email: submission.email,
      plan: submission.plan,
      status: 'active',
      monthly_revenue_cents:
        submission.plan === 'basic' ? 1900 : submission.plan === 'pro' ? 3500 : 4999,
      live_url: submission.client_preview_url,
      admin_url: `${submission.client_preview_url}/admin`,
      vercel_project_id: submission.client_vercel_project_id,
      domain: submission.assigned_subdomain,
    })

  try {
    await sendSiteLiveEmail({
      email: submission.email,
      businessName: submission.business_name,
      liveUrl: submission.client_preview_url,
      adminUrl: `${submission.client_preview_url}/admin`,
    })

    await sendYouNewClientEmail({
      businessName: submission.business_name,
      email: submission.email,
      plan: submission.plan,
      revenue:
        submission.plan === 'basic' ? '$299' : submission.plan === 'pro' ? '$399' : '$49.99',
    })
  } catch (err) {
    console.error('Email send error:', err)
  }

  return Response.json({
    success: true,
    liveUrl: submission.client_preview_url,
    adminUrl: `${submission.client_preview_url}/admin`,
    adminEmail: submission.client_admin_email,
    adminPassword: submission.client_admin_password,
  })
}
