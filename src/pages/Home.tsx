import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Globe2, Headphones, MapPin, ShieldCheck, Sparkles, Ticket } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import ListingCard from '../components/ListingCard';
import { FEATURED_US_EVENTS } from '../data/events';
import { eventImageFor } from '../lib/eventImages';
import BtsSupporterBanner from '../components/BtsSupporterBanner';

const services = [
  { title: 'Stays secured around your plans', body: 'Hotels, apartments, and shortlets selected around the places you are going.', icon: MapPin },
  { title: 'Access to the big moments', body: 'A considered selection of major sport, music, and cultural events.', icon: Ticket },
  { title: 'A human hand when you need it', body: 'We help confirm availability, coordinate suppliers, and keep your trip moving.', icon: Headphones },
];

const futureEvents = FEATURED_US_EVENTS
  .filter((event) => new Date(event.date).getTime() > Date.now())
  .slice(0, 3);

const heroSlides = [
  {
    src: '/images/hero.jpg',
    alt: 'Stadium and city travel destination',
    eyebrow: 'Start with the moment',
    title: 'Travel well for the moments that matter.',
    body: 'Curated access to major events, paired with a stay that makes the journey feel effortless.',
    caption: 'One trip, thoughtfully put together.',
  },
  {
    src: '/images/fans.jpg',
    alt: 'Fans enjoying a live event',
    eyebrow: 'Follow the feeling',
    title: 'Go where the energy is.',
    body: 'From the first note to the final whistle, we help you get closer to the moments you came for.',
    caption: 'Make room for the people and places you love.',
  },
  {
    src: '/images/event-music.jpg',
    alt: 'Live music event atmosphere',
    eyebrow: 'Make the memory',
    title: 'Turn a ticket into a story.',
    body: 'Choose the event, then let us help shape the stay, the details, and the journey around it.',
    caption: 'The best trips have a reason.',
  },
  {
    src: '/images/stadium.jpg',
    alt: 'Stadium event destination',
    eyebrow: 'Stay close to what matters',
    title: 'Be there when it happens.',
    body: 'Selected stays near the places that bring people together, with a human hand when plans change.',
    caption: 'Closer to the action. Calmer in the details.',
  },
  {
    src: '/images/city.jpg',
    alt: 'City holiday destination',
    eyebrow: 'Leave room for wonder',
    title: 'Your next story starts here.',
    body: 'Tell us the moment. We will help connect the ticket, the room, and everything in between.',
    caption: 'Go well. Come back with more to remember.',
  },
];

