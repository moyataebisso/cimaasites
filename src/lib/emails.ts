import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = `Waji Professional Websites <${process.env.RESEND_FROM_EMAIL || 'noreply@cimaasites.ai'}>`

export async function sendPreviewReadyEmail(data: {
  email: string
  businessName: string
  previewUrl: string
  adminEmail: string
  adminPassword: string
  submissionId: string
}) {
  await resend.emails.send({
    from,
    to: data.email,
    subject: `Your ${data.businessName} website preview is ready!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#2563EB">Your website is ready to preview!</h1>
        <p>Hi there,</p>
        <p>Your <strong>${data.businessName}</strong> website has been built and is ready for your review.</p>
        <a href="${data.previewUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#2563EB,#7C3AED);color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          View Your Website Preview
        </a>
        <p>Once you approve it, your site goes live instantly.</p>
        <h3>Your Admin Panel Login:</h3>
        <p>URL: ${data.previewUrl}/admin<br>
           Email: ${data.adminEmail}<br>
           Password: ${data.adminPassword}</p>
        <p style="color:#888;font-size:12px">
          Waji Professional Websites — Custom websites for local businesses
        </p>
      </div>
    `,
  })
}

export async function sendSiteLiveEmail(data: {
  email: string
  businessName: string
  liveUrl: string
  adminUrl: string
}) {
  await resend.emails.send({
    from,
    to: data.email,
    subject: `${data.businessName} is now LIVE!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#16a34a">Your website is LIVE!</h1>
        <p>Congratulations! <strong>${data.businessName}</strong> is now live on the internet.</p>
        <a href="${data.liveUrl}"
           style="display:inline-block;background:#16a34a;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
          Visit Your Live Website
        </a>
        <p>Manage your site anytime from your <a href="${data.adminUrl}">admin panel</a>.</p>
        <p>We are monitoring your site 24/7. If anything ever goes wrong, we will fix it immediately.</p>
        <p style="color:#888;font-size:12px">
          Waji Professional Websites — Custom websites for local businesses
        </p>
      </div>
    `,
  })
}

export async function sendYouNewClientEmail(data: {
  businessName: string
  email: string
  plan: string
  revenue: string
}) {
  await resend.emails.send({
    from,
    to: 'arsitechgroup@gmail.com',
    subject: `New client: ${data.businessName} (${data.plan})`,
    html: `
      <h2>New Cimaa Sites client!</h2>
      <p>Business: ${data.businessName}</p>
      <p>Email: ${data.email}</p>
      <p>Plan: ${data.plan}</p>
      <p>Revenue: ${data.revenue}/mo</p>
    `,
  })
}

export async function sendContactAutoReply(data: {
  email: string
  contactName: string
  businessName: string
}) {
  await resend.emails.send({
    from,
    to: data.email,
    subject: 'Thanks for reaching out — Waji Professional Websites',
    text: `Hi ${data.contactName}, thanks for telling us about ${data.businessName}. We'll review your info and get back to you within 24 hours with next steps.\n\n— The Waji team`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#2563EB">Thanks for reaching out!</h1>
        <p>Hi ${data.contactName},</p>
        <p>Thanks for telling us about <strong>${data.businessName}</strong>. We'll review your info and get back to you within 24 hours with next steps.</p>
        <p>— The Waji team</p>
        <p style="color:#888;font-size:12px">
          Waji Professional Websites — Custom websites for local businesses
        </p>
      </div>
    `,
  })
}

export async function sendPaymentReceivedEmail(data: {
  email: string
  contactName: string
  businessName: string
  plan: string
}) {
  await resend.emails.send({
    from,
    to: data.email,
    subject: `Payment received — building your site now (${data.businessName})`,
    text: `Hi ${data.contactName},\n\nWe just received your payment for ${data.businessName} — thank you! Your site is being built right now.\n\nMost sites are ready to preview within 5-10 minutes. We'll email you the moment your preview link is ready, along with your admin login so you can start customizing it. (No further action needed from you right now.)\n\nIf you have any questions or want to add details we should include, just reply to this email — we'll see it before your site goes live.\n\n— The Waji team`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#16a34a">Payment received — we're building your site!</h1>
        <p>Hi ${data.contactName},</p>
        <p>We just received your payment for <strong>${data.businessName}</strong> — thank you! Your site is being built right now.</p>
        <p>Most sites are ready to preview within 5-10 minutes. We'll email you the moment your preview link is ready, along with your admin login so you can start customizing it. (No further action needed from you right now.)</p>
        <p>If you have any questions or want to add details we should include, just reply to this email — we'll see it before your site goes live.</p>
        <p>— The Waji team</p>
        <p style="color:#888;font-size:12px">
          Waji Professional Websites — Custom websites for local businesses
        </p>
      </div>
    `,
  })
}

export async function sendCheckoutLinkEmail(data: {
  email: string
  contactName: string
  businessName: string
  plan: string
  checkoutUrl: string
}) {
  await resend.emails.send({
    from,
    to: data.email,
    subject: `Your Waji Professional Websites checkout link — ${data.businessName}`,
    text: `Hi ${data.contactName},\n\nWe've reviewed your request to build a ${data.plan} site for ${data.businessName} and we're ready to get started. Click the link below to complete your checkout — once paid, your site will be built and live within 24 hours.\n\n${data.checkoutUrl}\n\nHave a question? Reply to this email and we'll get back to you within a few hours.\n\n— The Waji team`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#2563EB">You're approved — let's get you live!</h1>
        <p>Hi ${data.contactName},</p>
        <p>We've reviewed your request to build a <strong>${data.plan}</strong> site for <strong>${data.businessName}</strong> and we're ready to get started. Click below to complete your checkout — once paid, your site will be built and live within 24 hours.</p>
        <p style="margin:24px 0">
          <a href="${data.checkoutUrl}"
             style="display:inline-block;background:linear-gradient(135deg,#2563EB,#7C3AED);color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">
            Complete Checkout
          </a>
        </p>
        <p style="font-size:13px;color:#475569">
          Or paste this link into your browser:<br>
          <a href="${data.checkoutUrl}" style="color:#2563EB;word-break:break-all">${data.checkoutUrl}</a>
        </p>
        <p>Have a question? Reply to this email and we'll get back to you within a few hours.</p>
        <p>— The Waji team</p>
        <p style="color:#888;font-size:12px">
          Waji Professional Websites — Custom websites for local businesses
        </p>
      </div>
    `,
  })
}

export async function sendNewContactLeadEmail(data: {
  contactName: string
  email: string
  businessName: string
  plan: string
  message: string
  submissionId: string
}) {
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cimaasites.ai'}/admin`
  await resend.emails.send({
    from,
    to: 'arsitechgroup@gmail.com',
    subject: `New Cimaa Sites lead: ${data.businessName}`,
    html: `
      <h2>New Cimaa Sites lead!</h2>
      <p>Contact: ${data.contactName}</p>
      <p>Email: ${data.email}</p>
      <p>Business: ${data.businessName}</p>
      <p>Plan: ${data.plan}</p>
      <p>Message:<br>${data.message ? data.message.replace(/\n/g, '<br>') : '<em>(none)</em>'}</p>
      <p>Review in <a href="${adminUrl}">admin</a> — submission ID: <code>${data.submissionId}</code></p>
    `,
  })
}
