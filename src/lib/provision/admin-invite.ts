import { supabaseAdmin } from '@/lib/supabase'

// Result returned to the caller. `type` lets us log how the link was obtained
// (invite vs recovery vs ultimate fallback) so we can spot in DB which clients
// hit the rate-limit / API-down path and may need a manual nudge.
export type AdminInviteResult = {
  actionLink: string
  type: 'invite' | 'recovery' | 'fallback_manual_reset'
  userId: string | null
}

/**
 * Generate a one-time link the customer uses to set their first admin password.
 *
 * Order of attempts:
 *   1. generateLink({ type: 'invite' }) — creates a new auth user and returns
 *      a single-use link. Does NOT send an email; we send our own via Resend.
 *   2. generateLink({ type: 'recovery' }) — fallback when invite returns 422
 *      (user already exists, e.g. partial-success retry). Same flow on the
 *      receiving page: customer sets a new password.
 *   3. Manual-reset fallback — if both Auth API calls fail (rate limit, outage),
 *      we still want provisioning to finish and the welcome email to ship.
 *      Returns adminUrl as the action link with `type='fallback_manual_reset'`
 *      so the email body can adjust copy ("use Forgot password on that page").
 */
export async function generateAdminInvite(args: {
  email: string
  schemaName: string
  businessName: string
  redirectTo: string
  adminUrl: string
}): Promise<AdminInviteResult> {
  const { email, schemaName, businessName, redirectTo, adminUrl } = args

  const userMetadata = {
    role: 'admin',
    schema: schemaName,
    business_name: businessName,
  }

  const inviteRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo, data: userMetadata },
  })

  if (!inviteRes.error && inviteRes.data?.properties?.action_link) {
    return {
      actionLink: inviteRes.data.properties.action_link,
      type: 'invite',
      userId: inviteRes.data.user?.id ?? null,
    }
  }

  console.warn('[admin-invite] invite generateLink failed; trying recovery', {
    email,
    error: inviteRes.error?.message,
    status: inviteRes.error?.status,
  })

  const recoveryRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo },
  })

  if (!recoveryRes.error && recoveryRes.data?.properties?.action_link) {
    return {
      actionLink: recoveryRes.data.properties.action_link,
      type: 'recovery',
      userId: recoveryRes.data.user?.id ?? null,
    }
  }

  console.error('[admin-invite] both invite and recovery failed; using manual fallback', {
    email,
    inviteError: inviteRes.error?.message,
    recoveryError: recoveryRes.error?.message,
  })

  return {
    actionLink: adminUrl,
    type: 'fallback_manual_reset',
    userId: null,
  }
}
