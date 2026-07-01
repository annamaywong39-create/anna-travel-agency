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
    html: `...`, // (keep your existing HTML)
  }),

  contactAutoReply: (data: { name: string; subject: string }) => ({
    subject: `Re: ${data.subject} — Anna Travel Agency`,
    html: `...`,
  }),

  welcomeEmail: (data: { name: string }) => ({
    subject: `Welcome to Anna Travel Agency! ⚽✈️`,
    html: `...`,
  }),

  // ✅ ADDED THIS
  adminBookingNotification: (data: {
    guestName: string;
    guestEmail: string;
    propertyName: string;
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: string;
    bookingId: string;
    paymentMethod: string;
  }) => ({
    subject: `📋 New Booking Received — ${data.propertyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #ffffff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 24px; text-align: center;">
          <h2 style="margin: 0; color: #ffffff;">📋 New Booking Alert!</h2>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8);">Anna Travel Agency</p>
        </div>
        <div style="padding: 24px;">
          <p style="color: #9ca3af; font-size: 14px;">A new booking has been received:</p>
          <div style="background: #1a1a2e; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #9ca3af;">Booking ID</td><td style="text-align: right; color: #f59e0b; font-weight: bold;">${data.bookingId.slice(0, 12)}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Guest</td><td style="text-align: right; color: #ffffff;">${data.guestName}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Email</td><td style="text-align: right; color: #ffffff;">${data.guestEmail}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Property</td><td style="text-align: right; color: #ffffff;">${data.propertyName}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">City</td><td style="text-align: right; color: #ffffff;">${data.city}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Check-in</td><td style="text-align: right; color: #ffffff;">${data.checkIn}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Check-out</td><td style="text-align: right; color: #ffffff;">${data.checkOut}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Guests</td><td style="text-align: right; color: #ffffff;">${data.guests}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Total</td><td style="text-align: right; color: #22c55e; font-weight: bold;">${data.totalPrice}</td></tr>
              <tr><td style="padding: 6px 0; color: #9ca3af;">Payment Method</td><td style="text-align: right; color: #f59e0b; font-weight: bold;">${data.paymentMethod}</td></tr>
            </table>
          </div>
          <div style="text-align: center; margin: 16px 0;">
            <a href="https://annatravelagency.com/admin" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 32px; border-radius: 8px;">
              View in Admin Panel
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 16px;">
            © 2026 Anna Travel Agency
          </p>
        </div>
      </div>
    `,
  }),
};

export default EMAIL_TEMPLATES;