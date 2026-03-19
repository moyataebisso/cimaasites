import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const db = {
  submissions: () =>
    supabaseAdmin.schema('cimaasites').from('onboarding_submissions'),
  logs: () =>
    supabaseAdmin.schema('cimaasites').from('provisioning_logs'),
  clients: () =>
    supabaseAdmin.schema('cimaasites').from('clients'),
}
