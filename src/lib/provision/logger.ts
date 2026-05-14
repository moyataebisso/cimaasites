import { supabaseAdmin } from '@/lib/supabase'

export async function logStep(
  submissionId: string,
  step: string,
  status: 'running' | 'done' | 'failed',
  message: string,
  error?: string
) {
  const { data: existing } = await supabaseAdmin
    .schema('cimaasites')
    .from('provisioning_logs')
    .select('id')
    .eq('submission_id', submissionId)
    .eq('step', step)
    .single()

  if (existing) {
    await supabaseAdmin
      .schema('cimaasites')
      .from('provisioning_logs')
      .update({
        status,
        message,
        error: error || null,
        completed_at: status !== 'running' ? new Date().toISOString() : null,
      })
      .eq('id', existing.id)
  } else {
    await supabaseAdmin
      .schema('cimaasites')
      .from('provisioning_logs')
      .insert({
        submission_id: submissionId,
        step,
        status,
        message,
        error: error || null,
        started_at: new Date().toISOString(),
        completed_at: status !== 'running' ? new Date().toISOString() : null,
      })
  }

  const progressMap: Record<string, number> = {
    payment_received: 10,
    generating_content: 25,
    creating_vercel_project: 40,
    setting_env_vars: 50,
    deploying: 65,
    waiting_for_deploy: 80,
    setting_up_domain: 90,
    tenant_admin_seeded: 93,
    sending_preview: 95,
    complete: 100,
  }

  const progress = progressMap[step] || 0

  const updateData: Record<string, unknown> = {
    current_step: step,
    progress,
  }
  if (status === 'failed') {
    updateData.status = 'failed'
  }

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update(updateData)
    .eq('id', submissionId)
}
