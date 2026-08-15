import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest } from 'next/server'

// Public, UUID-gated status feed for /building and /preview. Deliberately
// narrow: no provisioning_logs (internal pipeline structure), no
// error_message (internal detail). Operators use the admin dashboard
// (which pulls the full logs stream via the admin-gated data route).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  const { submissionId } = await params

  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('status, current_step, progress, business_name, client_preview_url')
    .eq('id', submissionId)
    .single()

  return Response.json({ submission })
}
