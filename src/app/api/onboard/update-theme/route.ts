import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const { submissionId, theme } = await request.json()

  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({ selected_theme: theme })
    .eq('id', submissionId)

  return Response.json({ success: true })
}
