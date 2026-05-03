'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// ─── Types ──────────────────────────────────────────────

export interface IntakeSubmission {
  id: string
  intake_token: string
  contact_name: string | null
  email: string
  business_name: string
  plan: string
  selected_layout: string | null
  business_description: string | null
}

interface DayHours {
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface ServiceItem {
  name: string
  description: string
  price: string
}

// Layout-specific blocks (stored on submission as discrete columns + intake_data)
interface RestaurantData {
  cuisine_type: string
  cuisine_type_other: string
  dietary_options: string[]
  reservations: '' | 'yes' | 'no' | 'not_yet'
  takeout: '' | 'yes' | 'no'
  delivery: '' | 'yes' | 'third_party' | 'no'
  seating_capacity: string // string in form, parsed on submit
  atmosphere: string[]
}

interface SalonData {
  salon_services: string[]
  booking_required: '' | 'yes' | 'walk_ins' | 'both'
  staff_count: string
  products_sold: '' | 'yes' | 'no'
  specializations: string
}

interface AutoData {
  auto_services: string[]
  makes_models: string
  certifications: string
  warranty: '' | 'yes' | 'no' | 'details_below'
  loaner_vehicles: '' | 'yes' | 'no'
}

interface GeneralData {
  service_area_radius: string
  certifications: string
}

export interface IntakeData {
  // Section 1 — About
  tagline: string
  business_description: string
  business_type: string
  // Section 2 — Story
  business_story: string
  years_in_business: string
  // Section 3 — Reach
  address: string
  city: string
  state: string
  zip: string
  hours: Record<string, DayHours>
  // Section 4 — Offerings
  services: ServiceItem[]
  // Section 5 — Layout-specific
  restaurant: RestaurantData
  salon: SalonData
  auto: AutoData
  general: GeneralData
  // Section 6 — Style
  selected_theme: string
  primary_color: string
  logo_url: string
  photo_urls: string[]
  photo_urls_raw: string
  notes: string
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

const DEFAULT_HOURS: Record<string, DayHours> = {
  Monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  Tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  Wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  Thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  Friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  Saturday: { isOpen: true, openTime: '10:00', closeTime: '14:00' },
  Sunday: { isOpen: false, openTime: '10:00', closeTime: '14:00' },
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VT','VA','WA','WV','WI','WY',
] as const

interface ThemeOption {
  id: string
  name: string
  description: string
  swatch: [string, string]
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'warm', name: 'Warm', description: 'Yellow + cream', swatch: ['#facc15', '#fef3c7'] },
  { id: 'bistro', name: 'Bistro', description: 'Red + cream — restaurants', swatch: ['#b91c1c', '#fef3c7'] },
  { id: 'wellness', name: 'Wellness', description: 'Green + white — healthcare', swatch: ['#15803d', '#ffffff'] },
  { id: 'editorial', name: 'Editorial', description: 'Black + white', swatch: ['#0f172a', '#ffffff'] },
  { id: 'modern', name: 'Modern', description: 'Blue + white', swatch: ['#2563eb', '#ffffff'] },
  { id: 'custom', name: 'Custom', description: 'Pick later', swatch: ['#94a3b8', '#f1f5f9'] },
]

const SECTIONS = [
  { id: 1, title: 'About your business' },
  { id: 2, title: 'Tell us your story' },
  { id: 3, title: 'How customers reach you' },
  { id: 4, title: 'What you offer' },
  { id: 5, title: 'A few details about your work' },
  { id: 6, title: 'Style and content' },
] as const

const TOTAL_SECTIONS = SECTIONS.length

const CUISINE_OPTIONS = [
  'Ethiopian',
  'Italian',
  'American',
  'Mexican',
  'Asian Fusion',
  'Mediterranean',
  'Indian',
  'Caribbean',
  'Other',
] as const

const DIETARY_OPTIONS = [
  'Vegan',
  'Vegetarian',
  'Gluten-free',
  'Halal',
  'Kosher',
  'Dairy-free',
  'Nut-free',
] as const

const ATMOSPHERE_OPTIONS = [
  'Casual',
  'Fine-dining',
  'Family-friendly',
  'Romantic',
  'Sports-bar',
  'Cafe',
] as const

const SALON_SERVICE_OPTIONS = [
  'Hair',
  'Nails',
  'Makeup',
  'Lashes',
  'Wellness',
  'Massage',
] as const

const AUTO_SERVICE_OPTIONS = [
  'Oil change',
  'Tires',
  'Brakes',
  'Engine',
  'Body work',
  'Custom',
] as const

const MIN_SERVICES = 4
const MAX_SERVICES = 8

// Map raw layout id from contact-form step to the layout-specific bundle.
type LayoutKind = 'restaurant' | 'salon' | 'auto' | 'general'

function layoutKind(layout: string | null | undefined): LayoutKind {
  const l = (layout || '').toLowerCase()
  if (l === 'restaurant' || l === 'bistro') return 'restaurant'
  if (l === 'salon' || l === 'spa') return 'salon'
  if (l === 'auto' || l === 'mechanic') return 'auto'
  return 'general' // fleet, healthcare, community, home_services, anything else
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
}

// ─── Component ──────────────────────────────────────────

export function IntakeForm({ submission }: { submission: IntakeSubmission }) {
  const layout = layoutKind(submission.selected_layout)

  const [currentSection, setCurrentSection] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [data, setData] = useState<IntakeData>({
    tagline: '',
    business_description: submission.business_description || '',
    business_type: '',
    business_story: '',
    years_in_business: '',
    address: '',
    city: '',
    state: 'MN',
    zip: '',
    hours: DEFAULT_HOURS,
    services: Array.from({ length: MIN_SERVICES }, () => ({
      name: '',
      description: '',
      price: '',
    })),
    restaurant: {
      cuisine_type: '',
      cuisine_type_other: '',
      dietary_options: [],
      reservations: '',
      takeout: '',
      delivery: '',
      seating_capacity: '',
      atmosphere: [],
    },
    salon: {
      salon_services: [],
      booking_required: '',
      staff_count: '',
      products_sold: '',
      specializations: '',
    },
    auto: {
      auto_services: [],
      makes_models: '',
      certifications: '',
      warranty: '',
      loaner_vehicles: '',
    },
    general: {
      service_area_radius: '',
      certifications: '',
    },
    selected_theme: 'warm',
    primary_color: '#facc15',
    logo_url: '',
    photo_urls: [],
    photo_urls_raw: '',
    notes: '',
  })

  const updateField = <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function toggleArrayValue(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
  }

  const validation = useMemo(
    () => validateSection(currentSection, data, layout),
    [currentSection, data, layout]
  )

  const goNext = () => {
    if (!validation.ok) return
    setCurrentSection((s) => Math.min(TOTAL_SECTIONS, s + 1))
  }
  const goBack = () => setCurrentSection((s) => Math.max(1, s - 1))

  const handleSubmit = async () => {
    if (!validation.ok) return
    setSubmitting(true)
    setErrorMessage('')

    const photo_urls = data.photo_urls_raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)

    // Resolve cuisine: free-text wins when "Other" was selected.
    const cuisineFinal =
      data.restaurant.cuisine_type === 'Other'
        ? data.restaurant.cuisine_type_other.trim()
        : data.restaurant.cuisine_type

    // Build the layout-specific payload (only the relevant block + universals)
    const layoutPayload: Record<string, unknown> =
      layout === 'restaurant'
        ? {
            cuisine_type: cuisineFinal || null,
            dietary_options: data.restaurant.dietary_options,
            reservations: data.restaurant.reservations || null,
            takeout: data.restaurant.takeout || null,
            delivery: data.restaurant.delivery || null,
            seating_capacity: parseIntOrNull(data.restaurant.seating_capacity),
            atmosphere: data.restaurant.atmosphere,
          }
        : layout === 'salon'
          ? {
              salon_services: data.salon.salon_services,
              booking_required: data.salon.booking_required || null,
              staff_count: parseIntOrNull(data.salon.staff_count),
              products_sold:
                data.salon.products_sold === 'yes'
                  ? true
                  : data.salon.products_sold === 'no'
                    ? false
                    : null,
              specializations: data.salon.specializations.trim() || null,
            }
          : layout === 'auto'
            ? {
                auto_services: data.auto.auto_services,
                makes_models: data.auto.makes_models.trim() || null,
                certifications: data.auto.certifications.trim() || null,
                warranty: data.auto.warranty || null,
                loaner_vehicles:
                  data.auto.loaner_vehicles === 'yes'
                    ? true
                    : data.auto.loaner_vehicles === 'no'
                      ? false
                      : null,
              }
            : {
                service_area_radius: parseIntOrNull(
                  data.general.service_area_radius
                ),
                certifications: data.general.certifications.trim() || null,
              }

    try {
      const res = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: submission.intake_token,
          intakeData: {
            tagline: data.tagline.trim(),
            business_description: data.business_description.trim(),
            business_type: data.business_type.trim(),
            business_story: data.business_story.trim(),
            years_in_business: parseIntOrNull(data.years_in_business),
            address: data.address.trim(),
            city: data.city.trim(),
            state: data.state,
            zip: data.zip.trim(),
            hours: data.hours,
            services: data.services
              .filter((s) => s.name.trim())
              .map((s) => ({
                name: s.name.trim(),
                description: s.description.trim(),
                price: s.price.trim(),
              })),
            layout_kind: layout,
            ...layoutPayload,
            selected_theme: data.selected_theme,
            primary_color: data.primary_color,
            logo_url: data.logo_url.trim() || null,
            photo_urls,
            notes: data.notes.trim() || null,
          },
        }),
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Could not submit intake')
      }
      setSubmitted(true)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-cimaa-border bg-white p-8 sm:p-10 shadow-sm text-center">
        <span className="h-14 w-14 rounded-full bg-cimaa-yellow text-cimaa-text inline-flex items-center justify-center text-2xl">
          🎉
        </span>
        <h2 className="mt-6 text-2xl sm:text-3xl font-heading font-semibold text-cimaa-text">
          Got it! Last step → secure your spot
        </h2>
        <p className="mt-3 text-cimaa-text-muted leading-relaxed">
          We&apos;re sending your payment link to{' '}
          <strong className="text-cimaa-text">{submission.email}</strong>. Check your
          inbox in the next minute.
        </p>
        <div className="mt-8">
          <Button href="https://mail.google.com" variant="primary" size="lg">
            Open my email
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-cimaa-border bg-white p-7 sm:p-9 shadow-sm">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-cimaa-text-muted">
            Section {currentSection} of {TOTAL_SECTIONS}
          </p>
          <p className="text-xs text-cimaa-text-subtle">
            {SECTIONS[currentSection - 1].title}
          </p>
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${TOTAL_SECTIONS}, minmax(0, 1fr))` }}
        >
          {SECTIONS.map((s) => {
            const done = s.id < currentSection
            const active = s.id === currentSection
            return (
              <div
                key={s.id}
                className={
                  'h-1.5 rounded-full transition-colors ' +
                  (done
                    ? 'bg-cimaa-green'
                    : active
                      ? 'bg-cimaa-yellow'
                      : 'bg-cimaa-border')
                }
              />
            )
          })}
        </div>
      </div>

      {/* Section 1: About */}
      {currentSection === 1 && (
        <motion.div {...fadeUp} className="space-y-6">
          <SectionHeader
            title="About your business"
            subtitle="What we'll use to write your site copy."
          />
          <Field
            label="Tagline"
            required
            helper="Short phrase customers will see at the top of your site."
            error={validation.errors.tagline}
          >
            <input
              value={data.tagline}
              onChange={(e) => updateField('tagline', e.target.value.slice(0, 100))}
              maxLength={100}
              className={inputClass(!!validation.errors.tagline)}
              placeholder="e.g., Authentic Ethiopian cuisine in the heart of Saint Paul"
            />
            <CharCount value={data.tagline} max={100} />
          </Field>
          <Field
            label="Business description"
            required
            helper="What you do, who you serve. One paragraph."
            error={validation.errors.business_description}
          >
            <textarea
              value={data.business_description}
              onChange={(e) =>
                updateField('business_description', e.target.value.slice(0, 500))
              }
              maxLength={500}
              rows={4}
              className={`${inputClass(!!validation.errors.business_description)} resize-none`}
              placeholder="Family-owned restaurant serving traditional Ethiopian and Eritrean dishes."
            />
            <CharCount value={data.business_description} max={500} />
          </Field>
          <Field
            label="Industry / business type"
            required
            helper="e.g., Ethiopian restaurant, hair salon, transportation company"
            error={validation.errors.business_type}
          >
            <input
              value={data.business_type}
              onChange={(e) => updateField('business_type', e.target.value)}
              className={inputClass(!!validation.errors.business_type)}
              placeholder="Ethiopian restaurant"
            />
          </Field>
        </motion.div>
      )}

      {/* Section 2: Story */}
      {currentSection === 2 && (
        <motion.div {...fadeUp} className="space-y-6">
          <SectionHeader
            title="Tell us your story"
            subtitle="The deeper context our AI uses to write copy that sounds like you."
          />
          <Field
            label="What makes your business special?"
            required
            helper="When did you start? Who do you serve? What do customers say about you? This is the most important field for AI-generated copy."
            error={validation.errors.business_story}
          >
            <textarea
              value={data.business_story}
              onChange={(e) =>
                updateField('business_story', e.target.value.slice(0, 500))
              }
              maxLength={500}
              rows={6}
              className={`${inputClass(!!validation.errors.business_story)} resize-none`}
              placeholder="My grandmother taught me to cook injera in our village outside Addis Ababa. We opened the restaurant in 2014 to share that food with our neighbors in Saint Paul..."
            />
            <CharCount value={data.business_story} max={500} />
          </Field>
          <Field
            label="Years in business"
            helper="Optional. Used for trust signals like 'Serving Minnesota since 2014'."
          >
            <input
              type="number"
              min="0"
              max="200"
              value={data.years_in_business}
              onChange={(e) => updateField('years_in_business', e.target.value)}
              className={inputClass(false) + ' max-w-[160px]'}
              placeholder="e.g. 12"
            />
          </Field>
        </motion.div>
      )}

      {/* Section 3: Reach */}
      {currentSection === 3 && (
        <motion.div {...fadeUp} className="space-y-6">
          <SectionHeader
            title="How customers reach you"
            subtitle="Address, phone, and hours go straight onto the contact page."
          />
          <Field label="Address" required error={validation.errors.address}>
            <input
              value={data.address}
              onChange={(e) => updateField('address', e.target.value)}
              className={inputClass(!!validation.errors.address)}
              placeholder="1234 Snelling Ave"
            />
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" required error={validation.errors.city}>
              <input
                value={data.city}
                onChange={(e) => updateField('city', e.target.value)}
                className={inputClass(!!validation.errors.city)}
                placeholder="Saint Paul"
              />
            </Field>
            <Field label="State" required>
              <select
                value={data.state}
                onChange={(e) => updateField('state', e.target.value)}
                className={inputClass(false)}
              >
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Zip" required error={validation.errors.zip}>
              <input
                value={data.zip}
                onChange={(e) =>
                  updateField('zip', e.target.value.replace(/[^0-9]/g, '').slice(0, 5))
                }
                inputMode="numeric"
                className={inputClass(!!validation.errors.zip)}
                placeholder="55104"
              />
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-cimaa-text mb-2">Hours</label>
            <div className="space-y-2">
              {DAYS.map((day) => {
                const h = data.hours[day]
                return (
                  <div
                    key={day}
                    className="grid grid-cols-[100px_1fr_auto_1fr_auto] sm:grid-cols-[120px_1fr_auto_1fr_auto] gap-2 sm:gap-3 items-center"
                  >
                    <span className="text-sm font-medium text-cimaa-text">{day}</span>
                    <input
                      type="time"
                      value={h.openTime}
                      disabled={!h.isOpen}
                      onChange={(e) =>
                        updateField('hours', {
                          ...data.hours,
                          [day]: { ...h, openTime: e.target.value },
                        })
                      }
                      className={inputClass(false) + ' disabled:opacity-50 py-2 text-sm'}
                    />
                    <span className="text-cimaa-text-muted text-xs">to</span>
                    <input
                      type="time"
                      value={h.closeTime}
                      disabled={!h.isOpen}
                      onChange={(e) =>
                        updateField('hours', {
                          ...data.hours,
                          [day]: { ...h, closeTime: e.target.value },
                        })
                      }
                      className={inputClass(false) + ' disabled:opacity-50 py-2 text-sm'}
                    />
                    <label className="flex items-center gap-1.5 text-xs text-cimaa-text-muted cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={!h.isOpen}
                        onChange={(e) =>
                          updateField('hours', {
                            ...data.hours,
                            [day]: { ...h, isOpen: !e.target.checked },
                          })
                        }
                        className="accent-cimaa-green"
                      />
                      Closed
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Section 4: Offerings (≥4 services) */}
      {currentSection === 4 && (
        <motion.div {...fadeUp} className="space-y-6">
          <SectionHeader
            title="What you offer"
            subtitle={`At least ${MIN_SERVICES} services. These show on your services page and feed AI menu generation.`}
          />
          <ServiceCounter
            count={data.services.filter((s) => s.name.trim().length > 0).length}
            min={MIN_SERVICES}
          />
          {validation.errors.services && (
            <p className="text-sm text-red-600">{validation.errors.services}</p>
          )}
          <div className="space-y-3">
            {data.services.map((service, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-cimaa-border bg-cimaa-bg-surface p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cimaa-text-muted">
                    Service {idx + 1}
                  </p>
                  {data.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          'services',
                          data.services.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-cimaa-text-muted hover:text-red-600 transition-colors"
                      aria-label={`Remove service ${idx + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    value={service.name}
                    onChange={(e) =>
                      updateField(
                        'services',
                        data.services.map((s, i) =>
                          i === idx ? { ...s, name: e.target.value } : s
                        )
                      )
                    }
                    className={inputClass(false)}
                    placeholder="Service name (e.g., Doro Wat)"
                  />
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      updateField(
                        'services',
                        data.services.map((s, i) =>
                          i === idx ? { ...s, description: e.target.value } : s
                        )
                      )
                    }
                    rows={2}
                    className={inputClass(false) + ' resize-none'}
                    placeholder="Short description — 1 to 2 sentences"
                  />
                  <input
                    value={service.price}
                    onChange={(e) =>
                      updateField(
                        'services',
                        data.services.map((s, i) =>
                          i === idx ? { ...s, price: e.target.value } : s
                        )
                      )
                    }
                    className={inputClass(false)}
                    placeholder="Price (e.g., $18, $15-25, $50/hr, Custom)"
                  />
                </div>
              </div>
            ))}
          </div>
          {data.services.length < MAX_SERVICES && (
            <button
              type="button"
              onClick={() =>
                updateField('services', [
                  ...data.services,
                  { name: '', description: '', price: '' },
                ])
              }
              className="inline-flex items-center gap-2 text-sm font-medium text-cimaa-green hover:text-cimaa-text transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add another service ({data.services.length}/{MAX_SERVICES})
            </button>
          )}
        </motion.div>
      )}

      {/* Section 5: Layout-specific */}
      {currentSection === 5 && (
        <motion.div {...fadeUp} className="space-y-6">
          {layout === 'restaurant' && (
            <RestaurantSection
              data={data.restaurant}
              errors={validation.errors}
              onChange={(next) => updateField('restaurant', next)}
              toggleArrayValue={toggleArrayValue}
            />
          )}
          {layout === 'salon' && (
            <SalonSection
              data={data.salon}
              errors={validation.errors}
              onChange={(next) => updateField('salon', next)}
              toggleArrayValue={toggleArrayValue}
            />
          )}
          {layout === 'auto' && (
            <AutoSection
              data={data.auto}
              errors={validation.errors}
              onChange={(next) => updateField('auto', next)}
              toggleArrayValue={toggleArrayValue}
            />
          )}
          {layout === 'general' && (
            <GeneralSection
              data={data.general}
              onChange={(next) => updateField('general', next)}
            />
          )}
        </motion.div>
      )}

      {/* Section 6: Style */}
      {currentSection === 6 && (
        <motion.div {...fadeUp} className="space-y-6">
          <SectionHeader
            title="Style and content"
            subtitle="Pick a starting theme. We'll fine-tune everything during build."
          />

          <Field label="Theme" required>
            <div className="grid sm:grid-cols-2 gap-3">
              {THEME_OPTIONS.map((opt) => {
                const active = data.selected_theme === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('selected_theme', opt.id)}
                    className={
                      'flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ' +
                      (active
                        ? 'border-cimaa-yellow bg-cimaa-bg-tan ring-2 ring-cimaa-yellow/40'
                        : 'border-cimaa-border bg-white hover:border-cimaa-text')
                    }
                  >
                    <div className="flex-shrink-0 flex">
                      <span
                        className="h-8 w-8 rounded-l-lg border border-cimaa-border"
                        style={{ backgroundColor: opt.swatch[0] }}
                      />
                      <span
                        className="h-8 w-8 rounded-r-lg border border-l-0 border-cimaa-border"
                        style={{ backgroundColor: opt.swatch[1] }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cimaa-text">{opt.name}</p>
                      <p className="text-xs text-cimaa-text-muted">{opt.description}</p>
                    </div>
                    {active && (
                      <CheckCircle2 size={18} className="ml-auto text-cimaa-green" />
                    )}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field
            label="Primary brand color"
            helper="Optional. Defaults match your selected theme."
          >
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.primary_color}
                onChange={(e) => updateField('primary_color', e.target.value)}
                className="h-10 w-16 rounded-lg border border-cimaa-border cursor-pointer"
              />
              <input
                type="text"
                value={data.primary_color}
                onChange={(e) => updateField('primary_color', e.target.value)}
                className={inputClass(false) + ' max-w-[160px] font-mono text-sm'}
              />
            </div>
          </Field>

          <Field label="Logo URL" helper="Paste a URL or leave blank — we'll add later.">
            <input
              value={data.logo_url}
              onChange={(e) => updateField('logo_url', e.target.value)}
              type="url"
              className={inputClass(false)}
              placeholder="https://..."
            />
          </Field>

          <Field
            label="Photo URLs"
            helper="3–5 photos for your site. One URL per line. Leave blank if none."
          >
            <textarea
              value={data.photo_urls_raw}
              onChange={(e) => updateField('photo_urls_raw', e.target.value)}
              rows={4}
              className={inputClass(false) + ' resize-none font-mono text-xs'}
              placeholder={'https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg'}
            />
          </Field>

          <Field label="Anything else?" helper="Special requests, must-haves, or hard-no's.">
            <textarea
              value={data.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className={inputClass(false) + ' resize-none'}
              placeholder="e.g., must include a reservation widget, no menu prices visible to guests"
            />
          </Field>
        </motion.div>
      )}

      {/* Errors */}
      {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-cimaa-border pt-6">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={goBack}
          disabled={currentSection === 1 || submitting}
        >
          <ChevronLeft size={16} />
          Back
        </Button>

        {currentSection < TOTAL_SECTIONS ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={goNext}
            disabled={!validation.ok}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!validation.ok || submitting}
            loading={submitting}
          >
            Submit and continue to payment
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Layout-specific section components ─────────────────

function RestaurantSection({
  data,
  errors,
  onChange,
  toggleArrayValue,
}: {
  data: RestaurantData
  errors: Record<string, string>
  onChange: (next: RestaurantData) => void
  toggleArrayValue: (arr: string[], v: string) => string[]
}) {
  return (
    <>
      <SectionHeader
        title="A few details about your restaurant"
        subtitle="Helps us generate accurate menu items, dietary tags, and the right look."
      />
      <Field label="Cuisine type" required error={errors.cuisine_type}>
        <select
          value={data.cuisine_type}
          onChange={(e) => onChange({ ...data, cuisine_type: e.target.value })}
          className={inputClass(!!errors.cuisine_type)}
        >
          <option value="">Select cuisine…</option>
          {CUISINE_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      {data.cuisine_type === 'Other' && (
        <Field label="Tell us your cuisine" required error={errors.cuisine_type_other}>
          <input
            value={data.cuisine_type_other}
            onChange={(e) => onChange({ ...data, cuisine_type_other: e.target.value })}
            className={inputClass(!!errors.cuisine_type_other)}
            placeholder="e.g., Eritrean, West African, Filipino"
          />
        </Field>
      )}
      <Field label="Dietary options" helper="Multi-select — tag any that apply.">
        <CheckboxGrid
          options={DIETARY_OPTIONS}
          values={data.dietary_options}
          onToggle={(v) =>
            onChange({ ...data, dietary_options: toggleArrayValue(data.dietary_options, v) })
          }
        />
      </Field>
      <Field label="Reservations">
        <RadioRow
          name="reservations"
          value={data.reservations}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'not_yet', label: 'Not yet' },
          ]}
          onChange={(v) => onChange({ ...data, reservations: v as RestaurantData['reservations'] })}
        />
      </Field>
      <Field label="Takeout">
        <RadioRow
          name="takeout"
          value={data.takeout}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          onChange={(v) => onChange({ ...data, takeout: v as RestaurantData['takeout'] })}
        />
      </Field>
      <Field label="Delivery">
        <RadioRow
          name="delivery"
          value={data.delivery}
          options={[
            { value: 'yes', label: 'Yes — our service' },
            { value: 'third_party', label: 'Third-party only (DoorDash etc)' },
            { value: 'no', label: 'No' },
          ]}
          onChange={(v) => onChange({ ...data, delivery: v as RestaurantData['delivery'] })}
        />
      </Field>
      <Field label="Seating capacity">
        <input
          type="number"
          min="0"
          value={data.seating_capacity}
          onChange={(e) => onChange({ ...data, seating_capacity: e.target.value })}
          className={inputClass(false) + ' max-w-[160px]'}
          placeholder="e.g. 48"
        />
      </Field>
      <Field label="Atmosphere" helper="Multi-select — pick all that fit.">
        <CheckboxGrid
          options={ATMOSPHERE_OPTIONS}
          values={data.atmosphere}
          onToggle={(v) =>
            onChange({ ...data, atmosphere: toggleArrayValue(data.atmosphere, v) })
          }
        />
      </Field>
    </>
  )
}

function SalonSection({
  data,
  errors,
  onChange,
  toggleArrayValue,
}: {
  data: SalonData
  errors: Record<string, string>
  onChange: (next: SalonData) => void
  toggleArrayValue: (arr: string[], v: string) => string[]
}) {
  return (
    <>
      <SectionHeader
        title="A few details about your salon"
        subtitle="Helps us tag services, booking flow, and overall feel."
      />
      <Field label="Services offered" required error={errors.salon_services}>
        <CheckboxGrid
          options={SALON_SERVICE_OPTIONS}
          values={data.salon_services}
          onToggle={(v) =>
            onChange({ ...data, salon_services: toggleArrayValue(data.salon_services, v) })
          }
        />
      </Field>
      <Field label="Booking required">
        <RadioRow
          name="booking_required"
          value={data.booking_required}
          options={[
            { value: 'yes', label: 'Yes — appointment only' },
            { value: 'walk_ins', label: 'Walk-ins welcome' },
            { value: 'both', label: 'Both' },
          ]}
          onChange={(v) =>
            onChange({ ...data, booking_required: v as SalonData['booking_required'] })
          }
        />
      </Field>
      <Field label="Staff count">
        <input
          type="number"
          min="0"
          value={data.staff_count}
          onChange={(e) => onChange({ ...data, staff_count: e.target.value })}
          className={inputClass(false) + ' max-w-[160px]'}
          placeholder="e.g. 4"
        />
      </Field>
      <Field label="Do you sell products?">
        <RadioRow
          name="products_sold"
          value={data.products_sold}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          onChange={(v) =>
            onChange({ ...data, products_sold: v as SalonData['products_sold'] })
          }
        />
      </Field>
      <Field label="Specializations" helper="Optional — e.g. curly hair, bridal, balayage.">
        <input
          value={data.specializations}
          onChange={(e) => onChange({ ...data, specializations: e.target.value })}
          className={inputClass(false)}
          placeholder="e.g., Curly hair, balayage, bridal"
        />
      </Field>
    </>
  )
}

function AutoSection({
  data,
  errors,
  onChange,
  toggleArrayValue,
}: {
  data: AutoData
  errors: Record<string, string>
  onChange: (next: AutoData) => void
  toggleArrayValue: (arr: string[], v: string) => string[]
}) {
  return (
    <>
      <SectionHeader
        title="A few details about your shop"
        subtitle="Helps customers know if you can service their vehicle."
      />
      <Field label="Services offered" required error={errors.auto_services}>
        <CheckboxGrid
          options={AUTO_SERVICE_OPTIONS}
          values={data.auto_services}
          onToggle={(v) =>
            onChange({ ...data, auto_services: toggleArrayValue(data.auto_services, v) })
          }
        />
      </Field>
      <Field label="Makes / models you service">
        <input
          value={data.makes_models}
          onChange={(e) => onChange({ ...data, makes_models: e.target.value })}
          className={inputClass(false)}
          placeholder="e.g., Toyota, Honda, Ford, BMW"
        />
      </Field>
      <Field label="Certifications">
        <input
          value={data.certifications}
          onChange={(e) => onChange({ ...data, certifications: e.target.value })}
          className={inputClass(false)}
          placeholder="e.g., ASE Certified, NAPA AutoCare"
        />
      </Field>
      <Field label="Warranty offered">
        <RadioRow
          name="warranty"
          value={data.warranty}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'details_below', label: 'Details below' },
          ]}
          onChange={(v) => onChange({ ...data, warranty: v as AutoData['warranty'] })}
        />
      </Field>
      <Field label="Loaner vehicles available?">
        <RadioRow
          name="loaner_vehicles"
          value={data.loaner_vehicles}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          onChange={(v) =>
            onChange({ ...data, loaner_vehicles: v as AutoData['loaner_vehicles'] })
          }
        />
      </Field>
    </>
  )
}

