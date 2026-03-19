'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

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

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)

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
        setAuthenticated(true)
      } else {
        alert('Wrong password')
      }
    } catch {
      alert('Error loading data')
    }
    setLoading(false)
  }

  const totalRevenue = clients.reduce((sum, c) => sum + (c.monthly_revenue_cents || 0), 0)

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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Cimaa Admin Dashboard</h1>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Clients" value={String(clients.length)} />
          <StatCard
            label="Monthly Revenue"
            value={`$${(totalRevenue / 100).toFixed(2)}`}
          />
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
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          s.status === 'live' && 'bg-green-100 text-green-700',
                          s.status === 'preview' && 'bg-blue-100 text-blue-700',
                          s.status === 'paid' && 'bg-amber-100 text-amber-700',
                          s.status === 'failed' && 'bg-red-100 text-red-700',
                          s.status === 'pending' && 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {s.status}
                      </span>
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
