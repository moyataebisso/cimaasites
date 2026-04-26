import Anthropic from '@anthropic-ai/sdk'

function getAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
}

export async function generateContent(submission: {
  business_name: string
  business_type: string
  business_description: string
  tagline?: string
  services?: Array<{ name: string; description?: string }>
  city?: string
  state?: string
  selected_layout?: string | null
  layout_notes?: string | null
}) {
  const anthropic = getAnthropicClient()

  const prompt = `
You are writing website copy for a local business.
Generate compelling, professional copy based on
this business information:

Business Name: ${submission.business_name}
Business Type: ${submission.business_type}
Description: ${submission.business_description}
Tagline: ${submission.tagline || 'none provided'}
Services: ${JSON.stringify(submission.services || [])}
City: ${submission.city || ''}
State: ${submission.state || ''}

Selected layout style: ${submission.selected_layout || 'fleet'} (this is the industry/feel — restaurant means food-forward, salon means editorial, fleet means transport, healthcare means trust-forward, community means mission-driven, home_services means lawn/landscaping/cleaning)

Customer's preferences (their own words): ${submission.layout_notes || 'none provided'}

Use these to inform tone, word choice, and emphasis. If they mention specific things like "family-owned" or "warm colors" or "more photos than text", weave those preferences into the copy authentically.

Respond with ONLY valid JSON, no markdown, no extra text:
{
  "heroHeadline": "compelling 6-10 word headline",
  "heroSubheading": "one sentence value proposition",
  "aboutText": "2-3 warm professional sentences about the business",
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
