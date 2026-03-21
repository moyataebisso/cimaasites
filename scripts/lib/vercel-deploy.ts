import * as https from 'https'

const TEMPLATE_REPO = 'moyataebisso/arsi-platform'

function getToken() {
  return process.env.VERCEL_API_TOKEN!
}
function getAccountId() {
  return process.env.VERCEL_ACCOUNT_ID!
}

function vercelAPI(method: string, path: string, body?: unknown): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined
    const options = {
      hostname: 'api.vercel.com',
      path: `${path}?teamId=${getAccountId()}`,
      method,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': String(Buffer.byteLength(data)) } : {}),
      },
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      res.on('data', (chunk) => (responseData += chunk))
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData)
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(parsed.error?.message || responseData))
          } else {
            resolve(parsed)
          }
        } catch {
          resolve(responseData)
        }
      })
    })

    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

export async function createClientVercelProject(
  projectName: string,
  schemaName: string,
  businessName: string,
  email: string,
  theme: string,
  enabledModules: Record<string, boolean>
): Promise<{ projectId: string; deploymentUrl: string }> {
  // 1. Create Vercel project
  const project = await vercelAPI('POST', '/v9/projects', {
    name: projectName,
    framework: 'nextjs',
    gitRepository: {
      type: 'github',
      repo: TEMPLATE_REPO,
    },
    rootDirectory: 'apps/starter-app',
    buildCommand: 'cd ../.. && turbo run build --filter={apps/starter-app}...',
  })

  const projectId = project.id

  // 2. Set environment variables
  const envVars = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL!, target: ['production', 'preview'], type: 'plain' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, target: ['production', 'preview'], type: 'plain' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY!, target: ['production'], type: 'encrypted' },
    { key: 'SUPABASE_SCHEMA', value: schemaName, target: ['production', 'preview'], type: 'plain' },
    { key: 'NEXT_PUBLIC_SUPABASE_SCHEMA', value: schemaName, target: ['production', 'preview'], type: 'plain' },
    { key: 'NEXT_PUBLIC_APP_URL', value: `https://${projectName}.vercel.app`, target: ['production'], type: 'plain' },
    { key: 'RESEND_API_KEY', value: process.env.RESEND_API_KEY!, target: ['production'], type: 'encrypted' },
    { key: 'RESEND_FROM_EMAIL', value: process.env.RESEND_FROM_EMAIL!, target: ['production'], type: 'plain' },
    { key: 'RESEND_FROM_NAME', value: businessName, target: ['production'], type: 'plain' },
    { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder', target: ['production'], type: 'plain' },
    { key: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', target: ['production'], type: 'encrypted' },
    { key: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_ACCESS_KEY_ID', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_SECRET_ACCESS_KEY', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_ENDPOINT', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLOUDFLARE_R2_BUCKET', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'CLIENT_SLUG', value: schemaName.replace('client_', ''), target: ['production'], type: 'plain' },
    { key: 'CRON_SECRET', value: 'cimaa2026secret', target: ['production'], type: 'plain' },
    { key: 'DISCORD_WEBHOOK_DAILY_REPORTS', value: 'placeholder', target: ['production'], type: 'plain' },
    { key: 'UNSPLASH_ACCESS_KEY', value: process.env.UNSPLASH_ACCESS_KEY || 'placeholder', target: ['production'], type: 'plain' },
    { key: 'ANTHROPIC_API_KEY', value: process.env.ANTHROPIC_API_KEY || 'placeholder', target: ['production'], type: 'plain' },
  ]

  await vercelAPI('POST', `/v10/projects/${projectId}/env`, envVars)

  // 3. Trigger deployment
  const deployment = await vercelAPI('POST', '/v13/deployments', {
    name: projectName,
    project: projectId,
    gitSource: {
      type: 'github',
      ref: 'main',
      repoId: TEMPLATE_REPO,
    },
  })

  // 4. Poll until ready
  const deploymentUrl = await waitForDeployment(deployment.id)

  return { projectId, deploymentUrl }
}

async function waitForDeployment(
  deploymentId: string,
  maxAttempts = 40
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 15000))
    const d = await vercelAPI('GET', `/v13/deployments/${deploymentId}`)
    if (d.readyState === 'READY') return d.url
    if (d.readyState === 'ERROR' || d.readyState === 'CANCELED') {
      throw new Error(`Deployment failed: ${d.readyState}`)
    }
  }
  throw new Error('Deployment timed out')
}
