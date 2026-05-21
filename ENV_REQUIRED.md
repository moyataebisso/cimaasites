# Required Environment Variables

All variables needed in `.env.local` (and Vercel project settings).

## Supabase

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (Settings > API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (Settings > API) — server-side only |

## Stripe

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (Developers > API keys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (Developers > API keys) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (Developers > Webhooks > signing secret) |
| `STRIPE_BASIC_SETUP_PRICE_ID` | Stripe Price ID for Basic plan setup fee ($599 one-time) |
| `STRIPE_BASIC_MONTHLY_PRICE_ID` | Stripe Price ID for Basic plan ($299/mo subscription) |
| `STRIPE_PRO_SETUP_PRICE_ID` | Stripe Price ID for Pro plan setup fee ($599 one-time) |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe Price ID for Pro plan ($399/mo subscription) |
| `STRIPE_DEVELOPER_PRICE_ID` | Stripe Price ID for Developer plan ($49.99 one-time payment) |

## Anthropic (Claude AI)

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (console.anthropic.com > API Keys) |

## Resend (Email)

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key (resend.com > API Keys) |
| `RESEND_FROM_EMAIL` | Verified sender email (e.g. `noreply@wajiiwebsites.com`) |

## Vercel (Auto-provisioning)

| Variable | Description |
|----------|-------------|
| `VERCEL_API_TOKEN` | Vercel personal access token (vercel.com/account/tokens) |
| `VERCEL_ACCOUNT_ID` | Vercel team/account ID (Settings > General > Team ID) |

## App

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Full app URL (e.g. `https://wajiiwebsites.com` or `http://localhost:3000`) |
| `ADMIN_PASSWORD` | Password for the /admin dashboard |

## Optional

| Variable | Description |
|----------|-------------|
| `UNSPLASH_ACCESS_KEY` | Unsplash API key for stock photos (optional, defaults to 'placeholder') |
