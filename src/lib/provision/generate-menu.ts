import Anthropic from '@anthropic-ai/sdk'

function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'drink'

export interface MenuItem {
  name: string
  description: string
  price: string
  category: MenuCategory
  featured: boolean
}

interface MenuSubmission {
  business_name: string
  business_description?: string | null
  tagline?: string | null
  selected_layout?: string | null
  cuisine_type?: string | null
  dietary_options?: string[] | null
  business_story?: string | null
}

const RESTAURANT_LAYOUTS = new Set(['restaurant', 'bistro'])

/**
 * Generates 6 AI-written menu items for a restaurant submission.
 * Returns [] for non-restaurant layouts (caller skips the menu_items insert).
 *
 * Idempotency: caller is expected to read submission.generated_menu_items
 * first and skip if already populated. This function always re-generates.
 */
export async function generateMenuItems(
  submission: MenuSubmission
): Promise<MenuItem[]> {
  const layout = submission.selected_layout || ''
  if (!RESTAURANT_LAYOUTS.has(layout)) {
    console.log('[generate-menu] skipping non-restaurant layout', { layout })
    return []
  }

  const cuisine = (submission.cuisine_type || 'general').trim() || 'general'
  const businessName = submission.business_name
  const description =
    submission.business_description || submission.tagline || ''
  const dietary = Array.isArray(submission.dietary_options)
    ? submission.dietary_options.filter(
        (x): x is string => typeof x === 'string' && x.trim().length > 0
      )
    : []
  const story =
    typeof submission.business_story === 'string' &&
    submission.business_story.trim().length > 0
      ? submission.business_story.trim()
      : ''

  const dietaryLine =
    dietary.length > 0
      ? `\nDietary options the kitchen handles: ${dietary.join(', ')}. Where it makes sense, flag matching dishes by appending "(${dietary[0]}-friendly)" or similar to the description.`
      : ''
  const storyLine = story
    ? `\nOwner's story (use to inform tone/specifics — borrow names, regions, family details where authentic):\n"""${story.slice(0, 600)}"""`
    : ''

  const prompt = `Generate 6 menu items for "${businessName}", a ${cuisine} restaurant. Description: "${description}".${storyLine}${dietaryLine}

Return ONLY a JSON array with this exact shape (no markdown, no extra text):
[
  {"name": "string", "description": "1-2 sentences, evocative", "price": "$XX or $XX-XX", "category": "appetizer|main|dessert|drink", "featured": true|false}
]

Requirements:
- Mix of categories: 1 appetizer, 3 mains, 1 dessert, 1 drink
- 3 items marked featured: true (these show on homepage)
- Realistic prices for ${cuisine} cuisine
- Authentic, recognizable dish names
- Descriptions that make people hungry`

  let text = ''
  try {
    const anthropic = getAnthropicClient()
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })
    text =
      response.content[0]?.type === 'text' ? response.content[0].text : ''
    console.log('[generate-menu] response', {
      businessName,
      cuisine,
      length: text.length,
    })
  } catch (err) {
    console.error('[generate-menu] anthropic call failed', { err })
    return []
  }

  // Strip markdown fencing if Claude added it despite the instruction.
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```\s*$/, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned) as unknown
    if (!Array.isArray(parsed)) {
      console.error('[generate-menu] expected array, got', { kind: typeof parsed })
      return []
    }

    // Coerce each entry into the MenuItem shape, dropping malformed rows.
    const items: MenuItem[] = []
    for (const raw of parsed) {
      if (!raw || typeof raw !== 'object') continue
      const r = raw as Record<string, unknown>
      const name = typeof r.name === 'string' ? r.name.trim() : ''
      if (!name) continue
      const category =
        r.category === 'appetizer' ||
        r.category === 'main' ||
        r.category === 'dessert' ||
        r.category === 'drink'
          ? r.category
          : ('main' as MenuCategory)
      items.push({
        name,
        description:
          typeof r.description === 'string' ? r.description.trim() : '',
        price: typeof r.price === 'string' ? r.price.trim() : '',
        category,
        featured: r.featured === true,
      })
    }

    console.log('[generate-menu] parsed', {
      count: items.length,
      featured: items.filter((i) => i.featured).length,
    })
    return items
  } catch (err) {
    console.error('[generate-menu] JSON parse failed', {
      err,
      excerpt: cleaned.slice(0, 200),
    })
    return []
  }
}
