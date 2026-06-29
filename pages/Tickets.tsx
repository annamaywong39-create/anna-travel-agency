import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';

export default function Tickets() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Ticket Resale" description="Buy or sell FIFA World Cup 2026 tickets safely through Anna Travel Agency. 100% buyer protection and verified tickets." path="/tickets" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="text-6xl mb-4">🎫</div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            FIFA World Cup 2026
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">Ticket Resale</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Can't attend a match? Sell your tickets safely. Looking for tickets? Buy from verified sellers with full buyer protection.
          </p>
        </motion.div>

        {/* 3 pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '🏷️', title: 'Sell Your Tickets', desc: "List tickets you can't use. Set your price. We handle the secure transfer and payment to you.", gradient: 'from-amber-500 to-orange-500', features: ['Set your own price', 'Instant payout after transfer', 'No listing fees', 'Cancel listing anytime'] },
            { icon: '🛒', title: 'Buy Verified Tickets', desc: 'Browse available tickets from verified sellers. Every ticket is authenticated before sale.', gradient: 'from-emerald-500 to-green-500', features: ['100% authentic tickets', 'Fair market prices', 'Search by match or team', 'Instant digital delivery'] },
            { icon: '🛡️', title: 'Safe & Guaranteed', desc: '100% buyer protection. Invalid ticket? Full refund. Secure escrow payments for both parties.', gradient: 'from-blue-500 to-cyan-500', features: ['Escrow payment protection', 'Full refund guarantee', 'ID-verified sellers', '24/7 support'] },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card3D>
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.desc}</p>
                  <div className="space-y-2">
                    {item.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">How Ticket Resale Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'List or Browse', desc: 'Sellers list tickets with match details and price. Buyers search by match, city, or team.', color: 'from-amber-500 to-orange-500' },
              { step: '2', title: 'Verify & Match', desc: 'We verify every ticket for authenticity. When buyer and seller agree, payment is held in escrow.', color: 'from-blue-500 to-cyan-500' },
              { step: '3', title: 'Secure Transfer', desc: "Tickets are transferred securely via FIFA's official resale channel or verified hand-off.", color: 'from-purple-500 to-pink-500' },
              { step: '4', title: 'Done!', desc: 'Buyer receives tickets and confirms. Seller gets paid. Both are protected by our guarantee.', color: 'from-green-500 to-emerald-500' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg`}>
                  {s.step}
                </div>
                <h4 className="text-white font-bold mb-1">{s.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular matches for resale */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">🔥 Most Sought-After Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { match: '🇺🇸 USA vs 🇦🇺 Australia', date: 'Jun 19', venue: 'Lumen Field, Seattle', demand: 'Extreme' },
              { match: '🇧🇷 Brazil vs 🇲🇦 Morocco', date: 'Jun 13', venue: 'MetLife Stadium, NY/NJ', demand: 'Very High' },
              { match: '🇦🇷 Argentina vs 🇩🇿 Algeria', date: 'Jun 16', venue: 'Arrowhead Stadium, KC', demand: 'Very High' },
              { match: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England vs 🇭🇷 Croatia', date: 'Jun 17', venue: 'AT&T Stadium, Dallas', demand: 'High' },
              { match: '🇫🇷 France vs 🇸🇳 Senegal', date: 'Jun 16', venue: 'MetLife Stadium, NY/NJ', demand: 'High' },
              { match: '🏆 FINAL', date: 'Jul 19', venue: 'MetLife Stadium, NY/NJ', demand: 'Extreme' },
            ].map((t, i) => (
              <Card3D key={i}>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{t.match}</p>
                    <p className="text-gray-500 text-xs">{t.date} · {t.venue}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.demand === 'Extreme' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    t.demand === 'Very High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>{t.demand}</span>
                </div>
              </Card3D>
            ))}
          </div>
        </motion.div>

        {/* Safety guarantee */}
        <Card3D glowColor="rgba(34, 197, 94, 0.15)">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <Shield className="w-20 h-20 text-green-400 shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Anna Travel Agency Guarantee</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Every ticket transaction on our platform is protected. If a ticket turns out to be invalid, duplicated, or doesn't grant entry — you receive a <strong className="text-white">full 100% refund</strong> immediately. Sellers are ID-verified and tickets are authenticated before any money changes hands.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">✓ 100% Money Back</span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">✓ Verified Sellers</span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">✓ Escrow Payments</span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">✓ 24/7 Support</span>
              </div>
            </div>
          </div>
        </Card3D>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:scale-105 transition-all flex items-center gap-2">
            🎫 Sell My Tickets <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/contact" className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-all flex items-center gap-2">
            🔍 Find Tickets
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
