import { Resend } from 'resend'
import {
  contactReceivedEmail,
  contactReceivedAdminAlert,
  intakeFormLinkEmail,
  intakeCompleteEmail,
  intakeCompleteAdminAlertEmail,
  paymentReceiptEmail,
  siteLiveEmail,
  type AdminAlertSubmission,
} from './email-templates'

// ─────────────────────────────────────────────
// Lazy Resend init — avoid touching env at import time
// so build/test contexts don't crash without RESEND_API_KEY.
// ─────────────────────────────────────────────
let resendInstance: Resend | null = null
function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

const FROM_DEFAULT = 'noreply@cimaasites.ai'
function fromAddress(): string {
  return `Waji Professional Websites <${process.env.RESEND_FROM_EMAIL || FROM_DEFAULT}>`
}

const ADMIN_INBOX = 'arsitechgroup@gmail.com'

// ─────────────────────────────────────────────
// Common types
// ─────────────────────────────────────────────

export type SendResult = { success: true } | { success: false; error: string }

export interface OnboardingSubmission {
  id: string
  contact_name: string | null
  email: string
  business_name: string
  plan: string
  business_description?: string | null
  selected_layout?: string | null
  layout_notes?: string | null
  amount_cents?: number | null
  created_at?: string | null
  client_preview_url?: string | null
  client_admin_email?: string | null
  client_admin_password?: string | null
}

async function send(args: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}): Promise<SendResult> {
  try {
    await getResend().emails.send({
      from: fromAddress(),
      to: args.to,
      subject: args.subject,
      html: args.html,
      ...(args.replyTo ? { replyTo: args.replyTo } : {}),
    })
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error'
    console.error('Email send failed:', message)
    return { success: false, error: message }
  }
}

// ═════════════════════════════════════════════
// NEW SPEC API — submission-based
// ═════════════════════════════════════════════

export async function sendContactReceivedConfirmation(
  submission: OnboardingSubmission
): Promise<SendResult> {
  const { subject, html } = contactReceivedEmail({
    contactName: submission.contact_name || '',
    businessName: submission.business_name,
  })
  return send({ to: submission.email, subject, html })
}

export async function sendContactAdminAlert(
  submission: OnboardingSubmission
): Promise<SendResult> {
  const adminSubmission: AdminAlertSubmission = {
    id: submission.id,
    contact_name: submission.contact_name,
    email: submission.email,
    business_name: submission.business_name,
    plan: submission.plan,
    selected_layout: submission.selected_layout ?? null,
    message: submission.business_description ?? null,
    layout_notes: submission.layout_notes ?? null,
    created_at: submission.created_at ?? null,
  }
  const { subject, html } = contactReceivedAdminAlert({ submission: adminSubmission })
  return send({
    to: ADMIN_INBOX,
    subject,
    html,
    replyTo: submission.email,
  })
}

export async function sendIntakeLink(
  submission: OnboardingSubmission,
  intakeUrl: string
): Promise<SendResult> {
  const { subject, html } = intakeFormLinkEmail({
    contactName: submission.contact_name || '',
    businessName: submission.business_name,
    intakeUrl,
    plan: submission.plan,
  })
  return send({ to: submission.email, subject, html })
}

export async function sendIntakeComplete(
  submission: OnboardingSubmission,
  paymentUrl: string
): Promise<SendResult> {
  const { subject, html } = intakeCompleteEmail({
    contactName: submission.contact_name || '',
    businessName: submission.business_name,
    paymentUrl,
  })
  return send({ to: submission.email, subject, html })
}

export async function sendIntakeCompleteAdminAlert(
  submission: OnboardingSubmission
): Promise<SendResult> {
  const adminSubmission: AdminAlertSubmission = {
    id: submission.id,
    contact_name: submission.contact_name,
    email: submission.email,
    business_name: submission.business_name,
    plan: submission.plan,
    selected_layout: submission.selected_layout ?? null,
    message: submission.business_description ?? null,
    layout_notes: submission.layout_notes ?? null,
    created_at: submission.created_at ?? null,
  }
  const { subject, html } = intakeCompleteAdminAlertEmail({
    submission: adminSubmission,
  })
  return send({ to: ADMIN_INBOX, subject, html, replyTo: submission.email })
}

export async function sendPaymentReceipt(
  submission: OnboardingSubmission
): Promise<SendResult> {
  const amountUsd =
    submission.amount_cents && submission.amount_cents > 0
      ? Math.round(submission.amount_cents / 100)
      : null
  const { subject, html } = paymentReceiptEmail({
    contactName: submission.contact_name || '',
    businessName: submission.business_name,
    amountUsd,
    plan: submission.plan,
  })
  return send({ to: submission.email, subject, html })
}

export async function sendSiteLive(
  submission: OnboardingSubmission
): Promise<SendResult> {
  if (
    !submission.client_preview_url ||
    !submission.client_admin_email ||
    !submission.client_admin_password
  ) {
    return {
      success: false,
      error: 'Submission missing client_preview_url / admin credentials',
    }
  }
  const { subject, html } = siteLiveEmail({
    contactName: submission.contact_name || '',
    businessName: submission.business_name,
    previewUrl: submission.client_preview_url,
    adminUrl: `${submission.client_preview_url}/admin`,
    adminEmail: submission.client_admin_email,
    adminPassword: submission.client_admin_password,
  })
  return send({ to: submission.email, subject, html })
}

