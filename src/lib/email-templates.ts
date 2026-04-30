/**
 * Email design system for Waji Professional Websites.
 *
 * Email-safe constraints (do not refactor away):
 *   - TABLE-based layouts only (Outlook chokes on flex/grid).
 *   - All styles inline. Gmail strips <style> blocks in <head>.
 *   - System font stack only — no @font-face.
 *   - Max width 600px centered. Mobile-first.
 *
 * Brand colors are mirrored from globals.css cimaa tokens so emails
 * read as the same product as the site.
 */

const FONT_STACK =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const COLORS = {
  bgCanvas: '#fef3c7', // cimaa-bg-tan — outer page bg
  bgCard: '#ffffff', // inner content card
  bgStrip: '#fde68a', // cimaa-bg-amber — header/footer strip
  yellow: '#facc15', // cimaa-yellow — primary CTA
  yellowDark: '#eab308', // hover/border tint
  green: '#15803d', // success
  text: '#18181b', // dark
  textMuted: '#71717a', // muted body
  textSubtle: '#9ca3af', // very subtle
  border: '#e7e5e4',
  bgInfo: '#fafaf7', // info card bg
  bgCode: '#1f2937', // dark code block
  textCode: '#fcd34d', // amber on dark code
} as const

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://cimaasites.vercel.app'

export interface BuildEmailArgs {
  preheader: string
  title: string
  intro: string
  bodyHtml: string
  ctaText?: string
  ctaUrl?: string
  footerNote?: string
}

