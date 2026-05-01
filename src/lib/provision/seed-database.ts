import { supabaseAdmin } from '@/lib/supabase'

// Layout → default hero variant. Kept here so the AI/starter-app don't have
// to know about layout-specific defaults — site_settings carries the resolved
// variant string the starter-app reads on boot.
const LAYOUT_DEFAULT_HERO: Record<string, string> = {
  fleet: 'solid_color',
  restaurant: 'image_overlay',
  salon: 'image_overlay',
  healthcare: 'solid_color',
  community: 'image_overlay',
  home_services: 'image_overlay',
}

// 12 chars, no ambiguous (0/O/1/l/I) so customers can re-type from email.
function generatePassword(): string {
  const chars =
    'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Submission = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratedContent = any

export async function seedClientDatabase(
  submission: Submission,
  content: GeneratedContent,
  schemaName: string
) {
  console.log('[seed] start', { schemaName, submissionId: submission.id })

  const db = supabaseAdmin.schema(schemaName)

  const layoutId: string = submission.selected_layout || 'restaurant'
  const heroVariant: string =
    LAYOUT_DEFAULT_HERO[layoutId] || LAYOUT_DEFAULT_HERO.fleet

  // ─── 1. site_settings ───────────────────────────────────
  // public.site_settings columns: key (text PK), value (jsonb).
  // supabase-js serializes strings/objects/arrays to JSON correctly when
  // the column is jsonb, so we just hand it native values.
  const settings: { key: string; value: unknown }[] = [
    { key: 'business_name', value: submission.business_name || '' },
    {
      key: 'tagline',
      value: submission.tagline || content?.heroSubheading || '',
    },
    {
      key: 'business_description',
      value: submission.business_description || content?.aboutText || '',
    },
    { key: 'business_type', value: submission.business_type || '' },
    { key: 'phone', value: submission.phone || '' },
    { key: 'email', value: submission.email || '' },
    { key: 'address', value: submission.address || '' },
    { key: 'city', value: submission.city || '' },
    { key: 'state', value: submission.state || '' },
    { key: 'zip', value: submission.zip || '' },
    { key: 'hours', value: submission.hours || {} },
    { key: 'selected_layout', value: layoutId },
    {
      key: 'selected_theme',
      value: submission.selected_theme || 'warm',
    },
    { key: 'active_hero_variant', value: heroVariant },
    {
      key: 'primary_color',
      value: submission.primary_color || '#facc15',
    },
    { key: 'logo_url', value: submission.logo_url || '' },
    { key: 'photo_urls', value: submission.photo_urls || [] },
    { key: 'social_links', value: submission.social_links || {} },
    { key: 'hero_headline', value: content?.heroHeadline || '' },
    { key: 'hero_subheading', value: content?.heroSubheading || '' },
    { key: 'about_text', value: content?.aboutText || '' },
    { key: 'meta_title', value: content?.metaTitle || '' },
    { key: 'meta_description', value: content?.metaDescription || '' },
  ]

  console.log('[seed] inserting site_settings', { count: settings.length })
  try {
    const { error } = await db
      .from('site_settings')
      .upsert(settings, { onConflict: 'key' })
    if (error) throw error
  } catch (err) {
    console.error('[seed] site_settings upsert failed', { schemaName, err })
    throw err
  }

  // ─── 2. services ────────────────────────────────────────
  // Prefer AI-generated services (richer copy) when available, fall back to
  // raw submission services from the intake form.
  type ServiceSrc = {
    name?: string
    title?: string
    description?: string
    summary?: string
    price?: string | number
    cost?: string | number
  }
  const generatedServices: ServiceSrc[] = Array.isArray(content?.services)
    ? content.services
    : []
  const submittedServices: ServiceSrc[] = Array.isArray(submission.services)
    ? submission.services
    : []
  const services: ServiceSrc[] =
    generatedServices.length > 0 ? generatedServices : submittedServices

  console.log('[seed] inserting services', { count: services.length })
  for (let i = 0; i < services.length; i++) {
    const svc = services[i]
    const name = (svc.name || svc.title || `Service ${i + 1}`).trim()
    if (!name) continue

    // Match the actual public.services columns. `sort_order` does NOT exist
    // on this table — including it produces PGRST204 schema-cache errors.
    try {
      const { error } = await db.from('services').insert({
        name,
        description: (svc.description || svc.summary || '').toString(),
        price: (svc.price ?? svc.cost ?? '').toString(),
        is_active: true,
      })
      if (error) throw error
    } catch (err) {
      const code = (err as { code?: string })?.code
      if (code === '23505') {
        // duplicate name on retry — silently skip
        console.log('[seed] skipping duplicate service', { name })
      } else {
        console.error('[seed] services insert failed', { schemaName, name, err })
        throw err
      }
    }
  }

  // ─── 3. admin auth user ─────────────────────────────────
  console.log('[seed] creating admin user', { email: submission.email })
  const adminPassword = generatePassword()

  let adminUserId: string | undefined
  try {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: submission.email,
        password: adminPassword,
        user_metadata: { role: 'admin', schema: schemaName },
        email_confirm: true,
      })

    if (authError) {
      // If the user already exists from a previous attempt, this isn't fatal —
      // they'll need to reset their password but the site still works.
      console.error('[seed] auth.admin.createUser error (non-fatal)', {
        message: authError.message,
        status: authError.status,
      })
    } else {
      adminUserId = authData?.user?.id
    }
  } catch (err) {
    console.error('[seed] createUser threw', { err })
    // Don't throw — site is still usable; client can reset password via email.
  }

  console.log('[seed] complete', {
    schemaName,
    adminEmail: submission.email,
    adminUserId,
    settingsWritten: settings.length,
    servicesWritten: services.length,
  })

  return {
    adminEmail: submission.email,
    adminPassword,
    adminUserId,
  }
}
