// Anna Travel Agency — send-email Edge Function
// Deploy with: supabase functions deploy send-email
// Required secret: supabase secrets set RESEND_API_KEY=re_...
//
// Receives: { to: string, template: string, data: Record<string, unknown> }
// Currently the only template used by the app is "adminBookingNotification",
// but the switch below is written so more templates can be added here later.

// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// A tiny, safe escape for the interpolation below.
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTemplate(template: string, data: Record<string, unknown>): { subject: string; html: string } | null {
  switch (template) {
    case "adminBookingNotification": {
      const subject = `New booking request — ${esc(data.guestName)} · ${esc(data.propertyName)}`;
      const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New booking request</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;background:#f4f1ec;margin:0;padding:28px 14px;color:#0b1f3a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td style="background:#0b1f3a;border-radius:24px 24px 0 0;padding:36px 34px 32px;">
      <div style="height:3px;width:52px;background:#d98c9b;margin-bottom:22px;"></div>
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#e6c98e;margin:0 0 14px;font-weight:bold;">Anna Travel Agency</p>
      <h1 style="font-size:32px;line-height:1.08;color:#ffffff;margin:0;font-weight:700;">New booking request</h1>
    </td></tr>
    <tr><td style="background:#ffffff;padding:34px;">
      <p style="font-size:15px;line-height:1.7;margin:0 0 24px;color:#637083;">A customer has submitted a booking request. Details below.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 26px;">
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;width:40%;">Guest</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;font-weight:bold;">${esc(data.guestName)}</td></tr>
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;">Email</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;">${esc(data.guestEmail)}</td></tr>
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;">Property</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;font-weight:bold;">${esc(data.propertyName)}</td></tr>
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;">City</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;">${esc(data.city)}</td></tr>
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;">Check-in</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;">${esc(data.checkIn)}</td></tr>
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;">Check-out</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;">${esc(data.checkOut)}</td></tr>
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;">Guests</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;">${esc(data.guests)}</td></tr>
        <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#637083;font-size:13px;">Total</td><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#0b1f3a;font-size:14px;font-weight:bold;">${esc(data.totalPrice)}</td></tr>
        <tr><td style="padding:10px 12px;color:#637083;font-size:13px;">Payment</td><td style="padding:10px 12px;color:#0b1f3a;font-size:14px;">${esc(data.paymentMethod)}</td></tr>
        <tr><td style="padding:10px 12px;color:#637083;font-size:13px;">Booking ID</td><td style="padding:10px 12px;color:#0b1f3a;font-size:14px;">${esc(data.bookingId)}</td></tr>
      </table>
    </td></tr>
    <tr><td style="background:#0b1f3a;border-radius:0 0 24px 24px;padding:24px 34px;text-align:center;">
      <p style="font-size:12px;color:rgba(255,255,255,.55);margin:0;">This is an automated notification. Do not reply directly.</p>
      <p style="font-size:11px;color:rgba(255,255,255,.35);margin:16px 0 0;">© 2026 Anna Travel Agency</p>
    </td></tr>
  </table>
</body></html>`;
      return { subject, html };
    }
    default:
      return null;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: { to?: string; template?: string; data?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { to, template, data } = body;
  if (!to || !template) {
    return json({ error: "Missing 'to' or 'template'" }, 400);
  }

  const rendered = renderTemplate(template, data || {});
  if (!rendered) {
    return json({ error: `Unknown template: ${template}` }, 400);
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    return json({ error: "RESEND_API_KEY is not configured" }, 500);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "Anna Travel Agency <hello@annatravelagency.com>",
      to: [to],
      subject: rendered.subject,
      html: rendered.html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: "Failed to send email", detail }, 502);
  }

  return json({ ok: true });
});