export function buildEmail({
  preheader,
  title,
  intro,
  bodyHtml,
  ctaText,
  ctaUrl,
  footerNote,
}: BuildEmailArgs): string {
  const ctaBlock = ctaText && ctaUrl ? renderCta(ctaText, ctaUrl) : ''
  const footerNoteBlock = footerNote ? renderFooterNote(footerNote) : ''

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgCanvas};font-family:${FONT_STACK};color:${COLORS.text};-webkit-font-smoothing:antialiased;">
  <!-- Hidden inbox preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${COLORS.bgCanvas};opacity:0;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bgCanvas};width:100%;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${COLORS.bgCard};border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;">

          <!-- Header strip -->
          <tr>
            <td style="background-color:${COLORS.bgStrip};padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <span style="font-size:28px;line-height:1;vertical-align:middle;">💻</span>
                    <span style="font-family:${FONT_STACK};font-size:22px;font-weight:700;color:${COLORS.text};letter-spacing:-0.01em;margin-left:10px;vertical-align:middle;">Waji</span>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding-top:6px;">
                    <span style="font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.12em;color:${COLORS.text};text-transform:uppercase;">Professional Websites</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title + intro -->
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <h1 style="margin:0;font-family:${FONT_STACK};font-size:28px;line-height:1.25;font-weight:600;color:${COLORS.text};letter-spacing:-0.01em;">
                ${title}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 8px 32px;">
              <p style="margin:0;font-family:${FONT_STACK};font-size:16px;line-height:1.6;color:#4a4a4a;">
                ${intro}
              </p>
            </td>
          </tr>

          <!-- Body slot -->
          <tr>
            <td style="padding:24px 32px;">
              ${bodyHtml}
            </td>
          </tr>

          ${ctaBlock}
          ${footerNoteBlock}

          <!-- Footer strip -->
          <tr>
            <td style="background-color:${COLORS.bgStrip};padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left">
                    <p style="margin:0;font-family:${FONT_STACK};font-size:14px;font-weight:700;color:${COLORS.text};">
                      Waji Professional Websites
                    </p>
                    <p style="margin:4px 0 0 0;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textMuted};">
                      Custom websites for local businesses
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding-top:14px;">
                    <a href="${APP_URL}/contact" style="font-family:${FONT_STACK};font-size:12px;color:${COLORS.text};text-decoration:none;font-weight:500;">Get a Quote</a>
                    <span style="color:${COLORS.textSubtle};margin:0 8px;">·</span>
                    <a href="${APP_URL}/admin" style="font-family:${FONT_STACK};font-size:12px;color:${COLORS.text};text-decoration:none;font-weight:500;">Customer Login</a>
                    <span style="color:${COLORS.textSubtle};margin:0 8px;">·</span>
                    <a href="${APP_URL}/contact" style="font-family:${FONT_STACK};font-size:12px;color:${COLORS.text};text-decoration:none;font-weight:500;">Contact</a>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding-top:14px;">
                    <p style="margin:0;font-family:${FONT_STACK};font-size:11px;color:${COLORS.textMuted};line-height:1.5;">
                      &copy; 2026 Waji Professional Websites by Arsi Technology Group LLC &middot; Designed in Minneapolis
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function renderCta(text: string, url: string): string {
  return `
          <tr>
            <td align="center" style="padding:8px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:${COLORS.yellow};border-radius:10px;">
                    <a href="${url}"
                       target="_blank"
                       rel="noopener noreferrer"
                       style="display:inline-block;padding:14px 32px;font-family:${FONT_STACK};font-size:16px;font-weight:700;color:${COLORS.text};text-decoration:none;border-radius:10px;letter-spacing:-0.005em;">
                      ${escapeHtml(text)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
}

function renderFooterNote(note: string): string {
  return `
          <tr>
            <td align="center" style="padding:0 32px 32px 32px;">
              <p style="margin:0;font-family:${FONT_STACK};font-size:13px;font-style:italic;color:${COLORS.textMuted};text-align:center;line-height:1.5;">
                ${note}
              </p>
            </td>
          </tr>`
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\r?\n/g, '<br />')
}

// ─────────────────────────────────────────────
// Reusable body fragments
// ─────────────────────────────────────────────

function infoTable(rows: { label: string; value: string }[]): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bgInfo};border:1px solid ${COLORS.border};border-radius:10px;">
  <tr><td style="padding:8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rows
        .map(
          (r, i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:${i < rows.length - 1 ? `1px solid ${COLORS.border}` : 'none'};vertical-align:top;width:140px;">
          <p style="margin:0;font-family:${FONT_STACK};font-size:12px;font-weight:600;color:${COLORS.textMuted};text-transform:uppercase;letter-spacing:0.06em;">${escapeHtml(r.label)}</p>
        </td>
        <td style="padding:10px 12px;border-bottom:${i < rows.length - 1 ? `1px solid ${COLORS.border}` : 'none'};vertical-align:top;">
          <p style="margin:0;font-family:${FONT_STACK};font-size:14px;color:${COLORS.text};line-height:1.5;word-break:break-word;">${r.value}</p>
        </td>
      </tr>`
        )
        .join('')}
    </table>
  </td></tr>
</table>`
}

function numberedList(items: string[]): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  ${items
    .map(
      (item, i) => `
  <tr>
    <td valign="top" style="width:36px;padding:6px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" valign="middle"
              style="width:28px;height:28px;background-color:${COLORS.yellow};border-radius:14px;font-family:${FONT_STACK};font-size:13px;font-weight:700;color:${COLORS.text};line-height:28px;">
            ${i + 1}
          </td>
        </tr>
      </table>
    </td>
    <td valign="middle" style="padding:6px 0 6px 14px;">
      <p style="margin:0;font-family:${FONT_STACK};font-size:15px;color:${COLORS.text};line-height:1.5;">${escapeHtml(item)}</p>
    </td>
  </tr>`
    )
    .join('')}
</table>`
}

function bulletList(items: string[]): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bgInfo};border:1px solid ${COLORS.border};border-radius:10px;">
  <tr><td style="padding:14px 18px;">
    ${items
      .map(
        (item) =>
          `<p style="margin:6px 0;font-family:${FONT_STACK};font-size:14px;color:${COLORS.text};line-height:1.55;">
        <span style="display:inline-block;width:6px;height:6px;background-color:${COLORS.yellow};border-radius:3px;vertical-align:middle;margin-right:10px;"></span>
        ${escapeHtml(item)}
      </p>`
      )
      .join('')}
  </td></tr>
