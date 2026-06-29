import { loadStripe } from '@stripe/stripe-js';

/*
 ┌──────────────────────────────────────────────────────┐
 │  STRIPE SETUP — FOLLOW THESE STEPS:                  │
 │                                                       │
 │  1. Go to https://stripe.com and create an account   │
 │  2. Go to Developers → API Keys                      │
 │  3. Copy your Publishable Key (starts with pk_)      │
 │  4. Set it as VITE_STRIPE_PUBLIC_KEY env variable     │
 │  5. Copy your Secret Key for the backend              │
 │                                                       │
 │  TEST MODE: Use pk_test_... and sk_test_... keys     │
 │  Test card: 4242 4242 4242 4242, any future exp, any │
 │                                                       │
 │  PRODUCTION FLOW:                                     │
 │  Frontend → calls backend API → backend creates       │
 │  Stripe PaymentIntent → returns client_secret →       │
 │  Frontend confirms with Stripe.js                     │
 │                                                       │
 │  For now we use Stripe Checkout (redirect mode)      │
 │  which is simpler and doesn't need a backend          │
 └──────────────────────────────────────────────────────┘
*/

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder';

// Lazy-load Stripe
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
}

/*
 ═══════════════════════════════════════════════════════
  BACKEND API EXAMPLE (Node.js / Express / Supabase Edge Function)
 ═══════════════════════════════════════════════════════

  // POST /api/create-checkout-session
  
  import Stripe from 'stripe';
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  app.post('/api/create-checkout-session', async (req, res) => {
    const { listingTitle, priceInCents, nights, bookingId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: listingTitle,
            description: `World Cup 2026 accommodation — ${nights} nights`,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/#/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/#/booking-cancelled`,
      metadata: { bookingId },
    });

    res.json({ sessionId: session.id, url: session.url });
  });

  // Webhook to confirm payment
  // POST /api/webhooks/stripe

  app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
    const event = stripe.webhooks.constructEvent(
      req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Update booking status to 'confirmed' in database
      // Send confirmation email
    }

    res.json({ received: true });
  });
*/

export default getStripe;
