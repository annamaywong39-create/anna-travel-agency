# Authorized Security Assessment — Anna Travel Agency
**Target:** codebase `anna-travel-luxury` (www.annatravelagency.com)
**Date:** 2026-08-21
**Tester:** Authorized white-hat (non-destructive code review + config analysis)
**Scope:** `/src`, `/supabase`, `vercel.json`, `vite.config.ts`, public assets

> No data deleted, no DoS, no personal data retained. All findings from static analysis of provided repo + build output.

---

## Executive Summary

The site has **solid baseline hardening** for a Supabase SPA:
- Security headers in `vercel.json` (HSTS 2y + preload, nosniff, DENY framing, Referrer-Policy, Permissions-Policy, CSP)
- RLS enabled on all tables with policies
- Supabase JS client uses parameterized queries (no SQLi)
- No `.env` in public, robots disallows `/admin`

**But 2 critical design flaws allow full admin takeover if misconfigured:**
1. **Demo Mode fallback** (`isSupabaseConfigured=false`) allows any email/password to create a user, and `email.includes('admin')` → admin role. If env vars missing in Vercel, production becomes wide-open.
2. **Profiles RLS allows self-promotion to admin** — `update own profile` policy has no column check, so authenticated user can `update profiles set role='admin' where id=auth.uid()`.

**Overall:** Well protected when env vars set and RLS fixes applied, but **one misconfig = critical compromise**. Plus client-side price tampering and XSS via image URLs.

---

## Critical Findings

### C1 — Demo Mode Authentication Bypass → Admin Takeover
**Severity:** Critical — Confirmed
**Affected:** `src/lib/supabase.ts`, `src/contexts/AuthContext.tsx:58-75, 100-117`
**Evidence:**
```ts
export const isSupabaseConfigured = Boolean(VITE_SUPABASE_URL && VITE_SUPABASE_ANON_KEY)
if (!isSupabaseConfigured) {
  const demoUser = { id:'demo-'+Date.now(), email, role: email.includes('admin') ? 'admin' : 'user' }
  setUser(demoUser) // any password works
}
```
**Why:** If Vercel env missing, `isSupabaseConfigured=false`, attacker visits `/login`, enters `admin@evil.com` / `x` → gets `role=admin`, passes client check `user.role==='admin'` in `Admin.tsx:108`.
**Impact:** Full admin panel, can create/delete listings/events, upload to storage, view all orders/bookings/users.
**Repro (safe):**
1. Unset env vars locally, `npm run dev`
2. Login with `admin@test.com`
3. Navigate to `/admin?tab=users` → success
**Fix (Priority 1):**
- Remove demo fallback in production build: `if (!isSupabaseConfigured && import.meta.env.PROD) throw`
- Or guard admin: `if (isDemo) return <blocked>` already exists but only checks `isDemo`, but login still creates admin. Change login to never allow admin role when `!isSupabaseConfigured`.
- Add env check in CI: fail build if `VITE_SUPABASE_URL` missing.

### C2 — Privilege Escalation: Users Can Update Own `role` to Admin
**Severity:** Critical — Confirmed
**Affected:** `supabase/SECURITY_RLS_FIXES_FIXED.sql:20-23`
```sql
create policy "Users can update own profile" on profiles for update to authenticated using (auth.uid()=id) with check (auth.uid()=id);
```
No column whitelist. `profiles` has `role` column.
**Why:** Authenticated attacker can `supabase.from('profiles').update({role:'admin'}).eq('id', auth.uid())` → becomes admin, then all admin policies (`exists (select ... role='admin')`) pass.
**Impact:** Any registered user → admin → full data access.
**Repro:**
```js
await supabase.from('profiles').update({role:'admin'}).eq('id', user.id)
```
**Fix:**
- Create trigger or RLS check: `with check (role = (select role from profiles where id=auth.uid()) OR ...)` or remove role from updatable columns via policy using `USING` + column check or use 2 policies: allow update only `first_name, last_name, phone, country`.
- Recommended:
```sql
drop policy "Users can update own profile" on profiles;
create policy "Users can update own safe fields" on profiles for update to authenticated
using (auth.uid()=id) with check (auth.uid()=id AND role = (SELECT role FROM profiles WHERE id=auth.uid()));
```
Or use Supabase column-level security.