export default function Home() {
  const { listings } = useData();
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroImageIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);
  const availableListings = listings.filter((listing) => listing.available !== false);
  const featuredStays = availableListings.slice(0, 3);

  return (
    <main className="overflow-hidden bg-[#F8F5F0] text-[#0B1F3A]">
      <div className="fixed left-0 right-0 top-20 z-40">
        <BtsSupporterBanner />
      </div>
      <div className="h-[190px] sm:h-[150px] lg:h-[112px]" aria-hidden="true" />
      <SEO title="Curated event travel and stays" description="Plan the trip around the moment. Curated event access, accommodation, and travel support from Anna Travel Agency." />

      <section className="relative isolate overflow-hidden bg-[#0B1F3A] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(217,140,155,0.22),transparent_35%),radial-gradient(circle_at_15%_80%,rgba(199,165,106,0.18),transparent_35%)]" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
          <div className="max-w-2xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#E6C98E]" aria-live="polite"><span className="h-px w-10 bg-[#D98C9B]" />{heroSlides[heroImageIndex].eyebrow}</p>
            <h1 className="min-h-[10.5rem] max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:min-h-[15rem] sm:text-7xl">{heroSlides[heroImageIndex].title}</h1>
            <p className="mt-7 min-h-[6rem] max-w-lg text-lg leading-8 text-white/70">{heroSlides[heroImageIndex].body}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/tickets" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D98C9B] px-6 py-3.5 font-semibold text-white transition hover:bg-[#c97888]"><Ticket className="h-4 w-4" />Explore events</Link>
              <Link to="/listings" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:border-[#E6C98E] hover:text-[#E6C98E]">Find a stay <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/65"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#E6C98E]" />Supplier checked</span><span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#D98C9B]" />International support</span><span className="flex items-center gap-2"><Headphones className="h-4 w-4 text-[#E6C98E]" />Personal assistance</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-6 overflow-hidden rounded-[2.5rem]" aria-hidden="true">
              <img src={heroSlides[heroImageIndex].src} alt="" width="900" height="600" className="h-full w-full scale-110 object-cover opacity-45 blur-2xl transition-opacity duration-700" />
              <div className="absolute inset-0 bg-[#0B1F3A]/45" />
            </div>
            <div className="absolute -inset-4 rounded-[2rem] border border-[#D98C9B]/25 rotate-3" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#132A46] shadow-2xl shadow-black/30">
              <div className="relative h-[430px] w-full overflow-hidden">
                <img
                  key={heroSlides[heroImageIndex].src}
                  src={heroSlides[heroImageIndex].src}
                  alt={heroSlides[heroImageIndex].alt}
                  width={900}
                  height={600}
                  decoding="async"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  onError={(event) => {
                    if (!event.currentTarget.src.endsWith('/images/hero.jpg')) event.currentTarget.src = '/images/hero.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-7"><div><p className="text-sm text-[#E6C98E]">{heroSlides[heroImageIndex].eyebrow}</p><p className="mt-2 min-h-[3.5rem] text-2xl font-medium leading-tight">{heroSlides[heroImageIndex].caption}</p></div><div className="flex gap-1.5" aria-label="Hero story carousel"><span className="sr-only">Travel story images</span>{heroSlides.map((slide, index) => <button key={slide.src} type="button" aria-label={`Show story ${index + 1}`} aria-pressed={index === heroImageIndex} onClick={() => setHeroImageIndex(index)} className={`h-2 rounded-full transition-all ${index === heroImageIndex ? 'w-6 bg-[#F2C94C]' : 'w-2 bg-white/50 hover:bg-white'}`} />)}</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-3 rounded-2xl border border-[#E4DCD2] bg-white p-3 shadow-xl shadow-[#0B1F3A]/10 md:grid-cols-[1fr_1fr_auto]">
          <Link to="/listings" className="group rounded-xl bg-[#F8F5F0] p-4 transition hover:bg-[#EDE5DA]"><span className="text-xs uppercase tracking-wider text-[#637083]">Start with a stay</span><span className="mt-1 flex items-center justify-between font-semibold text-[#0B1F3A]">Where are you going? <ChevronRight className="h-4 w-4 text-[#D98C9B] transition group-hover:translate-x-1" /></span></Link>
          <Link to="/tickets" className="group rounded-xl bg-[#F8F5F0] p-4 transition hover:bg-[#EDE5DA]"><span className="text-xs uppercase tracking-wider text-[#637083]">Start with an event</span><span className="mt-1 flex items-center justify-between font-semibold text-[#0B1F3A]">What is worth travelling for? <ChevronRight className="h-4 w-4 text-[#D98C9B] transition group-hover:translate-x-1" /></span></Link>
          <Link to="/tickets" className="flex items-center justify-center gap-2 rounded-xl bg-[#D98C9B] px-6 font-semibold text-white transition hover:bg-[#c97888]"><Sparkles className="h-4 w-4" />Plan my trip</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
        <div className="mb-10 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B28C4D]">The Anna difference</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl">Less searching. More going.</h2><p className="mt-4 leading-7 text-[#637083]">We bring the important pieces together so you can focus on the experience itself.</p></div>
        <div className="grid gap-5 md:grid-cols-3">{services.map(({ title, body, icon: Icon }) => <article key={title} className="rounded-2xl border border-[#E4DCD2] bg-white p-7"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5E1E5] text-[#C97888]"><Icon className="h-5 w-5" /></div><h3 className="mt-6 text-xl font-semibold text-[#0B1F3A]">{title}</h3><p className="mt-3 leading-7 text-[#637083]">{body}</p></article>)}</div>
      </section>

      <section className="bg-[#EDE5DA] py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B28C4D]">Selected for the season</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#0B1F3A]">Events worth the journey.</h2></div><Link to="/tickets" className="inline-flex items-center gap-2 font-semibold text-[#0B1F3A] hover:text-[#C97888]">View all events <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-10 grid gap-5 md:grid-cols-3">{futureEvents.map((event) => <article key={event.id} className="overflow-hidden rounded-2xl border border-[#DCD1C3] bg-white"><div className="event-media"><img src={eventImageFor(event)} alt={event.title} width="900" height="560" decoding="async" className="h-full w-full object-cover" loading="lazy" /></div><div className="p-5"><div className="flex items-center justify-between text-xs uppercase tracking-wider"><span className="text-[#C97888]">{event.category}</span><span className="text-[#637083]">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><h3 className="mt-3 text-xl font-semibold text-[#0B1F3A]">{event.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-[#637083]"><MapPin className="h-4 w-4 text-[#B28C4D]" />{event.city}</p><Link to="/tickets" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A]">View access <ArrowRight className="h-4 w-4" /></Link></div></article>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B28C4D]">Stays around the moment</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#0B1F3A]">A good place to come back to.</h2></div><Link to="/listings" className="inline-flex items-center gap-2 font-semibold text-[#0B1F3A] hover:text-[#C97888]">Browse all stays <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-10 grid gap-6 md:grid-cols-3">{featuredStays.length ? featuredStays.map((listing, index) => <ListingCard key={listing.id} listing={listing} index={index} />) : <div className="rounded-2xl border border-dashed border-[#DCD1C3] p-10 text-[#637083] md:col-span-3">Our accommodation collection is being refreshed. Check back shortly or contact our concierge.</div>}</div></section>

      <section className="bg-[#0B1F3A] py-20 text-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E6C98E]">Travel with confidence</p><h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.03em]">Tell us the moment. We will help shape the trip.</h2><p className="mt-4 max-w-xl leading-7 text-white/65">From a ticket request to the room waiting when you arrive, our team helps connect the details.</p></div><Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D98C9B] px-7 py-4 font-semibold text-white transition hover:bg-[#c97888]">Speak to the concierge <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  );
}
