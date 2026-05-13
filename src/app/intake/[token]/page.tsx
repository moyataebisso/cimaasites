import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { IntakeForm, type IntakeSubmission } from '@/components/IntakeForm'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function IntakePage({ params }: PageProps) {
  const { token } = await params

  if (!token || token.length < 16) {
    notFound()
  }

  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select(
      'id, intake_token, contact_name, email, business_name, plan, selected_layout, business_description, intake_completed_at, status'
    )
    .eq('intake_token', token)
    .single()

  if (!submission) {
    notFound()
  }

  if (submission.intake_completed_at) {
    return (
      <main className="bg-cimaa-bg-tan min-h-screen pt-28 pb-20">
        <Container>
          <div className="max-w-xl mx-auto rounded-2xl border border-cimaa-border bg-white p-8 sm:p-10 shadow-sm text-center">
            <span className="h-14 w-14 rounded-full bg-cimaa-green-light text-cimaa-green inline-flex items-center justify-center">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </span>
            <h1 className="mt-6 text-2xl sm:text-3xl font-heading font-semibold text-cimaa-text">
              You&apos;re all set 🎉
            </h1>
            <p className="mt-3 text-cimaa-text-muted leading-relaxed">
              We received your intake details for{' '}
              <strong className="text-cimaa-text">
                {submission.business_name}
              </strong>
              . The Wajii team is reviewing now and will send your payment link shortly.
            </p>
            <div className="mt-8">
              <Button href="/" variant="outline" size="lg">
                Back to home
              </Button>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  const intakeSubmission: IntakeSubmission = {
    id: submission.id,
    intake_token: submission.intake_token,
    contact_name: submission.contact_name,
    email: submission.email,
    business_name: submission.business_name,
    plan: submission.plan,
    selected_layout: submission.selected_layout,
    business_description: submission.business_description,
  }

  return (
    <main className="bg-cimaa-bg-tan min-h-screen pt-28 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
              Step 2 of 2
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold leading-tight tracking-tight text-cimaa-text">
              Tell us about your business
            </h1>
            <p className="mt-4 text-cimaa-text-muted leading-relaxed max-w-xl mx-auto">
              These details power your site copy, contact info, services page,
              and design choices. Should take about 5 minutes.
            </p>
            <p className="mt-2 text-xs text-cimaa-text-subtle">
              Submitting as <strong>{submission.email}</strong>
              {submission.contact_name ? ` (${submission.contact_name})` : ''}
            </p>
          </div>

          <IntakeForm submission={intakeSubmission} />

          <p className="mt-6 text-center text-xs text-cimaa-text-subtle">
            Need a hand?{' '}
            <Link href="mailto:arsitechgroup@gmail.com" className="text-cimaa-green underline">
              Email us directly
            </Link>{' '}
            and we&apos;ll fill the rest in for you.
          </p>
        </div>
      </Container>
    </main>
  )
}
