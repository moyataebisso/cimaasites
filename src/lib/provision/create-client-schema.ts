import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { supabaseAdmin } from '@/lib/supabase'

const TEMPLATE_RELATIVE_PATH =
  'supabase/migrations/20260426130200_client_schema_template.sql'

const SCHEMA_NAME_RX = /^client_[a-z0-9_-]{1,40}$/

let cachedTemplate: string | null = null

function loadTemplate(): string {
  if (cachedTemplate) return cachedTemplate
  const path = join(process.cwd(), TEMPLATE_RELATIVE_PATH)
  cachedTemplate = readFileSync(path, 'utf8')
  return cachedTemplate
}

function splitStatements(sql: string): string[] {
  // Strip line comments, then split on `;` boundaries. The template has no
  // dollar-quoted bodies or PL/pgSQL functions, so naive splitting is safe.
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0)
}

/**
 * Idempotently provisions a per-customer Postgres schema in the shared
 * Supabase project and seeds it with the tables defined in the schema
 * template. Safe to call twice on the same slug — every statement uses
 * IF NOT EXISTS / OR REPLACE semantics.
 *
 * Requires the cimaasites.exec_sql(text) helper to exist in Supabase
 * (see supabase/migrations/20260426130000_create_exec_sql_function.sql).
 */
export async function createClientSchema(
  slug: string
): Promise<{ schemaName: string }> {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`createClientSchema: invalid slug "${slug}"`)
  }

  const schemaName = `client_${slug.replace(/-/g, '_')}`

  if (!SCHEMA_NAME_RX.test(schemaName)) {
    throw new Error(
      `createClientSchema: derived schema name "${schemaName}" is invalid`
    )
  }

  const template = loadTemplate()
  const sql = template.replaceAll('__SCHEMA__', schemaName)
  const statements = splitStatements(sql)

  for (const statement of statements) {
    const { error } = await supabaseAdmin
      .schema('cimaasites')
      .rpc('exec_sql', { sql: statement })

    if (error) {
      throw new Error(
        `exec_sql failed (${error.code || 'unknown'}): ${error.message}\n— statement: ${statement.slice(0, 200)}`
      )
    }
  }

  return { schemaName }
}
