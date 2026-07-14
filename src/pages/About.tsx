import { motion } from 'framer-motion';
import { Globe, Shield, Heart, Star, Target } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { IMAGES } from '../data/constants';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="About Us" description="Learn about Anna Travel Agency — your trusted travel and event accommodation partner." path="/about" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-16 bg-gradient-to-r from-[#0a0a1a] via-[#14142a] to-[#0a0a1a] border border-white/10 p-8 md:p-12"
        >
          <div className="relative z-10 text-center">
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
              Born from a passion for travel and events, Anna Travel Agency is your trusted partner
              for accommodation and ticket bookings. We connect travelers with verified hotels,
              apartments, and shortlets — and fans with tickets to the best events.
            </p>
          </div>
        </motion.div>

        {/* Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
          >
            <img src={IMAGES.fans2} alt="Travel" className="w-full h-full object-cover rounded-2xl" loading="lazy" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We believe every traveler deserves a comfortable, convenient, and affordable place to stay.
              Whether you're traveling for business, leisure, or a special event, we're here to make your experience seamless.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              Anna Travel Agency was founded by a team of travel experts who experienced the challenges of
              finding quality accommodation and event tickets. We're here to make your travel experience stress-free.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '500+', label: 'Properties' },
                { number: '50+', label: 'Countries Served' },
                { number: '4.9', label: 'Average Rating' },
                { number: '100%', label: 'Satisfaction Guarantee' },
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
              { icon: Globe, title: 'Global Reach', desc: 'We serve travelers from every continent, with multilingual support.', color: 'text-blue-400' },
              { icon: Target, title: 'Best Locations', desc: 'Properties hand-picked for convenience and accessibility.', color: 'text-purple-400' },
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
              { name: 'Anna Rodriguez', role: 'Founder & CEO', emoji: '👩‍💼', bio: 'Travel industry veteran with 15+ years of experience.' },
              { name: 'David Kim', role: 'Head of Operations', emoji: '👨‍💻', bio: 'Former hotel chain manager, ensuring every guest has a perfect stay.' },
              { name: 'Fatima Al-Hassan', role: 'Customer Experience', emoji: '👩‍🎓', bio: 'Multilingual support specialist, fluent in 5 languages.' },
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Stay?</h2>
          <p className="text-gray-400 mb-8">Find the perfect accommodation for your next trip.</p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:scale-105 transition-all"
          >
            Browse Accommodations ✈️
          </Link>
        </motion.div>
      </div>
    </main>
  );
}