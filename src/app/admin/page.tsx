'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Loader2, ExternalLink, Globe } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────

interface Client {
  id: string
  business_name: string
  email: string
  plan: string
  status: string
  monthly_revenue_cents: number
  live_url: string
  created_at: string
}

interface Submission {
  id: string
  business_name: string
  email: string
  plan: string
  status: string
  created_at: string
  amount_cents: number
}

interface ChangeRequest {
  id: string
  client_email: string
  business_name: string
  request_type: string
  description: string
  status: string
  priority: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

type Tab = 'overview' | 'requests' | 'projects'

// ─── Data ───────────────────────────────────────────────

const EXISTING_PROJECTS = [
  {
    name: 'Arsi Tech Group',
    url: 'https://arsitechgroup.com',
    adminUrl: 'https://arsitechgroup.com/arsi-admin',
    type: 'Company Website',
    description: 'Main company marketing site for Arsi Technology Group LLC',
    status: 'live',
    businessName: 'Arsi Tech Group Website',
    github: 'moyataebisso/arsitech',
  },
  {
    name: 'SaveYours',
    url: 'https://saveyours.net',
    adminUrl: 'https://saveyours.net/admin/change-requests',
    type: 'Training Platform',
    description: 'CPR and first aid class registration, Stripe payments, automated emails',
    status: 'live',
    businessName: 'SaveYours',
    github: 'moyataebisso/saveyours',
  },
  {
    name: 'CareConnect Live',
    url: 'https://careconnectlive.org',
    adminUrl: 'https://careconnectlive.org/admin/change-requests',
    type: 'Healthcare Platform',
    description: 'Healthcare provider matching platform with booking, messaging, Stripe subscriptions',
    status: 'live',
    businessName: 'CareConnect Live',
    github: 'moyataebisso/careconnect',
  },
  {
    name: 'Oromo Platform',
    url: 'https://oromo-platform.vercel.app',
    adminUrl: 'https://oromo-platform.vercel.app/admin/change-requests',
    type: 'Community Platform',
    description: 'Oromo community platform with academy, businesses, careers, news, events',
    status: 'live',
    businessName: 'Oromo Platform',
    github: 'moyataebisso/oromo-platform',
  },
  {
    name: 'Arsi Command Center',
    url: 'https://arsi-platform-dashboard.vercel.app',
    adminUrl: 'https://arsi-platform-dashboard.vercel.app',
    type: 'Monitoring Dashboard',
    description: '24/7 uptime monitoring, SSL checks, performance tracking for all sites',
    status: 'live',
    businessName: 'Arsi Command Center',
    github: 'moyataebisso/arsi-platform',
  },
  {
    name: 'Entrusted Home Healthcare',
    url: 'https://entrustedhomehealthcare.org',
    adminUrl: null,
    type: 'Healthcare Website',
    description: 'Home healthcare company website with HIPAA compliance pages',
    status: 'live',
    businessName: 'Entrusted Home Healthcare',
    github: null,
  },
  {
    name: 'Rift Valley Transportation',
    url: 'https://rvtusinc.com',
    adminUrl: null,
    type: 'Transportation Website',
    description: 'Transportation company website hosted on GoDaddy',
    status: 'live',
    businessName: 'Rift Valley Transportation',
    github: null,
  },
]

const TYPE_COLORS: Record<string, string> = {
  'Company Website': 'bg-slate-100 text-slate-600',
  'Training Platform': 'bg-blue-100 text-blue-700',
  'Healthcare Platform': 'bg-emerald-100 text-emerald-700',
  'Community Platform': 'bg-violet-100 text-violet-700',
  'Monitoring Dashboard': 'bg-orange-100 text-orange-700',
  'Transportation Website': 'bg-amber-100 text-amber-700',
  'Healthcare Website': 'bg-teal-100 text-teal-700',
}

const PROJECT_BADGE_COLORS: Record<string, string> = {
  SaveYours: 'bg-blue-100 text-blue-700',
  'CareConnect Live': 'bg-emerald-100 text-emerald-700',
  'Oromo Platform': 'bg-violet-100 text-violet-700',
  'Arsi Tech Group Website': 'bg-slate-100 text-slate-600',
  'Arsi Command Center': 'bg-orange-100 text-orange-700',
  'Entrusted Home Healthcare': 'bg-teal-100 text-teal-700',
  'Rift Valley Transportation': 'bg-amber-100 text-amber-700',
}

const PROJECT_FILTER_OPTIONS = [
  { value: 'all', label: 'All Projects' },
  { value: 'Arsi Tech Group Website', label: 'Arsi Tech' },
  { value: 'SaveYours', label: 'SaveYours' },
  { value: 'CareConnect Live', label: 'CareConnect' },
  { value: 'Oromo Platform', label: 'Oromo Platform' },
  { value: 'cimaa', label: 'Cimaa Clients' },
]

// ─── Main Component ─────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [storedPassword, setStoredPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')

