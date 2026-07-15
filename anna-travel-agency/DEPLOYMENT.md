# 🚀 Anna Travel Agency — Deployment Guide

## Step 1: Domain ($12/year)

1. Go to [Namecheap](https://namecheap.com) or [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
2. Search for `annatravelagency.com`
3. Purchase (~$12/year on Namecheap, ~$10 on Cloudflare)
4. You'll configure DNS in Step 2

---

## Step 2: Deploy Frontend — Vercel (FREE)

1. Push this code to a **GitHub** repository
2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
3. Click **"New Project"** → Import your repo
4. Vercel auto-detects Vite — just click **Deploy**
5. Your site is live at `your-project.vercel.app`
6. Go to **Settings → Domains** → Add `annatravelagency.com`
7. Update your domain DNS to point to Vercel (they'll show instructions)

### Environment Variables in Vercel:
Go to **Settings → Environment Variables** and add:
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON = your-anon-key
VITE_STRIPE_PUBLIC_KEY = pk_live_your-key
```

---

## Step 3: Database — Supabase (FREE tier)

1. Go to [supabase.com](https://supabase.com) → Create account
2. Click **"New Project"** → Choose a name & password
3. Go to **SQL Editor** → Run the schema from `src/lib/supabase.ts`
4. Go to **Settings → API** → Copy URL and anon key
5. Add them to your `.env` file and Vercel env variables

### What you get free:
- 500MB database
- 50,000 monthly active users
- 1GB file storage
- Unlimited API requests

---

## Step 4: Payments — Stripe

1. Go to [stripe.com](https://stripe.com) → Create account
2. Complete business verification
3. Go to **Developers → API Keys**
4. Use **test keys** first (`pk_test_...`, `sk_test_...`)
5. Set `VITE_STRIPE_PUBLIC_KEY` in your env variables

### Backend for Stripe:
Stripe payments require a backend. Options:
- **Supabase Edge Functions** (free, recommended)
- **Vercel Serverless Functions** (free tier)
- **Railway** (free tier for Node.js backend)

See the backend code example in `src/lib/stripe.ts`

### Test Card Numbers:
| Card | Number |
|------|--------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| 3D Secure | 4000 0025 0000 3155 |

Use any future expiry date and any 3-digit CVV.

---

## Step 5: Email — Resend (FREE 3k/month)

1. Go to [resend.com](https://resend.com) → Create account
2. Verify your domain (`annatravelagency.com`)
3. Get your API key
4. Set up a **Supabase Edge Function** to send emails
5. See templates in `src/lib/email.ts`

### Emails sent automatically:
- ✅ Booking confirmation
- ✅ Welcome email on signup
- ✅ Contact form auto-reply
- ✅ Cancellation confirmation

---

## Step 6: Go Live Checklist

- [ ] Domain purchased and DNS configured
- [ ] Frontend deployed on Vercel
- [ ] Supabase project created with schema
- [ ] Replace localStorage with Supabase queries
- [ ] Stripe account verified + webhook configured
- [ ] Resend domain verified + edge function deployed
- [ ] Switch Stripe from test to live keys
- [ ] Test full booking flow end-to-end
- [ ] Add Google Analytics 4
- [ ] Submit sitemap to Google Search Console
- [ ] Create social media accounts
- [ ] Tell the world! 🎉

---

## Estimated Costs

| Service | Monthly Cost |
|---------|-------------|
| Domain | ~$1/mo ($12/yr) |
| Vercel (frontend) | **FREE** |
| Supabase (database) | **FREE** |
| Stripe | 2.9% + $0.30 per transaction |
| Resend (email) | **FREE** (3k emails/mo) |
| **Total fixed cost** | **~$1/month** |

You only pay Stripe fees when you actually make money! 🎉
