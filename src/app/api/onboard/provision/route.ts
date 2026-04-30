import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { logStep } from '@/lib/provision/logger'
import { generateContent } from '@/lib/provision/generate-content'
import { createVercelProject } from '@/lib/provision/deploy-vercel'
import { seedClientDatabase } from '@/lib/provision/seed-database'
import { createClientSchema } from '@/lib/provision/create-client-schema'
import { generateSlug } from '@/lib/provision/slug'
import { sendPreviewReadyEmail, sendYouNewClientEmail } from '@/lib/emails'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubmissionRow = any

export async function POST(request: NextRequest) {
  const { submissionId } = await request.json()

  if (!submissionId) {
    return Response.json({ error: 'submissionId required' }, { status: 400 })
  }

  // ─── Atomic claim ────────────────────────────────────────
  // Only one concurrent caller wins. Postgres handles the race in a single
  // statement: we update + filter on the lock columns, and PostgREST returns
  // the row only if the WHERE clause matches.
  //   - provisioning_started_at IS NULL  → no in-progress run
  //   - provisioned_at IS NULL           → not already done
  // Once a run fails, the catch handler clears provisioning_started_at so
  // manual retries can re-claim.
  const { data: claim, error: claimErr } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'provisioning',
      provisioning_started_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .is('provisioning_started_at', null)
    .is('provisioned_at', null)
    .select('*')
    .maybeSingle()

  if (claimErr) {
    console.error('[provision] claim error', { submissionId, error: claimErr })
    return Response.json({ error: 'claim failed' }, { status: 500 })
  }

  if (!claim) {
    // Either the submission doesn't exist, is already in progress, or already provisioned.
    console.log('[provision] already claimed or provisioned, skipping', {
      submissionId,
    })
    return Response.json({ success: true, skipped: true })
  }

  // We won the claim. Run provisioning in the background; respond fast.
  provisionSite(submissionId, claim).catch(async (error: Error) => {
    console.error('[provision] error', { submissionId, error: error.message })

    await logStep(
      submissionId,
      'provision_failed',
      'failed',
      'An error occurred during provisioning',
      error.message
    ).catch(console.error)

    // Release the claim so a manual retry can pick it up. Clear
    // provisioning_started_at so the .is(null) gate opens again.
    try {
      await supabaseAdmin
        .schema('cimaasites')
        .from('onboarding_submissions')
        .update({
          status: 'failed',
          error_message: error.message,
          provisioning_started_at: null,
        })
        .eq('id', submissionId)
    } catch (releaseErr) {
      console.error('[provision] claim release failed', releaseErr)
    }

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

// ─── Provisioning pipeline ───────────────────────────────────
// Each step is guarded by a DB-column check so a partial-success crash +
// manual retry won't duplicate work (no second Vercel project, no second
// admin user, no second welcome email).
async function provisionSite(
  submissionId: string,
  submission: SubmissionRow
) {
  const slug = generateSlug(submission.business_name)

  // ─── 0: Per-customer Postgres schema ───
  let schemaName: string = submission.client_supabase_schema
  if (!schemaName) {
    await logStep(
      submissionId,
      'creating_client_schema',
      'running',
      'Provisioning your isolated database...'
    )
    const result = await createClientSchema(slug)
    schemaName = result.schemaName

    await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({ client_supabase_schema: schemaName })
      .eq('id', submissionId)

    await logStep(
      submissionId,
      'creating_client_schema',
      'done',
      `Database ready (${schemaName})`
    )
  } else {
    await logStep(
      submissionId,
      'creating_client_schema',
      'done',
      `Reusing existing schema (${schemaName})`
    )
  }

  // ─── A: Generate content with Claude AI ───
  let content: Awaited<ReturnType<typeof generateContent>>
  if (submission.generated_hero_headline) {
    content = {
      heroHeadline: submission.generated_hero_headline,
      heroSubheading: submission.generated_hero_subheading,
      aboutText: submission.generated_about_text,
      services: submission.generated_services,
      metaTitle: submission.generated_meta_title,
      metaDescription: submission.generated_meta_description,
    }
    await logStep(
      submissionId,
      'generating_content',
      'done',
      'Reusing existing copy'
    )
  } else {
    await logStep(
      submissionId,
      'generating_content',
      'running',
      'Writing your website copy...'
    )

    content = await generateContent(submission)

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
  }

  // ─── B: Vercel project ───
  let vercelProjectId: string = submission.client_vercel_project_id
  let previewUrl: string = submission.client_preview_url
  let assignedSubdomain: string = submission.assigned_subdomain
  let projectName: string =
    assignedSubdomain?.replace(/\.vercel\.app$/, '') || ''

  if (!vercelProjectId || !previewUrl) {
    await logStep(
      submissionId,
      'creating_vercel_project',
      'running',
      'Setting up your website on our servers...'
    )

    const vercelResult = await createVercelProject(submission, schemaName)
    vercelProjectId = vercelResult.projectId
    previewUrl = vercelResult.previewUrl
    projectName = vercelResult.projectName
    assignedSubdomain = `${projectName}.vercel.app`

    await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({
        client_vercel_project_id: vercelProjectId,
        client_preview_url: previewUrl,
        assigned_subdomain: assignedSubdomain,
      })
      .eq('id', submissionId)

    await logStep(
      submissionId,
      'creating_vercel_project',
      'done',
      'Website deployed successfully'
    )
  } else {
    await logStep(
      submissionId,
      'creating_vercel_project',
      'done',
      'Reusing existing Vercel project'
    )
  }

  // ─── C: Seed database (admin user + content) ───
  let adminEmail: string = submission.client_admin_email
  let adminPassword: string = submission.client_admin_password

  if (!adminEmail || !adminPassword) {
    await logStep(
      submissionId,
      'setting_up_domain',
      'running',
      'Configuring your business information...'
    )

    const seeded = await seedClientDatabase(submission, content, schemaName)
    adminEmail = seeded.adminEmail
    adminPassword = seeded.adminPassword

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
  } else {
    await logStep(
      submissionId,
      'setting_up_domain',
      'done',
      'Reusing existing admin credentials'
    )
  }

  // ─── D: Welcome email (idempotent — guarded by welcome_email_sent_at) ───
  if (!submission.welcome_email_sent_at) {
    await logStep(
      submissionId,
      'sending_preview',
      'running',
      'Sending your preview link...'
    )

    await sendPreviewReadyEmail({
      email: submission.email,
      businessName: submission.business_name,
      previewUrl,
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
          ? '$399/mo'
          : submission.plan === 'developer'
            ? '$49.99 one-time'
            : '$299/mo',
    })

    await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq('id', submissionId)

    await logStep(
      submissionId,
      'sending_preview',
      'done',
      'Preview email sent!'
    )
  } else {
    await logStep(
      submissionId,
      'sending_preview',
      'done',
      'Preview email already sent — skipping duplicate'
    )
  }

  // ─── E: Mark complete ───
  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'preview',
      provisioned_at: new Date().toISOString(),
      progress: 100,
      current_step: 'complete',
      error_message: null,
    })
    .eq('id', submissionId)

  await logStep(
    submissionId,
    'complete',
    'done',
    'Your website is ready to preview!'
  )
}
