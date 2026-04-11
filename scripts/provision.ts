#!/usr/bin/env tsx
// ─────────────────────────────────────────
// CIMAA SITES PRICING — April 2026
// ─────────────────────────────────────────
// Setup fee:      $599 one-time
//                 Includes first month
//                 Triggers full provisioning
//
// Basic monthly:  $299/mo from month 2
// Pro monthly:    $399/mo from month 2
//
// Promo (first 3 months after setup):
//   Basic promo:  $249/mo x3 then $299
//   Pro promo:    $299/mo x3 then $399
//
// Grandfathered:  $100/mo (4 existing clients)
//                 Never changes
//
// Developer:      $49.99 one-time, no monthly
// ─────────────────────────────────────────
import 'dotenv/config'
import { input, select, confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import ora from 'ora'
import { createClient } from '@supabase/supabase-js'
import {
  generateSchemaName,
  createClientSchema,
  runSchemaSQL,
  seedClientData,
  createAdminUser,
} from './lib/supabase-mgmt'
import { createClientVercelProject } from './lib/vercel-deploy'

// Dynamically import ESM modules used by the Next.js app
async function getGenerateContent() {
  const mod = await import('../src/lib/provision/generate-content')
  return mod.generateContent
}

async function getEmailFunctions() {
  const mod = await import('../src/lib/emails')
  return {
    sendPreviewReadyEmail: mod.sendPreviewReadyEmail,
    sendYouNewClientEmail: mod.sendYouNewClientEmail,
  }
}

// Validate env vars
const requiredEnvs = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'VERCEL_API_TOKEN',
  'VERCEL_ACCOUNT_ID',
  'RESEND_API_KEY',
]

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(chalk.red(`Missing required env var: ${env}`))
    process.exit(1)
  }
}

