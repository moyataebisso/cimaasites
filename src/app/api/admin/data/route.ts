import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminPassword } from '@/lib/admin-auth'

export async function GET(request: Request) {
  const denied = requireAdminPassword(request)
  if (denied) return denied

  const { data: clients } = await supabaseAdmin
    .schema('cimaasites')
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: submissions } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select(
      'id, business_name, email, plan, status, current_step, submitted_at, amount_cents, selected_layout, layout_notes, contact_name, phone, business_description, checkout_url, stripe_session_id, approved_at, paid_at, client_live_url, intake_token, intake_sent_at, intake_completed_at'
    )
    .order('submitted_at', { ascending: false })
    .limit(50)

  return Response.json({ clients: clients || [], submissions: submissions || [] })
}
