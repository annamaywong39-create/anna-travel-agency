import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Clock, AlertCircle, CheckCircle2, HelpCircle, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';

const policies = [
  {
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    title: 'Free Cancellation — 7+ Days Before Check-in',
    description: 'Cancel at least 7 days before your scheduled check-in date and receive a full 100% refund. The refund will be processed to your original payment method within 5–7 business days.',
  },
  {
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'Partial Refund — 3 to 7 Days Before Check-in',
    description: 'Cancellations made between 3 and 7 days before check-in qualify for a 50% refund. The remaining 50% is retained to cover the property holder\'s preparation costs.',
  },
  {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    title: 'No Refund — Less Than 3 Days / No-Show',
    description: 'Cancellations made less than 3 days before check-in are non-refundable. Guests who fail to check in (no-show) are also not eligible for any refund.',
  },
];

const faqs = [
  {
    q: 'What happens if FIFA cancels a World Cup match?',
    a: 'If a match is cancelled or the tournament is suspended due to force majeure (natural disaster, pandemic, FIFA decision), you will receive a full 100% refund within 14 business days, regardless of when you booked.',
  },
  {
    q: 'How long does a refund take to process?',
    a: 'Refunds are processed within 5–7 business days after approval. The time it takes to appear in your account depends on your bank or payment provider (typically 3–10 additional business days).',
  },
  {
    q: 'Can I change my booking dates instead of cancelling?',
    a: 'Yes! Date changes are free if made at least 7 days before check-in, subject to availability. Contact us at hello@annatravelagency.com to request a date change.',
  },
  {
    q: 'What if the property doesn\'t match the listing?',
    a: 'If the property significantly differs from its listing (e.g., wrong room type, missing advertised amenities), report it within 24 hours of check-in. We will either relocate you or issue a full refund.',
  },
  {
    q: 'Are service fees refundable?',
    a: 'Yes. When you qualify for a full refund, the service fee and cleaning fee are also refunded in full. For partial refunds (50%), service fees are refunded proportionally.',
  },
  {
    q: 'How do I request a refund?',
    a: 'Log in to your dashboard, go to "My Bookings", and click "Cancel Booking". You can also email hello@annatravelagency.com with your booking confirmation number.',
  },
];

export default function Refund() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Refund Policy" description="Anna Travel Agency refund and cancellation policy for FIFA World Cup 2026 accommodation bookings." path="/refund" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-amber-400 text-sm mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-black text-white">Refund Policy</h1>
          </div>
          <p className="text-gray-500 text-sm mb-10">Last updated: January 1, 2026</p>

          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            At Anna Travel Agency, we understand plans can change. Our refund policy is designed to be fair and transparent for all guests booking accommodation for the FIFA World Cup 2026.
          </p>

          {/* Policy tiers */}
          <div className="space-y-4 mb-12">
            {policies.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className={`p-6 border-l-4 ${p.bg}`}>
                    <div className="flex items-start gap-4">
                      <p.icon className={`w-6 h-6 ${p.color} shrink-0 mt-1`} />
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{p.description}</p>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          {/* Visual timeline */}
          <Card3D>
            <div className="p-6">
              <h3 className="text-white font-bold text-lg mb-4">Refund at a Glance</h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <div className="shrink-0 text-center px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-green-400 font-bold text-sm">7+ days</p>
                  <p className="text-green-300 text-xs">100% refund</p>
                </div>
                <div className="w-8 h-px bg-gray-600 shrink-0" />
                <div className="shrink-0 text-center px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-yellow-400 font-bold text-sm">3–7 days</p>
                  <p className="text-yellow-300 text-xs">50% refund</p>
                </div>
                <div className="w-8 h-px bg-gray-600 shrink-0" />
                <div className="shrink-0 text-center px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 font-bold text-sm">&lt; 3 days</p>
                  <p className="text-red-300 text-xs">No refund</p>
                </div>
                <div className="w-8 h-px bg-gray-600 shrink-0" />
                <div className="shrink-0 text-center px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 font-bold text-sm">No-show</p>
                  <p className="text-red-300 text-xs">No refund</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3">* Days are counted before the scheduled check-in date</p>
            </div>
          </Card3D>

          {/* Special circumstances */}
          <div className="mt-10 mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Special Circumstances</h2>
            <Card3D glowColor="rgba(59, 130, 246, 0.15)">
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-1">🌪️ Force Majeure</h4>
                  <p className="text-gray-400 text-sm">In cases of natural disasters, pandemics, government travel bans, or FIFA event cancellations — full refunds are issued within 14 business days regardless of timing.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">🏥 Medical Emergency</h4>
                  <p className="text-gray-400 text-sm">Guests who cannot travel due to medical emergencies may qualify for a full refund with valid documentation (doctor's note or hospital records). Contact us within 48 hours.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">✈️ Travel Restrictions</h4>
                  <p className="text-gray-400 text-sm">If your country imposes a travel ban to the host country after booking, you qualify for a full refund with proof of the restriction.</p>
                </div>
              </div>
            </Card3D>
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3 mb-12">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card3D>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <Card3D glowColor="rgba(245, 158, 11, 0.15)">
            <div className="p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Need Help With a Refund?</h3>
              <p className="text-gray-400 mb-4">Our team is available 24/7 to assist you.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="mailto:hello@annatravelagency.com" className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all">
                  Email Us
                </a>
                <Link to="/contact" className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">
                  Contact Form
                </Link>
              </div>
            </div>
          </Card3D>
        </motion.div>
      </div>
    </main>
  );
}
