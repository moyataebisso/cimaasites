/**
 * Waji email design v2 — SaveYours-style: yellow header + footer bands,
 * clean white body, table-based info blocks, soft yellow callouts.
 *
 * Same 7 exports + arg shapes as v1 (email-templates.ts) so the swap in
 * emails.ts is a one-line import change. New return shape adds `text`
 * (plain-text fallback) which Resend uses for clients that block HTML.
 */

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const COLORS = {
  yellow: '#facc15', // header / footer / button
  yellowSoft: '#fef9c3', // callout box bg
  yellowBorder: '#facc15', // callout left border
  text: '#1a1a1a',
  textMuted: '#525252',
  bg: '#f5f5f5',
  bgCard: '#ffffff',
  rowBg: '#f9fafb',
  rowBorder: '#e5e7eb',
  noteBrown: '#78350f',
  bgCode: '#1f2937',
  textCode: '#fde68a',
} as const

const SITE_URL = 'https://cimaasites.ai'

// ─── Shared shell ───────────────────────────────────────

interface BuildArgs {
  preheader: string
  headerTitle: string // shows in the yellow banner
  bodyHtml: string // pre-rendered inner HTML (paragraphs, tables, etc.)
}

function buildShell({ preheader, headerTitle, bodyHtml }: BuildArgs): string {
  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(headerTitle)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:${FONT_STACK};color:${COLORS.text}">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${COLORS.bg};opacity:0">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg}">
    <tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${COLORS.bgCard};border-radius:8px;overflow:hidden">

        <!-- HEADER -->
        <tr><td style="background:${COLORS.yellow};padding:32px 40px;text-align:center">
          <h1 style="margin:0;color:${COLORS.text};font-size:26px;font-weight:700;line-height:1.2">
            💻 Waji ${escapeHtml(headerTitle)}
          </h1>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:40px;color:${COLORS.text};line-height:1.6;font-size:16px">
          ${bodyHtml}
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:${COLORS.yellow};padding:24px 40px;text-align:center;color:${COLORS.text};font-size:14px;line-height:1.6">
          <strong>Waji Professional Websites</strong><br>
          Custom websites for local businesses<br>
          <span style="color:${COLORS.textMuted}">Designed in Minneapolis, MN</span><br>
          <a href="${SITE_URL}/contact" style="color:${COLORS.text};text-decoration:underline">Get a Quote</a>
          &nbsp;·&nbsp;
          <a href="${SITE_URL}/admin" style="color:${COLORS.text};text-decoration:underline">Customer Login</a>
          &nbsp;·&nbsp;
          <a href="${SITE_URL}/contact" style="color:${COLORS.text};text-decoration:underline">Contact</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

// ─── HTML fragments (compose into bodyHtml) ─────────────

function paragraph(html: string, marginTop = 0): string {
  return `<p style="margin:${marginTop}px 0 16px;font-size:16px;line-height:1.6">${html}</p>`
}

function greeting(name: string): string {
  const safe = name && name.trim() ? escapeHtml(name.split(' ')[0]) : 'there'
  return `<p style="margin:0 0 16px;font-size:16px">Hi ${safe},</p>`
}

