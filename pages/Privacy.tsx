import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly: name, email address, phone number, country, payment information (processed by Stripe — we do not store card numbers), booking preferences, and any communications with us.\n\nWe automatically collect: IP address, browser type, device information, pages viewed, time spent on pages, and cookies for session management and analytics.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to: process and manage bookings; send booking confirmations and updates; communicate with you about your account; improve our services and user experience; send promotional communications (with your consent); comply with legal obligations; prevent fraud and ensure platform security.`,
  },
  {
    title: '3. Information Sharing',
    content: `We share your information with: property owners/managers (name, contact details, booking dates — necessary to fulfill your reservation); Stripe (payment processing — subject to their privacy policy); email service providers (for sending communications); analytics providers (aggregated, non-personal data only).\n\nWe do NOT sell your personal data to third parties. We may disclose information if required by law, court order, or government regulation.`,
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures: SSL/TLS encryption for all data transmission; secure payment processing through Stripe (PCI-DSS compliant); encrypted database storage; regular security audits; access controls for employee data access.\n\nHowever, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    title: '5. Cookies & Tracking',
    content: `We use cookies for: session management (keeping you logged in); remembering your preferences (currency, language); analytics (understanding how you use our site). You can control cookies through your browser settings. Disabling cookies may affect some features of our service.\n\nWe use Google Analytics for aggregated usage data. No personally identifiable information is shared with analytics providers.`,
  },
  {
    title: '6. Your Rights (GDPR & CCPA)',
    content: `You have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data ("right to be forgotten"); object to processing of your data; request data portability (receive your data in a structured format); withdraw consent at any time; lodge a complaint with a supervisory authority.\n\nTo exercise these rights, contact us at hello@annatravelagency.com. We will respond within 30 days.`,
  },
  {
    title: '7. Data Retention',
    content: `We retain your personal data for as long as necessary to: maintain your account; fulfill the purposes described in this policy; comply with legal obligations (e.g., tax records). Booking records are retained for 7 years for legal/tax compliance. You may request deletion of your account at any time. Upon deletion, we will remove your data within 30 days, except where retention is legally required.`,
  },
  {
    title: '8. International Data Transfers',
    content: `Our services operate across the USA, Mexico, and Canada. Your data may be transferred to and processed in any of these countries. We ensure appropriate safeguards are in place for international data transfers in compliance with GDPR, CCPA, and PIPEDA requirements.`,
  },
  {
    title: '9. Children\'s Privacy',
    content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal data from children. If you believe we have collected information from a minor, please contact us immediately and we will take steps to delete such information.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent notice on our website. The latest version will always be available at annatravelagency.com/privacy. Your continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '11. Contact Us',
    content: `For privacy-related inquiries or to exercise your data rights:\n\nAnna Travel Agency — Data Protection\nEmail: privacy@annatravelagency.com\nGeneral: hello@annatravelagency.com\nPhone: +1 (800) 123-4567\nAddress: New York, NY, USA`,
  },
];

export default function Privacy() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Privacy Policy" description="Privacy Policy for Anna Travel Agency — How we collect, use, and protect your personal data." path="/privacy" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: January 1, 2026</p>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <h2 className="text-xl font-bold text-white mb-3">{s.title}</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
