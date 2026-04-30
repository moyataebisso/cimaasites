import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function IntakePaidPage({ params }: PageProps) {
  const { token } = await params
  if (!token || token.length < 16) notFound()

  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('id, business_name, email, status')
    .eq('intake_token', token)
    .single()

  if (!submission) notFound()

  return (
    <main className="bg-cimaa-bg-tan min-h-screen pt-28 pb-20">
      <Container>
        <div className="max-w-xl mx-auto rounded-2xl border border-cimaa-border bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <span className="h-14 w-14 rounded-full bg-cimaa-yellow text-cimaa-text inline-flex items-center justify-center text-2xl">
              🎉
            </span>
            <h1 className="mt-6 text-2xl sm:text-3xl font-heading font-semibold text-cimaa-text">
              Payment received — building{' '}
              <span className="text-cimaa-green">{submission.business_name}</span>{' '}
              now
            </h1>
            <p className="mt-4 text-cimaa-text-muted leading-relaxed">
              Thanks! Your site is being built right now. You&apos;ll receive an
              email at <strong className="text-cimaa-text">{submission.email}</strong>{' '}
              within the next 5–10 minutes with your preview URL and admin
              login.
            </p>
            <p className="mt-3 text-sm text-cimaa-text-subtle">
              In the meantime: you can close this tab. We&apos;ll handle
              everything from here.
            </p>
          </div>

          {/* What happens next */}
          <div className="mt-10 rounded-xl bg-cimaa-bg-surface border border-cimaa-border p-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-cimaa-text-muted mb-4">
              What happens next
            </p>
            <ol className="space-y-4">
              <Step
                num={1}
                title="Now: Building your site"
                body="Our provisioning pipeline is generating your site copy, layout, and admin."
              />
              <Step
                num={2}
                title="Within minutes: Preview URL ready"
                body="You'll receive an email with your preview link and admin login."
              />
              <Step
                num={3}
                title="Within 24 hours: Final touches and launch"
                body="Site goes live on your subdomain after a quick QA pass."
              />
            </ol>
          </div>

          <div className="mt-8 flex justify-center">
            <Button href="/" variant="outline" size="md">
              Back to home
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-cimaa-text-subtle">
            Questions?{' '}
            <Link
              href="mailto:arsitechgroup@gmail.com"
              className="text-cimaa-green underline"
            >
              Email Moa
            </Link>{' '}
            — Stripe will also email you a receipt separately.
          </p>
        </div>
      </Container>
    </main>
  )
}

function Step({
  num,
  title,
  body,
}: {
  num: number
  title: string
  body: string
}) {
  return (
    <li className="flex gap-3">
      <span className="flex-shrink-0 h-7 w-7 rounded-full bg-cimaa-yellow text-cimaa-text font-bold text-sm flex items-center justify-center">
        {num}
      </span>
      <div>
        <p className="text-sm font-semibold text-cimaa-text">{title}</p>
        <p className="text-sm text-cimaa-text-muted">{body}</p>
      </div>
    </li>
  )
}
