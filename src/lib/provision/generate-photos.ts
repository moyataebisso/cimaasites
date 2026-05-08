// Curates Unsplash photos by layout + cuisine for the customer's hero,
// about, menu preview, and gallery sections. All four queries run in
// parallel to keep this off the critical-path latency budget. Returns
// empty strings/arrays on missing key or API errors so seeding never
// breaks because of stock-photo fetch failure.

const UNSPLASH_API = 'https://api.unsplash.com'

interface UnsplashSearchResponse {
  results?: Array<{ urls?: { regular?: string } }>
}

async function searchUnsplash(query: string, count: number): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    console.warn('[generate-photos] UNSPLASH_ACCESS_KEY missing, returning empty')
    return []
  }

  const url = `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=${count}&orientation=landscape`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
  } catch (err) {
    console.error('[generate-photos] unsplash fetch failed', { query, err })
    return []
  }

  if (!res.ok) {
    console.error('[generate-photos] unsplash error', {
      status: res.status,
      query,
    })
    return []
  }

  const data = (await res.json().catch(() => ({}))) as UnsplashSearchResponse
  const urls = (data.results || [])
    .map((r) => r?.urls?.regular)
    .filter((u): u is string => typeof u === 'string' && u.length > 0)

  console.log('[generate-photos] query result', {
    query,
    requested: count,
    received: urls.length,
  })
  return urls
}

export interface PhotoSet {
  hero: string
  about: string
  menu: string[] // up to 3
  gallery: string[] // up to 6
}

interface PhotoSubmission {
  selected_layout?: string | null
  cuisine_type?: string | null
}

interface QueryBundle {
  hero: string
  about: string
  menu: string
  gallery: string
}

function pickQueries(submission: PhotoSubmission): QueryBundle {
  const layout = submission.selected_layout || 'general'
  const cuisine = (submission.cuisine_type || '').trim()

  if (layout === 'restaurant' || layout === 'bistro') {
    return {
      hero: cuisine ? `${cuisine} restaurant interior` : 'restaurant interior cozy',
      about: cuisine ? `${cuisine} chef cooking` : 'restaurant chef',
      menu: cuisine ? `${cuisine} food plate` : 'gourmet food plate',
      gallery: cuisine ? `${cuisine} cuisine` : 'restaurant food',
    }
  }
  if (layout === 'salon' || layout === 'spa') {
    return {
      hero: 'salon interior modern',
      about: 'hair stylist working',
      menu: 'salon services',
      gallery: 'salon spa wellness',
    }
  }
  if (layout === 'auto' || layout === 'mechanic') {
    return {
      hero: 'auto repair shop interior',
      about: 'mechanic working car',
      menu: 'car service',
      gallery: 'auto repair garage',
    }
  }
  if (layout === 'healthcare') {
    return {
      hero: 'modern medical clinic interior',
      about: 'healthcare professional',
      menu: 'healthcare service',
      gallery: 'medical clinic team',
    }
  }
  if (layout === 'home_services') {
    return {
      hero: 'professional home services worker',
      about: 'contractor working',
      menu: 'home repair service',
      gallery: 'home services landscaping',
    }
  }
  return {
    hero: 'professional business office',
    about: 'team meeting professional',
    menu: 'business service',
    gallery: 'professional service',
  }
}

/**
 * Per-dish image lookup. Builds a cuisine-aware Unsplash query, retries
 * with a broader cuisine-only query if the specific dish returns nothing,
 * and gracefully returns null when both fail (or when UNSPLASH_ACCESS_KEY
 * is missing). Never throws — caller can always insert with null image_url.
 *
 * Example queries for "Doro Wat" / cuisineType "Ethiopian":
 *   1. "ethiopian doro wat dish food"
 *   2. (fallback) "ethiopian food"
 */
export async function fetchMenuItemImage(
  dishName: string,
  cuisineType: string | null
): Promise<string | null> {
  try {
    const cleanName = (dishName || '').trim()
    if (!cleanName) return null

    const cuisinePart = cuisineType?.trim() ? `${cuisineType.trim()} ` : ''
    const primaryQuery = `${cuisinePart}${cleanName} dish food`.toLowerCase()

    const primary = await searchUnsplash(primaryQuery, 1)
    if (primary[0]) return primary[0]

    // Broader fallback — better-than-nothing relevance based on cuisine.
    const fallbackQuery = (cuisinePart ? `${cuisinePart}food` : 'restaurant food').toLowerCase()
    const fallback = await searchUnsplash(fallbackQuery, 1)
    return fallback[0] || null
  } catch (err) {
    console.error('[generate-photos] fetchMenuItemImage failed (returning null)', {
      dishName,
      cuisineType,
      err,
    })
    return null
  }
}

export async function generatePhotoSet(
  submission: PhotoSubmission
): Promise<PhotoSet> {
  const queries = pickQueries(submission)
  console.log('[generate-photos] queries', queries)

  const [heroResults, aboutResults, menuResults, galleryResults] =
    await Promise.all([
      searchUnsplash(queries.hero, 1),
      searchUnsplash(queries.about, 1),
      searchUnsplash(queries.menu, 3),
      searchUnsplash(queries.gallery, 6),
    ])

  return {
    hero: heroResults[0] || '',
    about: aboutResults[0] || '',
    menu: menuResults,
    gallery: galleryResults,
  }
}
