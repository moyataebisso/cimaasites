'use client'

import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Circle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface StatusData {
  submission: {
    status: string
    current_step: string
    progress: number
    business_name: string
    client_preview_url: string
    error_message?: string
  }
  logs: Array<{
    step: string
    status: string
    message: string
    completed_at: string
  }>
}

const buildSteps = [
  { key: 'payment_received', label: 'Payment received' },
  { key: 'generating_content', label: 'Generating your content' },
  { key: 'creating_vercel_project', label: 'Building your website' },
  { key: 'setting_up_domain', label: 'Setting up your domain' },
  { key: 'sending_preview', label: 'Sending your preview' },
  { key: 'complete', label: 'Complete!' },
]

const funMessages = [
  'Setting up your database...',
  'Writing your homepage copy...',
  'Choosing the perfect layout...',
  'Optimizing for mobile...',
  'Configuring your admin panel...',
  'Almost there...',
]

export default function BuildingPage({
  params,
}: {
  params: Promise<{ submissionId: string }>
}) {
  const { submissionId } = use(params)
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/onboard/status/${submissionId}`)
        const data = await res.json()
        setStatusData(data)
      } catch (err) {
        console.error('Status fetch error:', err)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [submissionId])

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % funMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const isComplete = statusData?.submission?.status === 'preview'
  const isFailed = statusData?.submission?.status === 'failed'
  const progress = statusData?.submission?.progress || 0
  const completedSteps = new Set(
    statusData?.logs?.filter((l) => l.status === 'done').map((l) => l.step) || []
  )
  const runningSteps = new Set(
    statusData?.logs?.filter((l) => l.status === 'running').map((l) => l.step) || []
  )

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <Container className="max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Wajii
          </span>

          {isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="mt-8"
            >
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                <Check size={40} className="text-white" />
              </div>
              <h1 className="mt-6 text-3xl font-bold text-slate-900">
                Your website is ready to preview!
              </h1>
              <p className="mt-2 text-slate-500">
                {statusData?.submission?.business_name}
              </p>
              <div className="mt-8">
                <Button
                  href={`/preview/${submissionId}`}
                  size="lg"
                >
                  View Your Website Preview
                </Button>
              </div>
            </motion.div>
          ) : isFailed ? (
            <div className="mt-8">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <span className="text-3xl">&#9888;</span>
              </div>
              <h1 className="mt-6 text-2xl font-bold text-slate-900">
                Something went wrong
              </h1>
              <p className="mt-2 text-slate-500">
                {statusData?.submission?.error_message ||
                  "We hit a snag. Don't worry — we've been notified and will fix this."}
              </p>
              <p className="mt-4 text-sm text-slate-600">
                Something went wrong. Email us at{' '}
                <a href="mailto:arsitechgroup@gmail.com" className="text-blue-600 font-medium hover:underline">
                  arsitechgroup@gmail.com
                </a>{' '}
                and we will fix it within 1 hour.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8">
                <Loader2 size={48} className="text-blue-600 animate-spin mx-auto" />
              </div>

              <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-slate-900">
                Building {statusData?.submission?.business_name || 'your'} website...
              </h1>

              <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden max-w-xs mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-400">
                ~{Math.max(1, Math.ceil((100 - progress) / 25))} minutes remaining
              </p>

              <div className="mt-8 text-left space-y-3">
                {buildSteps.map((step) => {
                  const done = completedSteps.has(step.key)
                  const running = runningSteps.has(step.key)
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      {done ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      ) : running ? (
                        <Loader2 size={20} className="text-blue-600 animate-spin" />
                      ) : (
                        <Circle size={20} className="text-slate-300" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          done ? 'text-green-700 font-medium' : running ? 'text-blue-600 font-medium' : 'text-slate-400'
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-sm text-slate-400 italic"
              >
                {funMessages[msgIndex]}
              </motion.p>
            </>
          )}
        </motion.div>
      </Container>
    </main>
  )
}
