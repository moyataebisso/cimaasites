import { supabaseAdmin } from '@/lib/supabase'
import { fetchMenuItemImage } from './generate-photos'
import { logStep } from './logger'

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

// Coerce arbitrary value into a text representation for the `value` column
// of site_settings. The starter-app reads from value_json; `value` is a text
// mirror kept for legacy tools that don't speak jsonb.
function toText(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  try {
    return JSON.stringify(v)
  } catch {
    return ''
  }
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
  // public.site_settings has BOTH `value` (text) and `value_json` (jsonb).
  // The starter-app reads from value_json — but we mirror to value (text)
  // so legacy queries / older tooling don't see NULL. Native JS values
  // (objects, arrays) only round-trip correctly through value_json.
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
    // Canonical key names the starter-app reads. Submission columns stay
    // `selected_*` (those are user-input fields on cimaasites.onboarding_submissions);
    // only the written key in client_*.site_settings is `active_*`.
    { key: 'active_layout', value: layoutId },
    {
      key: 'active_theme',
      value: submission.selected_theme || 'bistro',
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
    // AI-curated stock photos (Unsplash). Empty string / [] when curation
    // failed or UNSPLASH_ACCESS_KEY was missing — starter-app falls back
    // to its layout default in that case.
    { key: 'hero_image_url', value: submission.generated_hero_image || '' },
    { key: 'about_image_url', value: submission.generated_about_image || '' },
    { key: 'menu_images', value: submission.generated_menu_images || [] },
    { key: 'gallery_images', value: submission.generated_gallery || [] },
  ]

  // Write both columns. `onConflict: 'key'` overwrites any prior partial
  // garbage from earlier failed runs.
  const upsertPayload = settings.map((s) => ({
    key: s.key,
    value: toText(s.value), // text mirror
    value_json: s.value, // primary — what the starter-app reads
  }))

  console.log('[seed] inserting site_settings', { count: upsertPayload.length })
  try {
    const { error } = await db
      .from('site_settings')
      .upsert(upsertPayload, { onConflict: 'key' })
    if (error) throw error
    console.log('[seed] site_settings upsert ok', { count: upsertPayload.length })
  } catch (err) {
    console.error('[seed] site_settings upsert failed', { schemaName, err })
    throw err
  }

  // ─── 2. services ────────────────────────────────────────
  // public.services columns (verified):
  //   id (uuid PK), name (text NOT NULL), description (text), duration_min (int),
  //   price (numeric), is_active (bool), max_capacity (int),
  //   requires_prepayment (bool), created_at (timestamptz)
  //
  // Prefer AI-generated services (richer copy) when available, fall back to
  // raw submission services from the intake form.
  type ServiceSrc = {
    name?: string
    title?: string
    description?: string
    summary?: string
    price?: string | number
    cost?: string | number
    duration?: number
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

    // Parse price to numeric. The column is `numeric`, NOT text — sending an
    // empty string here used to produce "invalid input syntax for type numeric".
    // Customer-entered prices are messy ("$15-25 per plate", "Custom quote",
    // "Free"); anything that doesn't reduce to a positive number → null.
    const rawPrice = svc.price ?? svc.cost
    let priceNumeric: number | null = null
    if (rawPrice != null && rawPrice !== '') {
      const parsed =
        typeof rawPrice === 'number'
          ? rawPrice
          : Number(String(rawPrice).replace(/[^0-9.]/g, ''))
      priceNumeric = Number.isFinite(parsed) && parsed > 0 ? parsed : null
    }

    // If the customer typed a descriptive price ("$15-25 per plate", "Free",
    // "Call for quote"), preserve it by appending to description so it's not
    // silently lost. The customer can always tidy it via the admin UI.
    const baseDescription = (svc.description || svc.summary || '').toString()
    const rawPriceStr =
      rawPrice != null ? String(rawPrice).trim() : ''
    const isDescriptivePrice = rawPriceStr.length > 0 && priceNumeric === null
    const finalDescription = isDescriptivePrice
      ? `${baseDescription}\n\nPricing: ${rawPriceStr}`.trim()
      : baseDescription

    try {
      const { error } = await db.from('services').insert({
        name,
        description: finalDescription,
        price: priceNumeric, // numeric or null
        duration_min: typeof svc.duration === 'number' ? svc.duration : null,
        is_active: true,
      })
      if (error) throw error
      console.log('[seed] service inserted', { name, priceNumeric })
    } catch (err) {
      const code = (err as { code?: string })?.code
      if (code === '23505') {
        // duplicate name on retry — silently skip
        console.log('[seed] skipping duplicate service', { name })
      } else {
        console.error('[seed] service insert failed', { schemaName, name, err })
        throw err
      }
    }
  }

  // ─── 2b. menu_items (restaurants only) ─────────────────
  // Populated by generateMenuItems during provisioning. Empty array for
  // non-restaurant layouts. Per-row try/catch so a column-name surprise
  // logs the offending row but doesn't abort the whole seed.
  const menuItems: Array<{
    name?: string
    description?: string
    price?: string
    category?: string
    featured?: boolean
  }> = Array.isArray(submission.generated_menu_items)
    ? submission.generated_menu_items
    : []

  if (menuItems.length > 0) {
    console.log('[seed] inserting menu_items', { count: menuItems.length })

    // Fetch a per-dish Unsplash image for every menu item in parallel.
    // Sequential lookup would add ~6s to provisioning. Each call returns
    // string-or-null and never throws, so failures degrade gracefully to
    // image_url=null and the starter-app falls back at render time.
    const cuisine =
      typeof submission.cuisine_type === 'string' &&
      submission.cuisine_type.trim()
        ? submission.cuisine_type.trim()
        : null

    await logStep(
      submission.id,
      'menu_images',
      'running',
      'Fetching dish photos from Unsplash'
    ).catch(() => {})

    const imageUrls = await Promise.all(
      menuItems.map((item) =>
        fetchMenuItemImage((item.name || '').trim(), cuisine)
      )
    )

    const imagesFound = imageUrls.filter((u) => !!u).length
    console.log('[seed] menu_items images resolved', {
      requested: menuItems.length,
      found: imagesFound,
    })

    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i]
      const itemName = (item.name || '').trim()
      if (!itemName) continue

      // Parse price to numeric ($12, $12-15, "Market price" → null)
      let priceNumeric: number | null = null
      if (item.price) {
        const parsed = Number(String(item.price).replace(/[^0-9.]/g, ''))
        priceNumeric =
          Number.isFinite(parsed) && parsed > 0 ? parsed : null
      }

      try {
        const { error } = await db.from('menu_items').insert({
          name: itemName,
          description: item.description || '',
          price: priceNumeric,
          category: item.category || 'main',
          is_featured: item.featured === true,
          is_active: true,
          image_url: imageUrls[i] || null,
        })
        if (error) {
          // Don't throw — menu_items column shape may differ from spec;
          // log and continue so the rest of the site still seeds cleanly.
          console.error('[seed] menu_item insert failed (non-fatal)', {
            name: itemName,
            err: error,
          })
        } else {
          console.log('[seed] menu_item inserted', {
            name: itemName,
            priceNumeric,
            featured: item.featured === true,
            hasImage: !!imageUrls[i],
          })
        }
      } catch (err) {
        console.error('[seed] menu_item insert exception (non-fatal)', {
          name: itemName,
          err,
        })
      }
    }

    await logStep(
      submission.id,
      'menu_images',
      'done',
      `${imagesFound}/${menuItems.length} dishes got images`
    ).catch(() => {})
  } else {
    console.log('[seed] no menu items to seed', {
      layout: submission.selected_layout,
    })
  }

  // Auth user creation moved to the invite step (see admin-invite.ts) so we
  // generate the user + invite link together right before the welcome email.
  // Eliminates the plaintext-password-in-DB step entirely.
  console.log('[seed] complete', {
    schemaName,
    adminEmail: submission.email,
    settingsWritten: settings.length,
    servicesWritten: services.length,
  })

  return {
    adminEmail: submission.email,
  }
}
