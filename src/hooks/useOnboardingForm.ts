'use client'

import { useState, useEffect, useCallback } from 'react'

export interface OnboardingFormData {
  plan: 'basic' | 'pro' | 'developer' | null
  businessName: string
  businessType: string
  tagline: string
  description: string
  yearEstablished?: number
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  googleMapsUrl?: string
  serviceArea: 'local' | 'regional' | 'national' | 'online'
  facebook?: string
  instagram?: string
  tiktok?: string
  whatsapp?: string
  hours: Record<
    string,
    { isOpen: boolean; openTime: string; closeTime: string }
  >
  is24Hours: boolean
  hoursVary: boolean
  services: Array<{
    name: string
    description?: string
    price?: string
    duration?: string
    bookingEnabled?: boolean
  }>
  logoUrl?: string
  photoUrls: string[]
  selectedTheme: string
  primaryColor?: string
  accentColor?: string
  headingFont: string
  currentStep: number
  submissionId?: string
}

const defaultHours: OnboardingFormData['hours'] = {
  Monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Saturday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
  Sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' },
}

const defaultFormData: OnboardingFormData = {
  plan: null,
  businessName: '',
  businessType: '',
  tagline: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  serviceArea: 'local',
  hours: defaultHours,
  is24Hours: false,
  hoursVary: false,
  services: [{ name: '', description: '', price: '', duration: '' }],
  photoUrls: [],
  selectedTheme: 'warm',
  headingFont: 'Inter',
  currentStep: 1,
}

const STORAGE_KEY = 'cimaa_onboarding'

export function useOnboardingForm() {
  const [formData, setFormData] = useState<OnboardingFormData>(defaultFormData)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setFormData({ ...defaultFormData, ...JSON.parse(saved) })
      } catch {
        // ignore parse errors
      }
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData, loaded])

  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(
      key: K,
      value: OnboardingFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const nextStep = useCallback(() => {
    setFormData((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }))
  }, [])

  const prevStep = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setFormData((prev) => ({ ...prev, currentStep: step }))
  }, [])

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setFormData(defaultFormData)
  }, [])

  return {
    formData,
    setFormData,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    loaded,
  }
}
