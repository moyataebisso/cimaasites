import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  const { submissionId } = await params

  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select(
      'status, current_step, progress, business_name, client_preview_url, error_message'
    )
    .eq('id', submissionId)
    .single()

  const { data: logs } = await supabaseAdmin
    .schema('cimaasites')
    .from('provisioning_logs')
    .select('step, status, message, completed_at')
    .eq('submission_id', submissionId)
    .order('started_at', { ascending: true })

  return Response.json({ submission, logs })
}