function GeneralSection({
  data,
  onChange,
}: {
  data: GeneralData
  onChange: (next: GeneralData) => void
}) {
  return (
    <>
      <SectionHeader
        title="A few details about your work"
        subtitle="Helps with location signals and trust copy."
      />
      <Field
        label="Service area radius (miles)"
        helper="How far do you travel from your address?"
      >
        <input
          type="number"
          min="0"
          value={data.service_area_radius}
          onChange={(e) => onChange({ ...data, service_area_radius: e.target.value })}
          className={inputClass(false) + ' max-w-[160px]'}
          placeholder="e.g. 25"
        />
      </Field>
      <Field label="Certifications / licenses" helper="Optional. Used for trust badges.">
        <input
          value={data.certifications}
          onChange={(e) => onChange({ ...data, certifications: e.target.value })}
          className={inputClass(false)}
          placeholder="e.g., Licensed MN contractor #BC012345"
        />
      </Field>
    </>
  )
}

// ─── Helpers ────────────────────────────────────────────

function ServiceCounter({ count, min }: { count: number; min: number }) {
  const ok = count >= min
  return (
    <div
      className={
        'rounded-lg px-3 py-2 text-sm font-medium ' +
        (ok ? 'bg-cimaa-green-light text-cimaa-green' : 'bg-cimaa-bg-amber text-cimaa-text')
      }
    >
      Services: {count} of {min} minimum {ok && '✓'}
    </div>
  )
}

