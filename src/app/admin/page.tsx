'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

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

type Tab = 'overview' | 'requests'

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

  const loadRequests = async (pw?: string, filter?: string) => {
    setRequestsLoading(true)
    try {
      const f = filter ?? requestsFilter
      const res = await fetch(`/api/admin/change-requests?status=${f}`, {
        headers: { 'x-admin-password': pw || storedPassword },
      })
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
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Cimaa Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-slate-200">
          <button
            onClick={() => setTab('overview')}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setTab('requests')
              if (requests.length === 0) loadRequests()
            }}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2',
              tab === 'requests'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            Change Requests
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {tab === 'overview' && (
          <>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <StatCard label="Total Clients" value={String(clients.length)} />
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

        {tab === 'requests' && (
          <>
            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-6">
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
                        <span className="text-sm font-bold text-slate-900">
                          {req.business_name || 'Unknown'}
                        </span>
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

                    {/* Admin notes (expanded) */}
                    {expandedRequest === req.id && req.admin_notes && (
                      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Admin Notes</p>
                        <p className="text-sm text-slate-700">{req.admin_notes}</p>
                      </div>
                    )}

                    {/* Edit form */}
                    {editingRequest === req.id && (
                      <div className="px-6 py-4 bg-blue-50/50 border-t border-slate-100 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Status
                          </label>
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
                            Saving as &quot;Done&quot; will send a notification email to {req.client_email}
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
      </Container>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
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
