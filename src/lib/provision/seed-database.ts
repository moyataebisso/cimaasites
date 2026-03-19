import { supabaseAdmin } from '@/lib/supabase'

function generatePassword(): string {
  const chars =
    'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function seedClientDatabase(submission: any, content: any) {
  const settingsToSeed = [
    {
      key: 'business_name',
      value: submission.business_name,
      value_json: submission.business_name,
    },
    {
      key: 'business_type',
      value: submission.business_type,
      value_json: submission.business_type,
    },
    {
      key: 'phone',
      value: submission.phone || '',
      value_json: submission.phone || '',
    },
    {
      key: 'email',
      value: submission.email,
      value_json: submission.email,
    },
    {
      key: 'address',
      value: `${submission.address || ''} ${submission.city || ''} ${submission.state || ''}`.trim(),
      value_json: `${submission.address || ''} ${submission.city || ''} ${submission.state || ''}`.trim(),
    },
    {
      key: 'active_theme',
      value: submission.selected_theme || 'warm',
      value_json: submission.selected_theme || 'warm',
    },
    {
      key: 'hero_headline',
      value: content.heroHeadline,
      value_json: content.heroHeadline,
    },
    {
      key: 'hero_subheading',
      value: content.heroSubheading,
      value_json: content.heroSubheading,
    },
    {
      key: 'about_text',
      value: content.aboutText,
      value_json: content.aboutText,
    },
    {
      key: 'tagline',
      value: submission.tagline || content.heroSubheading,
      value_json: submission.tagline || content.heroSubheading,
    },
    {
      key: 'hours',
      value: JSON.stringify(submission.hours || {}),
      value_json: submission.hours || {},
    },
    {
      key: 'color_primary',
      value: submission.primary_color || '',
      value_json: submission.primary_color || '',
    },
    {
      key: 'logo_url',
      value: submission.logo_url || '',
      value_json: submission.logo_url || '',
    },
    {
      key: 'meta_title',
      value: content.metaTitle,
      value_json: content.metaTitle,
    },
    {
      key: 'meta_description',
      value: content.metaDescription,
      value_json: content.metaDescription,
    },
    {
      key: 'social_links',
      value: JSON.stringify(submission.social_links || {}),
      value_json: submission.social_links || {},
    },
  ]

  for (const setting of settingsToSeed) {
    await supabaseAdmin
      .from('site_settings')
      .upsert(
        {
          key: setting.key,
          value: setting.value,
          value_json: setting.value_json,
        },
        { onConflict: 'key' }
      )
  }

  // Seed services into booking_services
  if (submission.services?.length > 0) {
    for (const service of submission.services) {
      if (!service.name) continue

      const matchedContent = content.services?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) => s.name.toLowerCase() === service.name.toLowerCase()
      )

      await supabaseAdmin.from('booking_services').insert({
        name: service.name,
        description:
          matchedContent?.description || service.description || '',
        duration_minutes: parseInt(service.duration) || 60,
        price: 0,
        active: true,
      })
    }
  }

  // Create admin auth user for client
  const adminPassword = generatePassword()

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: submission.email,
      password: adminPassword,
      user_metadata: { role: 'admin' },
      email_confirm: true,
    })

  if (authError) {
    console.error('Failed to create admin user:', authError)
    // Don't throw — site can still work, client can reset password
  }

  return {
    adminEmail: submission.email,
    adminPassword,
    adminUserId: authData?.user?.id,
  }
}
