import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

export async function POST(request: Request) {
  const adminPassword = request.headers.get('x-admin-password')
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { requestId, status, adminNotes } = await request.json()

  if (!requestId || !status) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: existing } = await supabaseAdmin
    .from('change_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (!existing) {
    return Response.json({ error: 'Request not found' }, { status: 404 })
  }

  const { error } = await supabaseAdmin
    .from('change_requests')
    .update({
      status,
      admin_notes: adminNotes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (status === 'done') {
    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL env var is required')
    }
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: `Wajii Sites <${process.env.RESEND_FROM_EMAIL}>`,
        to: existing.client_email,
        subject: `Your change is done — ${existing.business_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#16a34a">Your change is live!</h2>
            <p>Hi there,</p>
            <p>We completed your change request for <strong>${existing.business_name}</strong>.</p>
            <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #16a34a">
              <strong>What was changed:</strong><br>
              <p style="margin:8px 0 0">${existing.description}</p>
            </div>
            ${
              adminNotes
                ? `<div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0">
                <strong>Notes from our team:</strong><br>
                <p style="margin:8px 0 0">${adminNotes}</p>
              </div>`
                : ''
            }
            <p>Visit your website to see the update. If anything looks off, just submit another change request.</p>
            <p style="color:#888;font-size:12px">Wajii Sites — We are always here to help</p>
          </div>
        `,
      })
    } catch (e) {
      console.error('Failed to send done email:', e)
    }
  }

  return Response.json({ success: true })
}
