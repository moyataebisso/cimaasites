#!/usr/bin/env tsx
/**
 * One-off diagnostic. NOT committed.
 *
 * Verifies that Supabase Auth honors a per-customer redirectTo (e.g.
 * https://cimaa-adama-test-8-….vercel.app/admin/set-password) instead of
 * substituting the project's Site URL fallback. Run after editing the
 * Supabase dashboard → Authentication → URL Configuration → Redirect URLs
 * allowlist.
 *
 * Usage:
 *   npm run test:redirect                  # auto-pulls latest provisioned customer URL
 *   npm run test:redirect -- https://cimaa-foo.vercel.app   # explicit URL
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.
 * Creates a unique fake auth user per run — clean up later via:
 *   DELETE FROM auth.users WHERE email LIKE 'redirect-test-%@example.com';
 */
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { resolve } from 'node:path'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '[test-redirect] missing env. Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  )
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function resolveCustomerSiteUrl(): Promise<string> {
  // Allow explicit override via CLI arg.
  const argUrl = process.argv[2]
  if (argUrl) {
    return argUrl.replace(/\/+$/, '')
  }

  // Otherwise, pull the most recently provisioned submission's preview URL.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('id, business_name, client_preview_url, provisioned_at')
    .not('client_preview_url', 'is', null)
    .order('provisioned_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle()

  if (error || !data?.client_preview_url) {
    throw new Error(
      `Could not auto-resolve a customer URL: ${
        error?.message ?? 'no rows with client_preview_url'
      }. Pass one explicitly: npm run test:redirect -- https://cimaa-foo.vercel.app`
    )
  }

  const url: string = data.client_preview_url.startsWith('http')
    ? data.client_preview_url
    : `https://${data.client_preview_url}`

  console.log('[test-redirect] auto-picked latest provisioned customer', {
    business: data.business_name,
    submissionId: data.id,
    url,
  })
  return url.replace(/\/+$/, '')
}

function decodeRedirectFromActionLink(actionLink: string): string | null {
  try {
    const u = new URL(actionLink)
    return u.searchParams.get('redirect_to')
  } catch {
    return null
  }
}

async function main() {
  const customerSiteUrl = await resolveCustomerSiteUrl()
  const requestedRedirect = `${customerSiteUrl}/admin/set-password`
  const testEmail = `redirect-test-${Date.now()}@example.com`

  console.log('\n─── REQUEST ───')
  console.log('email:           ', testEmail)
  console.log('redirectTo (in): ', requestedRedirect)

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'invite',
    email: testEmail,
    options: {
      redirectTo: requestedRedirect,
      data: { role: 'admin', test: true },
    },
  })

  if (error) {
    console.error('\n[test-redirect] generateLink error:', error)
    process.exit(2)
  }

  const actionLink = data?.properties?.action_link
  if (!actionLink) {
    console.error('\n[test-redirect] no action_link in response:', data)
    process.exit(3)
  }

  const returnedRedirect = decodeRedirectFromActionLink(actionLink)

  console.log('\n─── RESPONSE ───')
  console.log('action_link:        ', actionLink)
  console.log('redirect_to (out):  ', returnedRedirect)

  console.log('\n─── VERDICT ───')
  if (!returnedRedirect) {
    console.log('UNKNOWN — action_link did not carry a redirect_to query parameter')
    process.exit(0)
  }

  const cleanedRequested = requestedRedirect.replace(/\/+$/, '')
  const cleanedReturned = returnedRedirect.replace(/\/+$/, '')
  if (cleanedRequested === cleanedReturned) {
    console.log('HONORED ✅ — Supabase used the customer URL we passed in.')
  } else {
    console.log('SUBSTITUTED ❌ — Supabase ignored redirectTo and used its Site URL fallback.')
    console.log('  expected:', cleanedRequested)
    console.log('  got:     ', cleanedReturned)
    console.log(
      '\nNext step: in the Supabase dashboard add a wildcard to Authentication → URL Configuration → Redirect URLs, e.g. https://cimaa-*.vercel.app/**'
    )
  }
}

main().catch((err) => {
  console.error('[test-redirect] fatal:', err)
  process.exit(99)
})
