import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { logStep } from '@/lib/provision/logger'
import { generateContent } from '@/lib/provision/generate-content'
import { createVercelProject } from '@/lib/provision/deploy-vercel'
import { seedClientDatabase } from '@/lib/provision/seed-database'
import { sendPreviewReadyEmail, sendYouNewClientEmail } from '@/lib/emails'

export async function POST(request: NextRequest) {
  const { submissionId } = await request.json()

  // Respond immediately — webhook needs fast response
  provisionSite(submissionId).catch(async (error) => {
    console.error('Provisioning error:', error)

    await logStep(
      submissionId,
      'provision_failed',
      'failed',
      'An error occurred during provisioning',
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
      businessName: 'PROVISIONING FAILED',
      email: submissionId,
      plan: 'ERROR',
      revenue: error.message,
    }).catch(console.error)
  })

  return new Response(
    JSON.stringify({ message: 'Provisioning started' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

async function provisionSite(submissionId: string) {
  const { data: submission, error } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('*')
    .eq('id', submissionId)
    .single()

  if (error || !submission) {
    throw new Error(`Submission not found: ${submissionId}`)
  }

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'provisioning',
      provisioning_started_at: new Date().toISOString(),
    })
    .eq('id', submissionId)

  // ─── A: Generate content with Claude AI ───
  await logStep(
    submissionId,
    'generating_content',
    'running',
    'Writing your website copy...'
  )

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

  await logStep(
    submissionId,
    'generating_content',
    'done',
    'Website copy generated'
  )

  // ─── B: Deploy to Vercel ───
  await logStep(
    submissionId,
    'creating_vercel_project',
    'running',
    'Setting up your website on our servers...'
  )

  const vercelResult = await createVercelProject(submission)

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      client_vercel_project_id: vercelResult.projectId,
      client_preview_url: vercelResult.previewUrl,
      assigned_subdomain: `${vercelResult.projectName}.vercel.app`,
    })
    .eq('id', submissionId)

  await logStep(
    submissionId,
    'creating_vercel_project',
    'done',
    'Website deployed successfully'
  )

  // ─── C: Seed database ───
  await logStep(
    submissionId,
    'setting_up_domain',
    'running',
    'Configuring your business information...'
  )

  const { adminEmail, adminPassword } = await seedClientDatabase(
    submission,
    content
  )

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      client_admin_email: adminEmail,
      client_admin_password: adminPassword,
    })
    .eq('id', submissionId)

  await logStep(
    submissionId,
    'setting_up_domain',
    'done',
    'Business information configured'
  )

  // ─── D: Send preview email ───
  await logStep(
    submissionId,
    'sending_preview',
    'running',
    'Sending your preview link...'
  )

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
    plan: submission.plan || 'basic',
    revenue:
      submission.plan === 'pro'
        ? '$35/mo'
        : submission.plan === 'developer'
          ? '$49.99 one-time'
          : '$19/mo',
  })

  await logStep(
    submissionId,
    'sending_preview',
    'done',
    'Preview email sent!'
  )

  // ─── E: Mark complete ───
  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'preview',
      provisioned_at: new Date().toISOString(),
      progress: 100,
      current_step: 'complete',
    })
    .eq('id', submissionId)

  await logStep(
    submissionId,
    'complete',
    'done',
    'Your website is ready to preview!'
  )
}
