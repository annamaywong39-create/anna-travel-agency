import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Headphones, Mail, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import ListingCard from '../components/ListingCard';
import BtsPromoBanner from '../components/BtsPromoBanner';
import { FEATURED_US_EVENTS } from '../data/events';
import { eventImageFor } from '../lib/eventImages';

const slides = [
  { image: '/images/hero.jpg', tag: 'TRAVEL AROUND THE MOMENT', title: 'Travel well for the moments that matter.', body: 'Event access, selected stays, and personal support for the trip around it.' },
  { image: '/images/fans.jpg', tag: 'FEEL THE MOMENT', title: 'Go where the energy is.', body: 'Find the event, bring your people, and let us help with the details.' },
  { image: '/images/city.jpg', tag: 'MAKE THE JOURNEY YOURS', title: 'Your next story starts here.', body: 'A considered way to plan tickets, stays, and the journey between them.' },
];

const benefits = [
  { icon: ShieldCheck, title: 'Supplier checked', body: 'Availability is verified before confirmation.' },
  { icon: Headphones, title: 'Human support', body: 'A real concierge when plans need a hand.' },
  { icon: CheckCircle2, title: 'Clear requests', body: 'Straightforward next steps and honest pricing.' },
  { icon: Sparkles, title: 'Selected moments', body: 'A focused collection, not endless noise.' },
];

