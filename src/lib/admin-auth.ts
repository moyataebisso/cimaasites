import { timingSafeEqual } from 'node:crypto'

// Header auth for admin routes. Compare with timingSafeEqual on
// equal-length buffers so a leaked timing signal can't be used to
// recover the secret one character at a time.
//
// Failure modes are made externally indistinguishable: missing env,
// missing header, wrong-length header, and wrong secret all take the
// same code path and return the same 401 body + log line. Item A took
// the same posture for the provision route; we keep it consistent
// here.

const ADMIN_HEADER = 'x-admin-password'

export interface AdminAuthRequest {
  headers: { get(name: string): string | null }
}

export function requireAdminPassword(
  request: AdminAuthRequest
): Response | null {
  const expected = process.env.ADMIN_PASSWORD
  const provided = request.headers.get(ADMIN_HEADER)

  if (!expected) {
    console.warn('[admin-auth] denied')
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!provided || provided.length !== expected.length) {
    console.warn('[admin-auth] denied')
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const a = Buffer.from(expected)
  const b = Buffer.from(provided)
  if (a.length !== b.length) {
    console.warn('[admin-auth] denied')
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!timingSafeEqual(a, b)) {
    console.warn('[admin-auth] denied')
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
