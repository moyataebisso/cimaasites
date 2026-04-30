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

export interface IntakeData {
  // Section 1
  tagline: string
  business_description: string
  business_type: string
  // Section 2
  address: string
  city: string
  state: string
  zip: string
  hours: Record<string, DayHours>
  // Section 3
  services: ServiceItem[]
  // Section 4
  selected_theme: string
  primary_color: string
  logo_url: string
  photo_urls: string[] // parsed from textarea on submit
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
  { id: 2, title: 'How customers reach you' },
  { id: 3, title: 'What you offer' },
  { id: 4, title: 'Style and content' },
] as const

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
}

// ─── Component ──────────────────────────────────────────

export function IntakeForm({ submission }: { submission: IntakeSubmission }) {
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3 | 4>(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [data, setData] = useState<IntakeData>({
    tagline: '',
    business_description: submission.business_description || '',
    business_type: '',
    address: '',
    city: '',
    state: 'MN',
    zip: '',
    hours: DEFAULT_HOURS,
    services: [
      { name: '', description: '', price: '' },
      { name: '', description: '', price: '' },
      { name: '', description: '', price: '' },
    ],
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

  const validation = useMemo(() => validateSection(currentSection, data), [currentSection, data])

  const goNext = () => {
    if (!validation.ok) return
    setCurrentSection((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s))
  }
  const goBack = () =>
    setCurrentSection((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))

  const handleSubmit = async () => {
    if (!validation.ok) return
    setSubmitting(true)
    setErrorMessage('')

    const photo_urls = data.photo_urls_raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)

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
            Section {currentSection} of 4
          </p>
          <p className="text-xs text-cimaa-text-subtle">
            {SECTIONS[currentSection - 1].title}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
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

      {/* Sections */}
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
            helper="What you do, who you serve. Used to write your site copy."
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
              placeholder="Family-owned restaurant serving traditional Ethiopian and Eritrean dishes. We've been a Saint Paul staple for 12 years."
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

      {currentSection === 2 && (
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
                onChange={(e) => updateField('zip', e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                inputMode="numeric"
                className={inputClass(!!validation.errors.zip)}
                placeholder="55104"
              />
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-cimaa-text mb-2">
              Hours
            </label>
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

      {currentSection === 3 && (
        <motion.div {...fadeUp} className="space-y-6">
          <SectionHeader
            title="What you offer"
            subtitle="These show on your services page. You can edit anytime later."
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
                  <input
                    value={service.description}
                    onChange={(e) =>
                      updateField(
                        'services',
                        data.services.map((s, i) =>
                          i === idx ? { ...s, description: e.target.value } : s
                        )
                      )
                    }
                    className={inputClass(false)}
                    placeholder="Short description"
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
                    placeholder="Price (e.g., $18 or 'starts at $50')"
                  />
                </div>
              </div>
            ))}
          </div>
          {data.services.length < 10 && (
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
              Add another service
            </button>
          )}
        </motion.div>
      )}

      {currentSection === 4 && (
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
                      <p className="text-sm font-semibold text-cimaa-text">
                        {opt.name}
                      </p>
                      <p className="text-xs text-cimaa-text-muted">
                        {opt.description}
                      </p>
                    </div>
                    {active && (
                      <CheckCircle2
                        size={18}
                        className="ml-auto text-cimaa-green"
                      />
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

          <Field
            label="Logo URL"
            helper="Paste a URL or leave blank — we'll add later."
          >
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
              placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg&#10;https://example.com/photo3.jpg"
            />
          </Field>

          <Field
            label="Anything else?"
            helper="Special requests, must-haves, or hard-no's."
          >
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
      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

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

        {currentSection < 4 ? (
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

// ─── Helpers ────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
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

// ─── Validation ─────────────────────────────────────────

interface ValidationResult {
  ok: boolean
  errors: Record<string, string>
}

function validateSection(section: number, d: IntakeData): ValidationResult {
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
    if (d.address.trim().length < 5) errors.address = 'Address is required'
    if (d.city.trim().length < 2) errors.city = 'City is required'
    if (d.zip.length !== 5) errors.zip = '5-digit zip required'
  }
  if (section === 3) {
    const filled = d.services.filter((s) => s.name.trim().length > 0)
    if (filled.length < 1)
      errors.services = 'Add at least one service before continuing'
  }
  // Section 4 has no required fields beyond the theme (which has a default).
  return { ok: Object.keys(errors).length === 0, errors }
}