// ═════════════════════════════════════════════
// LEGACY API — preserved so existing callers
// (provision/webhook/approve/send-checkout-link routes)
// keep working unchanged. Internally rebranded via templates.
// ═════════════════════════════════════════════

export async function sendPreviewReadyEmail(data: {
  email: string
  businessName: string
  previewUrl: string
  adminEmail: string
  adminPassword: string
  submissionId: string
  contactName?: string
}) {
  const { subject, html } = siteLiveEmail({
    contactName: data.contactName || '',
    businessName: data.businessName,
    previewUrl: data.previewUrl,
    adminUrl: `${data.previewUrl}/admin`,
    adminEmail: data.adminEmail,
    adminPassword: data.adminPassword,
  })
  await getResend().emails.send({
    from: fromAddress(),
    to: data.email,
    subject,
    html,
  })
}

export async function sendSiteLiveEmail(data: {
  email: string
  businessName: string
  liveUrl: string
  adminUrl: string
  adminEmail?: string
  adminPassword?: string
  contactName?: string
}) {
  // Legacy "site live" — used at handleGoLive. We don't always have admin
  // credentials here (post-launch confirmation), so fall back to a focused
  // "your site is live" message reusing the siteLiveEmail template when we
  // do, otherwise a lightweight version via intakeCompleteEmail-style copy.
  if (data.adminEmail && data.adminPassword) {
    const { subject, html } = siteLiveEmail({
      contactName: data.contactName || '',
      businessName: data.businessName,
      previewUrl: data.liveUrl,
      adminUrl: data.adminUrl,
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword,
    })
    await getResend().emails.send({
      from: fromAddress(),
      to: data.email,
      subject,
      html,
    })
    return
  }

  // Fallback: just a "live" announcement without re-sending credentials.
  const { subject, html } = siteLiveEmail({
    contactName: data.contactName || '',
    businessName: data.businessName,
    previewUrl: data.liveUrl,
    adminUrl: data.adminUrl,
    adminEmail: 'See previous email',
    adminPassword: 'See previous email',
  })
  await getResend().emails.send({
    from: fromAddress(),
    to: data.email,
    subject: `🚀 ${data.businessName} is now LIVE!`,
    html,
  })
}

export async function sendYouNewClientEmail(data: {
  businessName: string
  email: string
  plan: string
  revenue: string
}) {
  // Internal operational alert. Branded with the same shell.
  const { buildEmail } = await import('./email-templates')
  const html = buildEmail({
    preheader: `${data.businessName} · ${data.plan} · ${data.revenue}/mo`,
    title: `New client: ${data.businessName}`,
    intro: `${data.businessName} just signed up on the <strong>${data.plan}</strong> plan.`,
    bodyHtml: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafaf7;border:1px solid #e7e5e4;border-radius:10px;">
  <tr><td style="padding:14px 18px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;color:#18181b;line-height:1.7;">
    <strong>Email:</strong> ${data.email}<br/>
    <strong>Plan:</strong> ${data.plan}<br/>
    <strong>Revenue:</strong> ${data.revenue}/mo
  </td></tr>
</table>`,
  })
  await getResend().emails.send({
    from: fromAddress(),
    to: ADMIN_INBOX,
    subject: `New Waji client: ${data.businessName} (${data.plan})`,
    html,
  })
}

export async function sendContactAutoReply(data: {
  email: string
  contactName: string
  businessName: string
}) {
  const { subject, html } = contactReceivedEmail({
    contactName: data.contactName,
    businessName: data.businessName,
  })
  await getResend().emails.send({
    from: fromAddress(),
    to: data.email,
    subject,
    html,
  })
}

export async function sendPaymentReceivedEmail(data: {
  email: string
  contactName: string
  businessName: string
  plan: string
  amountUsd?: number | null
}) {
  const { subject, html } = paymentReceiptEmail({
    contactName: data.contactName,
    businessName: data.businessName,
    amountUsd: data.amountUsd ?? null,
    plan: data.plan,
  })
  await getResend().emails.send({
    from: fromAddress(),
    to: data.email,
    subject,
    html,
  })
}

export async function sendCheckoutLinkEmail(data: {
  email: string
  contactName: string
  businessName: string
  plan: string
  checkoutUrl: string
}) {
  const { subject, html } = intakeCompleteEmail({
    contactName: data.contactName,
    businessName: data.businessName,
    paymentUrl: data.checkoutUrl,
  })
  await getResend().emails.send({
    from: fromAddress(),
    to: data.email,
    subject,
    html,
  })
}

export async function sendNewContactLeadEmail(data: {
  contactName: string
  email: string
  businessName: string
  plan: string
  message: string
  submissionId: string
  selectedLayout?: string | null
  layoutNotes?: string | null
}) {
  const adminSubmission: AdminAlertSubmission = {
    id: data.submissionId,
    contact_name: data.contactName,
    email: data.email,
    business_name: data.businessName,
    plan: data.plan,
    selected_layout: data.selectedLayout ?? null,
    message: data.message,
    layout_notes: data.layoutNotes ?? null,
    created_at: new Date().toISOString(),
  }
  const { subject, html } = contactReceivedAdminAlert({
    submission: adminSubmission,
  })
  await getResend().emails.send({
    from: fromAddress(),
    to: ADMIN_INBOX,
    replyTo: data.email,
    subject,
    html,
  })
}