function infoTable(rows: { label: string; value: string }[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:24px 0;border-collapse:collapse">
${rows
  .map(
    (r, i) => `    <tr>
      <td style="padding:12px 16px;background:${COLORS.rowBg};border-bottom:${i === rows.length - 1 ? 0 : 1}px solid ${COLORS.rowBorder};font-weight:600;width:40%;vertical-align:top">${escapeHtml(r.label)}</td>
      <td style="padding:12px 16px;background:${COLORS.rowBg};border-bottom:${i === rows.length - 1 ? 0 : 1}px solid ${COLORS.rowBorder};vertical-align:top;word-break:break-word">${r.value}</td>
    </tr>`
  )
  .join('\n')}
  </table>`
}

function callout(heading: string, body: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:24px 0;background:${COLORS.yellowSoft};border-left:4px solid ${COLORS.yellowBorder};border-radius:4px">
    <tr><td style="padding:16px 20px">
      <strong style="color:${COLORS.noteBrown};font-size:14px;text-transform:uppercase;letter-spacing:0.05em">${escapeHtml(heading)}</strong>
      <div style="margin:8px 0 0;color:${COLORS.text};font-size:15px;line-height:1.55">${body}</div>
    </td></tr>
  </table>`
}

function bullets(title: string, items: string[]): string {
  return `<p style="margin:24px 0 12px;font-weight:600;font-size:15px">${escapeHtml(title)}</p>
  <ul style="margin:0 0 24px;padding-left:24px;font-size:15px;line-height:1.6">
${items.map((it) => `    <li style="margin-bottom:8px">${escapeHtml(it)}</li>`).join('\n')}
  </ul>`
}

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0">
    <tr><td style="background:${COLORS.yellow};border-radius:6px">
      <a href="${url}" style="display:inline-block;background:${COLORS.yellow};color:${COLORS.text};padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px">${escapeHtml(text)} →</a>
    </td></tr>
  </table>`
}

function signoff(line = '— The Waji team'): string {
  return `<p style="margin:24px 0 0;font-size:15px;color:${COLORS.textMuted}">${escapeHtml(line)}</p>`
}

function codeRow(label: string, value: string): string {
  return `<tr>
      <td style="padding:12px 16px;background:${COLORS.bgCode};color:${COLORS.textCode};font-weight:600;width:40%;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;border-bottom:1px solid #374151;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:12px 16px;background:${COLORS.bgCode};color:#fef3c7;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;border-bottom:1px solid #374151;vertical-align:top;word-break:break-all">${escapeHtml(value)}</td>
    </tr>`
}

function loginBlock({
  adminUrl,
  adminEmail,
  adminPassword,
}: {
  adminUrl: string
  adminEmail: string
  adminPassword: string
}): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:24px 0;border-collapse:collapse;border-radius:6px;overflow:hidden">
${codeRow('Admin URL', adminUrl)}
${codeRow('Email', adminEmail)}
${codeRow('Password', adminPassword)}
  </table>`
}

// ─── Type used by admin alerts (kept compatible with v1) ──

export interface AdminAlertSubmission {
  id: string
  contact_name: string | null
  email: string
  business_name: string
  plan: string
  selected_layout?: string | null
  message?: string | null
  layout_notes?: string | null
  submitted_at?: string | null
}

// ═════════════════════════════════════════════════════════
// TEMPLATES
// ═════════════════════════════════════════════════════════

// 1. Customer auto-reply on contact form submission ─────

export interface ContactReceivedArgs {
  contactName: string
  businessName: string
}

export function contactReceivedEmail({
  contactName,
  businessName,
}: ContactReceivedArgs) {
  const subject = 'We got your message — Waji Professional Websites'
  const bodyHtml = `
${greeting(contactName)}
${paragraph(
  `Thanks for reaching out about a website for <strong>${escapeHtml(businessName)}</strong>. A real person from the Waji team will read every word and reply within 24 hours — usually faster.`
)}
${bullets('What happens next:', [
  'We review your inquiry and check for fit (within 24 hours)',
  'We send a brief proposal with pricing and a kickoff link',
  "Once you're in, your site goes live in 3–5 business days",
])}
${callout(
  'Did you submit this?',
  "If you didn't, just ignore this email — we won't follow up without confirmation."
)}
${signoff()}
`
  return {
    subject,
    html: buildShell({
      preheader: `A real person will reply within 24 hours about ${businessName}.`,
      headerTitle: 'We got your message',
      bodyHtml,
    }),
    text: textForContactReceived({ contactName, businessName }),
  }
}

function textForContactReceived({
  contactName,
  businessName,
}: ContactReceivedArgs): string {
  return `Hi ${contactName || 'there'},

Thanks for reaching out about a website for ${businessName}. A real person from the Waji team will read every word and reply within 24 hours — usually faster.

What happens next:
- We review your inquiry and check for fit (within 24 hours)
- We send a brief proposal with pricing and a kickoff link
- Once you're in, your site goes live in 3–5 business days

If you didn't submit this, just ignore this email.

— The Waji team
Waji Professional Websites · Designed in Minneapolis, MN
${SITE_URL}`
}

