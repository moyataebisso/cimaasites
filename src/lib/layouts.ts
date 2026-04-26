export const LAYOUT_IDS = [
  'fleet',
  'restaurant',
  'salon',
  'healthcare',
  'community',
] as const

export type LayoutId = (typeof LAYOUT_IDS)[number]

export interface LayoutMeta {
  id: LayoutId
  name: string
  industry: string
  tagline: string
  description: string
  defaultTheme: string
  screenshot: string
  previewUrl: string
}

export const LAYOUTS: LayoutMeta[] = [
  {
    id: 'fleet',
    name: 'Fleet & Transport',
    industry: 'Transportation, logistics, fleet services',
    tagline: 'Bold and direct',
    description:
      'Built for transport, fleet, and logistics businesses. Bold solid-color hero, clear service blocks, easy booking flow.',
    defaultTheme: 'transport',
    screenshot: '/images/layouts/fleet.png',
    previewUrl:
      'https://arsi-platform-starter-app.vercel.app/?layout=fleet&theme=transport',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    industry: 'Restaurants, cafés, food service',
    tagline: 'Image-led and inviting',
    description:
      'Warm, photo-first design for restaurants and cafés. Menu preview, reservations CTA, location map.',
    defaultTheme: 'bistro',
    screenshot: '/images/layouts/restaurant.png',
    previewUrl:
      'https://arsi-platform-starter-app.vercel.app/?layout=restaurant&theme=bistro',
  },
  {
    id: 'salon',
    name: 'Salon & Beauty',
    industry: 'Salons, spas, beauty services',
    tagline: 'Editorial and clean',
    description:
      'Editorial layout for salons and beauty. Services + pricing list, gallery-friendly, booking-first CTA.',
    defaultTheme: 'rose',
    screenshot: '/images/layouts/salon.png',
    previewUrl:
      'https://arsi-platform-starter-app.vercel.app/?layout=salon&theme=rose',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    industry: 'Clinics, dental, therapy, wellness',
    tagline: 'Calm and trustworthy',
    description:
      'Trust-forward design for healthcare practices. Provider grid, services, appointment booking.',
    defaultTheme: 'wellness',
    screenshot: '/images/layouts/healthcare.png',
    previewUrl:
      'https://arsi-platform-starter-app.vercel.app/?layout=healthcare&theme=wellness',
  },
  {
    id: 'community',
    name: 'Community & Nonprofit',
    industry: 'Nonprofits, faith, education, community orgs',
    tagline: 'Mission-driven and warm',
    description:
      'Built for community organizations and nonprofits. Mission stats, donate/volunteer CTAs, story-led.',
    defaultTheme: 'nonprofit',
    screenshot: '/images/layouts/community.png',
    previewUrl:
      'https://arsi-platform-starter-app.vercel.app/?layout=community&theme=nonprofit',
  },
]

export function isLayoutId(value: unknown): value is LayoutId {
  return (
    typeof value === 'string' &&
    (LAYOUT_IDS as readonly string[]).includes(value)
  )
}
