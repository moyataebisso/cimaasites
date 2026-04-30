'use client'

import { Fragment, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  Globe,
  StickyNote,
  Copy,
  Check,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

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
  current_step?: string | null
  created_at: string
  amount_cents: number
  selected_layout: string | null
  layout_notes: string | null
  contact_name: string | null
  phone: string | null
  business_description: string | null
  checkout_url: string | null
  stripe_session_id: string | null
  approved_at: string | null
  paid_at?: string | null
  client_live_url: string | null
  intake_token?: string | null
  intake_sent_at?: string | null
  intake_completed_at?: string | null
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

  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)

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

  const loadOverview = async (pw?: string) => {
    try {
      const res = await fetch('/api/admin/data', {
        headers: { 'x-admin-password': pw || storedPassword },
      })
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
        setSubmissions(data.submissions || [])
      }
    } catch (err) {
      console.error('Failed to refresh overview:', err)
    }
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
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Contact</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Email</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Plan</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Layout</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => {
                      const hasNotes = Boolean(s.layout_notes && s.layout_notes.trim())
                      const isExpanded = expandedSubmission === s.id
                      return (
                        <Fragment key={s.id}>
                          <tr
                            className="border-b border-slate-50 cursor-pointer hover:bg-slate-50"
                            onClick={() =>
                              setExpandedSubmission(isExpanded ? null : s.id)
                            }
                          >
                            <td className="px-6 py-3 font-medium text-slate-900">
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronUp size={14} className="text-slate-400" />
                                ) : (
                                  <ChevronDown size={14} className="text-slate-400" />
                                )}
                                {s.business_name}
                              </div>
                            </td>
                            <td className="px-6 py-3 text-slate-600">
                              {s.contact_name || '—'}
                            </td>
                            <td className="px-6 py-3 text-slate-600">{s.email}</td>
                            <td className="px-6 py-3">
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                {s.plan}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium capitalize">
                                  {s.selected_layout || '—'}
                                </span>
                                {hasNotes && (
                                  <span
                                    title={s.layout_notes || ''}
                                    className="text-amber-600 inline-flex items-center"
                                  >
                                    <StickyNote size={14} />
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <StatusBadge status={s.status} />
                            </td>
                            <td className="px-6 py-3 text-slate-500">
                              {new Date(s.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-slate-50/70 border-b border-slate-100">
                              <td colSpan={7} className="px-6 py-4">
                                <SubmissionDetail
                                  submission={s}
                                  adminPassword={storedPassword}
                                  onChanged={() => loadOverview(storedPassword)}
                                />
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
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
  const label =
    status === 'intake_sent'
      ? 'Intake Sent'
      : status === 'intake_done'
        ? 'Intake Done'
        : status
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium',
        status === 'live' && 'bg-green-100 text-green-700',
        status === 'preview' && 'bg-blue-100 text-blue-700',
        status === 'paid' && 'bg-green-100 text-green-700',
        status === 'failed' && 'bg-red-100 text-red-700',
        status === 'cancelled' && 'bg-red-100 text-red-700',
        status === 'pending' && 'bg-slate-200 text-slate-600',
        status === 'intake_sent' && 'bg-blue-100 text-blue-700',
        status === 'intake_done' && 'bg-amber-100 text-amber-700',
        status === 'approved' && 'bg-violet-100 text-violet-700',
        status === 'provisioning' && 'bg-blue-100 text-blue-700'
      )}
    >
      {label}
    </span>
  )
}