### C3 — Public Can View All Profiles (PII Leakage)
**Severity:** High — Confirmed
**Affected:** `SECURITY_RLS_FIXES_FIXED.sql:15`
```sql
create policy "Public can view profiles" on profiles for select to anon, authenticated using (true);
```
**Why:** Allows anonymous to list all users, emails, roles, phone, country.
**Impact:** User enumeration, targeted phishing, admin identification.
**Fix:** Change to `authenticated` only and `auth.uid()=id OR admin`:
```sql
drop policy "Public can view profiles" on profiles;
create policy "Users can view own profile" on profiles for select to authenticated using (auth.uid()=id);
create policy "Admins can view all profiles" on profiles for select to authenticated using (exists (select 1 from profiles where id=auth.uid() and role='admin'));
```

---

## High Findings

### H1 — Client-Side Price Tampering
**Severity:** High — Confirmed
**Affected:** `src/contexts/DataContext.tsx: addToCart`, `src/pages/Tickets.tsx: addTicket`
`addToCart({price: discountedTicketPrice(...)})` price comes from client. Attacker can edit JS: `price: 1`.
**Impact:** Order created with $1 total, pending verification but could confuse admin or be paid via external PayPal if admin not checking.
**Fix:** Never trust client price. In `createOrder` or Edge Function, re-fetch `event_tickets.price` server-side and compute total. Store price snapshot server-side.

### H2 — Storage Upload: Client-Only MIME Check, Foldername Bypass Risk
**Severity:** High — Potential
**Affected:** `src/lib/storage.ts`, `SECURITY_RLS_FIXES_FIXED.sql: storage.objects policies`
Client checks `file.type.startsWith('image/')`, size <8MB. Server policy checks `(storage.foldername(name))[1] in ('listings','events','tickets')` — `foldername` splits by `/`, `[1]` is first folder, but path is `folder/uuid-name.ext` → `[1]=folder` okay, but attacker could use `listings/../../evil.svg`? Supabase storage sanitizes, but SVG with JS is still `image/svg+xml` → passes, can lead to stored XSS.
**Fix:** In bucket settings, allow only `image/jpeg, image/png, image/webp`, disallow `svg`. Add server-side validation in Edge Function.

### H3 — XSS via `image_url` / `seat_map_url`
**Severity:** High — Potential
**Affected:** All pages using `<img src={eventImageFor(event)}>` where `image_url` from DB, no validation for `javascript:` or `data:text/html`.
**Impact:** Admin uploads malicious URL → stored XSS for all visitors.
**Fix:** Validate URL starts with `https://` or `/`, reject `javascript:`, `data:` except image data URIs. Use CSP `img-src` already restricts to self, https, supabase, pexels — good, but still allow `https://evil.com/malicious.svg`.

### H4 — Weak Rate Limiting
**Severity:** Medium — Confirmed
**Affected:** `Login.tsx: lockSeconds 60 after 5 attempts` client-side only. Attacker can bypass by calling `supabase.auth.signInWithPassword` directly, no server rate limit except Supabase default.
**Fix:** Enable Supabase Auth rate limiting + captcha enforcement. Ensure `CaptchaBox` token validated server-side (currently passed as `captchaToken` option — Supabase will validate if captcha configured).

---

## Medium Findings

### M1 — CSP Allows `unsafe-inline` for Scripts/Styles
**Severity:** Medium — Confirmed
**Affected:** `vercel.json: Content-Security-Policy: script-src 'self' 'unsafe-inline' https://*.supabase.co`
**Why:** Weakens XSS protection.
**Fix:** Remove `unsafe-inline`, use nonce/hash. For now acceptable for Vite inline scripts, but add `object-src 'none'`, `base-uri 'self'`.

### M2 — Events RLS Contradicts App Requirement (History)
**Severity:** Medium — Confirmed
**Affected:** `SECURITY_RLS_FIXES_FIXED.sql: Events policy`
```sql
using (status in ('upcoming','live') or status is null)
```
App wants to show `finished` as history in Events tab. With this policy, anon cannot fetch finished events from DB, so history only shows from `FEATURED_US_EVENTS` fallback, not DB past events. Could cause confusion or require disabling RLS.
**Fix:** Change to `status in ('upcoming','live','finished','sold_out')`.

### M3 — Ticket Tickets Policy Hides Sold-Out Info
**Severity:** Low — Potential
Policy `quantity_available >0 and status='available'` hides sold-out tickets from public. App wants to show sold-out banner. Might need to allow sold_out status.