// 2. Admin alert when contact form lands ────────────────

export function contactReceivedAdminAlert({
  submission,
}: {
  submission: AdminAlertSubmission
}) {
  const subject = `🔔 New Waji inquiry — ${submission.business_name} (${submission.plan})`
  const submittedAt = formatTimestamp(submission.submitted_at)
  const bodyHtml = `
${paragraph(`<strong>${escapeHtml(submission.business_name)}</strong> just submitted the contact form. Submitted ${escapeHtml(submittedAt)}.`)}
${infoTable([
  { label: 'Contact', value: escapeHtml(submission.contact_name || '—') },
  {
    label: 'Email',
    value: `<a href="mailto:${escapeHtml(submission.email)}" style="color:${COLORS.text}">${escapeHtml(submission.email)}</a>`,
  },
  { label: 'Business', value: escapeHtml(submission.business_name) },
  { label: 'Plan interest', value: escapeHtml(submission.plan) },
  { label: 'Layout', value: escapeHtml(submission.selected_layout || '—') },
  { label: 'Message', value: nl2br(submission.message || '—') },
  { label: 'Layout notes', value: nl2br(submission.layout_notes || '—') },
])}
${ctaButton('Review in admin', `${SITE_URL}/admin`)}
${paragraph(`<span style="color:${COLORS.textMuted};font-size:13px">ID: ${escapeHtml(submission.id)}</span>`, 24)}
`
  return {
    subject,
    html: buildShell({
      preheader: `${submission.business_name} · ${submission.plan} · ${submission.email}`,
      headerTitle: 'New inquiry',
      bodyHtml,
    }),
    text: `New Waji inquiry — ${submission.business_name}

Contact:        ${submission.contact_name || '—'}
Email:          ${submission.email}
Business:       ${submission.business_name}
Plan interest:  ${submission.plan}
Layout:         ${submission.selected_layout || '—'}
Submitted:      ${submittedAt}

Message:
${submission.message || '(none)'}

Layout notes:
${submission.layout_notes || '(none)'}

Review in admin: ${SITE_URL}/admin
ID: ${submission.id}`,
  }
}

// 3. Customer intake-form link ──────────────────────────

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
  const subject = `Next step: tell us about ${businessName}`
  const bodyHtml = `
${greeting(contactName)}
${paragraph(
  `We're ready to start building. To make your site great, we need a few details about <strong>${escapeHtml(businessName)}</strong> — should take about 5 minutes.`
)}
${bullets("What we'll ask for:", [
  'Address, phone, hours',
  '4+ services with prices',
  'Brand colors and a few photos',
  'A short story about your business',
])}
${ctaButton('Start the intake form', intakeUrl)}
${callout(
  'Plan',
  `<strong>${escapeHtml(plan)}</strong> — replies are read by the Waji team directly. Just reply if you have questions.`
)}
${signoff()}
`
  return {
    subject,
    html: buildShell({
      preheader: `5-minute intake form for ${businessName} — then we build.`,
      headerTitle: "You're in 🎉",
      bodyHtml,
    }),
    text: `Hi ${contactName || 'there'},

We're ready to start building. To make your site great, we need a few details about ${businessName} — should take about 5 minutes.

What we'll ask for:
- Address, phone, hours
- 4+ services with prices
- Brand colors and a few photos
- A short story about your business

Start the intake form: ${intakeUrl}

Plan: ${plan}. Replies are read by the Waji team.

— The Waji team`,
  }
}

// 4. Customer payment link (intake complete) ────────────

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
  const subject = `✅ Got everything for ${businessName} — pay to launch`
  const bodyHtml = `
