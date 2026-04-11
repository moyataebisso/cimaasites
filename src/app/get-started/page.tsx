'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Upload, Plus, X } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useOnboardingForm, type OnboardingFormData } from '@/hooks/useOnboardingForm'
import { cn } from '@/lib/utils'

const TOTAL_STEPS = 8
const stepLabels = [
  'Plan',
  'Business',
  'Contact',
  'Hours',
  'Services',
  'Photos',
  'Style',
  'Review',
]

const businessTypes = [
  'Hair Salon',
  'Restaurant',
  'Healthcare/Clinic',
  'Church/Nonprofit',
  'Transportation',
  'Retail Store',
  'Fitness/Gym',
  'Legal Services',
  'Real Estate',
  'Beauty/Spa',
  'Auto Services',
  'Cleaning Services',
  'Childcare',
  'Other',
]

const timeOptions = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6
  const min = i % 2 === 0 ? '00' : '30'
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  const ampm = hour >= 12 ? 'PM' : 'AM'
  return {
    value: `${String(hour).padStart(2, '0')}:${min}`,
    label: `${h}:${min} ${ampm}`,
  }
})

const durationOptions = [
  '15min',
  '30min',
  '45min',
  '1hr',
  '1.5hr',
  '2hr',
  'varies',
]

const themes = [
  { id: 'warm', name: 'Warm', group: 'light', colors: ['#F59E0B', '#EF4444', '#FFF7ED', '#1C1917'] },
  { id: 'ocean', name: 'Ocean', group: 'light', colors: ['#0EA5E9', '#06B6D4', '#F0F9FF', '#0C4A6E'] },
  { id: 'forest', name: 'Forest', group: 'light', colors: ['#22C55E', '#16A34A', '#F0FDF4', '#14532D'] },
  { id: 'lavender', name: 'Lavender', group: 'light', colors: ['#A78BFA', '#7C3AED', '#FAF5FF', '#3B0764'] },
  { id: 'rose', name: 'Rose', group: 'light', colors: ['#FB7185', '#E11D48', '#FFF1F2', '#881337'] },
  { id: 'sand', name: 'Sand', group: 'light', colors: ['#D4A373', '#A3785E', '#FEFCE8', '#451A03'] },
  { id: 'sky', name: 'Sky', group: 'light', colors: ['#38BDF8', '#0284C7', '#F0F9FF', '#075985'] },
  { id: 'mint', name: 'Mint', group: 'light', colors: ['#34D399', '#059669', '#ECFDF5', '#064E3B'] },
  { id: 'peach', name: 'Peach', group: 'light', colors: ['#FB923C', '#EA580C', '#FFF7ED', '#7C2D12'] },
  { id: 'steel', name: 'Steel', group: 'light', colors: ['#64748B', '#475569', '#F8FAFC', '#0F172A'] },
  { id: 'coral', name: 'Coral', group: 'light', colors: ['#F97316', '#DC2626', '#FFF5F5', '#7F1D1D'] },
  { id: 'sage', name: 'Sage', group: 'light', colors: ['#84CC16', '#65A30D', '#F7FEE7', '#365314'] },
  { id: 'midnight', name: 'Midnight', group: 'dark', colors: ['#3B82F6', '#1E40AF', '#0F172A', '#E2E8F0'] },
  { id: 'charcoal', name: 'Charcoal', group: 'dark', colors: ['#A78BFA', '#6D28D9', '#1E1B2E', '#E2E8F0'] },
  { id: 'noir', name: 'Noir', group: 'dark', colors: ['#F59E0B', '#D97706', '#0A0A0A', '#FAFAFA'] },
  { id: 'slate', name: 'Slate Dark', group: 'dark', colors: ['#22D3EE', '#0891B2', '#0F172A', '#F1F5F9'] },
  { id: 'sunset', name: 'Sunset', group: 'colorful', colors: ['#F97316', '#EC4899', '#FEF3C7', '#1E1B2E'] },
  { id: 'aurora', name: 'Aurora', group: 'colorful', colors: ['#06B6D4', '#8B5CF6', '#F0FDFA', '#1E1B2E'] },
  { id: 'candy', name: 'Candy', group: 'colorful', colors: ['#EC4899', '#F43F5E', '#FFF1F2', '#4A044E'] },
  { id: 'electric', name: 'Electric', group: 'colorful', colors: ['#3B82F6', '#10B981', '#EFF6FF', '#0F172A'] },
]

