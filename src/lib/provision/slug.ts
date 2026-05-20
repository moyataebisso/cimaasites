/**
 * Lower-cases the business name and replaces any non-alphanumeric run with a
 * single hyphen, then trims leading/trailing hyphens and caps at 25 chars.
 *
 * Used to derive both the Vercel project name (`waji-<slug>-<ts>`) and the
 * per-customer Postgres schema name (`client_<slug>`). Keep these in sync —
 * if you change the rules here, every downstream identifier shifts.
 */
export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 25)
}