function CheckboxGrid({
  options,
  values,
  onToggle,
}: {
  options: readonly string[]
  values: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const active = values.includes(opt)
        return (
          <label
            key={opt}
            className={
              'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ' +
              (active
                ? 'border-cimaa-yellow bg-cimaa-bg-tan'
                : 'border-cimaa-border bg-white hover:border-cimaa-text')
            }
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(opt)}
              className="accent-cimaa-green"
            />
            <span className="text-sm text-cimaa-text">{opt}</span>
          </label>
        )
      })}
    </div>
  )
}

function RadioRow({
  name,
  value,
  options,
  onChange,
}: {
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <label
            key={opt.value}
            className={
              'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ' +
              (active
                ? 'border-cimaa-yellow bg-cimaa-bg-tan'
                : 'border-cimaa-border bg-white hover:border-cimaa-text')
            }
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="accent-cimaa-green"
            />
            <span className="text-sm text-cimaa-text">{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-cimaa-border pb-4">
      <h2 className="text-xl sm:text-2xl font-heading font-semibold text-cimaa-text">
        {title}
      </h2>
      <p className="mt-1 text-sm text-cimaa-text-muted">{subtitle}</p>
    </div>
  )
}

function Field({
  label,
  required,
  helper,
  error,
  children,
}: {
  label: string
  required?: boolean
  helper?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-cimaa-text mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helper && !error && (
        <p className="mt-1.5 text-xs text-cimaa-text-subtle">{helper}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <p className="mt-1 text-right text-[11px] text-cimaa-text-subtle">
      {value.length}/{max}
    </p>
  )
}

function inputClass(invalid: boolean) {
  return (
    'w-full rounded-xl bg-white border text-cimaa-text placeholder-cimaa-text-subtle px-4 py-3 text-sm outline-none transition-all ' +
    (invalid
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-cimaa-border focus:border-cimaa-green focus:ring-2 focus:ring-cimaa-green/20')
  )
}

function parseIntOrNull(v: string): number | null {
  const n = parseInt(v, 10)
  return Number.isFinite(n) && n >= 0 ? n : null
}

// ─── Validation ─────────────────────────────────────────

interface ValidationResult {
  ok: boolean
  errors: Record<string, string>
}

function validateSection(
  section: number,
  d: IntakeData,
  layout: LayoutKind
): ValidationResult {
  const errors: Record<string, string> = {}

  if (section === 1) {
    if (d.tagline.trim().length < 5) errors.tagline = 'Add a tagline (5+ chars)'
    if (d.business_description.trim().length < 20)
      errors.business_description =
        'Tell us a bit more (20+ chars) so we can write your copy'
    if (d.business_type.trim().length < 2)
      errors.business_type = 'What type of business is this?'
  }

  if (section === 2) {
    const story = d.business_story.trim()
    if (story.length < 50)
      errors.business_story = `Tell us a bit more (${story.length}/50 chars min) — this is what AI uses to write authentic copy`
  }

  if (section === 3) {
    if (d.address.trim().length < 5) errors.address = 'Address is required'
    if (d.city.trim().length < 2) errors.city = 'City is required'
    if (d.zip.length !== 5) errors.zip = '5-digit zip required'
  }

  if (section === 4) {
    const filled = d.services.filter((s) => s.name.trim().length > 0)
    if (filled.length < MIN_SERVICES)
      errors.services = `Add at least ${MIN_SERVICES} services (you have ${filled.length})`
  }

  if (section === 5) {
    if (layout === 'restaurant') {
      if (!d.restaurant.cuisine_type)
        errors.cuisine_type = 'Pick a cuisine type'
      if (
        d.restaurant.cuisine_type === 'Other' &&
        d.restaurant.cuisine_type_other.trim().length < 2
      )
        errors.cuisine_type_other = 'Tell us your cuisine'
    }
    if (layout === 'salon') {
      if (d.salon.salon_services.length < 1)
        errors.salon_services = 'Pick at least one service category'
    }
    if (layout === 'auto') {
      if (d.auto.auto_services.length < 1)
        errors.auto_services = 'Pick at least one service type'
    }
    // general layout has no required fields
  }

  // Section 6 has no required fields beyond the theme (which has a default).
  return { ok: Object.keys(errors).length === 0, errors }
}
