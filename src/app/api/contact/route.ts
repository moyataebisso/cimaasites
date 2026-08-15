import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import {
  sendContactAdminAlert,
  sendContactReceivedConfirmation,
} from '@/lib/emails'
import { isLayoutId, type LayoutId } from '@/lib/layouts'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

const VALID_PLANS = ['basic', 'pro', 'developer'] as const

// Stricter than the previous EMAIL_REGEX which accepted things like
// "a@b.c" — this requires a real 2+ char TLD and rejects spaces/quotes.
// Still permissive enough to accept everything a normal user would type.
const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

// SMS-to-email gateways. Contact form submits from these addresses are
// almost always spam relays or reply-bombs — reject silently.
const SMS_GATEWAY_DOMAINS = new Set([
  'vtext.com',
  'txt.att.net',
  'tmomail.net',
  'msg.fi.google.com',
  'vzwpix.com',
  'mms.att.net',
  'pm.sprint.com',
])

// Silent success shape — matches the real success response body so
// spam bots can't distinguish a real submit from a silently-dropped one.
const SILENT_SUCCESS = { success: true, id: null, submissionId: null }

// Minimum time between page mount and submit. Human users take several
// seconds to fill the form; bots that auto-fill and submit trip this.
const MIN_MOUNT_MS = 3000

// Dedupe window: don't re-emit admin alert for the same normalized
// email within this window. Avoids the amplifier where a bot submits
// "foo@gmail.com", "f.o.o@gmail.com", "foo+a@gmail.com", etc. to
// generate multiple admin alerts to the same inbox.
const DEDUPE_WINDOW_HOURS = 24

// Some clients (and at least one upstream form processor) wrap email
// addresses in markdown link syntax: "[a@b.com](mailto:a@b.com)".
// Strip that down to the plain address before validation.
const MARKDOWN_EMAIL_RE = /^\[([^\]]+)\]\(mailto:[^)]+\)$/
function unwrapMarkdownEmail(s: string): string {
  const m = s.match(MARKDOWN_EMAIL_RE)
  return m ? m[1] : s
}

const digitsOnly = (s: string) => s.replace(/[^0-9]/g, '')

// Normalize an email for dedupe. Gmail treats dots in the local part as
// insignificant and everything after a `+` as a tag, so "f.oo+bar@gmail.com"
// and "foo@gmail.com" deliver to the same inbox. googlemail.com is
// Gmail's German alias. Non-Gmail addresses are only lowercased.
function normalizeEmail(raw: string): string {
  const lower = raw.trim().toLowerCase()
  const [local, domain] = lower.split('@')
  if (!local || !domain) return lower
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const stripped = local.replace(/\./g, '').split('+')[0]
    return `${stripped}@gmail.com`
  }
  return lower
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  // ── Silent drops (200 + success-shaped body) ─────────────
  // Never surface these as errors — a spam bot that sees an error learns
  // its trick was noticed. Real users can't trip these paths.

  // 1. Honeypot: a real user can't type into an off-screen input.
  if (typeof body.website === 'string' && body.website.trim().length > 0) {
    return Response.json(SILENT_SUCCESS)
  }

  // 2. Mount timestamp: humans take longer than MIN_MOUNT_MS to fill.
  //    Bots that auto-fill and submit immediately trip this.
  const mountedAt =
    typeof body.mountedAt === 'number' && Number.isFinite(body.mountedAt)
      ? body.mountedAt
      : null
  if (mountedAt !== null && Date.now() - mountedAt < MIN_MOUNT_MS) {
    return Response.json(SILENT_SUCCESS)
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const rawEmail = typeof body.email === 'string' ? body.email.trim() : ''
  const email = unwrapMarkdownEmail(rawEmail).trim()
  const businessName =
    typeof body.business_name === 'string' ? body.business_name.trim() : ''
  const phoneRaw = typeof body.phone === 'string' ? body.phone.trim() : ''
  const phone = digitsOnly(phoneRaw)
  const plan = typeof body.plan === 'string' ? body.plan : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  // 3. SMS-gateway address → silent drop. These aren't real prospects.
  const emailDomain = email.toLowerCase().split('@')[1] || ''
  if (SMS_GATEWAY_DOMAINS.has(emailDomain)) {
    return Response.json(SILENT_SUCCESS)
  }

  // ── Server-side validation (don't trust client) ──────────
  if (name.length < 2) {
    return Response.json(
      { error: 'Name must be at least 2 characters' },
      { status: 400 }
    )
  }
  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 })
  }
  if (!EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 })
  }
  if (businessName.length < 2) {
    return Response.json(
      { error: 'Business name must be at least 2 characters' },
      { status: 400 }
    )
  }
  if (phone.length < 10) {
    return Response.json(
      { error: 'Phone must contain at least 10 digits' },
      { status: 400 }
    )
  }
  if (!VALID_PLANS.includes(plan as (typeof VALID_PLANS)[number])) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }
  if (!isLayoutId(body.selected_layout)) {
    return Response.json({ error: 'Invalid layout' }, { status: 400 })
  }
  const selectedLayout: LayoutId = body.selected_layout

  // ── Dedupe on normalized email ───────────────────────────
  // Blocks the amplifier where a bot submits foo@, f.o.o@, foo+a@ (all
  // deliver to the same Gmail inbox) to spam the admin alert. Also
  // prevents a real user's accidental double-submit from double-emailing.
  // In-memory match (no normalized_email column exists yet) — fetches
  // the recent window and normalizes each row's email at query time.
  const windowStart = new Date(
    Date.now() - DEDUPE_WINDOW_HOURS * 60 * 60 * 1000
  ).toISOString()
  const normalizedIncoming = normalizeEmail(email)
  const { data: recent } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('email')
    .gte('submitted_at', windowStart)
    .limit(500)
  const isDuplicate =
    Array.isArray(recent) &&
    recent.some((r) => normalizeEmail(r.email || '') === normalizedIncoming)
  if (isDuplicate) {
    return Response.json(SILENT_SUCCESS)
  }

  // ── Insert ───────────────────────────────────────────────
  const intakeToken = randomBytes(16).toString('hex')

  const { data, error } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .insert({
      contact_name: name,
      email,
      phone,
      business_name: businessName,
      plan,
      business_description: message || null,
      selected_layout: selectedLayout,
      layout_notes: null, // moved to Step 2 intake
      intake_token: intakeToken,
      status: 'pending',
      current_step: 'form',
      progress: 0,
    })
    .select(
      'id, contact_name, email, business_name, plan, business_description, selected_layout, layout_notes, submitted_at'
    )
    .single()

  if (error || !data) {
    console.error('Contact submission insert error:', error)
    return Response.json(
      { error: 'Could not save your message. Please try again.' },
      { status: 500 }
    )
  }

  // Fire both emails best-effort. Never block the response on email failure.
  const adminResult = await sendContactAdminAlert(data)
  if (!adminResult.success) {
    console.error('sendContactAdminAlert error:', adminResult.error)
  }

  const customerResult = await sendContactReceivedConfirmation(data)
  if (!customerResult.success) {
    console.error('sendContactReceivedConfirmation error:', customerResult.error)
  }

  return Response.json({ success: true, id: data.id, submissionId: data.id })
}
