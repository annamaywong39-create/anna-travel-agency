import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using Anna Travel Agency ("we", "us", "our") website and services, you accept and agree to be bound by these Terms of Service. If you do not agree, you may not use our services. These terms apply to all visitors, users, and others who access or use the service.`,
  },
  {
    title: '2. Services Provided',
    content: `Anna Travel Agency provides an online platform connecting guests with accommodation providers for the FIFA World Cup 2026. We facilitate bookings for hotels, apartments, and short-term rentals across host cities in the United States, Mexico, and Canada. We act as an intermediary between guests and property owners/managers.`,
  },
  {
    title: '3. Booking & Payments',
    content: `All bookings are subject to availability. Prices are listed in USD and can be viewed in other currencies for convenience; the final charge is in USD. Payment is processed securely through Stripe. By completing a booking, you authorize us to charge the provided payment method. A confirmation email will be sent upon successful payment. All prices include applicable service fees unless stated otherwise.`,
  },
  {
    title: '4. Cancellation & Refund Policy',
    content: `Free cancellation is available up to 7 days before the scheduled check-in date for a full refund. Cancellations made 3–7 days before check-in receive a 50% refund. Cancellations made less than 3 days before check-in are non-refundable. No-shows are non-refundable. In cases of force majeure (including but not limited to natural disasters, pandemics, or event cancellation by FIFA), full refunds will be issued within 14 business days.`,
  },
  {
    title: '5. User Accounts',
    content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: '6. Property Listings',
    content: `While we verify all listings on our platform, Anna Travel Agency does not own or operate the accommodation properties. We make reasonable efforts to ensure listing accuracy, but cannot guarantee that all information (photos, amenities, descriptions) is entirely accurate at the time of your stay. Any disputes regarding property conditions should be reported within 24 hours of check-in.`,
  },
  {
    title: '7. User Conduct',
    content: `You agree not to: use the service for any unlawful purpose; submit false reviews or ratings; attempt to access other users' accounts; scrape, copy, or redistribute content from the platform; use the platform to harass, abuse, or harm others; violate any local, state, national, or international laws.`,
  },
  {
    title: '8. Reviews & Content',
    content: `By submitting reviews, photos, or other content, you grant Anna Travel Agency a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content. Reviews must be honest, factual, and based on genuine experiences. We reserve the right to remove content that is misleading, offensive, or violates these terms.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `Anna Travel Agency shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. Our total liability shall not exceed the amount paid by you for the specific booking in question. We are not responsible for actions of property owners, third-party service providers, or events beyond our control.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to modify these terms at any time. Significant changes will be communicated via email or a notice on our website. Continued use of the service after changes constitutes acceptance of the new terms. The latest version of these terms will always be available on our website.`,
  },
  {
    title: '11. Contact Information',
    content: `For questions regarding these terms, please contact us at:\n\nAnna Travel Agency\nEmail: hello@annatravelagency.com\nPhone: +1 (800) 123-4567\nAddress: New York, NY, USA`,
  },
];

export default function Terms() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Terms of Service" description="Terms of Service for Anna Travel Agency — FIFA World Cup 2026 accommodation booking platform." path="/terms" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
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
