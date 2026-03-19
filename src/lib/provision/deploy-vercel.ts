const VERCEL_API = 'https://api.vercel.com'
const token = process.env.VERCEL_API_TOKEN
const accountId = process.env.VERCEL_ACCOUNT_ID

async function vercelFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${VERCEL_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data))
  return data
}

export async function createVercelProject(submission: {
  business_name: string
  email: string
  selected_theme?: string
}) {
  const slug = submission.business_name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30)

  const projectName = `cimaa-${slug}-${Date.now()}`

  // 1. Create new project linked to GitHub repo
  const project = await vercelFetch(`/v9/projects?teamId=${accountId}`, {
    method: 'POST',
    body: JSON.stringify({
      name: projectName,
      framework: 'nextjs',
      gitRepository: {
        type: 'github',
        repo: 'moyataebisso/arsi-platform',
      },
      rootDirectory: 'apps/starter-app',
      buildCommand: 'cd ../.. && turbo run build --filter={apps/starter-app}...',
    }),
  })

  // 2. Set environment variables
  const envVars = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL!, target: ['production', 'preview'], type: 'plain' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, target: ['production', 'preview'], type: 'plain' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY!, target: ['production', 'preview'], type: 'encrypted' },
    { key: 'NEXT_PUBLIC_APP_URL', value: `https://${projectName}.vercel.app`, target: ['production'], type: 'plain' },
    { key: 'RESEND_API_KEY', value: process.env.RESEND_API_KEY!, target: ['production'], type: 'encrypted' },
    { key: 'RESEND_FROM_EMAIL', value: process.env.RESEND_FROM_EMAIL!, target: ['production'], type: 'plain' },
    { key: 'RESEND_FROM_NAME', value: submission.business_name, target: ['production'], type: 'plain' },
    { key: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY!, target: ['production'], type: 'encrypted' },
    { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, target: ['production'], type: 'plain' },
    { key: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_ACCESS_KEY_ID', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_SECRET_ACCESS_KEY', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_ENDPOINT', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_BUCKET', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLIENT_SLUG', value: slug, target: ['production'], type: 'plain' },
    { key: 'CRON_SECRET', value: 'cimaa2026secret', target: ['production'], type: 'plain' },
    { key: 'DISCORD_WEBHOOK_DAILY_REPORTS', value: 'placeholder', target: ['production'], type: 'plain' },
  ]

  await vercelFetch(`/v10/projects/${project.id}/env?teamId=${accountId}`, {
    method: 'POST',
    body: JSON.stringify(envVars),
  })

  // 3. Trigger deployment
  const deployment = await vercelFetch(`/v13/deployments?teamId=${accountId}`, {
    method: 'POST',
    body: JSON.stringify({
      name: projectName,
      project: project.id,
      gitSource: {
        type: 'github',
        ref: 'main',
        repoId: 'moyataebisso/arsi-platform',
      },
    }),
  })

  // 4. Poll until deployment is ready
  const deploymentUrl = await waitForDeployment(deployment.id)

  return {
    projectId: project.id,
    projectName,
    deploymentUrl,
    previewUrl: `https://${deploymentUrl}`,
  }
}

async function waitForDeployment(
  deploymentId: string,
  maxAttempts: number = 40
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 15000))

    const deployment = await vercelFetch(`/v13/deployments/${deploymentId}`)

    if (deployment.status === 'READY') {
      return deployment.url
    }

    if (deployment.status === 'ERROR') {
      throw new Error('Deployment failed on Vercel')
    }
  }
  throw new Error('Deployment timed out after 10 minutes')
}
