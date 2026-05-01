import { supabaseAdmin } from '@/lib/supabase'

const SCHEMA_NAME_RX = /^client_[a-z0-9_-]{1,40}$/

// Below this and we know the clone failed silently or partially. The public
// schema currently has ~41 tables; 30 is a generous lower bound that catches
// "only 2 tables created" without flapping if a few are added or removed.
const MIN_EXPECTED_TABLES = 30

/**
 * Idempotently provisions a per-customer Postgres schema in the shared
 * Supabase project. Calls cimaasites.clone_public_to_schema(target_schema)
 * which copies every table from public.* into the target with INCLUDING ALL
 * (constraints, indexes, defaults). Safe to call twice on the same slug.
 *
 * Requires these helpers in Supabase (added by
 * supabase/migrations/20260501120000_add_clone_public_schema.sql):
 *   - cimaasites.clone_public_to_schema(text) RETURNS void
 *   - cimaasites.count_schema_tables(text)    RETURNS integer
 */
export async function createClientSchema(
  slug: string
): Promise<{ schemaName: string }> {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`createClientSchema: invalid slug "${slug}"`)
  }

  // Postgres identifiers can technically include hyphens (when quoted), but
  // every downstream caller treats them as bare names — keep underscores so
  // SUPABASE_SCHEMA env var, search_path, and our own RPCs all line up.
  const schemaName = `client_${slug.replace(/-/g, '_')}`

  if (!SCHEMA_NAME_RX.test(schemaName)) {
    throw new Error(
      `createClientSchema: derived schema name "${schemaName}" is invalid`
    )
  }

  console.log('[create-schema] start', { schemaName })

  // ─── Single RPC clones schema + all tables atomically ──
  const { error: cloneErr } = await supabaseAdmin
    .schema('cimaasites')
    .rpc('clone_public_to_schema', { target_schema: schemaName })

  if (cloneErr) {
    console.error('[create-schema] clone failed', { schemaName, error: cloneErr })
    throw new Error(
      `Schema clone failed (${cloneErr.code || 'unknown'}): ${cloneErr.message}`
    )
  }

  // ─── Verify table count ─────────────────────────────────
  const { data: tableCount, error: countErr } = await supabaseAdmin
    .schema('cimaasites')
    .rpc('count_schema_tables', { target_schema: schemaName })

  if (countErr) {
    console.error('[create-schema] count failed', { schemaName, error: countErr })
    throw new Error(
      `Could not verify table count (${countErr.code || 'unknown'}): ${countErr.message}`
    )
  }

  const n = typeof tableCount === 'number' ? tableCount : Number(tableCount) || 0
  console.log('[create-schema] verified table count', { schemaName, tablesCreated: n })

  if (n < MIN_EXPECTED_TABLES) {
    throw new Error(
      `Schema clone produced only ${n} tables in ${schemaName} — expected at least ${MIN_EXPECTED_TABLES}. Check public schema and clone_public_to_schema RAISE WARNINGs in DB logs.`
    )
  }

  // Smoke test that PostgREST can reach the schema (catches grant misses).
  const { error: smokeErr } = await supabaseAdmin
    .schema(schemaName)
    .from('site_settings')
    .select('key', { count: 'exact', head: true })

  if (smokeErr) {
    console.warn('[create-schema] site_settings smoke read returned error (continuing)', {
      schemaName,
      error: smokeErr.message,
    })
  } else {
    console.log('[create-schema] site_settings reachable in', schemaName)
  }

  console.log('[create-schema] complete', { schemaName, tablesCreated: n })

  return { schemaName }
}
