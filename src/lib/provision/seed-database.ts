import { supabaseAdmin } from '@/lib/supabase'

interface GeneratedContent {
  heroHeadline: string
  heroSubheading: string
  aboutText: string
  services?: Array<{ name: string; description: string }>
}

export async function seedClientDatabase(
  submission: {
    business_name: string
    business_type: string
    phone: string
    email: string
    address: string
    selected_theme?: string
    tagline?: string
    hours?: Record<string, unknown>
    primary_color?: string
    logo_url?: string
    services?: Array<{ name: string; description?: string; duration?: string }>
  },
  content: GeneratedContent
) {
  const settingsToSeed = [
    { key: 'business_name', value_json: submission.business_name },
    { key: 'business_type', value_json: submission.business_type },
    { key: 'phone', value_json: submission.phone },
    { key: 'email', value_json: submission.email },
    { key: 'address', value_json: submission.address },
    { key: 'active_theme', value_json: submission.selected_theme || 'warm' },
    { key: 'hero_headline', value_json: content.heroHeadline },
    { key: 'hero_subheading', value_json: content.heroSubheading },
    { key: 'about_text', value_json: content.aboutText },
    { key: 'tagline', value_json: submission.tagline || content.heroSubheading },
    { key: 'hours', value_json: submission.hours || {} },
    { key: 'color_primary', value_json: submission.primary_color || '' },
    { key: 'logo_url', value_json: submission.logo_url || '' },
  ]

  for (const setting of settingsToSeed) {
    await supabaseAdmin
      .from('site_settings')
      .upsert(setting, { onConflict: 'key' })
  }

  if (submission.services?.length) {
    for (const service of submission.services) {
      const generatedDesc = content.services?.find(
        (s) => s.name === service.name
      )?.description

      await supabaseAdmin.from('booking_services').insert({
        name: service.name,
        description: service.description || generatedDesc || '',
        duration_minutes: parseInt(service.duration || '60') || 60,
        price: 0,
        active: true,
      })
    }
  }

  const adminPassword = generatePassword()
  const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
    email: submission.email,
    password: adminPassword,
    user_metadata: { role: 'admin' },
    email_confirm: true,
  })

  return {
    adminEmail: submission.email,
    adminPassword,
    adminUserId: authUser.user?.id,
  }
}

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}
