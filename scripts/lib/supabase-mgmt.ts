import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'public' } }
  )
}

export function generateSchemaName(businessName: string): string {
  return (
    'client_' +
    businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 40)
  )
}

export async function createClientSchema(schemaName: string): Promise<void> {
  const supabase = getAdminClient()

  const { error } = await supabase.rpc('create_client_schema', {
    schema_name: schemaName,
  })

  if (error) throw new Error(`Failed to create schema: ${error.message}`)
}

export async function runSchemaSQL(schemaName: string): Promise<void> {
  const supabase = getAdminClient()

  const sqlPath = path.join(process.cwd(), 'scripts', 'client-schema.sql')
  let sql = fs.readFileSync(sqlPath, 'utf-8')

  sql = sql.replaceAll('{{SCHEMA}}', schemaName)

  const { error } = await supabase.rpc('exec_sql_in_schema', {
    schema_name: schemaName,
    sql_query: sql,
  })

  if (error) throw new Error(`Failed to run schema SQL: ${error.message}`)
}

export async function seedClientData(
  schemaName: string,
  data: {
    businessName: string
    businessType: string
    phone: string
    email: string
    address: string
    tagline: string
    theme: string
    primaryColor?: string
    hours?: Record<string, unknown>
    services?: Array<{ name: string; description?: string }>
    logoUrl?: string
    heroHeadline?: string
    heroSubheading?: string
    aboutText?: string
  }
): Promise<void> {
  const supabase = getAdminClient()

  const settings = [
    { key: 'business_name', value: data.businessName, value_json: data.businessName },
    { key: 'business_type', value: data.businessType, value_json: data.businessType },
    { key: 'phone', value: data.phone || '', value_json: data.phone || '' },
    { key: 'email', value: data.email, value_json: data.email },
    { key: 'address', value: data.address || '', value_json: data.address || '' },
    { key: 'tagline', value: data.tagline || '', value_json: data.tagline || '' },
    { key: 'active_theme', value: data.theme, value_json: data.theme },
    {
      key: 'color_primary',
      value: data.primaryColor || '',
      value_json: data.primaryColor || '',
    },
    {
      key: 'hours',
      value: JSON.stringify(data.hours || {}),
      value_json: data.hours || {},
    },
    {
      key: 'hero_headline',
      value: data.heroHeadline || `Welcome to ${data.businessName}`,
      value_json: data.heroHeadline || '',
    },
    {
      key: 'hero_subheading',
      value: data.heroSubheading || data.tagline || '',
      value_json: data.heroSubheading || '',
    },
    { key: 'about_text', value: data.aboutText || '', value_json: data.aboutText || '' },
    { key: 'logo_url', value: data.logoUrl || '', value_json: data.logoUrl || '' },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemaClient = supabase.schema(schemaName as any)

  for (const setting of settings) {
    const { error } = await schemaClient
      .from('site_settings')
      .upsert(setting, { onConflict: 'key' })

    if (error) console.error(`Warning: failed to seed ${setting.key}:`, error.message)
  }

  if (data.services?.length) {
    for (const service of data.services) {
      await schemaClient.from('booking_services').insert({
        name: service.name,
        description: service.description || '',
        duration_minutes: 60,
        price: 0,
        active: true,
      })
    }
  }
}

export async function createAdminUser(
  email: string,
  businessName: string
): Promise<{ password: string }> {
  const supabase = getAdminClient()
  const password = generatePassword()

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      role: 'admin',
      business_name: businessName,
    },
    email_confirm: true,
  })

  if (error && !error.message.includes('already registered')) {
    throw new Error(`Failed to create admin user: ${error.message}`)
  }

  return { password }
}

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 12 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}