  // Change requests state
  const [requests, setRequests] = useState<ChangeRequest[]>([])
  const [requestsTotal, setRequestsTotal] = useState(0)
  const [requestsFilter, setRequestsFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [editingRequest, setEditingRequest] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/data', {
        headers: { 'x-admin-password': password },
      })
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
        setSubmissions(data.submissions || [])
        setStoredPassword(password)
        setAuthenticated(true)
        loadRequests(password)
      } else {
        alert('Wrong password')
      }
    } catch {
      alert('Error loading data')
    }
    setLoading(false)
  }

  const loadRequests = async (pw?: string, statusF?: string, projectF?: string) => {
    setRequestsLoading(true)
    try {
      const s = statusF ?? requestsFilter
      const p = projectF ?? projectFilter
      const res = await fetch(
        `/api/admin/change-requests?status=${s}&project=${p}`,
        { headers: { 'x-admin-password': pw || storedPassword } }
      )
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
        setRequestsTotal(data.total || 0)
      }
    } catch (err) {
      console.error('Failed to load requests:', err)
    }
    setRequestsLoading(false)
  }

  const handleUpdateRequest = async (requestId: string) => {
    setUpdating(true)
    try {
      const res = await fetch('/api/admin/change-requests/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': storedPassword,
        },
        body: JSON.stringify({
          requestId,
          status: editStatus,
          adminNotes: editNotes,
        }),
      })
      if (res.ok) {
        setEditingRequest(null)
        setEditStatus('')
        setEditNotes('')
        loadRequests()
      }
    } catch (err) {
      console.error('Failed to update request:', err)
    }
    setUpdating(false)
  }

  const viewProjectRequests = (businessName: string) => {
    setProjectFilter(businessName)
    setTab('requests')
    loadRequests(undefined, requestsFilter, businessName)
  }

  const totalRevenue = clients.reduce((sum, c) => sum + (c.monthly_revenue_cents || 0), 0)
  const pendingCount = requests.filter((r) => r.status === 'pending').length

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm mb-4"
            placeholder="Enter admin password"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 cursor-pointer"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Cimaa Admin Dashboard</h1>
          <a
            href="https://arsi-platform-dashboard.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            Command Center
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-slate-200 overflow-x-auto">
          <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
            Overview
          </TabButton>
          <TabButton
            active={tab === 'requests'}
            onClick={() => {
              setTab('requests')
              if (requests.length === 0) loadRequests()
            }}
          >
            Change Requests
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                {pendingCount}
              </span>
            )}
          </TabButton>
          <TabButton active={tab === 'projects'} onClick={() => setTab('projects')}>
            My Projects
          </TabButton>
        </div>

        {/* ─── Overview Tab ──────────────────────────────── */}
        {tab === 'overview' && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard label="Total Projects" value="7" sub="All monitored 24/7" icon={<Globe size={16} className="text-blue-500" />} />
              <StatCard label="Cimaa Clients" value={String(clients.length)} sub="New Cimaa Sites clients" />
              <StatCard label="Monthly Revenue" value={`$${(totalRevenue / 100).toFixed(2)}`} />
              <StatCard label="Recent Signups" value={String(submissions.length)} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-bold text-slate-900">All Submissions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Business</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Email</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Plan</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-6 py-3 font-medium text-slate-900">{s.business_name}</td>
                        <td className="px-6 py-3 text-slate-600">{s.email}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            {s.plan}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="px-6 py-3 text-slate-500">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No submissions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ─── Change Requests Tab ───────────────────────── */}
        {tab === 'requests' && (
          <>
            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'pending', 'in_progress', 'done', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setRequestsFilter(f)
                    loadRequests(undefined, f)
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    requestsFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {f === 'all'
                    ? 'All'
                    : f === 'in_progress'
                      ? 'In Progress'
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <span className="text-sm text-slate-400 self-center ml-2">
                {requestsTotal} total
              </span>
            </div>

            {/* Project filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-slate-400 self-center mr-1">Project:</span>
              {PROJECT_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setProjectFilter(opt.value)
                    loadRequests(undefined, undefined, opt.value)
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                    projectFilter === opt.value
                      ? 'bg-violet-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {requestsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-slate-400" size={24} />
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-400">No change requests found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <div className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <ProjectBadge name={req.business_name} />
                        <span className="text-xs text-slate-400">{req.client_email}</span>
                        <RequestStatusBadge status={req.status} />
                        {req.priority === 'urgent' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                            URGENT
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                          {req.request_type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{req.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-400">
                          {new Date(req.created_at).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          {req.admin_notes && (
                            <button
                              onClick={() =>
                                setExpandedRequest(expandedRequest === req.id ? null : req.id)
                              }
                              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Notes
                              {expandedRequest === req.id ? (
                                <ChevronUp size={12} />
                              ) : (
                                <ChevronDown size={12} />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (editingRequest === req.id) {
                                setEditingRequest(null)
                              } else {
                                setEditingRequest(req.id)
                                setEditStatus(req.status)
                                setEditNotes(req.admin_notes || '')
                              }
                            }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            {editingRequest === req.id ? 'Cancel' : 'Update'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedRequest === req.id && req.admin_notes && (
                      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Admin Notes</p>
                        <p className="text-sm text-slate-700">{req.admin_notes}</p>
                      </div>
                    )}

                    {editingRequest === req.id && (
                      <div className="px-6 py-4 bg-blue-50/50 border-t border-slate-100 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Admin Notes (visible to client when done)
                          </label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none"
                            rows={2}
                            placeholder="Notes about what was changed..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingRequest(null)}
                            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateRequest(req.id)}
                            disabled={updating}
                            className="px-4 py-1.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 cursor-pointer"
                          >
                            {updating ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                        {editStatus === 'done' && (
                          <p className="text-xs text-amber-600">
                            Saving as &quot;Done&quot; will send a notification email to{' '}
                            {req.client_email}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── My Projects Tab ───────────────────────────── */}
        {tab === 'projects' && (
          <>
            <p className="text-sm text-slate-500 mb-6">
              {EXISTING_PROJECTS.length} projects &middot;{' '}
              {EXISTING_PROJECTS.filter((p) => p.status === 'live').length} live &middot; All
              monitored by Command Center
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXISTING_PROJECTS.map((project) => (
                <div
                  key={project.name}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{project.name}</h3>
                      <span
                        className={cn(
                          'inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          TYPE_COLORS[project.type] || 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {project.type}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium whitespace-nowrap">
                      Live
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{project.description}</p>

                  <div className="space-y-1 mb-4">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline truncate"
                    >
                      <ExternalLink size={10} />
                      {project.url.replace('https://', '')}
                    </a>
                    {project.github && (
                      <a
                        href={`https://github.com/${project.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:underline"
                      >
                        <span>&#128193;</span>
                        {project.github}
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Visit Site &#8599;
                    </a>
                    {project.adminUrl && (
                      <a
                        href={project.adminUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Admin Panel &#8599;
                      </a>
                    )}
                    <button
                      onClick={() => viewProjectRequests(project.businessName)}
                      className="px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      View Requests &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>
    </main>
  )
}

// ─── Helper Components ──────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2 whitespace-nowrap',
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      )}
    >
      {children}
    </button>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: string
  sub?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium',
        status === 'live' && 'bg-green-100 text-green-700',
        status === 'preview' && 'bg-blue-100 text-blue-700',
        status === 'paid' && 'bg-amber-100 text-amber-700',
        status === 'failed' && 'bg-red-100 text-red-700',
        status === 'pending' && 'bg-slate-100 text-slate-600'
      )}
    >
      {status}
    </span>
  )
}

function RequestStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium',
        status === 'pending' && 'bg-amber-100 text-amber-700',
        status === 'in_progress' && 'bg-blue-100 text-blue-700',
        status === 'done' && 'bg-green-100 text-green-700',
        status === 'cancelled' && 'bg-slate-100 text-slate-500'
      )}
    >
      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function ProjectBadge({ name }: { name: string }) {
  const color = PROJECT_BADGE_COLORS[name] || 'bg-blue-100 text-blue-700'
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', color)}>
      {name || 'Unknown'}
    </span>
  )
}
