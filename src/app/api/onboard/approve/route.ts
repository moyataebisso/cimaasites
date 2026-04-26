import { supabaseAdmin } from '@/lib/supabase'
import {
  sendCheckoutLinkEmail,
  sendSiteLiveEmail,
  sendYouNewClientEmail,
} from '@/lib/emails'
import {
  createCheckoutSession,
  type CheckoutPlan,
} from '@/lib/stripe-checkout'

type Mode = 'go_live' | 'approve_for_payment'

const VALID_PLANS: CheckoutPlan[] = ['basic', 'pro', 'developer']

export async function POST(request: Request) {
  const body = await request.json()
  const submissionId: string | undefined = body.submissionId
  const mode: Mode = body.mode === 'approve_for_payment' ? 'approve_for_payment' : 'go_live'
  const sendEmail: boolean = body.sendEmail === true

  if (!submissionId) {
    return Response.json({ error: 'submissionId is required' }, { status: 400 })
  }

  if (mode === 'approve_for_payment') {
    const password = request.headers.get('x-admin-password')
    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { data: submission } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .select('*')
    .eq('id', submissionId)
    .single()

  if (!submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (mode === 'approve_for_payment') {
    return handleApproveForPayment(submission, sendEmail)
  }

  return handleGoLive(submission)
}

async function handleApproveForPayment(
  submission: {
    id: string
    status: string
    plan: string
    email: string
    contact_name: string | null
    business_name: string
    stripe_session_id: string | null
    checkout_url: string | null
    approved_at: string | null
  },
  sendEmail: boolean
) {
  if (!submission.email) {
    return Response.json({ error: 'Submission is missing email' }, { status: 400 })
  }
  if (!VALID_PLANS.includes(submission.plan as CheckoutPlan)) {
    return Response.json({ error: 'Submission has invalid plan' }, { status: 400 })
  }

  const isReapproval =
    submission.status === 'approved' &&
    !!submission.stripe_session_id &&
    !!submission.checkout_url

  let checkoutUrl: string
  let sessionId: string

  if (isReapproval) {
    checkoutUrl = submission.checkout_url!
    sessionId = submission.stripe_session_id!
  } else {
    if (submission.status !== 'pending') {
      return Response.json(
        {
          error: `Submission is ${submission.status}, must be pending to approve`,
        },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession({
      submissionId: submission.id,
      plan: submission.plan as CheckoutPlan,
      email: submission.email,
      businessName: submission.business_name,
    })
    checkoutUrl = session.url
    sessionId = session.sessionId

    const { error: updateError } = await supabaseAdmin
      .schema('cimaasites')
      .from('onboarding_submissions')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        stripe_session_id: sessionId,
        checkout_url: checkoutUrl,
      })
      .eq('id', submission.id)

    if (updateError) {
      console.error('approve_for_payment update error:', updateError)
      return Response.json(
        { error: 'Could not update submission' },
        { status: 500 }
      )
    }
  }

  if (sendEmail) {
    try {
      await sendCheckoutLinkEmail({
        email: submission.email,
        contactName: submission.contact_name || submission.business_name,
        businessName: submission.business_name,
        plan: submission.plan,
        checkoutUrl,
      })
    } catch (err) {
      console.error('sendCheckoutLinkEmail error:', err)
      return Response.json(
        {
          success: true,
          checkoutUrl,
          submissionId: submission.id,
          emailError: 'Could not send email — link is still valid',
        },
        { status: 200 }
      )
    }
  }

  return Response.json({
    success: true,
    checkoutUrl,
    submissionId: submission.id,
    emailSent: sendEmail,
  })
}

async function handleGoLive(submission: {
  id: string
  business_name: string
  email: string
  plan: string
  client_preview_url: string
  client_admin_email: string
  client_admin_password: string
  client_vercel_project_id: string
  assigned_subdomain: string
}) {
  await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .update({
      status: 'live',
      approved_at: new Date().toISOString(),
      live_at: new Date().toISOString(),
      client_live_url: submission.client_preview_url,
    })
    .eq('id', submission.id)

  await supabaseAdmin
    .schema('cimaasites')
    .from('clients')
    .insert({
      submission_id: submission.id,
      business_name: submission.business_name,
      email: submission.email,
      plan: submission.plan,
      status: 'active',
      monthly_revenue_cents:
        submission.plan === 'basic' ? 1900 : submission.plan === 'pro' ? 3500 : 4999,
      live_url: submission.client_preview_url,
      admin_url: `${submission.client_preview_url}/admin`,
      vercel_project_id: submission.client_vercel_project_id,
      domain: submission.assigned_subdomain,
    })

  try {
    await sendSiteLiveEmail({
      email: submission.email,
      businessName: submission.business_name,
      liveUrl: submission.client_preview_url,
      adminUrl: `${submission.client_preview_url}/admin`,
    })

    await sendYouNewClientEmail({
      businessName: submission.business_name,
      email: submission.email,
      plan: submission.plan,
      revenue:
        submission.plan === 'basic' ? '$299' : submission.plan === 'pro' ? '$399' : '$49.99',
    })
  } catch (err) {
    console.error('Email send error:', err)
  }

  return Response.json({
    success: true,
    liveUrl: submission.client_preview_url,
    adminUrl: `${submission.client_preview_url}/admin`,
    adminEmail: submission.client_admin_email,
    adminPassword: submission.client_admin_password,
  })
}
