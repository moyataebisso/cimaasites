'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Hardcoded slide list. Captions are descriptive (not invented business names)
// because the current screenshots in public/layout-previews/ are section /
// layout snapshots, not per-customer site screenshots. When real per-customer
// captures are added with the spec'd `<business>-<layout>.jpg` naming, drop
// them in this array — `parseFilenameCaption` will derive the caption fields.
type Slide = {
  src: string
  businessName: string
  layoutLabel: string
}

const SLIDES: Slide[] = [
  {
    src: '/layout-previews/restauraunt.png.png',
    businessName: 'Restaurant homepage',
    layoutLabel: 'Restaurant layout',
  },
  {
    src: '/layout-previews/menu.png.png',
    businessName: 'Menu page',
    layoutLabel: 'Restaurant layout',
  },
  {
    src: '/layout-previews/fleet.png.png',
    businessName: 'Fleet services site',
    layoutLabel: 'Fleet layout',
  },
  {
    src: '/layout-previews/loc.png.png',
    businessName: 'Hours & location',
    layoutLabel: 'Local business section',
  },
  {
    src: '/layout-previews/contact.png.png',
    businessName: 'Contact page',
    layoutLabel: 'Universal section',
  },
]

// Robust parser for filenames matching `<business-words>-<layout>.<ext>`. Last
// hyphen-delimited segment before the extension is the layout; everything
// before is the business name. Handles multi-word businesses
// ("bella-salon-and-spa-salon.jpg" → business "Bella Salon And Spa", layout
// "Salon"). Exported so future contributors can slot real customer screenshots
// without touching SLIDES manually.
export function parseFilenameCaption(filename: string): {
  businessName: string
  layoutLabel: string
} {
  const stem = filename.replace(/\.[^.]+$/, '').replace(/^.*\//, '')
  const parts = stem.split('-').filter(Boolean)
  if (parts.length < 2) {
    return { businessName: titleCase(stem), layoutLabel: 'Layout' }
  }
  const layout = parts[parts.length - 1]
  const business = parts.slice(0, -1).join(' ')
  return {
    businessName: titleCase(business),
    layoutLabel: `${titleCase(layout)} layout`,
  }
}

function titleCase(s: string): string {
  return s
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

const AUTO_ADVANCE_MS = 5000

export default function SiteGallery() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const slideCount = SLIDES.length

  // Scroll the track to a slide index. We measure the first card's width
  // (browser handles 1/2/3-per-view via responsive `flex-basis`) and scroll
  // to `index * cardWidth`, wrapping when index passes the end.
  const scrollToIndex = useCallback((next: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-slide]')
    if (!card) return
    const cardWidth = card.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0
    const targetLeft = next * (cardWidth + gap)
    track.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % slideCount
      scrollToIndex(next)
      return next
    })
  }, [scrollToIndex, slideCount])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev - 1 + slideCount) % slideCount
      scrollToIndex(next)
      return next
    })
  }, [scrollToIndex, slideCount])

  // Auto-advance. Pauses on hover (`paused`) and when the user is dragging or
  // the tab is hidden. Stops while reduced-motion is requested.
  useEffect(() => {
    if (paused) return
    if (typeof window !== 'undefined') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
    }
    const id = window.setInterval(goNext, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [paused, goNext])

  // Keep activeIndex in sync when the user manually swipes/drags the track —
  // we read the closest card by scroll position so the dot indicator follows.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const card = track.querySelector<HTMLElement>('[data-slide]')
        if (!card) return
        const cardWidth = card.getBoundingClientRect().width
        const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0
        const idx = Math.round(track.scrollLeft / (cardWidth + gap))
        setActiveIndex(Math.max(0, Math.min(slideCount - 1, idx)))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [slideCount])

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    },
    [goNext, goPrev]
  )

  const slidesId = useMemo(() => `site-gallery-track`, [])

  return (
    <section
      aria-label="Examples of customer sites"
      className="bg-cimaa-bg-tan pt-28 pb-12 md:pt-32 md:pb-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
              See what we build
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-cimaa-text">
              Real sites, recently shipped
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <CarouselButton label="Previous example" onClick={goPrev}>
              <ChevronLeft size={18} />
            </CarouselButton>
            <CarouselButton label="Next example" onClick={goNext}>
              <ChevronRight size={18} />
            </CarouselButton>
          </div>
        </div>

        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer site examples"
          aria-controls={slidesId}
          tabIndex={0}
          onKeyDown={handleKey}
          className="
            flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cimaa-green focus-visible:ring-offset-2
            rounded-2xl
            [&::-webkit-scrollbar]:hidden [scrollbar-width:none]
          "
          id={slidesId}
        >
          {SLIDES.map((slide, idx) => (
            <figure
              key={slide.src}
              data-slide
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${slideCount}: ${slide.businessName}, ${slide.layoutLabel}`}
              className="
                snap-start shrink-0
                basis-full sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]
              "
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white border border-cimaa-border shadow-sm">
                <Image
                  src={slide.src}
                  alt={`${slide.businessName} — ${slide.layoutLabel}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  priority={idx === 0}
                />
              </div>
              <figcaption className="mt-3 px-1">
                <div className="font-semibold text-cimaa-text">
                  {slide.businessName}
                </div>
                <div className="text-sm text-cimaa-text-muted">
                  {slide.layoutLabel}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2" aria-hidden="true">
          {SLIDES.map((slide, idx) => (
            <span
              key={slide.src}
              className={[
                'h-1.5 rounded-full transition-all',
                idx === activeIndex
                  ? 'w-6 bg-cimaa-green'
                  : 'w-1.5 bg-cimaa-text-subtle/40',
              ].join(' ')}
            />
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-cimaa-text-muted">
          Each site is built around your specific business — these are examples of recent customer work.
        </p>
      </div>
    </section>
  )
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="
        flex h-10 w-10 items-center justify-center rounded-full
        border border-cimaa-border bg-white text-cimaa-text
        hover:border-cimaa-green hover:text-cimaa-green
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cimaa-green focus-visible:ring-offset-2
        transition-colors
      "
    >
      {children}
    </button>
  )
}