</table>`
}

function timelineCard(stops: { icon: string; label: string; body: string }[]): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bgInfo};border:1px solid ${COLORS.border};border-radius:10px;">
  <tr><td style="padding:8px 16px;">
    ${stops
      .map(
        (s, i) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="top" style="width:36px;padding:14px 0;">
          <span style="font-size:22px;line-height:1;">${s.icon}</span>
        </td>
        <td valign="middle" style="padding:14px 0 14px 8px;${i < stops.length - 1 ? `border-bottom:1px solid ${COLORS.border};` : ''}">
          <p style="margin:0;font-family:${FONT_STACK};font-size:14px;font-weight:700;color:${COLORS.text};">${escapeHtml(s.label)}</p>
          <p style="margin:4px 0 0 0;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textMuted};line-height:1.5;">${escapeHtml(s.body)}</p>
        </td>
      </tr>
    </table>`
      )
      .join('')}
  </td></tr>
</table>`
}

function previewCard(previewUrl: string, businessName: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bgInfo};border:1px solid ${COLORS.border};border-radius:10px;">
  <tr><td style="padding:20px 22px;">
    <p style="margin:0;font-family:${FONT_STACK};font-size:12px;font-weight:600;color:${COLORS.textMuted};text-transform:uppercase;letter-spacing:0.08em;">Preview your site</p>
    <p style="margin:8px 0 0 0;font-family:${FONT_STACK};font-size:18px;font-weight:600;color:${COLORS.text};letter-spacing:-0.01em;">${escapeHtml(businessName)}</p>
    <p style="margin:8px 0 0 0;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textMuted};word-break:break-all;">
      <a href="${previewUrl}" style="color:${COLORS.green};text-decoration:underline;">${escapeHtml(previewUrl)}</a>
    </p>
  </td></tr>
</table>`
}