${greeting(contactName)}
${paragraph(
  `Thanks for the details. We have everything we need to build your site. The last step is securing your spot with the setup fee.`
)}
${paragraph(
  `Once paid, your site will be built automatically and live within <strong>3–5 business days</strong>. You'll get an email with your preview URL and admin login as soon as it's ready.`
)}
${ctaButton('Pay setup fee', paymentUrl)}
${callout(
  'Secure',
  'Payment processed by Stripe. We never see or store your card details.'
)}
${signoff()}
`
  return {
    subject,
    html: buildShell({
      preheader: `Last step: secure your spot with the setup fee.`,
      headerTitle: 'Looking great',
      bodyHtml,
    }),
    text: `Hi ${contactName || 'there'},

Thanks for the details. We have everything we need to build your site. The last step is securing your spot with the setup fee.

Once paid, your site will be built automatically and live within 3–5 business days.

Pay setup fee: ${paymentUrl}

Secure payment via Stripe. No card on file.

— The Waji team`,
  }
}

// 5. Customer payment receipt ───────────────────────────

export interface PaymentReceiptArgs {
  contactName: string
  businessName: string
  amountUsd?: number | null
  plan: string
}

const PLAN_DETAILS: Record<string, { setup: string; recurring: string }> = {
  basic: { setup: '$599 setup', recurring: '$299/mo' },
  pro: { setup: '$599 setup', recurring: '$399/mo' },
  developer: { setup: '$49.99 one-time', recurring: '—' },
}

export function paymentReceiptEmail({
  contactName,
  businessName,
  amountUsd,
  plan,
}: PaymentReceiptArgs) {
  const subject = `🎉 Payment received — building ${businessName} now`
  const planDetails = PLAN_DETAILS[plan] || { setup: 'Setup fee', recurring: '—' }
  const amountLine =
    typeof amountUsd === 'number' && amountUsd > 0
      ? `$${amountUsd.toFixed(2)}`
      : planDetails.setup

  const bodyHtml = `
${greeting(contactName)}
${paragraph(
  `Thanks! We received your payment for <strong>${escapeHtml(businessName)}</strong>. We're now building your site — you'll get another email when it's ready.`
)}
${infoTable([
  { label: 'Business', value: escapeHtml(businessName) },
  { label: 'Plan', value: escapeHtml(plan) },
  { label: 'Amount paid', value: amountLine },
  { label: 'Recurring', value: planDetails.recurring },
])}
${bullets("What's happening now:", [
  'Now: Your site is being built (provisioning is running)',
  'Within minutes: Preview URL + admin login arrive by email',
  'Within 24 hours: Final touches and launch',
])}
${callout(
  'Save this receipt',
  'Stripe will also email you a separate receipt for your records. Keep both for tax purposes.'
)}
${signoff()}
`
  return {
    subject,
    html: buildShell({
      preheader: `Building your site now. Preview ready in minutes.`,
      headerTitle: 'Payment received',
      bodyHtml,
    }),
    text: `Hi ${contactName || 'there'},

Thanks! We received your payment for ${businessName}. We're now building your site.

Business:      ${businessName}
Plan:          ${plan}
Amount paid:   ${amountLine}
Recurring:     ${planDetails.recurring}

What's happening now:
- Now: Your site is being built
- Within minutes: Preview URL + admin login arrive
- Within 24 hours: Final touches and launch

Stripe will email you a separate receipt for tax records.

— The Waji team`,
  }
}

// 6. Customer site-live email ───────────────────────────
// Two flavors of admin handoff, picked at runtime:
//   inviteLink    → new flow: customer clicks link, sets own password on
//                   /admin/set-password. We never see or store their password.
//   adminPassword → legacy flow: rendered for clients provisioned before the
//                   Supabase invite-link cutover (kept so re-sends to existing
//                   customers like Adama Test 5 don't show a broken email).
// `inviteType` lets us soften the copy when the Auth API was down and we fell
// back to "use Forgot password on the login page".

export interface SiteLiveArgs {
  contactName: string
  businessName: string
  previewUrl: string
  adminUrl: string
  adminEmail: string
  inviteLink?: string
  inviteType?: 'invite' | 'recovery' | 'fallback_manual_reset'
  adminPassword?: string
}

export function siteLiveEmail({
  contactName,
  businessName,
  previewUrl,
  adminUrl,
  adminEmail,
  inviteLink,
  inviteType,
  adminPassword,
}: SiteLiveArgs) {
  const subject = `🚀 Your Waji site is ready — preview ${businessName}`
  const useInvite = !!inviteLink
  const isFallback = inviteType === 'fallback_manual_reset'

  const adminBlockHtml = useInvite
    ? renderInviteBlock({ inviteLink: inviteLink!, adminEmail, adminUrl, isFallback })
    : renderLegacyLoginBlock({ adminUrl, adminEmail, adminPassword: adminPassword || '' })

  const bodyHtml = `
