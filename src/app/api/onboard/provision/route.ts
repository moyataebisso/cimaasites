import { supabaseAdmin } from '@/lib/supabase'
import { logStep } from '@/lib/provision/logger'
import { generateContent } from '@/lib/provision/generate-content'
import { createVercelProject } from '@/lib/provision/deploy-vercel'
import { seedClientDatabase } from '@/lib/provision/seed-database'
import { sendPreviewReadyEmail, sendYouNewClientEmail } from '@/lib/emails'

export async function POST(request: Request) {
  const { submissionId } = await request.json()

  // Respond immediately, run provisioning async
  provisionSite(submissionId).catch(async (error) => {
    console.error('Provisioning failed:', error)
    await logStep(
      submissionId,
      'provision_failed',
      'failed',
      'Provisioning encountered an error',
      error.message
    )
    await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', submissionId)

    await sendYouNewClientEmail({
      businessName: 'FAILED PROVISION',
      email: submissionId,
      plan: 'error',
      revenue: error.message,
    })
  })

  return new Response('Provisioning started', { status: 200 })
}

async function provisionSite(submissionId: string) {
  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('*')
    .eq('id', submissionId)
    .single()

  if (!submission) throw new Error('Submission not found')

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'provisioning',
      provisioning_started_at: new Date().toISOString(),
    })
    .eq('id', submissionId)

  // STEP A: Generate content with Claude AI
  await logStep(submissionId, 'generating_content', 'running', 'Generating your website content...')
  const content = await generateContent(submission)

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      generated_hero_headline: content.heroHeadline,
      generated_hero_subheading: content.heroSubheading,
      generated_about_text: content.aboutText,
      generated_services: content.services,
      generated_meta_title: content.metaTitle,
      generated_meta_description: content.metaDescription,
    })
    .eq('id', submissionId)

  await logStep(submissionId, 'generating_content', 'done', 'Content generated successfully')

  // STEP B: Create Vercel project + deploy
  await logStep(submissionId, 'creating_vercel_project', 'running', 'Setting up your website...')
  const vercelResult = await createVercelProject(submission)

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      client_vercel_project_id: vercelResult.projectId,
      client_preview_url: vercelResult.previewUrl,
    })
    .eq('id', submissionId)

  await logStep(submissionId, 'creating_vercel_project', 'done', 'Website deployed successfully')

  // STEP C: Seed database with their info
  await logStep(submissionId, 'setting_up_domain', 'running', 'Setting up your business data...')
  const { adminEmail, adminPassword } = await seedClientDatabase(submission, content)

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      client_admin_email: adminEmail,
      client_admin_password: adminPassword,
      assigned_subdomain: `${vercelResult.projectName}.vercel.app`,
    })
    .eq('id', submissionId)

  await logStep(submissionId, 'setting_up_domain', 'done', 'Business data configured')

  // STEP D: Send preview email
  await logStep(submissionId, 'sending_preview', 'running', 'Sending you the preview link...')

  await sendPreviewReadyEmail({
    email: submission.email,
    businessName: submission.business_name,
    previewUrl: vercelResult.previewUrl,
    adminEmail,
    adminPassword,
    submissionId,
  })

  await sendYouNewClientEmail({
    businessName: submission.business_name,
    email: submission.email,
    plan: submission.plan,
    revenue:
      submission.plan === 'basic' ? '$19/mo' : submission.plan === 'pro' ? '$35/mo' : '$49.99 one-time',
  })

  // STEP E: Mark as complete
  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'preview',
      provisioned_at: new Date().toISOString(),
      progress: 100,
    })
    .eq('id', submissionId)

  await logStep(submissionId, 'complete', 'done', 'Your website is ready to preview!')
}
