'use client'

import { useEffect, useState, use } from 'react'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'

export default function PreviewPage({
  params,
}: {
  params: Promise<{ submissionId: string }>
}) {
  const { submissionId } = use(params)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')

  useEffect(() => {
    fetch(`/api/onboard/status/${submissionId}`)
      .then((r) => r.json())
      .then((data) => {
        setPreviewUrl(data.submission?.client_preview_url || null)
        setBusinessName(data.submission?.business_name || '')
      })
  }, [submissionId])

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <Container>
          <div className="flex items-center justify-between h-14 gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Wajii
              </span>
              <Badge variant="blue" className="hidden sm:inline-flex">Preview Mode</Badge>
            </div>
            <span className="hidden lg:block text-sm font-medium text-slate-700 truncate">
              {businessName}
            </span>
          </div>
        </Container>
      </div>

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
