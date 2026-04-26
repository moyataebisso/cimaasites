import { supabaseAdmin } from '@/lib/supabase'
import { sendContactAutoReply, sendNewContactLeadEmail } from '@/lib/emails'
import { isLayoutId, type LayoutId } from '@/lib/layouts'

const VALID_PLANS = ['basic', 'pro', 'developer'] as const
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LAYOUT_NOTES_MAX = 1000

export async function POST(request: Request) {
  const body = await request.json()
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const businessName =
    typeof body.business_name === 'string' ? body.business_name.trim() : ''
  const plan = typeof body.plan === 'string' ? body.plan : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  const selectedLayout: LayoutId = isLayoutId(body.selected_layout)
    ? body.selected_layout
    : 'fleet'

  const rawNotes =
    typeof body.layout_notes === 'string' ? body.layout_notes.trim() : ''
  const layoutNotes = rawNotes ? rawNotes.slice(0, LAYOUT_NOTES_MAX) : null

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 })
  }
  if (!EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 })
  }
  if (!businessName) {
    return Response.json({ error: 'Business name is required' }, { status: 400 })
  }
  if (!VALID_PLANS.includes(plan as (typeof VALID_PLANS)[number])) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .schema('cimaasites')
    .from('onboarding_submissions')
    .insert({
      contact_name: name,
      email,
      business_name: businessName,
      plan,
      business_description: message || null,
      selected_layout: selectedLayout,
      layout_notes: layoutNotes,
      status: 'pending',
      current_step: 'form',
      progress: 0,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Contact submission insert error:', error)
    return Response.json(
      { error: 'Could not save your message. Please try again.' },
      { status: 500 }
    )
  }

  try {
    await sendNewContactLeadEmail({
      contactName: name,
      email,
      businessName,
      plan,
      message,
      submissionId: data.id,
    })
  } catch (err) {
    console.error('sendNewContactLeadEmail error:', err)
  }

  try {
    await sendContactAutoReply({
      email,
      contactName: name,
      businessName,
    })
  } catch (err) {
    console.error('sendContactAutoReply error:', err)
  }

  return Response.json({ success: true, submissionId: data.id })
}
