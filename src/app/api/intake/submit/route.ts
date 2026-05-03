import { supabaseAdmin } from '@/lib/supabase'
import { sendIntakeCompleteAdminAlert } from '@/lib/emails'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

interface ServiceInput {
  name?: unknown
  description?: unknown
  price?: unknown
}

interface DayHoursInput {
  isOpen?: unknown
  openTime?: unknown
  closeTime?: unknown
}

const TYPE_FIELDS = ['warm', 'bistro', 'wellness', 'editorial', 'modern', 'custom'] as const
type ThemeId = (typeof TYPE_FIELDS)[number]

const LAYOUT_KINDS = ['restaurant', 'salon', 'auto', 'general'] as const
type LayoutKind = (typeof LAYOUT_KINDS)[number]

const MIN_SERVICES = 4

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function asTheme(v: unknown): ThemeId {
  return TYPE_FIELDS.includes(v as ThemeId) ? (v as ThemeId) : 'warm'
}

function asLayoutKind(v: unknown): LayoutKind {
  return LAYOUT_KINDS.includes(v as LayoutKind) ? (v as LayoutKind) : 'general'
}

function asIntOrNull(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return Math.floor(v)
  if (typeof v === 'string' && v.trim()) {
    const n = parseInt(v, 10)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  return null
}

function asBoolOrNull(v: unknown): boolean | null {
  if (v === true || v === false) return v
  return null
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter((x) => x.length > 0)
}

function asStringOrNull(v: unknown): string | null {
  const s = asString(v)
  return s.length > 0 ? s : null
}

function sanitizeHours(input: unknown): Record<string, DayHoursInput> | null {
  if (!input || typeof input !== 'object') return null
  const out: Record<string, DayHoursInput> = {}
  for (const [k, v] of Object.entries(input as Record<string, DayHoursInput>)) {
    if (!v || typeof v !== 'object') continue
    out[k] = {
      isOpen: typeof v.isOpen === 'boolean' ? v.isOpen : true,
      openTime: typeof v.openTime === 'string' ? v.openTime : '09:00',
      closeTime: typeof v.closeTime === 'string' ? v.closeTime : '17:00',
    }
  }
  return out
}

function sanitizeServices(input: unknown): { name: string; description: string; price: string }[] {
  if (!Array.isArray(input)) return []
  return (input as ServiceInput[])
    .map((s) => ({
      name: asString(s?.name),
      description: asString(s?.description),
      price: asString(s?.price),
    }))
    .filter((s) => s.name.length > 0)
    .slice(0, 10)
}

function sanitizePhotoUrls(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return (input as unknown[])
    .map((u) => (typeof u === 'string' ? u.trim() : ''))
    .filter((u) => /^https?:\/\//i.test(u))
    .slice(0, 20)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const token = asString(body.token)
  const intake = (body.intakeData ?? {}) as Record<string, unknown>

  if (!token || token.length < 16) {
    return Response.json({ error: 'Invalid intake token' }, { status: 400 })
  }

  const { data: submission, error: lookupError } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select(
      'id, intake_token, contact_name, email, business_name, plan, status, intake_completed_at, business_description, selected_layout, layout_notes, submitted_at'
    )
    .eq('intake_token', token)
    .single()

  if (lookupError || !submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 })
  }
  if (submission.intake_completed_at) {
    return Response.json({ error: 'Already submitted' }, { status: 400 })
  }

  // ── Universal fields ────────────────────────────────────
  const tagline = asString(intake.tagline)
  const business_description = asString(intake.business_description)
  const business_type = asString(intake.business_type)
  const business_story = asString(intake.business_story)
  const years_in_business = asIntOrNull(intake.years_in_business)
  const address = asString(intake.address)
  const city = asString(intake.city)
  const state = asString(intake.state) || 'MN'
  const zip = asString(intake.zip)
  const hours = sanitizeHours(intake.hours)
  const services = sanitizeServices(intake.services)
  const selected_theme = asTheme(intake.selected_theme)
  const primary_color = asString(intake.primary_color) || '#facc15'
  const logo_url = asString(intake.logo_url) || null
  const photo_urls = sanitizePhotoUrls(intake.photo_urls)
  const notes = asString(intake.notes) || null
  const layout_kind = asLayoutKind(intake.layout_kind)

  // Universal validation (mirrors client)
  if (tagline.length < 5)
    return Response.json({ error: 'Tagline is too short' }, { status: 400 })
  if (business_description.length < 20)
    return Response.json(
      { error: 'Business description is too short' },
      { status: 400 }
    )
  if (business_type.length < 2)
    return Response.json({ error: 'Business type is required' }, { status: 400 })
  if (business_story.length < 50)
    return Response.json(
      { error: 'Business story must be at least 50 characters' },
      { status: 400 }
    )
  if (address.length < 5)
    return Response.json({ error: 'Address is required' }, { status: 400 })
  if (city.length < 2)
    return Response.json({ error: 'City is required' }, { status: 400 })
  if (!/^\d{5}$/.test(zip))
    return Response.json({ error: '5-digit zip required' }, { status: 400 })
  if (services.length < MIN_SERVICES)
    return Response.json(
      { error: `At least ${MIN_SERVICES} services are required` },
      { status: 400 }
    )

  // ── Layout-specific (only the relevant block populates) ──
  // Restaurant
  let cuisine_type: string | null = null
  let dietary_options: string[] = []
  let reservations: string | null = null
  let takeout: string | null = null
  let delivery: string | null = null
  let seating_capacity: number | null = null
  let atmosphere: string[] = []

  // Salon
  let salon_services: string[] = []
  let booking_required: string | null = null
  let staff_count: number | null = null
  let products_sold: boolean | null = null
  let specializations: string | null = null

  // Auto
  let auto_services: string[] = []
  let makes_models: string | null = null
  let certifications: string | null = null
  let warranty: string | null = null
  let loaner_vehicles: boolean | null = null

  // General
  let service_area_radius: number | null = null

  if (layout_kind === 'restaurant') {
    cuisine_type = asStringOrNull(intake.cuisine_type)
    dietary_options = asStringArray(intake.dietary_options)
    reservations = asStringOrNull(intake.reservations)
    takeout = asStringOrNull(intake.takeout)
    delivery = asStringOrNull(intake.delivery)
    seating_capacity = asIntOrNull(intake.seating_capacity)
    atmosphere = asStringArray(intake.atmosphere)
    if (!cuisine_type)
      return Response.json({ error: 'Cuisine type is required' }, { status: 400 })
  } else if (layout_kind === 'salon') {
    salon_services = asStringArray(intake.salon_services)
    booking_required = asStringOrNull(intake.booking_required)
    staff_count = asIntOrNull(intake.staff_count)
    products_sold = asBoolOrNull(intake.products_sold)
    specializations = asStringOrNull(intake.specializations)
    if (salon_services.length < 1)
      return Response.json(
        { error: 'Pick at least one salon service' },
        { status: 400 }
      )
  } else if (layout_kind === 'auto') {
    auto_services = asStringArray(intake.auto_services)
    makes_models = asStringOrNull(intake.makes_models)
    certifications = asStringOrNull(intake.certifications)
    warranty = asStringOrNull(intake.warranty)
    loaner_vehicles = asBoolOrNull(intake.loaner_vehicles)
    if (auto_services.length < 1)
      return Response.json(
        { error: 'Pick at least one auto service' },
        { status: 400 }
      )
  } else {
    // general
    service_area_radius = asIntOrNull(intake.service_area_radius)
    certifications = asStringOrNull(intake.certifications)
  }

  // Single jsonb mirror so the entire shape is queryable from one column.
  const intakeData = {
    tagline,
    business_description,
    business_type,
    business_story,
    years_in_business,
    address,
    city,
    state,
    zip,
    hours,
    services,
    layout_kind,
    cuisine_type,
    dietary_options,
    reservations,
    takeout,
    delivery,
    seating_capacity,
    atmosphere,
    salon_services,
    booking_required,
    staff_count,
    products_sold,
    specializations,
    auto_services,
    makes_models,
    certifications,
    warranty,
    loaner_vehicles,
    service_area_radius,
    selected_theme,
    primary_color,
    logo_url,
    photo_urls,
    notes,
  }

  const completedAt = new Date().toISOString()
  const { error: updateError } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      // Universal
      tagline,
      business_description,
      business_type,
      business_story,
      years_in_business,
      address,
      city,
      state,
      zip,
      hours,
      services,
      // Restaurant
      cuisine_type,
      dietary_options,
      reservations,
      takeout,
      delivery,
      seating_capacity,
      atmosphere,
      // Salon
      salon_services,
      booking_required,
      staff_count,
      products_sold,
      specializations,
      // Auto
      auto_services,
      makes_models,
      // certifications used by both auto + general — last writer wins
      certifications,
      warranty,
      loaner_vehicles,
      // General
      service_area_radius,
      // Style
      selected_theme,
      primary_color,
      logo_url,
      photo_urls,
      layout_notes: notes,
      // Mirror + state
      intake_data: intakeData,
      intake_completed_at: completedAt,
      status: 'intake_done',
      current_step: 'paid',
    })
    .eq('id', submission.id)

  if (updateError) {
    console.error('Intake update error:', updateError)
    return Response.json(
      { error: 'Could not save your intake. Try again?' },
      { status: 500 }
    )
  }

  // Best-effort admin alert.
  const alertResult = await sendIntakeCompleteAdminAlert(submission)
  if (!alertResult.success) {
    console.error('sendIntakeCompleteAdminAlert error:', alertResult.error)
  }

  return Response.json({ success: true })
}
