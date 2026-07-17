import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useWillChange, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight, Shield, Star, MapPin, Calendar, CreditCard,
  Building2, Home as HomeIcon, Key, Globe, Headphones, CheckCircle2, Search, Users,
  Plane, Clock, Headphones as HeadphonesIcon, Hotel, Truck
} from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import ListingCard from '../components/ListingCard';
import { useData } from '../contexts/DataContext';
import { IMAGES, TESTIMONIALS } from '../data/constants';

// ─── Slideshow Images ──────────────────────────────
const SLIDESHOW_IMAGES = [
  IMAGES.hotel1,
  IMAGES.hotel2,
  IMAGES.hotel3,
  IMAGES.apartment1,
  IMAGES.apartment2,
  IMAGES.apartment3,
  IMAGES.nyc,
  IMAGES.mexico,
  IMAGES.toronto,
  IMAGES.vancouver,
];

// ─── Parallax Section ──────────────────────────────
function ParallaxSection({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const willChange = useWillChange();
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div ref={ref} style={{ y: shouldReduceMotion ? 0 : y, willChange }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { listings } = useData();
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = shouldReduceMotion ? 0 : useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = shouldReduceMotion ? 1 : useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // ─── Slideshow State ──────────────────────────────
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ─── Search Widget State ──────────────────────────
  const [activeTab, setActiveTab] = useState<'stays' | 'events'>('stays');
  const availableListings = listings.filter(l => l.available !== false);

  // ─── Core Services ────────────────────────────────
  const services = [
    { icon: Hotel, title: 'Hotels', description: 'Luxury & budget stays worldwide', color: 'from-amber-400 to-amber-600' },
    { icon: Plane, title: 'Airport Transfers', description: 'Seamless pickup & drop-off', color: 'from-amber-500 to-amber-700' },
    { icon: Globe, title: 'Experiences', description: 'Curated tours & activities', color: 'from-amber-400 to-amber-600' },
    { icon: HeadphonesIcon, title: '24/7 Support', description: 'Round-the-clock assistance', color: 'from-amber-500 to-amber-700' },
  ];

  return (
    <main className="overflow-x-hidden">
      <SEO />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* ─── Slideshow Background ───────────────── */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={SLIDESHOW_IMAGES[currentImageIndex]}
              alt="Luxury travel destination"
              className="absolute inset-0 w-full h-full object-cover scale-110"
              loading="eager"
              fetchPriority="high"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/80 via-[#0a0a1a]/60 to-[#0a0a1a]" />
          {/* Slideshow indicator dots */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {SLIDESHOW_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentImageIndex ? 'bg-amber-400 w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* ─── Content ────────────────────────────── */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          {/* ─── Brand Tagline ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-sm tracking-[0.3em] text-amber-400/80 uppercase font-medium">
              Anna Travel Agency
            </span>
          </motion.div>

          {/* ─── Main Title ────────────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight"
          >
            <span className="text-white">
              YOUR JOURNEY,
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              OUR PRIORITY
            </span>
          </motion.h1>

          {/* ─── Subtitle ──────────────────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4"
          >
            <span className="text-amber-400 font-medium">WE PLAN.</span>
            <span className="text-white"> YOU ENJOY.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Hotels · Airport Transfers · Experiences · And More
          </motion.p>

          {/* ─── CTAs ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/listings"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Browse Accommodations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/tickets"
              className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 hover:border-white/30 transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View Events & Tickets
            </Link>
          </motion.div>

          {/* ─── Search Widget ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-full max-w-4xl mx-auto bg-slate-950/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl text-left"
          >
            <div className="flex gap-4 border-b border-white/10 pb-4 mb-5">
              <button 
                onClick={() => setActiveTab('stays')}
                className={`flex items-center gap-2 font-bold text-sm pb-2 transition-all border-b-2 ${
                  activeTab === 'stays' ? 'text-amber-300 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" /> Find Stays
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 font-bold text-sm pb-2 transition-all border-b-2 ${
                  activeTab === 'events' ? 'text-amber-300 border-amber-400' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" /> Find Tickets
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'stays' ? "Where are you going?" : "Search artist or event..."}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="number" 
                  min="1" 
                  placeholder={activeTab === 'stays' ? "Guests" : "Tickets count"}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl py-3.5 hover:shadow-lg hover:shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2">
                <Search className="w-5 h-5" /> Search Now
              </button>
            </div>
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
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" /> Global Reach</div>
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

      {/* ═══════════════ SERVICES SECTION ═══════════════ */}
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
                Services
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-white mb-4"
              >
                WE PLAN. YOU ENJOY.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg max-w-2xl mx-auto"
              >
                Hotels · Airport Transfers · Experiences · And More
              </motion.p>
            </div>
          </ParallaxSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-amber-500/20`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-400 text-sm">{service.description}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ACCOMMODATION TYPES ═══════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Whether you're traveling solo, with family, or for an event — we've got you covered.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Hotels',
                color: 'from-blue-500 to-cyan-400',
                shadow: 'shadow-blue-500/20',
                description: 'Premium hotels with full amenities, room service, and concierge.',
                features: ['24/7 Front Desk', 'Room Service', 'Gym & Pool', 'Airport Shuttle'],
                count: listings.filter((l: any) => l.type === 'hotel').length,
              },
              {
                icon: HomeIcon,
                title: 'Apartments',
                color: 'from-emerald-500 to-green-400',
                shadow: 'shadow-emerald-500/20',
                description: 'Fully furnished apartments with kitchen and living space.',
                features: ['Full Kitchen', 'Living Room', 'Washer/Dryer', 'Local Experience'],
                count: listings.filter((l: any) => l.type === 'apartment').length,
              },
              {
                icon: Key,
                title: 'Shortlets',
                color: 'from-purple-500 to-pink-400',
                shadow: 'shadow-purple-500/20',
                description: 'Short-term rentals perfect for groups and extended stays.',
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
                      {type.features.map((f: string) => (
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
              Why Choose Anna Travel Agency?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Verified Properties', desc: 'Every listing is personally verified for quality and safety.', color: 'text-green-400' },
              { icon: MapPin, title: 'Best Locations', desc: 'Properties in prime locations with easy access to transport.', color: 'text-blue-400' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Pay safely with Stripe. Full refund policy included.', color: 'text-purple-400' },
              { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Round-the-clock multilingual support for all guests.', color: 'text-amber-400' },
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
              Top Picks For Your Stay
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableListings.slice(0, 6).map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
            >
              View All Accommodations <ArrowRight className="w-5 h-5" />
            </Link>
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
              Loved By Travelers Worldwide
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 6).map((t, i) => (
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
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

      {/* ═══════════════ EVENTS & TICKETS ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.03] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4"
            >
              🎫 Events & Ticket Sales
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Buy Tickets for Events
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              From concerts to sports, find tickets for events near you. Safe, verified, and guaranteed.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🎵', title: 'Concerts', desc: 'Find tickets for your favorite artists and bands.', gradient: 'from-pink-500 to-rose-500' },
              { icon: '⚽', title: 'Sports Events', desc: 'Football, basketball, tennis — get tickets to live matches.', gradient: 'from-amber-500 to-amber-600' },
              { icon: '🎭', title: 'Theater & Shows', desc: 'Broadway, comedy, and more — book your seat today.', gradient: 'from-purple-500 to-indigo-500' },
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/tickets"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Browse Events & Tickets <ArrowRight className="w-5 h-5" />
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
            <img 
              src={IMAGES.fans1} 
              alt="Travel" 
              className="w-full h-80 md:h-96 object-cover" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/95 via-[#0a0a1a]/80 to-[#0a0a1a]/60" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-16 max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  Ready to Travel?
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    Book Your Stay Today.
                  </span>
                </h2>
                <p className="text-gray-300 mb-8">
                  Find the perfect accommodation for your next trip. Browse our verified listings and book with confidence.
                </p>
                <Link
                  to="/listings"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg shadow-2xl shadow-amber-500/25 hover:scale-105 transition-all"
                >
                  Browse Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}