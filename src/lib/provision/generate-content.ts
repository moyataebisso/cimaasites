import Anthropic from '@anthropic-ai/sdk'

function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
}

interface ContentInput {
  business_name: string
  business_type: string
  business_description: string
  tagline?: string
  services?: Array<{ name: string; description?: string }>
  city?: string
  state?: string
  selected_layout?: string | null
  layout_notes?: string | null
  // ── Expanded intake fields (any may be null) ──
  business_story?: string | null
  years_in_business?: number | null
  cuisine_type?: string | null
  dietary_options?: string[] | null
  atmosphere?: string[] | null
  reservations?: string | null
  takeout?: string | null
  delivery?: string | null
  salon_services?: string[] | null
  specializations?: string | null
  auto_services?: string[] | null
  certifications?: string | null
  service_area_radius?: number | null
}

function listOrNone(items: unknown): string {
  if (!Array.isArray(items) || items.length === 0) return 'none provided'
  return items
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .join(', ') || 'none provided'
}

function strOrNone(v: unknown): string {
  if (typeof v === 'string' && v.trim().length > 0) return v
  if (typeof v === 'number') return String(v)
  return 'none provided'
}

export async function generateContent(submission: ContentInput) {
  const anthropic = getAnthropicClient()

  // Layout-specific extras only render the relevant block so the prompt
  // doesn't drown the model in irrelevant context.
  const layout = (submission.selected_layout || '').toLowerCase()
  let layoutBlock = ''
  if (layout === 'restaurant' || layout === 'bistro') {
    layoutBlock = `
RESTAURANT CONTEXT:
- Cuisine: ${strOrNone(submission.cuisine_type)}
- Dietary options: ${listOrNone(submission.dietary_options)}
- Atmosphere: ${listOrNone(submission.atmosphere)}
- Reservations: ${strOrNone(submission.reservations)}
- Takeout: ${strOrNone(submission.takeout)}
- Delivery: ${strOrNone(submission.delivery)}
`
  } else if (layout === 'salon' || layout === 'spa') {
    layoutBlock = `
SALON CONTEXT:
- Services offered: ${listOrNone(submission.salon_services)}
- Specializations: ${strOrNone(submission.specializations)}
`
  } else if (layout === 'auto' || layout === 'mechanic') {
    layoutBlock = `
AUTO SHOP CONTEXT:
- Services offered: ${listOrNone(submission.auto_services)}
- Certifications: ${strOrNone(submission.certifications)}
`
  } else {
    layoutBlock = `
SERVICE BUSINESS CONTEXT:
- Service area radius (miles): ${strOrNone(submission.service_area_radius)}
- Certifications: ${strOrNone(submission.certifications)}
`
  }

  const prompt = `
You are writing website copy for a local business.
Generate compelling, professional copy based on this business information:

Business Name: ${submission.business_name}
Business Type: ${submission.business_type}
Description: ${submission.business_description}
Tagline: ${strOrNone(submission.tagline)}
Years in business: ${strOrNone(submission.years_in_business)}
City: ${submission.city || ''}
State: ${submission.state || ''}
Services: ${JSON.stringify(submission.services || [])}

THE OWNER'S STORY (most important — use this voice and these details):
${submission.business_story || '(none provided — invent nothing; rely on the description above instead)'}
${layoutBlock}
Selected layout style: ${submission.selected_layout || 'fleet'} (this is the industry/feel — restaurant means food-forward, salon means editorial, fleet means transport, healthcare means trust-forward, community means mission-driven, home_services means lawn/landscaping/cleaning)

Customer's preferences (their own words): ${submission.layout_notes || 'none provided'}

Use the owner's story FIRST when writing — borrow phrases, family details, founding moments, and the kinds of customers they serve. Layer in dietary tags, atmosphere words, and certifications where they make the copy more concrete. If they mention specific things like "family-owned" or "warm colors" or "more photos than text", weave those preferences into the copy authentically.

Respond with ONLY valid JSON, no markdown, no extra text:
{
  "heroHeadline": "compelling 6-10 word headline",
  "heroSubheading": "one sentence value proposition",
  "aboutText": "2-3 warm professional sentences about the business — anchored in the owner's story",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description under 160 chars",
  "services": [
    {
      "name": "service name",
      "description": "one compelling sentence"
    }
  ]
}

Rules:
- Use the actual business name
- Be specific to their industry
- Sound human and warm not corporate
- heroHeadline should be action-oriented
- Do NOT use placeholder text
- If the owner's story mentions a year/decade, work the years_in_business signal into about copy
`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text =
      message.content[0].type === 'text'
        ? message.content[0].text.trim()
        : '{}'

    // Strip markdown fencing if present
    const cleaned = text
      .replace(/^```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim()

    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Content generation failed:', error)
    return {
      heroHeadline: `Welcome to ${submission.business_name}`,
      heroSubheading:
        submission.business_description ||
        `Professional ${submission.business_type} services`,
      aboutText:
        submission.business_description ||
        `We are ${submission.business_name}, your trusted ${submission.business_type}.`,
      metaTitle: `${submission.business_name} - ${submission.business_type}`,
      metaDescription:
        submission.business_description ||
        `${submission.business_name} - professional services`,
      services: (submission.services || []).map((s) => ({
        name: s.name,
        description: s.description || `Professional ${s.name} service`,
      })),
    }
  }
}
