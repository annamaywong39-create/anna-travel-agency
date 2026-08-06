# Anna Travel Agency

Luxury event travel marketplace for curated high-demand events and accommodation.

Customers can buy tickets, book accommodation, or purchase both in one order.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Set the Vercel framework preset to **Vite**.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Environment Variables.
5. Deploy.

The `vercel.json` file keeps the single-page app routes working.

## Before accepting real payments

- Replace localStorage authentication with Supabase Auth.
- Never publish passwords, service-role keys, payment secret keys, or database passwords.
- Remove demo/fake ticket inventory and use verified supplier inventory.
- Use a server-side Stripe/Paystack checkout session and webhook.
- Generate booking codes server-side after creating an order.
- Confirm accommodation with the supplier before displaying a room number.
- Publish only genuine customer reviews. The review feature is designed for verified completed bookings.