function SubmissionDetail({
  submission,
  adminPassword,
  onChanged,
}: {
  submission: Submission
  adminPassword: string
  onChanged: () => void
}) {
  const [busy, setBusy] = useState<
    null | 'approve' | 'approve_email' | 'resend' | 'intake' | 'payment_link'
  >(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const status = submission.status
  const hasNotes = Boolean(submission.layout_notes && submission.layout_notes.trim())

  const approve = async (sendEmail: boolean) => {
    setError(null)
    setSuccess(null)
    setBusy(sendEmail ? 'approve_email' : 'approve')
    try {
      const res = await fetch('/api/onboard/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({
          submissionId: submission.id,
          mode: 'approve_for_payment',
          sendEmail,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Approve failed')
      }
      if (data.emailError) {
        setSuccess(`Checkout link generated. ${data.emailError}`)
      } else if (sendEmail) {
        setSuccess('Approved — checkout link emailed to customer.')
      } else {
        setSuccess('Approved — checkout link generated. Use Resend Email when ready.')
      }
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approve failed')
    }
    setBusy(null)
  }

  const resendEmail = async () => {
    setError(null)
    setSuccess(null)
    setBusy('resend')
    try {
      const res = await fetch('/api/admin/send-checkout-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ submissionId: submission.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not send email')
      }
      setSuccess(`Email sent to ${submission.email}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send email')
    }
    setBusy(null)
  }

  const copyCheckout = async () => {
    if (!submission.checkout_url) return
    try {
      await navigator.clipboard.writeText(submission.checkout_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Ignore — user can still use the open-in-tab link
    }
  }

  const sendIntake = async () => {
    setError(null)
    setSuccess(null)
    setBusy('intake')
    try {
      const res = await fetch('/api/admin/send-intake-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ submission_id: submission.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not send intake link')
      }
      if (data.emailError) {
        setSuccess(
          `Intake URL ready (email failed: ${data.emailError}). Copy the link from the detail panel.`
        )
      } else {
        setSuccess(`Intake link sent to ${submission.email}.`)
      }
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send intake link')
    }
    setBusy(null)
  }

  const sendPaymentLink = async () => {
    // intake_done → /api/admin/send-payment-link
    setError(null)
    setSuccess(null)
    setBusy('payment_link')
    try {
      const res = await fetch('/api/admin/send-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ submission_id: submission.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not send payment link')
      }
      setSuccess(
        data.emailError
          ? `Checkout link generated (${data.emailError}). Use Resend if needed.`
          : `Payment link sent to ${submission.email}.`
      )
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send payment link')
    }
    setBusy(null)
  }

  return (
    <div className="space-y-4">
      {/* Detail */}
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <DetailRow label="Contact" value={submission.contact_name || '—'} />
        <DetailRow label="Email" value={submission.email} />
        <DetailRow label="Phone" value={submission.phone || '—'} />
        <DetailRow
          label="Plan"
          value={
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {submission.plan}
            </span>
          }
        />
        <DetailRow
          label="Layout"
          value={
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium capitalize">
                {submission.selected_layout || '—'}
              </span>
              {hasNotes && <StickyNote size={14} className="text-amber-600" />}
            </div>
          }
        />
        <DetailRow
          label="Submitted"
          value={new Date(submission.created_at).toLocaleString()}
        />
        {submission.approved_at && (
          <DetailRow
            label="Approved"
            value={new Date(submission.approved_at).toLocaleString()}
          />
        )}
      </div>

      {hasNotes && (
        <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">Layout notes</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {submission.layout_notes}
          </p>
        </div>
      )}

      {submission.business_description && (
        <div className="rounded-lg bg-slate-100 border border-slate-200 px-4 py-3">
          <p className="text-xs font-semibold text-slate-600 mb-1">
            Business description
          </p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {submission.business_description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-slate-200">
        {status === 'pending' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Two paths from here: send the customer the Step 2 intake form, or
              skip straight to a Stripe checkout link.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={sendIntake}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 cursor-pointer"
              >
                {busy === 'intake' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending intake link...
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    Send Intake Link
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => approve(true)}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-60 cursor-pointer"
              >
                {busy === 'approve_email' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating link...
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    Skip intake — Email Checkout
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => approve(false)}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
              >
                {busy === 'approve' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating link...
                  </>
                ) : (
                  'Approve (Manual Send)'
                )}
              </button>
            </div>
          </div>
        )}

        {status === 'intake_sent' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>
                Intake link sent
                {submission.intake_sent_at &&
                  ` ${new Date(submission.intake_sent_at).toLocaleString()}`}
                . Waiting on customer.
              </span>
            </div>
            {submission.intake_token && (
              <div className="flex items-stretch gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono break-all">
                  /intake/{submission.intake_token}
                </code>
              </div>
            )}
          </div>
        )}

        {status === 'intake_done' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Customer completed the intake form
              {submission.intake_completed_at &&
                ` at ${new Date(submission.intake_completed_at).toLocaleString()}`}
              . Generate a Stripe checkout link and send it.
            </p>
            <button
              type="button"
              onClick={sendPaymentLink}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 cursor-pointer"
            >
              {busy === 'payment_link' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating checkout...
                </>
              ) : (
                <>
                  <Mail size={14} />
                  Send Payment Link
                </>
              )}
            </button>
          </div>
        )}

        {status === 'approved' && (
          <div className="space-y-3">
            {submission.checkout_url ? (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Checkout URL
                </p>
                <div className="flex items-stretch gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono break-all">
                    {submission.checkout_url}
                  </code>
                  <button
                    type="button"
                    onClick={copyCheckout}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <a
                    href={submission.checkout_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink size={14} />
                    Open
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Generating checkout URL...
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={resendEmail}
                disabled={busy !== null || !submission.checkout_url}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 cursor-pointer"
              >
                {busy === 'resend' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    Resend Email to Customer
                  </>
                )}
              </button>
              {submission.approved_at && (
                <p className="text-xs text-slate-500">
                  Approved at {new Date(submission.approved_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {(status === 'paid' || status === 'provisioning') && (
          <div className="text-sm text-slate-600">
            <p>
              Customer paid. Provisioning is in progress — webhook + provision
              flow handles the rest.
            </p>
          </div>
        )}

        {status === 'live' && (
          <div className="text-sm text-slate-600 flex flex-wrap items-center gap-3">
            <span>Site is live.</span>
            {submission.client_live_url && (
              <a
                href={submission.client_live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <ExternalLink size={12} />
                {submission.client_live_url.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        )}
      </div>

      {(error || success) && (
        <div
          className={cn(
            'flex items-start gap-2 rounded-lg px-3 py-2 text-sm',
            error
              ? 'bg-red-50 border border-red-100 text-red-700'
              : 'bg-emerald-50 border border-emerald-100 text-emerald-700'
          )}
        >
          {error ? <AlertCircle size={14} className="mt-0.5" /> : <CheckCircle2 size={14} className="mt-0.5" />}
          <span>{error || success}</span>
        </div>
      )}
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs font-medium text-slate-500 w-20 shrink-0">
        {label}
      </span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
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