function loginCard({
  adminUrl,
  adminEmail,
  adminPassword,
}: {
  adminUrl: string
  adminEmail: string
  adminPassword: string
}): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bgCode};border:1px solid ${COLORS.bgCode};border-radius:10px;">
  <tr><td style="padding:18px 22px;">
    <p style="margin:0;font-family:${FONT_STACK};font-size:12px;font-weight:600;color:${COLORS.textCode};text-transform:uppercase;letter-spacing:0.08em;">Your admin login</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
      <tr>
        <td style="padding:6px 0;width:100px;">
          <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:#9ca3af;">Admin URL</p>
        </td>
        <td style="padding:6px 0;">
          <p style="margin:0;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;color:#fef3c7;word-break:break-all;">
            <a href="${adminUrl}" style="color:#fef3c7;text-decoration:none;">${escapeHtml(adminUrl)}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;">
          <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:#9ca3af;">Email</p>
        </td>
        <td style="padding:6px 0;">
          <p style="margin:0;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;color:#fef3c7;word-break:break-all;">${escapeHtml(adminEmail)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;">
          <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:#9ca3af;">Password</p>
        </td>
        <td style="padding:6px 0;">
          <p style="margin:0;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:14px;font-weight:700;color:${COLORS.textCode};letter-spacing:0.04em;word-break:break-all;">${escapeHtml(adminPassword)}</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
<p style="margin:12px 0 0 0;font-family:${FONT_STACK};font-size:13px;color:${COLORS.textMuted};line-height:1.5;">
  Save this password somewhere safe. You'll use it to log into your admin and edit your site anytime.
</p>`
}

function divider(): string {
  return `<div style="height:24px;line-height:24px;font-size:1px;">&nbsp;</div>`
}

function plainParagraph(html: string): string {
  return `<p style="margin:0;font-family:${FONT_STACK};font-size:15px;line-height:1.6;color:${COLORS.text};">${html}</p>`
}

// ─────────────────────────────────────────────
// 1. Contact received → customer auto-reply
// ─────────────────────────────────────────────

export interface ContactReceivedArgs {
  contactName: string
  businessName: string
}

export function contactReceivedEmail({
  contactName,
  businessName,
}: ContactReceivedArgs) {
  const safeName = contactName || 'there'
  const subject = 'We got your message — Waji Professional Websites'
  const html = buildEmail({
    preheader: `A real person will reply within 24 hours about ${businessName}.`,
    title: `Thanks, ${escapeHtml(safeName)} 👋`,
    intro: `We received your inquiry about a website for <strong style="color:${COLORS.text};">${escapeHtml(businessName)}</strong>. A real person (Moa) will read every word and reply within 24 hours — usually faster.`,
    bodyHtml: `
<p style="margin:0 0 14px 0;font-family:${FONT_STACK};font-size:13px;font-weight:600;color:${COLORS.textMuted};text-transform:uppercase;letter-spacing:0.08em;">What happens next</p>
${numberedList([
  'We review your inquiry and check for fit (within 24 hours)',
  'We send a brief proposal with pricing and a kickoff link',
  "Once you're in, your site goes live in 3–5 business days",
])}`,
    footerNote: "If you didn't submit this, just ignore this email.",
  })
  return { subject, html }
}

// ─────────────────────────────────────────────
// 2. Contact received → admin alert
// ─────────────────────────────────────────────

export interface AdminAlertSubmission {
  id: string
  contact_name: string | null
  email: string
  business_name: string
  plan: string
  selected_layout?: string | null
  message?: string | null
  layout_notes?: string | null
  created_at?: string | null
}

export function contactReceivedAdminAlert({
  submission,
}: {
  submission: AdminAlertSubmission
}) {
  const submittedAt = formatTimestamp(submission.created_at)
  const subject = `🔔 New Waji inquiry — ${submission.business_name} (${submission.plan})`
  const html = buildEmail({
    preheader: `${submission.business_name} · ${submission.plan} · ${submission.email}`,
    title: `New inquiry: ${escapeHtml(submission.business_name)}`,
    intro: `Submitted ${escapeHtml(submittedAt)} via the contact form.`,
    bodyHtml: infoTable([
      { label: 'Contact', value: escapeHtml(submission.contact_name || '—') },
      {
        label: 'Email',
        value: `<a href="mailto:${escapeHtml(submission.email)}" style="color:${COLORS.green};text-decoration:underline;">${escapeHtml(submission.email)}</a>`,
      },
      { label: 'Business', value: escapeHtml(submission.business_name) },
      { label: 'Plan interest', value: escapeHtml(submission.plan) },
      { label: 'Layout', value: escapeHtml(submission.selected_layout || '—') },
      { label: 'Message', value: nl2br(submission.message || '—') },
      { label: 'Layout notes', value: nl2br(submission.layout_notes || '—') },
    ]),
    ctaText: 'Review in admin',
    ctaUrl: `${APP_URL}/admin`,
    footerNote: `ID: ${submission.id}`,
  })
  return { subject, html }
}

// ─────────────────────────────────────────────
// 3. Intake form link → customer
// ─────────────────────────────────────────────

export interface IntakeFormLinkArgs {
  contactName: string
  businessName: string
  intakeUrl: string
  plan: string
}

export function intakeFormLinkEmail({
  contactName,
  businessName,
  intakeUrl,
  plan,
}: IntakeFormLinkArgs) {
  const safeName = contactName || 'there'
  const subject = `Next step: tell us about ${businessName}`
  const html = buildEmail({
    preheader: `5-minute intake form for ${businessName} — then we build.`,
    title: "You're in 🎉",
    intro: `Hi ${escapeHtml(safeName)}, we're ready to start building. To make your site great, we need a few details about <strong style="color:${COLORS.text};">${escapeHtml(businessName)}</strong> — should take about 5 minutes.`,
    bodyHtml: `
<p style="margin:0 0 14px 0;font-family:${FONT_STACK};font-size:13px;font-weight:600;color:${COLORS.textMuted};text-transform:uppercase;letter-spacing:0.08em;">What we'll ask for</p>
${bulletList([
  'Address, phone, hours',
  '3–5 services with prices',
  'Brand colors and a few photos',
  'Anything else you want on the site',
])}`,
    ctaText: 'Start the intake form',
    ctaUrl: intakeUrl,
    footerNote: `Plan: ${escapeHtml(plan)}. Replies are read by Moa directly.`,
  })
  return { subject, html }
}

