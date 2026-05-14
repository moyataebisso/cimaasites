/**
 * Canonical app base URL with no trailing slash.
 *
 * Previous incident: a stray trailing slash on `NEXT_PUBLIC_APP_URL` in Vercel
 * env caused `${env}/api/onboard/provision` to render as
 * `https://…vercel.app//api/onboard/provision`, which Vercel rejected and the
 * Stripe webhook's fire-and-forget fetch never landed. Caller can't tell from
 * just `process.env.NEXT_PUBLIC_APP_URL` whether the value is "clean" — so
 * always route through this helper and `${getAppBaseUrl()}/path` works
 * regardless of how the env var was typed.
 *
 * Fallback chain (in order):
 *   1. NEXT_PUBLIC_APP_URL  — primary source of truth, stripped of trailing /'s
 *   2. Host header           — derived from the incoming request (Vercel always
 *                              provides it). Uses http:// for localhost,
 *                              https:// for everything else.
 *   3. Hardcoded prod URL   — last-resort so production never breaks even if
 *                              the env var is missing and no request is in scope.
 */
export function getAppBaseUrl(
  req?: Request | { headers?: Headers | { get?: (k: string) => string | null } }
): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  if (envUrl) {
    return envUrl.replace(/\/+$/, '')
  }

  const headers = req?.headers
  const host =
    headers && typeof (headers as Headers).get === 'function'
      ? (headers as Headers).get('host')
      : null
  if (host) {
    const protocol = host.includes('localhost') ? 'http' : 'https'
    return `${protocol}://${host}`
  }

  return 'https://wajiiwebsites.com'
}
