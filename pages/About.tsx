import { motion } from 'framer-motion';
import { Globe, Shield, Heart, Star, Target } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { IMAGES } from '../data/constants';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="About Us" description="Learn about Anna Travel Agency — your trusted FIFA World Cup 2026 accommodation partner." path="/about" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
            <Heart className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">
Anna Travel Agency
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Born from a passion for football and travel, Anna Travel Agency is your trusted partner
            for FIFA World Cup 2026 accommodation. We connect fans from around the world with
            verified hotels, apartments, and shortlets across all 16 host cities.
          </p>
        </motion.div>

        {/* Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
          >
            <img src={IMAGES.fans2} alt="Football fans" className="w-full h-full object-cover rounded-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              The FIFA World Cup 2026 will be the biggest sporting event in history — 48 teams,
              104 matches, 16 cities, 3 countries. We believe every fan deserves a comfortable,
              convenient, and affordable place to stay while experiencing the beautiful game.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              Anna Travel Agency was founded by a team of travel experts and football enthusiasts
              who experienced the challenges of finding quality accommodation during previous
              World Cups. We're here to make your 2026 experience seamless.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '16', label: 'Host Cities' },
                { number: '500+', label: 'Properties' },
                { number: '50+', label: 'Countries Served' },
                { number: '4.9', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-black text-amber-400">{stat.number}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Trust & Safety', desc: 'Every property is personally verified. Your safety is our top priority.', color: 'text-green-400' },
              { icon: Globe, title: 'Global Reach', desc: 'We serve fans from every continent, with multilingual support.', color: 'text-blue-400' },
              { icon: Target, title: 'Best Locations', desc: 'Properties hand-picked for proximity to stadiums and transport.', color: 'text-purple-400' },
              { icon: Star, title: 'Best Price Guarantee', desc: 'Competitive pricing with early-bird discounts and group rates.', color: 'text-amber-400' },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center">
                    <value.icon className={`w-10 h-10 mx-auto mb-4 ${value.color}`} />
                    <h3 className="text-white font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Anna Rodriguez', role: 'Founder & CEO', emoji: '👩‍💼', bio: 'Travel industry veteran with 15+ years of experience. Attended 3 World Cups.' },
              { name: 'David Kim', role: 'Head of Operations', emoji: '👨‍💻', bio: 'Former hotel chain manager, now ensuring every guest has a perfect stay.' },
              { name: 'Fatima Al-Hassan', role: 'Customer Experience', emoji: '👩‍🎓', bio: 'Multilingual support specialist, fluent in 5 languages. Football fanatic.' },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-3xl mx-auto mb-4">
                      {member.emoji}
                    </div>
                    <h3 className="text-white font-bold text-lg">{member.name}</h3>
                    <p className="text-amber-400 text-sm mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ticket Resale */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card3D glowColor="rgba(245, 158, 11, 0.15)">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-2xl">
                    🎫
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Ticket Resale</h2>
                    <p className="text-amber-400 text-sm">Buy & Sell World Cup 2026 Tickets Safely</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Plans change — we get it. If you've purchased FIFA World Cup 2026 tickets but can no longer attend, 
                  Anna Travel Agency provides a <strong className="text-white">safe and trusted marketplace</strong> to resell your tickets 
                  to verified fans. We also help fans find last-minute tickets at fair prices.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: '🏷️', title: 'Sell Your Tickets', desc: 'List tickets you can\'t use. Set your own price. We handle the secure transfer and payment to you.', color: 'border-amber-500/30 bg-amber-500/5' },
                    { icon: '🛒', title: 'Buy Verified Tickets', desc: 'Browse available tickets from verified sellers. Every ticket is authenticated before sale.', color: 'border-green-500/30 bg-green-500/5' },
                    { icon: '🛡️', title: 'Safe & Guaranteed', desc: '100% buyer protection. If a ticket is invalid, you get a full refund. Secure escrow payments.', color: 'border-blue-500/30 bg-blue-500/5' },
                  ].map((item) => (
                    <div key={item.title} className={`p-5 rounded-xl border ${item.color}`}>
                      <span className="text-2xl">{item.icon}</span>
                      <h4 className="text-white font-bold mt-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-white font-bold mb-3">How It Works</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { step: '1', title: 'List or Browse', desc: 'Sellers list their tickets with match details. Buyers search by match, city, or team.' },
                      { step: '2', title: 'Verify & Match', desc: 'We verify ticket authenticity. When a buyer is found, we hold payment in escrow.' },
                      { step: '3', title: 'Secure Transfer', desc: 'Tickets are transferred securely via FIFA\'s official resale platform or verified hand-off.' },
                      { step: '4', title: 'Done!', desc: 'Buyer gets tickets, seller gets paid. Both parties are protected by our guarantee.' },
                    ].map((s) => (
                      <div key={s.step} className="text-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white font-bold mx-auto mb-2">
                          {s.step}
                        </div>
                        <h5 className="text-white font-semibold text-sm">{s.title}</h5>
                        <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all"
                  >
                    🎫 Sell My Tickets
                  </Link>
                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/10"
                  >
                    🔍 Find Tickets
                  </Link>
                </div>
              </div>
            </Card3D>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready for the World Cup?</h2>
          <p className="text-gray-400 mb-8">Book your accommodation today and secure your spot.</p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:scale-105 transition-all"
          >
            Browse Accommodations ⚽
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