### M4 — No CSRF Needed but No Explicit Protection on Contact Form
Contact form `contact_messages` allows anon insert `with check (true)` — open to spam.
**Fix:** Add captcha + rate limit.

---

## Low / Informational

- **Admin panel discoverable:** `/admin` exists, robots disallows but still reachable. Client-side role check only — relies on RLS. Ensure RLS as above.
- **Source maps:** Vite build default no source maps in production — checked `dist/` no `.map` — good.
- **Google verification file** `/google467a7c6fe46ba268.html` exposed — intentional, low risk.
- **Dependencies:** `vite 5.4.0` + `esbuild <=0.24.2` moderate vuln GHSA-67mh-4wv8-2f99 (dev server request forgery) — only affects `npm run dev`, not prod. `react-router-dom` upgraded to 7.18.2 fixes open redirect. Remaining 2 vulns dev-only.
- **Console logs** may leak emails in dev.

---

## Vulnerability Table

| Severity | Finding | Affected Area | Status |
|----------|---------|---------------|--------|
| Critical | Demo Mode auth bypass → admin | AuthContext, supabase.ts | Confirmed |
| Critical | Self-promote role to admin | profiles RLS policy | Confirmed |
| High | Public can view all profiles (PII) | profiles SELECT policy | Confirmed |
| High | Client-side price tampering | DataContext addToCart, Tickets | Confirmed |
| High | Stored XSS via image_url | Events, Listings | Potential |
| High | SVG upload → XSS | storage.ts, bucket | Potential |
| Medium | Weak client rate limiting | Login.tsx | Confirmed |
| Medium | CSP unsafe-inline | vercel.json | Confirmed |
| Medium | Events RLS blocks finished history | events SELECT policy | Confirmed |
| Low | Contact form spam (anon insert true) | contact_messages | Confirmed |
| Low | esbuild dev server vuln | vite 5.4 / esbuild | Potential (dev only) |

---

## Remediation Plan

### Priority 1 — Fix immediately (before next deploy)
1. **Remove demo admin creation:** In `AuthContext.login/signup`, if `!isSupabaseConfigured`, never set `role='admin'`, force `role='user'`, and block `/admin` when `isDemo`.
2. **Lock profiles role:** Replace update policy with column-safe version, prevent role change.
3. **Restrict profiles SELECT:** Change public view `using(true)` to own + admin only.
4. **Re-validate price server-side:** In checkout Edge Function or `createOrder`, fetch real price from `event_tickets`.

### Priority 2 — Fix soon (this week)
5. **Storage hardening:** In Supabase dashboard, restrict `site-media` MIME to jpeg/png/webp, disable svg. Add Edge Function validation.
6. **Image URL validation:** In `AdminEvents` form, validate `image_url` starts with `https://` or `/` and domain allowlist.
7. **Enable Supabase captcha & rate limit:** In Supabase Auth settings, enable captcha, set rate limit 5/min.
8. **Fix Events/Tickets RLS to allow finished/sold_out for history display.**

### Priority 3 — Hardening
9. **Tighten CSP:** Remove `unsafe-inline` from script-src when possible, add `object-src 'none'`, `base-uri 'self'`.
10. **Add server logging:** Use Supabase logs + Vercel analytics for failed logins.
11. **Upgrade Vite:** When ready, migrate to Vite 6.4.3+ or 8.2.2 (requires testing Tailwind 4 plugin).
12. **Add contact form captcha + honeypot.**

---

## Overall Security Assessment

**Security Risk: High** (when env vars missing) / **Moderate** (when correctly configured and Priority 1 fixes applied)

**Why High if misconfigured:** Demo mode gives instant admin (C1) + any user can self-promote (C2) + leak all profiles (C3) → full compromise, data leakage, booking manipulation.

**Why Moderate when fixed:** After fixing C1-C3 and price validation, remaining risks are XSS via image URL (requires admin compromise first), dev-only esbuild vuln, and CSP unsafe-inline — typical SPA risks, not critical. Security headers are excellent (HSTS preload, nosniff, DENY framing, restrictive Permissions-Policy). RLS enabled everywhere.

**Recommendation:** Apply Priority 1 SQL patches in Supabase SQL Editor now, redeploy latest zip with demo admin blocked, then address Priority 2.

---

*End of report — all checks non-destructive, no data exfiltrated.*
