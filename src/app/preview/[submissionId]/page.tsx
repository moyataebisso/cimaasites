'use client'

import { useEffect, useState, use } from 'react'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const themes = [
  'warm', 'ocean', 'forest', 'lavender', 'rose', 'sand',
  'sky', 'mint', 'peach', 'steel', 'coral', 'sage',
  'midnight', 'charcoal', 'noir', 'slate',
  'sunset', 'aurora', 'candy', 'electric',
]

export default function PreviewPage({
  params,
}: {
  params: Promise<{ submissionId: string }>
}) {
  const { submissionId } = use(params)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [showChangesModal, setShowChangesModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [approveResult, setApproveResult] = useState<{
    liveUrl: string
    adminUrl: string
    adminEmail: string
    adminPassword: string
  } | null>(null)
  const [changeRequest, setChangeRequest] = useState('')
  const [changeSent, setChangeSent] = useState(false)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    fetch(`/api/onboard/status/${submissionId}`)
      .then((r) => r.json())
      .then((data) => {
        setPreviewUrl(data.submission?.client_preview_url || null)
        setBusinessName(data.submission?.business_name || '')
      })
  }, [submissionId])

  const handleChangeTheme = async (theme: string) => {
    await fetch('/api/onboard/update-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, theme }),
    })
    setShowThemePanel(false)
    // Reload iframe
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
    if (iframe) iframe.src = iframe.src
  }

  const handleApprove = async () => {
    setApproving(true)
    try {
      const res = await fetch('/api/onboard/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }),
      })
      const data = await res.json()
      setApproveResult(data)
    } catch (err) {
      console.error('Approve error:', err)
    }
    setApproving(false)
  }

  if (approveResult) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Container className="max-w-lg text-center">
          <div className="text-6xl mb-4">&#127881;</div>
          <h1 className="text-3xl font-bold text-slate-900">Your website is LIVE!</h1>
          <p className="mt-4 text-slate-600">
            <strong>{businessName}</strong> is now live on the internet.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Live URL</p>
              <a href={approveResult.liveUrl} className="text-blue-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
                {approveResult.liveUrl}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Admin Panel</p>
              <a href={approveResult.adminUrl} className="text-blue-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
                {approveResult.adminUrl}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Admin Login</p>
              <p className="text-sm text-slate-700">Email: {approveResult.adminEmail}</p>
              <p className="text-sm text-slate-700">Password: {approveResult.adminPassword}</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            You can connect a custom domain from your admin panel.
          </p>
        </Container>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <Container>
          <div className="flex items-center justify-between h-14 gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Waji
              </span>
              <Badge variant="blue" className="hidden sm:inline-flex">Preview Mode</Badge>
            </div>
            <span className="hidden lg:block text-sm font-medium text-slate-700 truncate">
              {businessName}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="hidden sm:block px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
              >
                Theme
              </button>
              <button
                onClick={() => setShowChangesModal(true)}
                className="hidden sm:block px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
              >
                Changes
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-700 hover:to-violet-700 transition-colors cursor-pointer"
              >
                &#10003; Go Live
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Theme panel */}
      {showThemePanel && (
        <div className="fixed top-14 right-0 w-80 h-[calc(100vh-56px)] bg-white border-l border-slate-200 shadow-xl z-40 overflow-y-auto p-4">
          <h3 className="font-bold text-slate-900 mb-4">Choose Theme</h3>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => handleChangeTheme(t)}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-blue-500 transition-colors capitalize"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Changes modal */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            {changeSent ? (
              <div className="text-center">
                <p className="text-2xl mb-2">&#10003;</p>
                <h3 className="font-bold text-lg">Request sent!</h3>
                <p className="text-sm text-slate-500 mt-2">
                  We&apos;ll update your site within 24 hours.
                </p>
                <button
                  onClick={() => { setShowChangesModal(false); setChangeSent(false) }}
                  className="mt-4 px-4 py-2 text-sm font-medium bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-4">What would you like to change?</h3>
                <textarea
                  value={changeRequest}
                  onChange={(e) => setChangeRequest(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm resize-none"
                  rows={4}
                  placeholder="Describe the changes you'd like..."
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowChangesModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setChangeSent(true)}
                    className="flex-1 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Approve modal */}
      {showApproveModal && !approveResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-2">Ready to go live?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Your website will be live at:
              <br />
              <strong>{previewUrl}</strong>
            </p>
            <p className="text-xs text-slate-400 mb-6">
              You can connect a custom domain from your admin panel.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg"
              >
                Not yet
              </button>
              <button
                onClick={handleApprove}
                disabled={approving}
                className={cn(
                  'flex-1 px-4 py-2 text-sm font-bold text-white rounded-lg',
                  approving ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                )}
              >
                {approving ? 'Going live...' : 'Yes, Go Live!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview iframe */}
      <div className="flex-1 pt-14">
        {previewUrl ? (
          <iframe
            id="preview-iframe"
            src={previewUrl}
            className="w-full h-[calc(100vh-56px)] border-0"
            title="Website Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Loading preview...
          </div>
        )}
      </div>
    </main>
  )
}
