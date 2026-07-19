import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useWillChange, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight, Shield, Star, MapPin, Calendar, CreditCard,
  Building2, Home as HomeIcon, Key, Globe, Headphones, CheckCircle2, Search, Users,
  Plane, Clock, Headphones as HeadphonesIcon, Hotel, ChevronLeft, ChevronRight, Car
} from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import ListingCard from '../components/ListingCard';
import { useData } from '../contexts/DataContext';
import { IMAGES, TESTIMONIALS } from '../data/constants';

// ─── Slideshow Images (Diverse Travel Collection) ────
const SLIDESHOW_IMAGES = [
  'https://images.pexels.com/photos/2606028/pexels-photo-2606028.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/6434592/pexels-photo-6434592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/14750392/pexels-photo-14750392.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/8134808/pexels-photo-8134808.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/371589/pexels-photo-371589.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/2834651/pexels-photo-2834651.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/1687857/pexels-photo-1687857.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/31514419/pexels-photo-31514419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/31514425/pexels-photo-31514425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/1461370/pexels-photo-1461370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/20624534/pexels-photo-20624534.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/25696388/pexels-photo-25696388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalSlides = SLIDESHOW_IMAGES.length;

  const goToSlide = (index: number) => {
    setCurrentImageIndex((index + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide(currentImageIndex + 1);
  const prevSlide = () => goToSlide(currentImageIndex - 1);

  // ─── Auto-play ────────────────────────────────────
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  // ─── Search Widget State ──────────────────────────
  const [activeTab, setActiveTab] = useState<'stays' | 'events'>('stays');
  const availableListings = listings.filter(l => l.available !== false);

  // ─── Core Services aligned to Banner Footer ──────
  const services = [
    { icon: Hotel, title: 'Hotel Bookings', description: 'Luxury & handpicked hotels worldwide.', color: 'from-[#DB8293] to-[#e8a3b0]' },
    { icon: Car, title: 'Airport Transfers', description: 'Seamless luxury pickup & drop-off.', color: 'from-[#C49B55] to-[#dcb16f]' },
    { icon: Globe, title: 'Travel Experiences', description: 'Curated world tours & bespoke activities.', color: 'from-[#DB8293] to-[#C49B55]' },
    { icon: HeadphonesIcon, title: 'Support 24/7', description: 'Our team is always on call for you.', color: 'from-[#C49B55] to-[#DB8293]' },
  ];

  return (
    <main className="overflow-x-hidden bg-[#0A1128] text-white">
      <SEO />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* ─── Slideshow Background ───────────────── */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={SLIDESHOW_IMAGES[currentImageIndex]}
              alt="Travel destination"
              className="absolute inset-0 w-full h-full object-cover scale-110"
              loading="eager"
              fetchPriority="high"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/85 via-[#0B1220]/60 to-[#0B1220]" />
        </motion.div>

        {/* ─── Slideshow Controls ──────────────────── */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center border border-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center border border-white/10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-auto flex gap-2">
            {SLIDESHOW_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentImageIndex ? 'bg-[#DB8293] w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ─── Content ────────────────────────────── */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
          
          {/* ─── Logo Component Integration ────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-4"
          >
            <img 
              src="/logo.png" 
              alt="Anna Travel Agency Logo" 
              className="h-28 md:h-36 w-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
              onError={(e: { currentTarget: { style: { display: string; }; }; }) => {
                // Fail-safe layout in case logo.png hasn't been uploaded to public folder yet
                e.currentTarget.style.display = 'none';
                const fallback = document.getElementById('brand-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            {/* Fail-safe Fallback Markups */}
            <div id="brand-fallback" className="hidden flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center shadow-2xl mb-3">
                <span className="text-white font-bold text-4xl">A</span>
              </div>
              <span className="text-3xl font-bold tracking-wide">Anna</span>
              <span className="text-sm tracking-[0.4em] text-[#C49B55] uppercase font-medium mt-1">
                TRAVEL AGENCY
              </span>
            </div>
          </motion.div>

          {/* ─── Tagline & Heart Separator ─────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 w-full justify-center max-w-md">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-white/20 flex-1" />
              <span className="text-red-400 text-lg">♥</span>
              <div className="h-[1px] bg-gradient-to-l from-transparent to-white/20 flex-1" />
            </div>
            <span className="text-xs md:text-sm tracking-[0.3em] text-[#C49B55] uppercase font-semibold mt-2">
              YOUR JOURNEY, OUR PRIORITY
            </span>
          </motion.div>

          {/* ─── Main Header Banner Typography ──────── */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight tracking-tight"
          >
            <span className="text-white">
              WE PLAN.
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#DB8293] via-[#e8a3b0] to-[#C49B55] bg-clip-text text-transparent">
              YOU ENJOY.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-sm md:text-base text-gray-300 font-medium tracking-[0.15em] max-w-2xl mx-auto mb-10 uppercase"
          >
            Hotels <span className="text-[#DB8293]">•</span> Transfers <span className="text-[#DB8293]">•</span> Experiences <span className="text-[#DB8293]">•</span> And More
          </motion.p>

          {/* ─── CTAs (Branded Buttons) ───────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/listings"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-lg shadow-2xl shadow-[#DB8293]/25 hover:shadow-[#DB8293]/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Browse Accommodations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/tickets"
              className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 hover:border-[#DB8293]/50 transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-[#C49B55]" />
              View Events & Tickets
            </Link>
          </motion.div>

          {/* ─── Brand Search Widget ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="w-full max-w-4xl mx-auto bg-[#0B1220]/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl text-left"
          >
            <div className="flex gap-4 border-b border-white/10 pb-4 mb-5">
              <button 
                onClick={() => setActiveTab('stays')}
                className={`flex items-center gap-2 font-bold text-sm pb-2 transition-all border-b-2 ${
                  activeTab === 'stays' ? 'text-[#DB8293] border-[#DB8293]' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" /> Find Stays
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 font-bold text-sm pb-2 transition-all border-b-2 ${
                  activeTab === 'events' ? 'text-[#DB8293] border-[#DB8293]' : 'text-gray-400 border-transparent hover:text-white'
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
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#DB8293] focus:ring-1 focus:ring-[#DB8293]/30 transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#DB8293] transition-all"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="number" 
                  min="1" 
                  placeholder={activeTab === 'stays' ? "Guests" : "Tickets count"}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#DB8293] transition-all"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold rounded-2xl py-3.5 hover:shadow-lg hover:shadow-[#DB8293]/20 active:scale-98 transition-all flex items-center justify-center gap-2">
                <Search className="w-5 h-5" /> Search Now
              </button>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> Secure Booking</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-[#C49B55]" /> 4.9/5 Rating</div>
            <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#DB8293]" /> Easy Payment</div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-sky-400" /> Global Reach</div>
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
              className="w-1.5 h-1.5 rounded-full bg-[#DB8293]"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ SERVICES SECTION ═══════════════ */}
      <section className="py-24 relative bg-[#0B1220]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DB8293]/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ParallaxSection>
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-[#DB8293]/10 border border-[#DB8293]/20 text-[#DB8293] text-sm font-semibold mb-4"
              >
                Bespoke Services
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
                From luxury resorts to rapid airport logistics, discover our range of premium travel offerings.
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
                  <div className="p-6 text-center bg-[#131C2E] rounded-2xl border border-white/5 shadow-xl hover:border-[#DB8293]/25 transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-[#DB8293]/10`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ACCOMMODATION TYPES ═══════════════ */}
      <section className="py-24 relative bg-[#0A1128]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#C49B55]/10 border border-[#C49B55]/20 text-[#C49B55] text-sm font-semibold mb-4"
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
              Whether you are traveling solo, with family, or attending a major event — we have you covered.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Hotels',
                color: 'from-[#C49B55] to-[#dcb16f]',
                shadow: 'shadow-[#C49B55]/10',
                description: 'Premium hotels with curated elite amenities, full room service, and concierge care.',
                features: ['24/7 Front Desk', 'Room Service', 'Gym & Pool Access', 'Premium Shuttles'],
                count: listings.filter((l: any) => l.type === 'hotel').length,
              },
              {
                icon: HomeIcon,
                title: 'Apartments',
                color: 'from-[#DB8293] to-[#e8a3b0]',
                shadow: 'shadow-[#DB8293]/10',
                description: 'Fully furnished high-end apartments with home privacy and complete functional kitchens.',
                features: ['Full Kitchen', 'Private Living Areas', 'Washer/Dryer Included', 'Local Experience'],
                count: listings.filter((l: any) => l.type === 'apartment').length,
              },
              {
                icon: Key,
                title: 'Shortlets',
                color: 'from-slate-700 to-slate-800',
                shadow: 'shadow-slate-500/5',
                description: 'Highly flexible short-term leases optimized for family vacations, events, and group travel.',
                features: ['Multi-Bedroom Layouts', 'Group/Family Friendly', 'Cost Effective Rates', 'Flexible Extension Dates'],
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
                  <div className="p-8 bg-[#131C2E] rounded-3xl border border-white/5 h-full flex flex-col justify-between">
                    <div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 ${type.shadow} shadow-lg`}>
                        <type.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{type.title}</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed text-sm">{type.description}</p>
                      <div className="space-y-2 mb-6">
                        {type.features.map((f: string) => (
                          <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-[#DB8293]" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-gray-500">{type.count}+ listings available</span>
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
      <section className="py-24 relative bg-[#0B1220]">
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
              { icon: Shield, title: 'Verified Properties', desc: 'Every luxury listing is thoroughly checked for privacy, comfort, and security.', color: 'text-[#DB8293]' },
              { icon: MapPin, title: 'Elite Locations', desc: 'Handpicked spots offering proximity to key transport routes and top views.', color: 'text-[#C49B55]' },
              { icon: CreditCard, title: 'Safe Transactions', desc: 'Completely secure localized checkouts with customer-first refund safety policies.', color: 'text-[#DB8293]' },
              { icon: HeadphonesIcon, title: '24/7 Concierge Support', desc: 'Round-the-clock multilingual desk standby to assist with any travel issues.', color: 'text-[#C49B55]' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center bg-[#131C2E] border border-white/5 rounded-2xl shadow-lg hover:border-[#C49B55]/20 transition-all">
                    <item.icon className={`w-10 h-10 mx-auto mb-4 ${item.color}`} />
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED LISTINGS ═══════════════ */}
      <section className="py-24 relative bg-[#0A1128]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#DB8293]/10 border border-[#DB8293]/20 text-[#DB8293] text-sm font-semibold mb-4"
            >
              ★ Top Pick Accommodations
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Our Hand-Selected Top Stays
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-lg shadow-2xl shadow-[#DB8293]/25 hover:shadow-[#DB8293]/40 hover:scale-105 transition-all duration-300"
            >
              View All Accommodations <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 relative overflow-hidden bg-[#0B1220]">
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
                  <div className="p-6 bg-[#131C2E] border border-white/5 rounded-2xl">
                    <div className="flex mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-[#C49B55] fill-[#C49B55]" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center text-white text-xs font-bold">
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
      <section className="py-24 relative bg-[#0A1128]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C49B55]/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#C49B55]/10 border border-[#C49B55]/20 text-[#C49B55] text-sm font-semibold mb-4"
            >
              🎫 Events & Ticket Sales
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Get Verified Live Event Tickets
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              From concerts to exclusive local sports, find secure tickets for major events near you.
            </motion.p>
          </div>

          {/* Corrected Cut-off Card Logic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🎵', title: 'Concerts', desc: 'Secure reliable access to your favorite local and touring global artists.', gradient: 'from-[#DB8293] to-[#e8a3b0]' },
              { icon: '⚽', title: 'Sports Matches', desc: 'Football, basketball tournaments, tennis — buy authentic verified entry seats.', gradient: 'from-[#C49B55] to-[#dcb16f]' },
              { icon: '🎭', title: 'Theater & Shows', desc: 'Bespoke drama, standup comedy events, and premium musical experiences.', gradient: 'from-slate-700 to-slate-800' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 text-center bg-[#131C2E] border border-white/5 rounded-2xl shadow-xl h-full flex flex-col justify-between">
                    <div>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-[#0B1220]/50`}>
                        {item.icon}
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/tickets"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-lg shadow-2xl shadow-[#DB8293]/25 hover:shadow-[#DB8293]/40 hover:scale-105 transition-all duration-300"
            >
              Explore Tickets <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}