// ─────────────────────────────────────────────
// 4. Intake complete → customer (payment link)
// ─────────────────────────────────────────────

export interface IntakeCompleteArgs {
  contactName: string
  businessName: string
  paymentUrl: string
}

export function intakeCompleteEmail({
  contactName,
  businessName,
  paymentUrl,
}: IntakeCompleteArgs) {
  const safeName = contactName || 'there'
  const subject = `✅ Got everything for ${businessName} — pay to launch`
  const html = buildEmail({
    preheader: `Last step: secure your spot with the setup fee.`,
    title: `Looking great, ${escapeHtml(safeName)}`,
    intro: `Thanks for the details. We have everything we need to build your site. The last step is securing your spot with the setup fee.`,
    bodyHtml: plainParagraph(
      `Once paid, your site will be built automatically and live within <strong>3–5 business days</strong>. You'll get an email with your preview URL and admin login as soon as it's ready.`
    ),
    ctaText: 'Pay setup fee',
    ctaUrl: paymentUrl,
    footerNote: 'Secure payment via Stripe. No card on file.',
  })
  return { subject, html }
}

// ─────────────────────────────────────────────
// 5. Payment receipt → customer
// ─────────────────────────────────────────────

export interface PaymentReceiptArgs {
  contactName: string
  businessName: string
  amountUsd?: number | null
  plan: string
}

export function paymentReceiptEmail({
  contactName,
  businessName,
  amountUsd,
  plan,
}: PaymentReceiptArgs) {
  const safeName = contactName || 'there'
  const amountText =
    amountUsd && amountUsd > 0 ? `your $${amountUsd} setup fee` : 'your setup fee'
  const subject = `🎉 Payment received — building ${businessName} now`
  const html = buildEmail({
    preheader: `Building your site now. Preview ready in minutes.`,
    title: 'Payment confirmed',
    intro: `Thanks ${escapeHtml(safeName)}! We received ${amountText} for <strong style="color:${COLORS.text};">${escapeHtml(businessName)}</strong> on the ${escapeHtml(plan)} plan. We're now building your site — you'll get another email when it's ready.`,
    bodyHtml: timelineCard([
      { icon: '✅', label: 'Now: Building your site', body: 'Provisioning is running.' },
      {
        icon: '⏳',
        label: 'Within minutes: Preview URL ready',
        body: 'You\'ll receive an email with the link.',
      },
      {
        icon: '🚀',
        label: 'Within 24h: Final touches and launch',
        body: 'Site goes live on your subdomain.',
      },
    ]),
    footerNote: 'A receipt has been sent separately by Stripe.',
  })
  return { subject, html }
}

// ─────────────────────────────────────────────
// 6. Site live → customer
// ─────────────────────────────────────────────

export interface SiteLiveArgs {
  contactName: string
  businessName: string
  previewUrl: string
  adminUrl: string
  adminEmail: string
  adminPassword: string
}

export function siteLiveEmail({
  contactName,
  businessName,
  previewUrl,
  adminUrl,
  adminEmail,
  adminPassword,
}: SiteLiveArgs) {
  const safeName = contactName || 'there'
  const subject = `🚀 Your Waji site is ready — preview ${businessName}`
  const html = buildEmail({
    preheader: `${businessName} is live. Preview link and admin login inside.`,
    title: `${escapeHtml(businessName)} is live ✨`,
    intro: `Hi ${escapeHtml(safeName)} — your site is built and ready to view. Here are your links and login.`,
    bodyHtml: `
${previewCard(previewUrl, businessName)}
${divider()}
${loginCard({ adminUrl, adminEmail, adminPassword })}`,
    ctaText: 'View your site',
    ctaUrl: previewUrl,
    footerNote: 'Questions? Just reply to this email — Moa reads every one.',
  })
  return { subject, html }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatTimestamp(iso?: string | null): string {
  if (!iso) return 'just now'
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short',
    })
  } catch {
    return iso
  }
}

export const __testing__ = {
  COLORS,
  FONT_STACK,
  APP_URL,
  escapeHtml,
}