${greeting(contactName)}
${paragraph(
  `<strong>${escapeHtml(businessName)}</strong> is built and ready to view. Your preview link and admin setup details are below.`
)}
${ctaButton('View your site', previewUrl)}
${adminBlockHtml}
${bullets('What you can do from your admin:', [
  'Edit any page text or service',
  'Add or swap photos',
  'Change colors and theme',
  'Manage hours, contact info, and bookings',
])}
${paragraph(
  `Questions? Just reply to this email — we read every one.`,
  16
)}
${signoff()}
`
  return {
    subject,
    html: buildShell({
      preheader: `${businessName} is live. Preview link and admin setup inside.`,
      headerTitle: 'Your site is live ✨',
      bodyHtml,
    }),
    text: useInvite
      ? siteLiveTextInvite({
          contactName,
          businessName,
          previewUrl,
          adminUrl,
          adminEmail,
          inviteLink: inviteLink!,
          isFallback,
        })
      : siteLiveTextLegacy({
          contactName,
          businessName,
          previewUrl,
          adminUrl,
          adminEmail,
          adminPassword: adminPassword || '',
        }),
  }
}

function renderInviteBlock(args: {
  inviteLink: string
  adminEmail: string
  adminUrl: string
  isFallback: boolean
}): string {
  const { inviteLink, adminEmail, adminUrl, isFallback } = args
  if (isFallback) {
    // Auth API was down when we generated the link. We still send the email but
    // route the customer to the admin login page where they can use the
    // built-in "Forgot password" flow to set their first password.
    return `
<p style="margin:24px 0 8px;font-weight:600;font-size:15px">Set up your admin password</p>
${paragraph(
  `Your admin email is <strong>${escapeHtml(adminEmail)}</strong>. Click below to open your login page, then click <strong>Forgot password</strong> to receive a setup link.`
)}
${ctaButton('Open admin login', adminUrl)}
${callout(
  'About this step',
  "We had a brief hiccup generating your one-click setup link. The Forgot password flow on the login page does the same thing — you'll be in within a minute."
)}`
  }
  return `
<p style="margin:24px 0 8px;font-weight:600;font-size:15px">Set up your admin password</p>
${paragraph(
  `Your admin email is <strong>${escapeHtml(adminEmail)}</strong>. Click below to set your password and sign in. The link is single-use and good for 24 hours.`
)}
${ctaButton('Set up your password and log in', inviteLink)}
<p style="margin:0 0 8px;font-size:13px;color:${COLORS.textMuted}">Or copy this link: <a href="${inviteLink}" style="color:${COLORS.text};word-break:break-all">${escapeHtml(inviteLink)}</a></p>
${callout(
  'About this link',
  `It's a one-time invitation. After you set your password, log in any time at <strong>${escapeHtml(adminUrl)}</strong> with your email and password.`
)}`
}

function renderLegacyLoginBlock(args: {
  adminUrl: string
  adminEmail: string
  adminPassword: string
}): string {
  return `
<p style="margin:24px 0 8px;font-weight:600;font-size:15px">Your admin login</p>
${loginBlock(args)}
${callout(
  'Save this password',
  "You'll use these credentials to log in and edit your site anytime. Save them somewhere safe — we can reset on request, but it's faster if you keep your own copy."
)}`
}

function siteLiveTextInvite(args: {
  contactName: string
  businessName: string
  previewUrl: string
  adminUrl: string
  adminEmail: string
  inviteLink: string
  isFallback: boolean
}): string {
  const { contactName, businessName, previewUrl, adminUrl, adminEmail, inviteLink, isFallback } = args
  if (isFallback) {
    return `Hi ${contactName || 'there'},

