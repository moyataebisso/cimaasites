import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GeneratedContent {
  heroHeadline: string
  heroSubheading: string
  aboutText: string
  metaTitle: string
  metaDescription: string
  services: Array<{ name: string; description: string }>
}

export async function generateContent(submission: {
  business_name: string
  business_type: string
  business_description: string
  tagline?: string
  services?: Array<{ name: string; description?: string }>
  city?: string
  state?: string
}): Promise<GeneratedContent> {
  const prompt = `You are writing website copy for a local business.
Generate compelling, professional copy based on this business information:

Business Name: ${submission.business_name}
Business Type: ${submission.business_type}
Description: ${submission.business_description}
Tagline: ${submission.tagline || 'none provided'}
Services: ${JSON.stringify(submission.services || [])}
Location: ${submission.city || ''}, ${submission.state || ''}

Generate a JSON response with EXACTLY this structure, no other text, no markdown:
{
  "heroHeadline": "compelling 6-10 word headline",
  "heroSubheading": "one sentence describing the business value",
  "aboutText": "2-3 sentences about the business, warm and professional",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description under 160 chars",
  "services": [
    {
      "name": "service name",
      "description": "one compelling sentence about this service"
    }
  ]
}

Rules:
- Use the business name naturally
- Be specific to their industry
- Sound human and warm, not corporate
- metaTitle format: "[Business Name] - [What They Do]"
- heroHeadline should be action-oriented
- Do NOT mention location unless it's in their tagline`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    return JSON.parse(text)
  } catch {
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
