import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { logStep } from '@/lib/provision/logger'
import { generateContent } from '@/lib/provision/generate-content'
import { generateMenuItems } from '@/lib/provision/generate-menu'
import { generatePhotoSet } from '@/lib/provision/generate-photos'
import { createVercelProject } from '@/lib/provision/deploy-vercel'
import { seedClientDatabase } from '@/lib/provision/seed-database'
import { createClientSchema } from '@/lib/provision/create-client-schema'
import { generateSlug } from '@/lib/provision/slug'
import {
  sendPreviewReadyEmail,
  sendYouNewClientEmail,
  revenueLabel,
} from '@/lib/emails'

// Vercel Pro: allow up to ~13 minutes for the full provisioning pipeline
// (Anthropic content generation + Vercel API calls + deploy poll + seeding).
export const maxDuration = 800
export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubmissionRow = any

export async function POST(request: NextRequest) {
  const { submissionId } = await request.json()

  console.log('[provision] entry', { submissionId })

  if (!submissionId) {
    console.warn('[provision] missing submissionId in request body')
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

  console.log('[provision] claim result', {
    submissionId,
    claimed: !!claim,
    claimErr: claimErr?.message ?? null,
    rowId: claim?.id ?? null,
    businessName: claim?.business_name ?? null,
  })

  if (claimErr) {
    console.error('[provision] claim error', { submissionId, error: claimErr })
    return Response.json({ error: 'claim failed' }, { status: 500 })
  }

  if (!claim) {
    console.log('[provision] already claimed or provisioned, skipping', {
      submissionId,
    })
    return Response.json({ success: true, skipped: true })
  }

  console.log('[provision] proceeding with provisioning', {
    submissionId,
    id: claim.id,
    business_name: claim.business_name,
    plan: claim.plan,
  })

  // ─── Run provisioning INLINE ──────────────────────────────
  // Vercel terminates fire-and-forget promises when the function response
  // is sent — the previous .catch() pattern silently killed the pipeline
  // mid-execution after the claim UPDATE returned. With maxDuration=800
  // we have ~13 min, and the caller (webhook) already fire-and-forgets
  // its POST to us, so blocking here doesn't hold the webhook open.
  try {
    const result = await provisionSite(submissionId, claim)
    console.log('[provision] complete', { submissionId, ...result })
    return Response.json({ success: true, ...result })
  } catch (error) {
    // String(err) on plain objects yields "[object Object]" — that's how
    // "Revenue: [object Object]/mo" leaked into the failure alert email.
    // Postgres error objects from supabase-js are { code, message, details, hint };
    // pull message out explicitly, then fall back to JSON.
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message: unknown }).message)
          : JSON.stringify(error)
    console.error('[provision] error', { submissionId, error: message, raw: error })

    await logStep(
      submissionId,
      'provision_failed',
      'failed',
      'An error occurred during provisioning',
      message
    ).catch(console.error)

    // Release the claim so a manual retry can pick it up. Clear
    // provisioning_started_at so the .is(null) gate opens again.
    try {
      await supabaseAdmin
        .schema('cimaasites')
        .from('onboarding_submissions')
        .update({
          status: 'failed',
          error_message: message,
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
      revenue: message,
    }).catch(console.error)

    return Response.json({ success: false, error: message }, { status: 500 })
  }
}