${businessName} is built and ready to view.

Preview your site: ${previewUrl}

SET UP YOUR ADMIN PASSWORD:
Admin email: ${adminEmail}
Open: ${adminUrl}
Then click "Forgot password" to receive a setup link.

We had a brief hiccup generating your one-click setup link, but the Forgot password flow does the same thing.

— The Waji team`
  }
  return `Hi ${contactName || 'there'},

${businessName} is built and ready to view.

Preview your site: ${previewUrl}

SET UP YOUR ADMIN PASSWORD:
Admin email: ${adminEmail}
Set your password (single-use, expires in 24h): ${inviteLink}

After you set your password, log in any time at ${adminUrl}.

— The Waji team`
}

function siteLiveTextLegacy(args: {
  contactName: string
  businessName: string
  previewUrl: string
  adminUrl: string
  adminEmail: string
  adminPassword: string
}): string {
  const { contactName, businessName, previewUrl, adminUrl, adminEmail, adminPassword } = args
  return `Hi ${contactName || 'there'},

${businessName} is built and ready to view.

Preview your site: ${previewUrl}

YOUR ADMIN LOGIN:
Admin URL:  ${adminUrl}
Email:      ${adminEmail}
Password:   ${adminPassword}

Save this password somewhere safe — we can reset on request, but keeping your own copy is faster.

— The Waji team`
}

// 6b. Admin alert when intake completes ─────────────────

export function intakeCompleteAdminAlertEmail({
  submission,
}: {
  submission: AdminAlertSubmission
}) {
  const subject = `🟡 Intake done — send payment link for ${submission.business_name}`
  const bodyHtml = `
${paragraph(`<strong>${escapeHtml(submission.business_name)}</strong> finished the Step 2 intake form. Generate a Stripe checkout link and send it.`)}
${infoTable([
  { label: 'Contact', value: escapeHtml(submission.contact_name || '—') },
  {
    label: 'Email',
    value: `<a href="mailto:${escapeHtml(submission.email)}" style="color:${COLORS.text}">${escapeHtml(submission.email)}</a>`,
  },
  { label: 'Business', value: escapeHtml(submission.business_name) },
  { label: 'Plan', value: escapeHtml(submission.plan) },
])}
${ctaButton('Send payment link', `${SITE_URL}/admin`)}
${paragraph(`<span style="color:${COLORS.textMuted};font-size:13px">ID: ${escapeHtml(submission.id)}</span>`, 24)}
`
  return {
    subject,
    html: buildShell({
      preheader: `${submission.business_name} finished the intake form.`,
      headerTitle: 'Intake complete',
      bodyHtml,
    }),
    text: `Intake complete — ${submission.business_name}

Contact:  ${submission.contact_name || '—'}
Email:    ${submission.email}
Business: ${submission.business_name}
Plan:     ${submission.plan}

Generate a Stripe checkout link and send it: ${SITE_URL}/admin

ID: ${submission.id}`,
  }
}

// ─── buildEmail compatibility shim ──────────────────────
// Legacy `sendYouNewClientEmail` in emails.ts uses dynamic
// import('./email-templates').buildEmail to compose its own HTML.
// Re-export the same interface so the swap works without
// touching that legacy caller.

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
  const cta = ctaText && ctaUrl ? ctaButton(ctaText, ctaUrl) : ''
  const note = footerNote
    ? `<p style="margin:16px 0 0;font-size:13px;color:${COLORS.textMuted};font-style:italic">${escapeHtml(footerNote)}</p>`
    : ''
  return buildShell({
    preheader,
    headerTitle: title,
    bodyHtml: `
${paragraph(intro)}
${bodyHtml}
${cta}
${note}
`,
  })
}

// ─── Helpers ────────────────────────────────────────────

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