export default function Home() {
  const { listings } = useData();
  const [slide, setSlide] = useState(0);
  const [planner, setPlanner] = useState<'tickets' | 'stays' | 'trip'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const current = slides[slide];
  const events = FEATURED_US_EVENTS.filter((event) => new Date(event.date).getTime() > Date.now()).slice(0, 4);
  const stays = listings.filter((listing) => listing.available !== false).slice(0, 3);

  useEffect(() => { const timer = window.setInterval(() => setSlide((value) => (value + 1) % slides.length), 6000); return () => window.clearInterval(timer); }, []);

  return <main className="home-luxury min-h-screen bg-[#f6f9fd] text-[#14253f] dark:bg-[#0A1931] dark:text-[#E2E8F0]">
    <SEO title="Curated event travel and stays" description="Plan event trips with selected stays, ticket requests, and personal concierge support from Anna Travel Agency." />
    <BtsPromoBanner />
    <section className="relative overflow-visible bg-[#ddecfb] mt-0">
      <img src={current.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" width="1600" height="900" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#e9f4ff] via-[#edf7ff]/90 to-transparent" />
      <div className="relative mx-auto grid min-h-[590px] max-w-7xl items-center gap-10 px-5 pb-36 pt-32 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12">
        <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#b08a42]">{current.tag}</p><h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.04] tracking-[-.04em] text-[#14253f] sm:text-7xl">{current.title}</h1><p className="mt-6 max-w-lg text-lg leading-8 text-[#53677f]">{current.body}</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/tickets" className="inline-flex items-center gap-2 rounded-full bg-[#1267c4] px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-900/15 hover:bg-[#0d56a5]">Explore tickets <ArrowRight className="h-4 w-4" /></Link><Link to="/listings" className="inline-flex items-center gap-2 rounded-full border border-[#9cb4cd] bg-white/60 px-6 py-3.5 font-bold text-[#14253f] hover:bg-white">Find a stay</Link></div></div>
        <div className="relative mt-6 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:mt-0">
          <div className="absolute right-1/2 top-1/2 h-[300px] w-[340px] -translate-y-1/2 translate-x-1/2 rotate-2 overflow-hidden rounded-[2rem] border-[6px] border-white/80 shadow-2xl transition-all duration-700 sm:h-[360px] sm:w-[460px] md:right-0 md:h-[390px] md:w-[520px] md:translate-x-0 lg:rounded-[2.5rem] lg:border-8">
            <img src={current.image} alt="Travel and event inspiration" width="900" height="650" className="h-full w-full object-cover transition-all duration-700" />
          </div>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-0 md:left-auto md:right-24 md:translate-x-0">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setSlide(idx)} aria-label={`Go to slide ${idx+1}`} className={`h-2 rounded-full transition-all ${idx===slide ? 'w-6 bg-[#1267C4]' : 'w-2 bg-white/70 hover:bg-white'}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 z-20 w-[calc(100%-2.5rem)] max-w-6xl -translate-x-1/2 translate-y-1/2 rounded-2xl border border-[#d8e4ef] bg-white p-2 shadow-2xl shadow-[#16375c]/15">
        <div className="flex gap-1 rounded-xl bg-[#f1f6fb] p-1">{(['tickets','stays','trip'] as const).map((item) => <button key={item} type="button" onClick={() => setPlanner(item)} className={`rounded-lg px-5 py-3 text-sm font-bold capitalize transition ${planner === item ? 'bg-white text-[#1267C4] shadow-sm' : 'text-[#657890]'}`}>{item === 'trip' ? 'Plan my trip' : item}</button>)}</div>
        <div className="grid gap-2 p-3 sm:grid-cols-[1.5fr_1fr_auto]">
          <label className="relative block rounded-xl border border-[#e2eaf2] px-4 py-2 focus-within:border-[#1267C4]">
            <span className="block text-xs text-[#8b9aae]">{planner === 'tickets' ? 'What are you seeing?' : 'Where are you going?'}</span>
            <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder={planner === 'tickets' ? 'BTS, Lollapalooza, US Open...' : 'New York, Baltimore, Arlington...'} className="w-full bg-transparent text-sm font-semibold text-[#24364d] outline-none placeholder:text-[#9db0c6]" />
          </label>
          <div className="rounded-xl border border-[#e2eaf2] px-4 py-2">
            <span className="block text-xs text-[#8b9aae]">Travellers</span>
            <span className="text-sm font-semibold text-[#24364d]">2 travellers • Flexible dates</span>
          </div>
          <Link to={`${planner === 'tickets' ? '/tickets' : '/listings'}${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`} className="flex items-center justify-center rounded-xl bg-[#1267C4] px-6 py-3 text-white hover:bg-[#0d56a5]"><Search className="h-5 w-5" /></Link>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 pb-8 pt-28 sm:px-8 lg:px-12"><div className="grid gap-4 md:grid-cols-4">{benefits.map(({ icon: Icon, title, body }) => <div key={title} className="flex gap-3 rounded-2xl bg-white p-5 shadow-sm"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f0fc] text-[#1267c4]"><Icon className="h-5 w-5" /></div><div><h2 className="font-semibold text-[#14253f]">{title}</h2><p className="mt-1 text-sm leading-5 text-[#718198]">{body}</p></div></div>)}</div></section>
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12"><div className="flex items-end justify-between border-b border-[#dce7f0] pb-5"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#b08a42]">Selected for the season</p><h2 className="mt-2 font-serif text-4xl font-semibold text-[#14253f]">Events worth travelling for.</h2></div><Link to="/tickets" className="hidden items-center gap-2 font-semibold text-[#1267c4] sm:flex">View all <ChevronRight className="h-4 w-4" /></Link></div><div className="mt-8 grid gap-5 md:grid-cols-4">{events.map((event) => <Link key={event.id} to="/tickets" className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="event-media"><img src={eventImageFor(event)} alt={event.title} width="700" height="440" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#b08a42]">{event.category}</p><h3 className="mt-2 line-clamp-2 font-serif text-xl font-semibold text-[#14253f]">{event.title}</h3><p className="mt-3 flex items-center gap-2 text-sm text-[#718198]"><CalendarDays className="h-4 w-4 text-[#1267c4]" />{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div></Link>)}</div></section>
    <section className="bg-[#e8f1f8] px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between border-b border-[#cbdce9] pb-5"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#b08a42]">Good places to come back to</p><h2 className="mt-2 font-serif text-4xl font-semibold text-[#14253f]">Selected stays.</h2></div><Link to="/listings" className="hidden items-center gap-2 font-semibold text-[#1267c4] sm:flex">Browse stays <ChevronRight className="h-4 w-4" /></Link></div><div className="mt-8 grid gap-6 md:grid-cols-3">{stays.map((listing, index) => <ListingCard key={listing.id} listing={listing} index={index} />)}</div></div></section>
    <section className="px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-3xl bg-[#14253f] p-8 text-white sm:p-12 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#e3c782]">Your journey, our priority</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold sm:text-5xl">Tell us the moment. We will help shape the trip.</h2></div><Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e3c782] px-6 py-3.5 font-bold text-[#14253f]">Speak to the concierge <ArrowRight className="h-4 w-4" /></Link></div></section>
    <section className="bg-[#1267c4] px-5 py-8 text-white sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15"><Mail className="h-5 w-5" /></div><div><p className="font-bold">A little inspiration, occasionally</p><p className="text-sm text-white/70">Travel ideas and selected moments, sent thoughtfully.</p></div></div><form className="flex w-full max-w-md gap-2" onSubmit={(event) => event.preventDefault()}><input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder="Your email address" className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-white" /><button type="submit" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1267c4]">Subscribe</button></form></div></section>
  </main>;
}