const fontOptions = [
  'Playfair Display',
  'Inter',
  'Outfit',
  'DM Sans',
  'Merriweather',
  'Raleway',
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, i) => {
          const step = i + 1
          const done = currentStep > step
          const active = currentStep === step
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  done
                    ? 'bg-green-500 text-white'
                    : active
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                )}
              >
                {done ? <Check size={14} /> : step}
              </div>
              <span
                className={cn(
                  'text-[10px] mt-1 hidden sm:block',
                  active ? 'text-blue-600 font-semibold' : 'text-slate-400'
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ─── Step Components ────────────────────────────────────

function StepPlan({
  formData,
  updateField,
  nextStep,
}: {
  formData: OnboardingFormData
  updateField: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void
  nextStep: () => void
}) {
  const selectPlan = (plan: OnboardingFormData['plan']) => {
    updateField('plan', plan)
    setTimeout(nextStep, 300)
  }

  const plans = [
    {
      id: 'basic' as const,
      name: 'Basic',
      price: '$599',
      period: ' setup',
      badge: 'Most Popular',
      features: [
        'Professional website (5 pages)',
        'Contact form + lead capture',
        'Admin dashboard',
        '20+ themes',
        '24/7 monitoring',
        'Direct support',
        'SSL + custom domain',
      ],
      style: 'border-blue-200',
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: '$599',
      period: ' setup',
      badge: 'Best Value',
      featured: true,
      features: [
        'Everything in Basic, plus:',
        'Appointment booking',
        'Online store',
        'Blog + content management',
        'Email marketing',
        'Customer reviews',
        'Events + tickets',
        'Photo gallery',
      ],
      style: 'bg-gradient-to-br from-blue-600 to-violet-600 border-transparent text-white',
    },
    {
      id: 'developer' as const,
      name: 'Developer',
      price: '$49.99',
      period: ' one-time',
      badge: 'For Developers',
      features: [
        'Full source code',
        'Your own Supabase + Vercel',
        'No monthly fees',
        '1hr setup call',
      ],
      style: 'bg-slate-900 border-transparent text-white',
    },
  ]

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Choose your plan</h2>
      <p className="text-slate-500 mb-8">You can upgrade anytime</p>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const selected = formData.plan === plan.id
          const isLight = !plan.featured && plan.id !== 'developer'
          return (
            <button
              key={plan.id}
              onClick={() => selectPlan(plan.id)}
              className={cn(
                'relative rounded-2xl border p-6 text-left transition-all cursor-pointer',
                plan.style,
                selected && 'ring-2 ring-blue-500 ring-offset-2',
                plan.featured && 'md:-mt-2 md:py-8'
              )}
            >
              <Badge
                variant={plan.featured ? 'violet' : plan.id === 'developer' ? 'gold' : 'blue'}
                className={cn(
                  plan.featured && 'bg-white/20 text-white border-white/30',
                  plan.id === 'developer' && 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                )}
              >
                {plan.badge}
              </Badge>
              <h3 className={cn('text-lg font-bold mt-3', isLight ? 'text-slate-900' : 'text-white')}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={cn('text-3xl font-bold', isLight ? 'text-slate-900' : 'text-white')}>
                  {plan.price}
                </span>
                <span className={cn('text-sm', isLight ? 'text-slate-500' : 'text-white/70')}>
                  {plan.period}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      size={14}
                      className={cn('mt-0.5 flex-shrink-0', isLight ? 'text-blue-600' : 'text-white/80')}
                    />
                    <span className={cn('text-sm', isLight ? 'text-slate-600' : 'text-white/90')}>{f}</span>
                  </li>
                ))}
              </ul>
              {selected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepBusiness({
  formData,
  updateField,
}: {
  formData: OnboardingFormData
  updateField: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void
}) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Tell us about your business</h2>
      <p className="text-slate-500 mb-8">This helps us build the perfect site for you</p>
      <div className="space-y-5 max-w-xl">
        <Field label="Business Name *">
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            className={inputClass}
            placeholder="Your business name"
          />
        </Field>
        <Field label="Business Type *">
          <select
            value={formData.businessType}
            onChange={(e) => updateField('businessType', e.target.value)}
            className={inputClass}
          >
            <option value="">Select type...</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Tagline (optional)">
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => updateField('tagline', e.target.value)}
            className={inputClass}
            placeholder="e.g. The best haircuts in town"
          />
        </Field>
        <Field label="Business Description *">
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className={cn(inputClass, 'resize-none')}
            rows={3}
            placeholder="Tell us what makes your business special (2-3 sentences)"
          />
        </Field>
        <Field label="Year Established (optional)">
          <input
            type="number"
            value={formData.yearEstablished || ''}
            onChange={(e) =>
              updateField('yearEstablished', e.target.value ? parseInt(e.target.value) : undefined)
            }
            className={inputClass}
            placeholder="e.g. 2015"
          />
        </Field>
      </div>
    </div>
  )
}

