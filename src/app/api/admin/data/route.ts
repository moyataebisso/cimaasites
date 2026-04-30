import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const password = request.headers.get('x-admin-password')

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: clients } = await supabaseAdmin
    .schema('cimaasites')
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: submissions } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select(
      'id, business_name, email, plan, status, current_step, created_at, amount_cents, selected_layout, layout_notes, contact_name, phone, business_description, checkout_url, stripe_session_id, approved_at, paid_at, client_live_url, intake_token, intake_sent_at, intake_completed_at'
    )
    .order('created_at', { ascending: false })
    .limit(50)

  return Response.json({ clients: clients || [], submissions: submissions || [] })
}
