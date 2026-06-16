/*
 ┌──────────────────────────────────────────────────────┐
 │  EMAIL SETUP — USING RESEND (resend.com)             │
 │                                                       │
 │  1. Go to https://resend.com and create an account   │
 │  2. Verify your domain or use onboarding@resend.dev  │
 │  3. Get your API key from the dashboard              │
 │  4. IMPORTANT: Email must be sent from a BACKEND     │
 │     never expose API keys in frontend code!          │
 │                                                       │
 │  FREE TIER: 3,000 emails/month, 100/day              │
 │  Alternatives: SendGrid, Mailgun, AWS SES            │
 └──────────────────────────────────────────────────────┘
*/

// ═══ Email templates (used by backend) ═══

export const EMAIL_TEMPLATES = {

  bookingConfirmation: (data: {
    guestName: string;
    propertyName: string;
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: string;
    bookingId: string;
  }) => ({
    subject: `✅ Booking Confirmed — ${data.propertyName} | Anna Travel Agency`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #ffffff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✈️ Booking Confirmed!</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">Anna Travel Agency — FIFA World Cup 2026</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 18px;">Hi ${data.guestName},</p>
          <p>Your World Cup 2026 accommodation is secured! Here are your booking details:</p>
          
          <div style="background: #1a1a2e; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #9ca3af;">Confirmation #</td><td style="text-align: right; color: #f59e0b; font-weight: bold;">${data.bookingId}</td></tr>
              <tr><td style="padding: 8px 0; color: #9ca3af;">Property</td><td style="text-align: right;">${data.propertyName}</td></tr>
              <tr><td style="padding: 8px 0; color: #9ca3af;">City</td><td style="text-align: right;">${data.city}</td></tr>
              <tr><td style="padding: 8px 0; color: #9ca3af;">Check-in</td><td style="text-align: right;">${data.checkIn}</td></tr>
              <tr><td style="padding: 8px 0; color: #9ca3af;">Check-out</td><td style="text-align: right;">${data.checkOut}</td></tr>
              <tr><td style="padding: 8px 0; color: #9ca3af;">Guests</td><td style="text-align: right;">${data.guests}</td></tr>
              <tr style="border-top: 1px solid #333;"><td style="padding: 12px 0; color: #ffffff; font-weight: bold;">Total Paid</td><td style="text-align: right; color: #22c55e; font-weight: bold; font-size: 18px;">${data.totalPrice}</td></tr>
            </table>
          </div>

          <p><strong>Cancellation Policy:</strong> Free cancellation up to 7 days before check-in.</p>
          <p>Questions? Reply to this email or contact us at <a href="mailto:hello@annatravelagency.com" style="color: #f59e0b;">hello@annatravelagency.com</a></p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 32px; text-align: center;">
            © 2026 Anna Travel Agency. All rights reserved.<br>
            FIFA World Cup 2026™ Official Accommodation Partner
          </p>
        </div>
      </div>
    `,
  }),

  contactAutoReply: (data: { name: string; subject: string }) => ({
    subject: `Re: ${data.subject} — Anna Travel Agency`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${data.name},</h2>
        <p>Thank you for contacting Anna Travel Agency! We've received your message and will get back to you within 2 hours.</p>
        <p>In the meantime, browse our <a href="https://annatravelagency.com/#/listings" style="color: #f59e0b;">World Cup 2026 accommodations</a>.</p>
        <p>Best regards,<br><strong>Anna Travel Agency Team</strong></p>
      </div>
    `,
  }),

  welcomeEmail: (data: { name: string }) => ({
    subject: `Welcome to Anna Travel Agency! ⚽✈️`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #ffffff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #22c55e, #059669); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome, ${data.name}! ⚽</h1>
        </div>
        <div style="padding: 32px;">
          <p>Your account has been created. You're one step closer to an unforgettable World Cup 2026 experience!</p>
          <a href="https://annatravelagency.com/#/listings" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 16px 0;">Browse Accommodations →</a>
        </div>
      </div>
    `,
  }),
};

/*
 ═══════════════════════════════════════════════════════
  BACKEND EMAIL SENDING — Supabase Edge Function Example
 ═══════════════════════════════════════════════════════

  // supabase/functions/send-email/index.ts

  import { Resend } from 'resend';
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

  Deno.serve(async (req) => {
    const { to, subject, html } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Anna Travel Agency <bookings@annatravelagency.com>',
      to: [to],
      subject,
      html,
    });

    return new Response(JSON.stringify({ data, error }), {
      headers: { 'Content-Type': 'application/json' },
    });
  });

*/

export default EMAIL_TEMPLATES;