function StepContact({
  formData,
  updateField,
}: {
  formData: OnboardingFormData
  updateField: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void
}) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        How can customers reach you?
      </h2>
      <p className="text-slate-500 mb-8">We&apos;ll display this on your site</p>
      <div className="space-y-5 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email Address *">
            <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="you@email.com" />
          </Field>
          <Field label="Phone Number *">
            <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="(612) 555-0123" />
          </Field>
        </div>
        <Field label="Business Address">
          <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className={inputClass} placeholder="123 Main St" />
        </Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="City">
            <input type="text" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} />
          </Field>
          <Field label="State">
            <input type="text" value={formData.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass} />
          </Field>
          <Field label="ZIP Code">
            <input type="text" value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Google Maps Link (optional)">
          <input type="url" value={formData.googleMapsUrl || ''} onChange={(e) => updateField('googleMapsUrl', e.target.value)} className={inputClass} placeholder="Paste your Google Maps business link" />
        </Field>
        <Field label="Service Area">
          <div className="grid grid-cols-2 gap-2">
            {(['local', 'regional', 'national', 'online'] as const).map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => updateField('serviceArea', area)}
                className={cn(
                  'px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  formData.serviceArea === area
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                )}
              >
                {area.charAt(0).toUpperCase() + area.slice(1)}
              </button>
            ))}
          </div>
        </Field>
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-4">Social Media (optional)</p>
          <div className="space-y-3">
            <input type="url" value={formData.facebook || ''} onChange={(e) => updateField('facebook', e.target.value)} className={inputClass} placeholder="Facebook URL" />
            <input type="text" value={formData.instagram || ''} onChange={(e) => updateField('instagram', e.target.value)} className={inputClass} placeholder="Instagram @handle" />
            <input type="text" value={formData.tiktok || ''} onChange={(e) => updateField('tiktok', e.target.value)} className={inputClass} placeholder="TikTok @handle" />
            <input type="text" value={formData.whatsapp || ''} onChange={(e) => updateField('whatsapp', e.target.value)} className={inputClass} placeholder="WhatsApp number" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StepHours({
  formData,
  updateField,
}: {
  formData: OnboardingFormData
  updateField: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void
}) {
  const updateDay = (day: string, field: string, value: string | boolean) => {
    updateField('hours', {
      ...formData.hours,
      [day]: { ...formData.hours[day], [field]: value },
    })
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">When are you open?</h2>
      <p className="text-slate-500 mb-8">Set your regular business hours</p>
      <div className="max-w-xl space-y-3">
        {days.map((day) => (
          <div key={day} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateDay(day, 'isOpen', !formData.hours[day]?.isOpen)}
              className={cn(
                'w-12 h-6 rounded-full transition-colors flex-shrink-0 relative',
                formData.hours[day]?.isOpen ? 'bg-blue-600' : 'bg-slate-300'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all',
                  formData.hours[day]?.isOpen ? 'left-[26px]' : 'left-0.5'
                )}
              />
            </button>
            <span className="w-24 text-sm font-medium text-slate-700">{day}</span>
            {formData.hours[day]?.isOpen ? (
              <div className="flex items-center gap-2">
                <select
                  value={formData.hours[day]?.openTime || '09:00'}
                  onChange={(e) => updateDay(day, 'openTime', e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                >
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <span className="text-slate-400 text-sm">to</span>
                <select
                  value={formData.hours[day]?.closeTime || '18:00'}
                  onChange={(e) => updateDay(day, 'closeTime', e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                >
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-slate-400">Closed</span>
            )}
          </div>
        ))}
        <div className="pt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={formData.is24Hours}
              onChange={(e) => updateField('is24Hours', e.target.checked)}
              className="rounded border-slate-300"
            />
            We are open 24/7
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={formData.hoursVary}
              onChange={(e) => updateField('hoursVary', e.target.checked)}
              className="rounded border-slate-300"
            />
            Hours vary — I&apos;ll update this later
          </label>
        </div>
      </div>
    </div>
  )
}

function StepServices({
  formData,
  updateField,
}: {
  formData: OnboardingFormData
  updateField: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void
}) {
  const updateService = (index: number, field: string, value: string | boolean) => {
    const updated = [...formData.services]
    updated[index] = { ...updated[index], [field]: value }
    updateField('services', updated)
  }
  const addService = () => {
    if (formData.services.length < 8) {
      updateField('services', [...formData.services, { name: '', description: '', price: '', duration: '' }])
    }
  }
  const removeService = (index: number) => {
    updateField('services', formData.services.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">What services do you offer?</h2>
      <p className="text-slate-500 mb-8">Add up to 8 services</p>
      <div className="max-w-xl space-y-4">
        {formData.services.map((service, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3 relative">
            {formData.services.length > 1 && (
              <button
                type="button"
                onClick={() => removeService(i)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
            <input
              type="text"
              value={service.name}
              onChange={(e) => updateService(i, 'name', e.target.value)}
              className={inputClass}
              placeholder="Service name *"
            />
            <input
              type="text"
              value={service.description || ''}
              onChange={(e) => updateService(i, 'description', e.target.value)}
              className={inputClass}
              placeholder="Short description (optional)"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={service.price || ''}
                onChange={(e) => updateService(i, 'price', e.target.value)}
                className={inputClass}
                placeholder="Price e.g. $50"
              />
              <select
                value={service.duration || ''}
                onChange={(e) => updateService(i, 'duration', e.target.value)}
                className={inputClass}
              >
                <option value="">Duration</option>
                {durationOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            {formData.plan === 'pro' && (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={service.bookingEnabled || false}
                  onChange={(e) => updateService(i, 'bookingEnabled', e.target.checked)}
                  className="rounded border-slate-300"
                />
                Enable online booking for this service
              </label>
            )}
          </div>
        ))}
        {formData.services.length < 8 && (
          <button
            type="button"
            onClick={addService}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus size={16} /> Add Another Service
          </button>
        )}
      </div>
    </div>
  )
}

function StepPhotos({
  formData,
  updateField,
}: {
  formData: OnboardingFormData
  updateField: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void
}) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Add your photos</h2>
      <p className="text-slate-500 mb-8">Great photos = more customers</p>
      <div className="max-w-xl space-y-8">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Logo</p>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            {formData.logoUrl ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
                  {formData.businessName?.[0] || 'L'}
                </div>
                <button
                  type="button"
                  onClick={() => updateField('logoUrl', undefined)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Upload your logo</p>
                <p className="text-xs text-slate-400 mt-1">PNG or JPG, recommended 400x400px</p>
                <p className="text-xs text-slate-400 mt-3">
                  Photo uploads will be available after payment
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Business Photos (up to 8)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:border-blue-400 transition-colors"
              >
                {formData.photoUrls[i] ? (
                  <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-sm text-slate-400">
                    Photo {i + 1}
                  </div>
                ) : (
                  <Plus className="w-5 h-5 text-slate-400" />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Photo uploads will be available after payment. You can add them from your admin dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}

function StepStyle({
  formData,
  updateField,
}: {
  formData: OnboardingFormData
  updateField: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void
}) {
  const groups = [
    { label: 'Light Themes', items: themes.filter((t) => t.group === 'light') },
    { label: 'Dark Themes', items: themes.filter((t) => t.group === 'dark') },
    { label: 'Colorful Themes', items: themes.filter((t) => t.group === 'colorful') },
  ]

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Choose your style</h2>
      <p className="text-slate-500 mb-8">You can change this anytime from your admin panel</p>
      {groups.map((group) => (
        <div key={group.label} className="mb-8">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {group.label}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {group.items.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateField('selectedTheme', theme.id)}
                className={cn(
                  'relative rounded-xl border-2 p-4 text-left transition-all',
                  formData.selectedTheme === theme.id
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex gap-1.5 mb-3">
                  {theme.colors.map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-700">{theme.name}</p>
                {formData.selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="max-w-xl mt-8">
        <p className="text-sm font-medium text-slate-700 mb-3">Heading Font</p>
        <select
          value={formData.headingFont}
          onChange={(e) => updateField('headingFont', e.target.value)}
          className={inputClass}
        >
          {fontOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function StepReview({
  formData,
  loading,
  onSubmit,
}: {
  formData: OnboardingFormData
  loading: boolean
  onSubmit: () => void
}) {
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedTimeline, setAgreedTimeline] = useState(false)

  const planPrices: Record<string, string> = {
    basic: '$599 setup + $299/mo',
    pro: '$599 setup + $399/mo',
    developer: '$49.99 (one-time)',
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Review your order</h2>
      <p className="text-slate-500 mb-8">Make sure everything looks good</p>
      <div className="max-w-xl">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            &#128203; Your Website Summary
          </h3>
          <div className="space-y-2 text-sm">
            <Row label="Business" value={formData.businessName || '—'} />
            <Row label="Type" value={formData.businessType || '—'} />
            <Row
              label="Plan"
              value={formData.plan ? formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1) : '—'}
            />
            <Row label="Theme" value={formData.selectedTheme} check />
            <Row label="Services" value={`${formData.services.filter((s) => s.name).length} listed`} check />
          </div>
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">Estimated Timeline</p>
            <p className="text-sm text-slate-700 mt-1">Site preview ready: ~5 minutes</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-700">Order Total</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formData.plan ? planPrices[formData.plan] : '—'}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="rounded border-slate-300 mt-0.5"
            />
            I agree to the Terms of Service
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={agreedTimeline}
              onChange={(e) => setAgreedTimeline(e.target.checked)}
              className="rounded border-slate-300 mt-0.5"
            />
            I understand my site preview will be ready in ~5 minutes
          </label>
        </div>

        <button
          onClick={onSubmit}
          disabled={!agreedTerms || !agreedTimeline || loading}
          className={cn(
            'w-full mt-6 py-4 rounded-xl text-white font-bold text-lg transition-all',
            agreedTerms && agreedTimeline && !loading
              ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/25 cursor-pointer'
              : 'bg-slate-300 cursor-not-allowed'
          )}
        >
          {loading ? 'Processing...' : '🔒 Proceed to Payment'}
        </button>

        <p className="mt-3 text-center text-xs text-slate-400">
          Powered by Stripe. We never store your card details.
        </p>
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Row({ label, value, check }: { label: string; value: string; check?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">
        {check && <span className="text-green-500 mr-1">&#10003;</span>}
        {label}
      </span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white'

// ─── Main Page ──────────────────────────────────────────

export default function GetStartedPage() {
  const { formData, updateField, nextStep, prevStep, loaded } = useOnboardingForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const saveRes = await fetch('/api/onboard/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!saveRes.ok) {
        const err = await saveRes.json()
        throw new Error(err.error || 'Failed to save your information. Please try again.')
      }
      const { submissionId } = await saveRes.json()
      updateField('submissionId', submissionId)

      const checkoutRes = await fetch('/api/onboard/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          plan: formData.plan,
          email: formData.email,
          businessName: formData.businessName,
        }),
      })
      if (!checkoutRes.ok) {
        throw new Error('Failed to create checkout session. Please try again.')
      }
      const { url } = await checkoutRes.json()
      if (!url) throw new Error('No checkout URL returned. Please try again.')
      window.location.href = url
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or email arsitechgroup@gmail.com')
      setLoading(false)
    }
  }

  if (!loaded) return null

  const canProceed = () => {
    switch (formData.currentStep) {
      case 1: return !!formData.plan
      case 2: return !!formData.businessName && !!formData.businessType && !!formData.description
      case 3: return !!formData.email && !!formData.phone
      default: return true
    }
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-32">
      <Container className="max-w-4xl">
        <ProgressBar currentStep={formData.currentStep} />
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={formData.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {formData.currentStep === 1 && (
              <StepPlan formData={formData} updateField={updateField} nextStep={nextStep} />
            )}
            {formData.currentStep === 2 && (
              <StepBusiness formData={formData} updateField={updateField} />
            )}
            {formData.currentStep === 3 && (
              <StepContact formData={formData} updateField={updateField} />
            )}
            {formData.currentStep === 4 && (
              <StepHours formData={formData} updateField={updateField} />
            )}
            {formData.currentStep === 5 && (
              <StepServices formData={formData} updateField={updateField} />
            )}
            {formData.currentStep === 6 && (
              <StepPhotos formData={formData} updateField={updateField} />
            )}
            {formData.currentStep === 7 && (
              <StepStyle formData={formData} updateField={updateField} />
            )}
            {formData.currentStep === 8 && (
              <StepReview formData={formData} loading={loading} onSubmit={handleSubmit} />
            )}
          </motion.div>
        </AnimatePresence>

        {formData.currentStep > 1 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 z-40">
            <Container className="max-w-4xl flex justify-between">
              <button
                onClick={prevStep}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft size={16} /> Back
              </button>
              {formData.currentStep < TOTAL_STEPS && (
                <Button onClick={nextStep} disabled={!canProceed()} size="sm">
                  Continue <ChevronRight size={16} />
                </Button>
              )}
            </Container>
          </div>
        )}
      </Container>
    </main>
  )
}
