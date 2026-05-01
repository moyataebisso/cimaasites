import { generateSlug } from './slug'

const VERCEL_API = 'https://api.vercel.com'

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

// Build a Vercel API URL with the correct teamId scope. Pro/Team accounts
// reject calls without ?teamId — we'd see 401 "Not authorized" otherwise.
// Prefer VERCEL_TEAM_ID; fall back to legacy VERCEL_ACCOUNT_ID so a deploy
// mid-rollout doesn't break.
function vercelUrl(path: string, additionalParams?: Record<string, string>): string {
  const url = new URL(`${VERCEL_API}${path}`)
  const teamId = process.env.VERCEL_TEAM_ID || process.env.VERCEL_ACCOUNT_ID
  if (teamId) {
    url.searchParams.set('teamId', teamId)
  }
  for (const [k, v] of Object.entries(additionalParams || {})) {
    url.searchParams.set(k, v)
  }
  return url.toString()
}

async function vercelFetch(path: string, options: RequestInit = {}) {
  const url = vercelUrl(path)
  const method = options.method || 'GET'
  console.log('[provision] vercel call', { url, method })

  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      `Vercel API error (${res.status} on ${method} ${path}): ${data.error?.message || JSON.stringify(data)}`
    )
  }

  return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createVercelProject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submission: any,
  schemaName: string
) {
  const slug = generateSlug(submission.business_name)
  const projectName = `cimaa-${slug}-${Date.now()}`

  // 1. Create project from same GitHub repo
  const project = await vercelFetch('/v9/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: projectName,
      framework: 'nextjs',
      gitRepository: {
        type: 'github',
        repo: 'moyataebisso/arsi-platform',
      },
      rootDirectory: 'apps/starter-app',
      buildCommand:
        'cd ../.. && turbo run build --filter={apps/starter-app}...',
    }),
  })

  // 2. Set all environment variables
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
    // SUPABASE_SCHEMA is read by the starter-app's getAdminClient() to scope
    // all queries to this customer's isolated schema. Pre-multi-tenant
    // deployments (no schemaName) silently fall back to 'public' on the
    // starter side, so we keep them working by setting a sensible default.
    { key: 'SUPABASE_SCHEMA', value: schemaName, target: ['production', 'preview'], type: 'plain' },
    { key: 'CRON_SECRET', value: 'cimaa2026secret', target: ['production'], type: 'plain' },
    { key: 'DISCORD_WEBHOOK_DAILY_REPORTS', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'UNSPLASH_ACCESS_KEY', value: process.env.UNSPLASH_ACCESS_KEY || 'placeholder', target: ['production'], type: 'plain' },
  ]

  await vercelFetch(`/v10/projects/${project.id}/env`, {
    method: 'POST',
    body: JSON.stringify(envVars),
  })

  // 3. Trigger deployment
  const deployment = await vercelFetch('/v13/deployments', {
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

  // 4. Poll until deployment ready (max 10 min)
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
  maxAttempts = 40
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 15000))

    const deployment = await vercelFetch(`/v13/deployments/${deploymentId}`)

    if (deployment.readyState === 'READY') {
      return deployment.url
    }

    if (
      deployment.readyState === 'ERROR' ||
      deployment.readyState === 'CANCELED'
    ) {
      throw new Error(
        `Deployment failed with state: ${deployment.readyState}`
      )
    }
  }

  throw new Error('Deployment timed out after 10 minutes')
}