async function main() {
  console.log('\n' + chalk.bold.blue('═══════════════════════════════'))
  console.log(chalk.bold.blue('  CIMAA SITES — PROVISIONING'))
  console.log(chalk.bold.blue('═══════════════════════════════') + '\n')

  // ── COLLECT INFO ──────────────────────────────
  const businessName = await input({
    message: 'Business name?',
    validate: (v) => v.length > 1 || 'Required',
  })

  const businessType = await select({
    message: 'Business type?',
    choices: [
      { value: 'Hair Salon', name: 'Hair Salon' },
      { value: 'Restaurant', name: 'Restaurant' },
      { value: 'Healthcare/Clinic', name: 'Healthcare/Clinic' },
      { value: 'Church/Nonprofit', name: 'Church/Nonprofit' },
      { value: 'Transportation', name: 'Transportation' },
      { value: 'Retail Store', name: 'Retail Store' },
      { value: 'Fitness/Gym', name: 'Fitness/Gym' },
      { value: 'Beauty/Spa', name: 'Beauty/Spa' },
      { value: 'Auto Services', name: 'Auto Services' },
      { value: 'Other', name: 'Other' },
    ],
  })

  const email = await input({
    message: 'Client email address?',
    validate: (v) => v.includes('@') || 'Enter valid email',
  })

  const phone = await input({
    message: 'Phone number? (optional)',
  })

  const tagline = await input({
    message: 'Tagline? (optional)',
  })

  const theme = await select({
    message: 'Which theme?',
    choices: [
      { value: 'warm', name: 'Warm (orange/gold)' },
      { value: 'corporate', name: 'Corporate (blue)' },
      { value: 'bold', name: 'Bold (dark)' },
      { value: 'nature', name: 'Nature (green)' },
      { value: 'luxury', name: 'Luxury (gold/black)' },
      { value: 'ocean', name: 'Ocean (teal)' },
      { value: 'mint', name: 'Mint (teal/white)' },
      { value: 'rose', name: 'Rose (pink/red)' },
      { value: 'sunset', name: 'Sunset (coral/orange)' },
    ],
  })

  const plan = await select({
    message: 'Which plan?',
    choices: [
      { value: 'basic', name: 'Basic — $599 setup + $299/mo' },
      { value: 'pro', name: 'Pro — $599 setup + $399/mo' },
    ],
  })

  const enableBooking =
    plan === 'pro'
      ? await confirm({ message: 'Enable booking module?', default: true })
      : false

  const enableShop =
    plan === 'pro'
      ? await confirm({ message: 'Enable shop/ecommerce module?', default: false })
      : false

  const enableBlog =
    plan === 'pro'
      ? await confirm({ message: 'Enable blog module?', default: false })
      : false

  // ── CONFIRM ────────────────────────────────────
  console.log('\n' + chalk.bold('Summary:'))
  console.log(chalk.gray('─────────────────────────'))
  console.log(`Business: ${chalk.white(businessName)}`)
  console.log(`Type:     ${chalk.white(businessType)}`)
  console.log(`Email:    ${chalk.white(email)}`)
  console.log(`Theme:    ${chalk.white(theme)}`)
  console.log(`Plan:     ${chalk.white(plan)}`)
  console.log(`Booking:  ${enableBooking ? chalk.green('✓') : chalk.gray('✗')}`)
  console.log(`Shop:     ${enableShop ? chalk.green('✓') : chalk.gray('✗')}`)
  console.log(`Blog:     ${enableBlog ? chalk.green('✓') : chalk.gray('✗')}`)
  console.log(chalk.gray('─────────────────────────') + '\n')

  const proceed = await confirm({
    message: 'Provision this client?',
    default: true,
  })

  if (!proceed) {
    console.log(chalk.yellow('Cancelled.'))
    process.exit(0)
  }

  // ── PROVISION ──────────────────────────────────
  const schemaName = generateSchemaName(businessName)
  const projectName = `cimaa-${schemaName.replace('client_', '')}-${Date.now()}`

  let adminPassword = ''
  let previewUrl = ''

  console.log()

  // STEP A — Create schema
  const spinnerA = ora('Creating client database schema...').start()
  try {
    await createClientSchema(schemaName)
    await runSchemaSQL(schemaName)
    spinnerA.succeed(chalk.green(`Schema created: ${schemaName}`))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    spinnerA.fail(chalk.red(`Schema creation failed: ${msg}`))
    process.exit(1)
  }

  // STEP B — Generate content with Claude AI
  const spinnerB = ora('Generating website content with AI...').start()
  let content: {
    heroHeadline: string
    heroSubheading: string
    aboutText: string
    metaTitle: string
    metaDescription: string
    services: Array<{ name: string; description: string }>
  }
  try {
    const generateContent = await getGenerateContent()
    content = await generateContent({
      business_name: businessName,
      business_type: businessType,
      business_description: tagline || `Professional ${businessType} services`,
      tagline,
      services: [],
      city: '',
      state: '',
    })
    spinnerB.succeed(chalk.green('AI content generated'))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    spinnerB.warn(chalk.yellow(`AI content failed (using defaults): ${msg}`))
    content = {
      heroHeadline: `Welcome to ${businessName}`,
      heroSubheading: tagline || `Professional ${businessType} services`,
      aboutText: `We are ${businessName}, your trusted ${businessType}.`,
      metaTitle: `${businessName} - ${businessType}`,
      metaDescription: `${businessName} - professional ${businessType} services`,
      services: [],
    }
  }

  // STEP C — Seed database
  const spinnerC = ora('Seeding business data...').start()
  try {
    await seedClientData(schemaName, {
      businessName,
      businessType,
      phone,
      email,
      address: '',
      tagline: tagline || content.heroSubheading,
      theme,
      heroHeadline: content.heroHeadline,
      heroSubheading: content.heroSubheading,
      aboutText: content.aboutText,
    })
    spinnerC.succeed(chalk.green('Business data seeded'))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    spinnerC.fail(chalk.red(`Seeding failed: ${msg}`))
    process.exit(1)
  }

  // STEP D — Create admin user
  const spinnerD = ora('Creating admin login...').start()
  try {
    const result = await createAdminUser(email, businessName)
    adminPassword = result.password
    spinnerD.succeed(chalk.green(`Admin user created: ${email}`))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    spinnerD.warn(chalk.yellow(`Admin user warning: ${msg}`))
    adminPassword = 'Please use forgot password to set'
  }

  // STEP E — Deploy to Vercel
  const spinnerE = ora('Deploying to Vercel (this takes 3-8 min)...').start()
  try {
    const result = await createClientVercelProject(
      projectName,
      schemaName,
      businessName,
      email,
      theme,
      { booking: enableBooking, ecommerce: enableShop, blog: enableBlog }
    )
    previewUrl = `https://${result.deploymentUrl}`
    spinnerE.succeed(chalk.green(`Deployed: ${previewUrl}`))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    spinnerE.fail(chalk.red(`Deployment failed: ${msg}`))
    console.log(chalk.yellow('\nYou can deploy manually:'))
    console.log(chalk.gray(`Schema: ${schemaName}`))
    console.log(chalk.gray(`Project name: ${projectName}`))
    process.exit(1)
  }

  // STEP F — Register in cimaasites clients table
  const spinnerF = ora('Registering client...').start()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.schema('cimaasites' as any) as any).from('clients').insert({
      business_name: businessName,
      email,
      plan,
      status: 'active',
      monthly_revenue_cents: plan === 'pro' ? 39900 : 29900,
      live_url: previewUrl,
      admin_url: `${previewUrl}/admin`,
      domain: `${projectName}.vercel.app`,
    })
    spinnerF.succeed(chalk.green('Registered in Cimaa Sites admin'))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    spinnerF.warn(chalk.yellow(`Registration warning: ${msg}`))
  }

  // STEP G — Send emails
  const spinnerG = ora('Sending welcome email...').start()
  try {
    const { sendPreviewReadyEmail, sendYouNewClientEmail } = await getEmailFunctions()
    await sendPreviewReadyEmail({
      email,
      businessName,
      previewUrl,
      adminEmail: email,
      adminPassword,
      submissionId: schemaName,
    })
    await sendYouNewClientEmail({
      businessName,
      email,
      plan,
      revenue: plan === 'pro' ? '$399/mo' : '$299/mo',
    })
    spinnerG.succeed(chalk.green('Welcome email sent'))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    spinnerG.warn(chalk.yellow(`Email warning: ${msg}`))
  }

  // ── DONE ───────────────────────────────────────
  console.log('\n' + chalk.bold.green('═══════════════════════════════'))
  console.log(chalk.bold.green('  PROVISIONING COMPLETE'))
  console.log(chalk.bold.green('═══════════════════════════════') + '\n')

  console.log(chalk.bold('Client Details:'))
  console.log(chalk.gray('─────────────────────────'))
  console.log(`Business:  ${chalk.white(businessName)}`)
  console.log(`Schema:    ${chalk.white(schemaName)}`)
  console.log(`Site URL:  ${chalk.cyan(previewUrl)}`)
  console.log(`Admin URL: ${chalk.cyan(previewUrl + '/admin')}`)
  console.log(`Email:     ${chalk.white(email)}`)
  console.log(`Password:  ${chalk.white(adminPassword)}`)
  console.log(`Plan:      ${chalk.white(plan)} (${plan === 'pro' ? '$399' : '$299'}/mo)`)
  console.log(chalk.gray('─────────────────────────'))
  console.log(chalk.gray('\nNext: Send Stripe invoice + add custom domain'))
  console.log()
}

main().catch((e) => {
  console.error(chalk.red('\nProvisioning failed:'), e.message)
  process.exit(1)
})
