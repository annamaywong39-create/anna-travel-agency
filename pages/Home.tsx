import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import {
  ArrowRight, Shield, Star, MapPin, Calendar, CreditCard,
  ChevronRight, Building2, Home as HomeIcon, Key, Globe, Headphones, CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';
import CountdownTimer from '../components/CountdownTimer';
import SoccerBall3D from '../components/SoccerBall3D';
import Card3D from '../components/Card3D';
import ListingCard from '../components/ListingCard';
import { useData } from '../contexts/DataContext';
import { IMAGES, HOST_CITIES, MATCH_SCHEDULE, TESTIMONIALS } from '../data/constants';

function ParallaxSection({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { listings } = useData();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main>
      <SEO />
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={IMAGES.hero} alt="World Cup" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/80 via-[#0a0a1a]/60 to-[#0a0a1a]" />
        </motion.div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Official Accommodation Partner — FIFA World Cup 2026™
          </motion.div>

          {/* Soccer ball */}
          <div className="flex justify-center mb-6">
            <SoccerBall3D />
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Your Home
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              At The World Cup
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Hotels, apartments & shortlets across <strong className="text-white">16 host cities</strong> in
            USA 🇺🇸, Mexico 🇲🇽 & Canada 🇨🇦. Book your World Cup accommodation with{' '}
            <strong className="text-amber-300">Anna Travel Agency</strong>.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mb-10"
          >
            <div>
              <p className="text-sm text-amber-400/70 mb-3 uppercase tracking-widest">Countdown to the Final 🏆</p>
              <CountdownTimer />
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/listings"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Browse Accommodations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/schedule"
              className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 hover:border-white/30 transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View Match Schedule
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /> Secure Booking</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> 4.9/5 Rating</div>
            <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-400" /> Easy Payment</div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" /> 16 Cities</div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ ACCOMMODATION TYPES ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ParallaxSection>
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4"
              >
                Accommodation Types
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-white mb-4"
              >
                Find Your Perfect Stay
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg max-w-2xl mx-auto"
              >
                Whether you're solo, with family, or rolling deep with your fan crew — we've got you covered.
              </motion.p>
            </div>
          </ParallaxSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Hotels',
                color: 'from-blue-500 to-cyan-400',
                shadow: 'shadow-blue-500/20',
                description: 'Premium hotels near stadiums with full amenities, room service, and concierge.',
                features: ['24/7 Front Desk', 'Room Service', 'Gym & Pool', 'Airport Shuttle'],
                count: listings.filter((l: any) => l.type === 'hotel').length,
              },
              {
                icon: HomeIcon,
                title: 'Apartments',
                color: 'from-emerald-500 to-green-400',
                shadow: 'shadow-emerald-500/20',
                description: 'Fully furnished apartments perfect for extended stays with kitchen and living space.',
                features: ['Full Kitchen', 'Living Room', 'Washer/Dryer', 'Local Experience'],
                count: listings.filter((l: any) => l.type === 'apartment').length,
              },
              {
                icon: Key,
                title: 'Shortlets',
                color: 'from-purple-500 to-pink-400',
                shadow: 'shadow-purple-500/20',
                description: 'Short-term rentals available for the entire World Cup period. Perfect for groups.',
                features: ['Multi-Bedroom', 'Group Friendly', 'Cost Effective', 'Flexible Dates'],
                count: listings.filter((l: any) => l.type === 'shortlet').length,
              },
            ].map((type: any, i: number) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card3D>
                  <div className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 ${type.shadow} shadow-lg`}>
                      <type.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{type.title}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{type.description}</p>
                    <div className="space-y-2 mb-6">
                      {type.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{type.count}+ listings available</span>
                      <Link
                        to="/listings"
                        className={`px-4 py-2 rounded-xl bg-gradient-to-r ${type.color} text-white font-semibold text-sm hover:scale-105 transition-transform`}
                      >
                        Browse
                      </Link>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOST CITIES ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4"
            >
              🇺🇸 🇲🇽 🇨🇦 Host Cities
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              16 Cities, 3 Countries, 1 Dream
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {HOST_CITIES.slice(0, 8).map((city, i) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/city/${city.id}`} className="group block">
                  <Card3D>
                    <div className="relative h-48 overflow-hidden">
                      <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="text-2xl mb-1">{city.countryFlag}</div>
                        <h3 className="text-white font-bold text-sm md:text-base">{city.name}</h3>
                        <p className="text-gray-300 text-xs">{city.stadium}</p>
                      </div>
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </Card3D>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
            >
              View All 16 Host Cities <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURED LISTINGS ═══════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
            >
              ⭐ Featured Listings
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Top Picks For World Cup 2026
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
            >
              View All Accommodations <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ MATCH SCHEDULE PREVIEW ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
            >
              📅 Tournament Schedule
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Key Dates To Plan Around
            </motion.h2>
          </div>

          <div className="space-y-3">
            {MATCH_SCHEDULE.map((match, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card3D>
                  <div className="flex items-center gap-4 p-4 md:p-5">
                    <div className="w-16 md:w-24 text-center shrink-0">
                      <span className="text-xs md:text-sm text-amber-400 font-medium">{match.date}</span>
                    </div>
                    <div className="w-px h-10 bg-gradient-to-b from-amber-500 to-red-500" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm md:text-base">{match.match}</h4>
                      <p className="text-gray-400 text-xs md:text-sm truncate">{match.venue} — {match.city}</p>
                    </div>
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/schedule" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
              View Full Schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Why Anna Travel Agency?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Verified Properties', desc: 'Every listing is personally verified for quality and safety.', color: 'text-green-400' },
              { icon: MapPin, title: 'Stadium Proximity', desc: 'All properties within easy reach of World Cup venues.', color: 'text-blue-400' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Pay safely with Stripe. Full refund policy included.', color: 'text-purple-400' },
              { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock multilingual support for all guests.', color: 'text-amber-400' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center">
                    <item.icon className={`w-10 h-10 mx-auto mb-4 ${item.color}`} />
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Loved By Fans Worldwide
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6">
                    <div className="flex mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{t.name}</p>
                        <p className="text-gray-500 text-xs">{t.country}</p>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TICKET RESALE ═══════════════ */}
      <section id="ticket-resale" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.03] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4"
            >
              🎫 Official Ticket Resale
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Buy & Sell World Cup Tickets
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Plans change — we get it. Sell tickets you can't use or find last-minute tickets at fair prices. Every transaction is verified and guaranteed.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🏷️', title: 'Sell Your Tickets', desc: "List tickets you can't use. Set your own price. We handle the secure transfer and payment to you.", gradient: 'from-amber-500 to-orange-500' },
              { icon: '🛒', title: 'Buy Verified Tickets', desc: 'Browse available tickets from verified sellers. Every ticket is authenticated before sale.', gradient: 'from-emerald-500 to-green-500' },
              { icon: '🛡️', title: 'Safe & Guaranteed', desc: '100% buyer protection. If a ticket is invalid, you get a full refund. Secure escrow payments.', gradient: 'from-blue-500 to-cyan-500' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
                      {item.icon}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card3D>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">How Ticket Resale Works</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { step: '1', title: 'List or Browse', desc: 'Sellers list tickets with match details. Buyers search by match, city, or team.' },
                    { step: '2', title: 'Verify & Match', desc: 'We verify ticket authenticity. Payment is held safely in escrow.' },
                    { step: '3', title: 'Secure Transfer', desc: "Tickets transferred via FIFA's official resale platform or verified hand-off." },
                    { step: '4', title: 'Done!', desc: 'Buyer gets tickets, seller gets paid. Both protected by our guarantee.' },
                  ].map((s) => (
                    <div key={s.step} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                        {s.step}
                      </div>
                      <h4 className="text-white font-semibold text-sm mb-1">{s.title}</h4>
                      <p className="text-gray-500 text-xs">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card3D>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/tickets"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              🎫 Sell My Tickets
            </Link>
            <Link
              to="/tickets"
              className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-all flex items-center gap-2"
            >
              🔍 Find Tickets
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img src={IMAGES.fans1} alt="Fans" className="w-full h-80 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/95 via-[#0a0a1a]/80 to-[#0a0a1a]/60" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-16 max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  Don't Miss Out!
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">
                    Book Early, Save Big.
                  </span>
                </h2>
                <p className="text-gray-300 mb-8">
                  Prices are rising fast as the World Cup approaches. Secure your accommodation now and enjoy early-bird discounts.
                </p>
                <Link
                  to="/listings"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:scale-105 transition-all"
                >
                  Book Now — From $150/night <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
