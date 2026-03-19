import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = `Cimaa Sites <${process.env.RESEND_FROM_EMAIL || 'noreply@cimaasites.ai'}>`

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
          Cimaa Sites — Powerful websites for powerful businesses
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
          Cimaa Sites — Powerful websites for powerful businesses
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
