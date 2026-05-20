import { generateSlug } from './slug'

const VERCEL_API = 'https://api.vercel.com'

// Single source of truth for the starter-app repo we deploy from.
const TEMPLATE_REPO = 'moyataebisso/arsi-platform'
const TEMPLATE_BRANCH = 'main'

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

// Vercel's /v13/deployments endpoint requires gitSource.repoId to be the
// NUMERIC GitHub repo ID — string path is rejected with "missing required
// property `repoId`". /v9/projects accepts the string `repo` field, so we
// only need the numeric id at deployment trigger time.
//
// Public repos work without a token (60 req/hr per IP). If GITHUB_TOKEN is
// set, the limit jumps to 5000/hr and it covers private repos.
async function getGitHubRepoId(repo: string): Promise<number> {
  const ghToken = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (ghToken) {
    headers['Authorization'] = `Bearer ${ghToken}`
  }

  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers })

  if (res.status === 404) {
    console.error(
      '[provision] github repo not found — may be private (set GITHUB_TOKEN with `repo` scope) or repo path wrong',
      { repo, hadToken: !!ghToken }
    )
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(
      `GitHub API error (${res.status} fetching ${repo}): ${body}`
    )
  }

  const data = (await res.json()) as { id: number }
  console.log('[provision] resolved github repo id', { repo, id: data.id })
  return data.id
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
  const projectName = `waji-${slug}-${Date.now()}`

  // 1. Create project from same GitHub repo
  const project = await vercelFetch('/v9/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: projectName,
      framework: 'nextjs',
      gitRepository: {
        type: 'github',
        repo: TEMPLATE_REPO,
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

  // Resolve numeric GitHub repo ID — /v13/deployments rejects the string path.
  const repoIdNumeric = await getGitHubRepoId(TEMPLATE_REPO)

  // 3. Trigger deployment
  const deployBody = {
    name: projectName,
    project: project.id,
    target: 'production',
    gitSource: {
      type: 'github',
      ref: TEMPLATE_BRANCH,
      repoId: repoIdNumeric,
    },
  }
  console.log('[provision] vercel deploy request', {
    project: project.id,
    gitSource: deployBody.gitSource,
    target: deployBody.target,
  })
  const deployment = await vercelFetch('/v13/deployments', {
    method: 'POST',
    body: JSON.stringify(deployBody),
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
