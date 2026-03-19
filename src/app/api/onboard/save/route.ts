import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const data = await request.json()

  const { data: submission, error } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .insert({
      status: 'pending',
      plan: data.plan,
      business_name: data.businessName,
      business_type: data.businessType,
      business_description: data.description,
      tagline: data.tagline,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      hours: data.hours,
      services: data.services,
      social_links: {
        facebook: data.facebook,
        instagram: data.instagram,
        tiktok: data.tiktok,
        whatsapp: data.whatsapp,
      },
      selected_theme: data.selectedTheme,
      primary_color: data.primaryColor,
      accent_color: data.accentColor,
      logo_url: data.logoUrl,
      photo_urls: data.photoUrls,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ submissionId: submission.id })
}