// ─── Provisioning pipeline ───────────────────────────────────
// Each step is guarded by a DB-column check so a partial-success crash +
// manual retry won't duplicate work (no second Vercel project, no second
// admin user, no second welcome email).
async function provisionSite(
  submissionId: string,
  submission: SubmissionRow
): Promise<{ previewUrl: string; schemaName: string }> {
  const slug = generateSlug(submission.business_name)
  console.log('[provision] step: schema creation', { submissionId, slug })

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
    console.log('[provision] schema created', { submissionId, schemaName })
  } else {
    await logStep(
      submissionId,
      'creating_client_schema',
      'done',
      `Reusing existing schema (${schemaName})`
    )
    console.log('[provision] schema reused', { submissionId, schemaName })
  }

  // ─── A: Generate content with Claude AI ───
  console.log('[provision] step: AI copy generation', { submissionId })
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
    console.log('[provision] content reused from DB', { submissionId })
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
    console.log('[provision] content generated', {
      submissionId,
      headlineLen: content.heroHeadline?.length ?? 0,
    })
  }

  // ─── A2: Menu items (restaurants only, idempotent) ───
  if (submission.generated_menu_items != null) {
    console.log('[provision] menu items already generated — skipping', {
      submissionId,
      count: Array.isArray(submission.generated_menu_items)
        ? submission.generated_menu_items.length
        : 0,
    })
  } else {
    console.log('[provision] step: menu generation', { submissionId })
    const menuItems = await generateMenuItems(submission).catch((err) => {
      console.error('[provision] menu generation failed (non-fatal)', { err })
      return []
    })
    await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({ generated_menu_items: menuItems })
      .eq('id', submissionId)
    submission.generated_menu_items = menuItems
    console.log('[provision] menu items generated', {
      submissionId,
      count: menuItems.length,
    })
  }

  // ─── A3: Stock photos (Unsplash, idempotent) ───
  if (submission.generated_hero_image) {
    console.log('[provision] photos already curated — skipping', {
      submissionId,
    })
  } else {
    console.log('[provision] step: photo curation', { submissionId })
    const photos = await generatePhotoSet(submission).catch((err) => {
      console.error('[provision] photo curation failed (non-fatal)', { err })
      return { hero: '', about: '', menu: [], gallery: [] }
    })
    await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({
        generated_hero_image: photos.hero,
        generated_about_image: photos.about,
        generated_menu_images: photos.menu,
        generated_gallery: photos.gallery,
      })
      .eq('id', submissionId)
    submission.generated_hero_image = photos.hero
    submission.generated_about_image = photos.about
    submission.generated_menu_images = photos.menu
    submission.generated_gallery = photos.gallery
    console.log('[provision] photos curated', {
      submissionId,
      heroSet: !!photos.hero,
      aboutSet: !!photos.about,
      menuCount: photos.menu.length,
      galleryCount: photos.gallery.length,
    })
  }

  // ─── B: Vercel project ───
  console.log('[provision] step: vercel project creation', { submissionId })
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
    console.log('[provision] vercel project created', {
      submissionId,
      vercelProjectId,
      previewUrl,
    })
  } else {
    await logStep(
      submissionId,
      'creating_vercel_project',
      'done',
      'Reusing existing Vercel project'
    )
    console.log('[provision] vercel project reused', {
      submissionId,
      vercelProjectId,
      previewUrl,
    })
  }

  // ─── C: Seed database (admin user + content) ───
  console.log('[provision] step: seed database', { submissionId })
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
    console.log('[provision] database seeded', { submissionId, adminEmail })
  } else {
    await logStep(
      submissionId,
      'setting_up_domain',
      'done',
      'Reusing existing admin credentials'
    )
    console.log('[provision] admin creds reused', { submissionId, adminEmail })
  }

  // ─── D: Welcome email (idempotent — guarded by welcome_email_sent_at) ───
  console.log('[provision] step: welcome email', {
    submissionId,
    alreadySent: !!submission.welcome_email_sent_at,
  })
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
      revenue: revenueLabel(submission.plan || 'basic'),
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
    console.log('[provision] welcome emails sent', {
      submissionId,
      to: submission.email,
    })
  } else {
    await logStep(
      submissionId,
      'sending_preview',
      'done',
      'Preview email already sent — skipping duplicate'
    )
    console.log('[provision] welcome email skipped (already sent)', {
      submissionId,
    })
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

  return { previewUrl, schemaName }
}
