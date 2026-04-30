'use client'

import { useMemo, useState } from 'react'
import {
  contactReceivedEmail,
  contactReceivedAdminAlert,
  intakeFormLinkEmail,
  intakeCompleteEmail,
  paymentReceiptEmail,
  siteLiveEmail,
} from '@/lib/email-templates'

// Mock data shared across all templates
const mock = {
  contactName: 'Sarah Johnson',
  businessName: 'Adama Restaurant',
  email: 'sarah@adamarestaurant.com',
  plan: 'pro',
  selected_layout: 'restaurant',
  message: 'We need a website with online ordering and reservations',
  layout_notes: 'Warm earthy colors, lots of food photos',
  intakeUrl: 'https://cimaasites.vercel.app/intake/abc123',
  paymentUrl: 'https://buy.stripe.com/test_xxx',
  amountUsd: 599,
  previewUrl: 'https://adama-restaurant-xyz.vercel.app',
  adminUrl: 'https://adama-restaurant-xyz.vercel.app/admin',
  adminEmail: 'sarah@adamarestaurant.com',
  adminPassword: 'Xk9mP3nQ7wRt',
  submissionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  createdAt: new Date().toISOString(),
}

type TemplateKey =
  | 'contactReceived'
  | 'contactAdminAlert'
  | 'intakeLink'
  | 'intakeComplete'
  | 'paymentReceipt'
  | 'siteLive'

interface TemplateMeta {
  key: TemplateKey
  label: string
  audience: string
  to: string
  build: () => { subject: string; html: string }
}

const TEMPLATES: TemplateMeta[] = [
  {
    key: 'contactReceived',
    label: '1. Contact received (customer)',
    audience: 'Customer auto-reply',
    to: mock.email,
    build: () =>
      contactReceivedEmail({
        contactName: mock.contactName,
        businessName: mock.businessName,
      }),
  },
  {
    key: 'contactAdminAlert',
    label: '2. Contact received (admin)',
    audience: 'Internal admin alert',
    to: 'arsitechgroup@gmail.com',
    build: () =>
      contactReceivedAdminAlert({
        submission: {
          id: mock.submissionId,
          contact_name: mock.contactName,
          email: mock.email,
          business_name: mock.businessName,
          plan: mock.plan,
          selected_layout: mock.selected_layout,
          message: mock.message,
          layout_notes: mock.layout_notes,
          created_at: mock.createdAt,
        },
      }),
  },
  {
    key: 'intakeLink',
    label: '3. Intake form link (customer)',
    audience: 'Post-quote → kickoff',
    to: mock.email,
    build: () =>
      intakeFormLinkEmail({
        contactName: mock.contactName,
        businessName: mock.businessName,
        intakeUrl: mock.intakeUrl,
        plan: mock.plan,
      }),
  },
  {
    key: 'intakeComplete',
    label: '4. Intake complete → pay (customer)',
    audience: 'Sends payment link',
    to: mock.email,
    build: () =>
      intakeCompleteEmail({
        contactName: mock.contactName,
        businessName: mock.businessName,
        paymentUrl: mock.paymentUrl,
      }),
  },
  {
    key: 'paymentReceipt',
    label: '5. Payment receipt (customer)',
    audience: 'After Stripe success',
    to: mock.email,
    build: () =>
      paymentReceiptEmail({
        contactName: mock.contactName,
        businessName: mock.businessName,
        amountUsd: mock.amountUsd,
        plan: mock.plan,
      }),
  },
  {
    key: 'siteLive',
    label: '6. Site live (customer)',
    audience: 'Provisioning complete',
    to: mock.email,
    build: () =>
      siteLiveEmail({
        contactName: mock.contactName,
        businessName: mock.businessName,
        previewUrl: mock.previewUrl,
        adminUrl: mock.adminUrl,
        adminEmail: mock.adminEmail,
        adminPassword: mock.adminPassword,
      }),
  },
]

export default function EmailPreviewPage() {
  const [active, setActive] = useState<TemplateKey>('contactReceived')
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')

  const current = useMemo(() => {
    const t = TEMPLATES.find((t) => t.key === active) ?? TEMPLATES[0]
    const built = t.build()
    return {
      ...t,
      subject: built.subject,
      html: built.html,
      bytes: new Blob([built.html]).size,
    }
  }, [active])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', color: '#18181b' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Email Template Preview
          </h1>
          <p style={{ marginTop: 6, color: '#52525b', fontSize: 14 }}>
            Internal admin tool. Templates render with mock data — no emails are sent.
          </p>
        </header>

        {/* Template buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 20,
          }}
        >
          {TEMPLATES.map((t) => {
            const isActive = t.key === active
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid ' + (isActive ? '#facc15' : '#e4e4e7'),
                  backgroundColor: isActive ? '#fef3c7' : '#ffffff',
                  color: '#18181b',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Metadata strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: 16,
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: '14px 18px',
            marginBottom: 12,
            alignItems: 'center',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 600,
              }}
            >
              Subject
            </p>
            <p style={{ margin: '3px 0 0 0', fontSize: 14, fontWeight: 500 }}>
              {current.subject}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 600,
              }}
            >
              To
            </p>
            <p style={{ margin: '3px 0 0 0', fontSize: 14, fontFamily: 'monospace' }}>
              {current.to}{' '}
              <span style={{ color: '#a1a1aa', fontSize: 12 }}>
                ({current.audience})
              </span>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 600,
              }}
            >
              Size
            </p>
            <p style={{ margin: '3px 0 0 0', fontSize: 14, fontFamily: 'monospace' }}>
              {(current.bytes / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        {/* View tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          <ViewTab
            active={view === 'desktop'}
            onClick={() => setView('desktop')}
            label="Desktop view (600px)"
          />
          <ViewTab
            active={view === 'mobile'}
            onClick={() => setView('mobile')}
            label="Mobile view (375px)"
          />
        </div>

        {/* iframe preview */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <iframe
            key={active + view}
            srcDoc={current.html}
            title={`Email preview — ${current.label}`}
            style={{
              width: view === 'desktop' ? 700 : 410,
              maxWidth: '100%',
              height: '70vh',
              minHeight: 600,
              border: '1px solid #e4e4e7',
              borderRadius: 6,
              backgroundColor: '#ffffff',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ViewTab({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 6,
        border: '1px solid ' + (active ? '#18181b' : '#e4e4e7'),
        backgroundColor: active ? '#18181b' : '#ffffff',
        color: active ? '#ffffff' : '#18181b',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
