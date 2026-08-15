import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminPassword } from '@/lib/admin-auth'

const EXISTING_PROJECT_NAMES = [
  'Arsi Tech Group Website',
  'SaveYours',
  'CareConnect Live',
  'Oromo Platform',
  'Arsi Command Center',
  'Entrusted Care Residence',
  'Rift Valley Transportation',
]

export async function GET(request: Request) {
  const denied = requireAdminPassword(request)
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const project = searchParams.get('project')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 20

  let query = supabaseAdmin
    .from('change_requests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (project && project !== 'all') {
    if (project === 'cimaa') {
      query = query.not(
        'business_name',
        'in',
        `(${EXISTING_PROJECT_NAMES.map((n) => `"${n}"`).join(',')})`
      )
    } else {
      query = query.eq('business_name', project)
    }
  }

  const { data, error, count } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({
    requests: data,
    total: count,
    page,
    pageSize,
  })
}
