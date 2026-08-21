import { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter, MapPin, Search, Ticket as TicketIcon, X, ShoppingCart, Hotel, Grid3X3, List, Clock, Heart, Star, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import BtsPromoBanner from '../components/BtsPromoBanner';
import TrustBadges from '../components/TrustBadges';
import RecentBookingsTicker from '../components/RecentBookingsTicker';
import StickyHoldBar from '../components/StickyHoldBar';
import { useData } from '../contexts/DataContext';
import { useWishlist } from '../contexts/WishlistContext';
import { FEATURED_US_EVENTS } from '../data/events';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { eventImageFor } from '../lib/eventImages';
import { formatVenueDate } from '../lib/eventDate';

type TicketOption = { id: string; name: string; section?: string; row?: string; seat_details?: string; delivery_method?: string; delivery_timing?: string; image_url?: string; discount_percent?: number; price: number; quantity_available: number };
type EventItem = {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  category: string;
  description?: string;
  image_url?: string;
  seat_map_url?: string;
  status: string;
  tickets: TicketOption[];
};

const FALLBACK_IMAGE = '/images/event-sport.jpg';
const dateFilters = [
  { id: 'all', label: 'All dates' },
  { id: '7', label: 'Next 7 days' },
  { id: '30', label: 'Next 30 days' },
  { id: '90', label: 'Next 90 days' },
];

function eventStatus(date: string, currentStatus?: string) {
  if (currentStatus === 'cancelled') return 'cancelled';
  if (currentStatus === 'sold_out') return 'sold_out';
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return currentStatus || 'upcoming';
  return time < Date.now() ? 'finished' : currentStatus === 'live' ? 'live' : 'upcoming';
}

function countryFromCity(city: string) {
  if (/canada|toronto|vancouver/i.test(city)) return 'Canada';
  if (/mexico|guadalajara|monterrey/i.test(city)) return 'Mexico';
  if (/brazil|rio|são|sao|brasília|brasilia/i.test(city)) return 'Brazil';
  if (/australia|sydney|melbourne|perth|brisbane|adelaide|newcastle|townsville/i.test(city)) return 'Australia';
  return 'United States';
}

function isBtsBaltimoreEvent(item: Pick<EventItem, 'id' | 'title' | 'venue' | 'city' | 'date'>) {
  return item.id === 'bts-arirang-baltimore-2026-08-10'
    || (/bts/i.test(item.title) && /m&t bank stadium/i.test(item.venue) && /baltimore/i.test(item.city) && item.date.startsWith('2026-08-10'));
}

function btsDiscountPercent(ticket: TicketOption) {
  if (Number.isFinite(ticket.discount_percent)) return Math.max(60, Math.min(70, Number(ticket.discount_percent)));
  if (/field\s*r/i.test(`${ticket.section || ''} ${ticket.name}`)) return 70;
  if (/133/i.test(`${ticket.section || ''} ${ticket.name}`)) return 60;
  return 65;
}

function discountedTicketPrice(price: number, discountPercent: number) {
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}

function ticketGroup(ticket: TicketOption) {
  const text = `${ticket.name} ${ticket.section || ''}`.toLowerCase();
  if (/vip|suite|package|founder|club|experience|hot seat|deluxe|diamond|gold|silver|soundcheck|field/.test(text)) return 'Premium';
  if (/100|200/.test(text)) return 'Lower bowl';
  if (/300|400|500/.test(text)) return 'Upper bowl';
  return 'Other';
}

function fallbackEvents(): EventItem[] {
  return FEATURED_US_EVENTS.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    venue: event.venue,
    city: event.city,
    country: countryFromCity(event.city),
    category: event.category || 'Event',
    description: event.description,
    image_url: event.image_url,
    status: eventStatus(event.date, event.status),
    tickets: (event.tickets || []).map((ticket) => ({
      id: ticket.id,
      name: ticket.category_name,
      section: ticket.section,
      row: ticket.row,
      seat_details: ticket.seat_details,
      delivery_method: ticket.delivery_method,
      delivery_timing: ticket.delivery_timing,
      image_url: ticket.image_url,
      discount_percent: ticket.discount_percent,
      price: ticket.price,
      quantity_available: ticket.quantity_available,
    })),
  }));
}

export default function Tickets() {
  const { addToCart } = useData();
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlist();
  const navigate = useNavigate();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketGroupFilter, setTicketGroupFilter] = useState<'all' | 'Premium' | 'Lower bowl' | 'Upper bowl' | 'Other'>('all');
  const [mainTab, setMainTab] = useState<'events' | 'tickets'>('tickets');
  const [isHolding, setIsHolding] = useState(false);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [holdInfo, setHoldInfo] = useState<{ holdId: string; heldUntil: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (!isSupabaseConfigured) {
          if (!cancelled) setItems(fallbackEvents());
          return;
        }
        const [{ data: matches, error: matchError }, { data: events, error: eventError }] = await Promise.all([
          supabase.from('matches').select('*').gte('match_date', new Date().toISOString()).order('match_date'),
          supabase.from('events').select('*').order('date'),
        ]);
        if (matchError || eventError) throw matchError || eventError;

        const eventRows = events || [];
        const ids = eventRows.map((event) => event.id);
        const { data: ticketRows } = ids.length
          ? await supabase.from('event_tickets').select('*').in('event_id', ids).order('price')
          : { data: [] as any[] };
        const eventItems: EventItem[] = eventRows.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          venue: event.venue,
          city: event.city,
          country: countryFromCity(event.city),
          category: event.category || 'Event',
          description: event.description,
          image_url: eventImageFor(event),
          seat_map_url: event.seat_map_url ? String(event.seat_map_url) : undefined,
          status: eventStatus(event.date, event.status),
          tickets: (ticketRows || []).filter((ticket) => ticket.event_id === event.id).map((ticket) => ({
            id: ticket.id,
            name: ticket.category_name,
            section: ticket.section ? String(ticket.section) : undefined,
            row: ticket.row ? String(ticket.row) : undefined,
            seat_details: ticket.seat_details ? String(ticket.seat_details) : undefined,
            delivery_method: ticket.delivery_method ? String(ticket.delivery_method) : undefined,
            delivery_timing: ticket.delivery_timing ? String(ticket.delivery_timing) : undefined,
            image_url: ticket.image_url ? String(ticket.image_url) : undefined,
            discount_percent: ticket.discount_percent !== null && ticket.discount_percent !== undefined ? Number(ticket.discount_percent) : undefined,
            price: Number(ticket.price) || 0,
            quantity_available: Number(ticket.quantity_available) || 0,
          })),
        }));
        const matchItems: EventItem[] = (matches || []).map((match) => ({
          id: match.id,
          title: `${match.home_team} vs ${match.away_team}`,
          date: match.match_date,
          venue: match.venue,
          city: match.city,
          country: countryFromCity(match.city),
          category: 'Events',
          description: 'Access subject to supplier verification.',
          image_url: '/images/event-sport.jpg',
          status: eventStatus(match.match_date, match.status),
          tickets: [
            ['category_1', 'Category 1', match.category_1_price],
            ['category_2', 'Category 2', match.category_2_price],
            ['category_3', 'Category 3', match.category_3_price],
            ['category_4', 'Category 4', match.category_4_price],
          ].filter(([, , price]) => Number(price) > 0).map(([id, name, price]) => ({ id: `${match.id}-${id}`, name: String(name), price: Number(price), quantity_available: 10 })),
        }));
        if (!cancelled) {
          const upcomingOnly = [...matchItems, ...eventItems]
            .filter((item) => new Date(item.date).getTime() >= Date.now())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setItems(upcomingOnly);
        }
      } catch (error) {
        console.error('Unable to load tickets:', error);
        if (!cancelled) setItems(fallbackEvents());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => ['all', ...Array.from(new Set(items.map((item) => item.category))).sort()], [items]);
  const countries = useMemo(() => ['all', ...Array.from(new Set(items.map((item) => item.country))).sort()], [items]);
  const filtered = useMemo(() => {
    const now = Date.now();
    const maxDays = dateFilter === 'all' ? Infinity : Number(dateFilter);
    return items.filter((item) => {
      if (item.status === 'finished' || new Date(item.date).getTime() < Date.now()) return false;
      // Events tab: show all events, Tickets tab: only events with tickets available
      if (mainTab === 'tickets' && !item.tickets.some(t => t.quantity_available > 0)) return false;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || `${item.title} ${item.city} ${item.venue}`.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || item.category === category;
      const matchesCountry = country === 'all' || item.country === country;
      const diff = (new Date(item.date).getTime() - now) / 86400000;
      const matchesDate = dateFilter === 'all' || (diff >= 0 && diff <= maxDays);
      return matchesQuery && matchesCategory && matchesCountry && matchesDate;
    });
  }, [items, query, category, country, dateFilter, mainTab]);

  const releaseCurrentHold = async () => {
    if (holdInfo?.holdId && isSupabaseConfigured) {
      try {
        await supabase.rpc('release_ticket_hold', { p_hold_id: holdInfo.holdId });
      } catch {}
      setHoldInfo(null);
    }
  };

  const closePurchase = () => {
    void releaseCurrentHold();
    setSelected(null);
  };

  const openPurchase = (item: EventItem) => {
    void releaseCurrentHold();
    setSelected(item);
    setTicketId(item.tickets.find((ticket) => ticket.quantity_available > 0)?.id || '');
    setQuantity(1);
    setTicketSearch('');
    setTicketGroupFilter('all');
    setHoldError(null);
    setHoldInfo(null);
  };

  const selectedTicket = selected?.tickets.find((ticket) => ticket.id === ticketId);
  const selectedSeatMap = selected?.seat_map_url || (selected && /bts|m&t bank stadium|baltimore/i.test(`${selected.title} ${selected.venue} ${selected.city}`)
    ? '/images/seatmaps/mt-bank-stadium-bts-2026-08-10.png'
    : null);
  const visibleTickets = (selected?.tickets || [])
    .filter((ticket) => ticket.quantity_available > 0)
    .filter((ticket) => ticketGroupFilter === 'all' || ticketGroup(ticket) === ticketGroupFilter)
    .filter((ticket) => !ticketSearch.trim() || `${ticket.name} ${ticket.section || ''} ${ticket.row || ''}`.toLowerCase().includes(ticketSearch.trim().toLowerCase()))
    .sort((a, b) => a.price - b.price);

  const mapPosition = selectedTicket?.section === '532'
    ? { left: '39%', top: '83%' }
    : selectedTicket?.section === '133'
      ? { left: '61%', top: '66%' }
      : selectedTicket?.section === 'Field R'
        ? { left: '40%', top: '48%' }
        : null;

  const addTicket = async () => {
    if (!selected || !selectedTicket) return;
    setIsHolding(true);
    setHoldError(null);
    try {
      let holdId: string | undefined;
      let heldUntil: string | undefined;
      // 1. Attempt server-side 2-minute hold (prevents oversell)
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.rpc('hold_ticket', {
          p_ticket_id: selectedTicket.id,
          p_quantity: quantity,
        });
        if (error) {
          throw new Error(error.message.includes('Not enough') ? 'Not enough tickets available for this quantity. Please reduce quantity or try another section.' : error.message);
        }
        const row = Array.isArray(data) ? data[0] : data;
        if (row?.hold_id) {
          holdId = row.hold_id;
          heldUntil = row.held_until;
          setHoldInfo({ holdId: row.hold_id, heldUntil: row.held_until });
        }
      }

      const discounted = isBtsBaltimoreEvent(selected) || selectedTicket.discount_percent !== undefined || /bts/i.test(selected.title);
      const discountPercent = discounted ? btsDiscountPercent(selectedTicket) : 0;
      addToCart({
        id: `${selected.id}-${selectedTicket.id}`,
        type: 'ticket',
        item: {
          eventName: selected.title,
          ticketId: selectedTicket.id,
          venue: selected.venue,
          city: selected.city,
          specialOffer: discounted,
          discountPercent,
          holdId: holdId,
          heldUntil: heldUntil,
        } as any,
        quantity,
        price: discounted ? discountedTicketPrice(selectedTicket.price, discountPercent) : selectedTicket.price,
      });
      setSelected(null);
      navigate('/checkout');
    } catch (err: any) {
      console.error('Hold failed', err);
      setHoldError(err.message || 'Unable to hold tickets. Please try again.');
    } finally {
      setIsHolding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7FAFD] pt-2 pb-20 text-[#14253F]">
      <SEO title="Curated Events & Tickets" description="Explore high-demand events and verified ticket access with accommodation options." path="/tickets" />
      <div className="mb-8">
        <BtsPromoBanner />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#1267C4]">Curated access</p>
          <h1 className="text-4xl font-black tracking-tight text-[#14253F] md:text-6xl">The moments worth travelling for.</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#5B6B82]">A considered selection of major sporting, music, and cultural events — with a stay to match.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <TrustBadges />
            <RecentBookingsTicker />
          </div>
        </header>

        {/* Main Event vs Tickets tabs */}
        <section className="mb-6">
          <div className="inline-flex rounded-2xl border border-[#D8E5F0] bg-white p-1 shadow-sm">
            <button onClick={() => setMainTab('events')} className={`rounded-xl px-6 py-2.5 text-sm font-bold transition ${mainTab==='events' ? 'bg-[#14253F] text-white shadow-sm' : 'text-[#687A90] hover:text-[#14253F]'}`}>Events ({items.length})</button>
            <button onClick={() => setMainTab('tickets')} className={`rounded-xl px-6 py-2.5 text-sm font-bold transition ${mainTab==='tickets' ? 'bg-[#1267C4] text-white shadow-sm' : 'text-[#687A90] hover:text-[#14253F]'}`}>Tickets ({items.reduce((s,i)=>s+i.tickets.filter(t=>t.quantity_available>0).length,0)} options)</button>
          </div>
          <p className="mt-3 text-xs text-[#687A90]">{mainTab==='events' ? 'Events tab shows all events we have — title, date, venue, city, image, status. Click View Tickets to see ticket options.' : 'Tickets tab shows events that have tickets + section, row, price, discount, delivery, seatmap, hold timer.'}</p>
        </section>

        {/* Top picks — curated 3 — only in tickets tab */}
        {mainTab==='tickets' && !loading && filtered.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-[#F2C94C] fill-[#F2C94C]" />
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#14253F]">Top picks for you</h2>
              <span className="rounded-full bg-[#E7F1FC] px-2.5 py-1 text-[11px] font-semibold text-[#1267C4]">Best value • Verified</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {filtered
                .filter((i) => /bts/i.test(i.title))
                .slice(0, 3)
                .map((item) => {
                  const bestTicket = item.tickets.filter(t=>t.quantity_available>0).sort((a,b)=> (b.discount_percent||0)-(a.discount_percent||0))[0];
                  return (
                    <div key={`top-${item.id}`} className="relative overflow-hidden rounded-2xl border border-[#FFD166]/40 bg-gradient-to-br from-[#14253F] via-[#123A70] to-[#1267C4] p-4 text-white shadow-lg">
                      <div className="absolute right-3 top-3 rounded-full bg-[#F2C94C] px-2.5 py-1 text-[11px] font-bold text-[#14253F]">{bestTicket?.discount_percent ? `${bestTicket.discount_percent}% off` : 'Special offer'}</div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#FFD166]">{item.category} • {item.city}</p>
                      <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-tight">{item.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-white/70"><Calendar className="h-3 w-3" />{formatVenueDate(item.date, { month: 'short', day: 'numeric' })} • {item.venue}</p>
                      <button onClick={() => { const el = document.getElementById(`event-card-${item.id}`); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setQuery(item.title.split('—')[0].trim()); }} className="mt-3 w-full rounded-full bg-white px-4 py-2 text-xs font-bold text-[#14253F] hover:bg-[#FFD166]">View best seats</button>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        <section className="mb-8 rounded-2xl border border-[#D8E5F0] bg-white p-4 shadow-sm" aria-label="Event filters">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <label className="relative block">
              <span className="sr-only">Search events</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9AB0]" />
              <input id="event-search" name="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, city or venue" className="w-full rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] py-3 pl-11 pr-4 text-sm text-[#14253F] outline-none transition focus:border-[#1267C4]" />
            </label>
            <label><span className="sr-only">Event genre</span><select id="event-genre" name="genre" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-[#D8E5F0] bg-white px-4 py-3 text-sm text-[#14253F] outline-none focus:border-[#1267C4]"><option value="all">All genres</option>{categories.slice(1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span className="sr-only">Country</span><select id="event-country" name="country" value={country} onChange={(event) => setCountry(event.target.value)} className="w-full rounded-xl border border-[#D8E5F0] bg-white px-4 py-3 text-sm text-[#14253F] outline-none focus:border-[#1267C4]"><option value="all">All countries</option>{countries.slice(1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span className="sr-only">Date range</span><select id="event-date-range" name="dateRange" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-xl border border-[#D8E5F0] bg-white px-4 py-3 text-sm text-[#14253F] outline-none focus:border-[#1267C4]">{dateFilters.map((value) => <option key={value.id} value={value.id}>{value.label}</option>)}</select></label>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#687A90]"><span className="flex items-center gap-2"><Filter className="h-3.5 w-3.5" /> {filtered.length} curated event{filtered.length === 1 ? '' : 's'}</span><span className="flex items-center gap-1 rounded-lg border border-[#D8E5F0] bg-[#F7FAFD] p-1"><button type="button" onClick={() => setViewMode('grid')} aria-label="Grid view" className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-[#1267C4] text-white' : 'text-[#8A9AB0]'}`}><Grid3X3 className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setViewMode('list')} aria-label="List view" className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-[#1267C4] text-white' : 'text-[#8A9AB0]'}`}><List className="h-3.5 w-3.5" /></button></span></div>
        </section>

        {loading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-[#E7F1FC]" />)}</div> : filtered.length === 0 ? <div className="rounded-2xl border border-[#D8E5F0] bg-white py-20 text-center"><TicketIcon className="mx-auto mb-3 h-10 w-10 text-[#1267C4]" /><h2 className="text-xl font-bold text-[#14253F]">No events match those filters</h2><p className="mt-2 text-[#687A90]">Try another date, country, or genre.</p></div> : <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>{filtered.map((item) => { const available = item.tickets.filter((ticket) => ticket.quantity_available > 0); const isWish = hasWishlist(item.id); return <Card3D key={item.id}><article id={`event-card-${item.id}`} className="relative overflow-hidden rounded-2xl border border-[#D8E5F0] bg-white shadow-sm"><button onClick={(e)=>{ e.preventDefault(); toggleWishlist({ id: item.id, type: 'event', title: item.title }); }} aria-label={isWish?'Remove from wishlist':'Save to wishlist'} className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition ${isWish ? 'bg-[#E85D9A] border-[#E85D9A] text-white' : 'bg-white/90 border-[#D8E5F0] text-[#8A9AB0] hover:text-[#E85D9A]'}`}><Heart className={`h-4 w-4 ${isWish?'fill-white':''}`} /></button><img src={item.image_url || FALLBACK_IMAGE} alt={item.title} width="900" height="520" decoding="async" className={`h-52 w-full object-cover ${item.status === 'finished' ? 'grayscale' : ''}`} loading="lazy" />{item.status === 'finished' && <div className="border-y border-slate-200 bg-slate-100 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-600">This event has passed</div>}<div className="p-5"><div className="mb-3 flex items-center justify-between gap-3"><span className="rounded-full border border-[#D8E5F0] bg-[#E7F1FC] px-3 py-1 text-xs font-semibold text-[#1267C4]">{item.category}</span><span className="text-xs text-[#687A90]">{item.status === 'finished' ? 'Event ended' : item.status === 'sold_out' ? 'Sold out' : available.length ? 'Tickets available' : 'Request access'}</span></div><h2 className="line-clamp-2 text-xl font-bold text-[#14253F]">{item.title}</h2><div className="mt-3 space-y-2 text-sm text-[#5B6B82]"><p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#1267C4]" />{formatVenueDate(item.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#1267C4]" />{item.venue}, {item.city}</p></div><div className={`mt-5 grid gap-2 ${mainTab==='events' ? 'grid-cols-2' : 'grid-cols-1'} `}><button disabled={item.status === 'finished' || item.status === 'sold_out'} onClick={() => openPurchase(item)} className="rounded-xl bg-[#1267C4] px-3 py-3 text-sm font-bold text-white transition hover:bg-[#0F5AAC] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"> {item.status === 'finished' ? 'Event ended' : item.status === 'sold_out' ? 'Sold out' : mainTab==='events' ? 'Buy ticket' : 'Buy ticket'}</button>{mainTab==='events' && <button onClick={() => navigate(`/listings?city=${encodeURIComponent(item.city)}`)} className="flex items-center justify-center gap-1 rounded-xl border border-[#D8E5F0] px-3 py-3 text-sm font-semibold text-[#687A90] transition hover:border-[#1267C4] hover:text-[#1267C4]"><Hotel className="h-4 w-4" />Find a stay</button>}</div></div></article></Card3D>; })}</div>}
      </div>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#14253F]/55 p-3 backdrop-blur-sm sm:p-4" onClick={() => closePurchase()}><div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-[20px] border border-[#D8E5F0] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#1267C4]">{selected.category}</p><h2 className="mt-1 text-2xl font-bold text-[#14253F]">{selected.title}</h2><p className="mt-1 text-sm text-[#687A90]">{selected.venue}, {selected.city}</p></div><button onClick={() => closePurchase()} aria-label="Close" className="rounded-lg p-2 text-[#8A9AB0] hover:bg-[#F7FAFD] hover:text-[#14253F]"><X className="h-5 w-5" /></button></div>{selectedSeatMap && <div className="mb-5 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-3"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#687A90]">Venue seating map</p><div className="relative overflow-hidden rounded-lg bg-[#E7F1FC]"><img src={selectedSeatMap} alt="Seating map" className="block w-full object-contain" />{mapPosition && <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1267C4] p-2 shadow" style={mapPosition} aria-label={`Selected section ${selectedTicket?.section}`}><span className="sr-only">Selected section {selectedTicket?.section}</span></span>}</div><p className="mt-2 text-xs text-[#687A90]">Click a section marker to filter tickets. Exact seats verified after hold.</p></div>}{selectedTicket?.image_url && <div className="mb-5 overflow-hidden rounded-xl border border-[#D8E5F0]"><img src={selectedTicket.image_url} alt={`${selected.title} ticket view`} width="800" height="450" className="h-48 w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></div>}{selected.tickets.length ? <><div className="mb-4 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-3"><div className="flex flex-col gap-2 sm:flex-row"><input id="ticket-search" name="ticketSearch" aria-label="Search section, row, or package" value={ticketSearch} onChange={(event) => setTicketSearch(event.target.value)} placeholder="Search section, row, or package" className="min-w-0 flex-1 rounded-lg border border-[#D8E5F0] bg-white px-3 py-2 text-sm text-[#14253F] placeholder-gray-400 outline-none focus:border-[#1267C4]" /><select id="seating-filter" name="seating" aria-label="Seating filter" value={ticketGroupFilter} onChange={(event) => setTicketGroupFilter(event.target.value as typeof ticketGroupFilter)} className="rounded-lg border border-[#D8E5F0] bg-white px-3 py-2 text-sm text-[#14253F]"><option value="all">All seating</option><option value="Premium">Premium & VIP</option><option value="Lower bowl">100s–200s</option><option value="Upper bowl">300s–500s</option><option value="Other">Other</option></select></div><p className="mt-2 text-xs text-[#687A90]">{visibleTickets.length} option{visibleTickets.length === 1 ? '' : 's'} · Prices per ticket · 60-70% special offer where shown</p></div><label className="mb-2 block text-sm font-semibold text-[#14253F]">Choose your tickets</label><div className="space-y-2">{visibleTickets.map((ticket) => <button key={ticket.id} disabled={ticket.quantity_available === 0} onClick={() => setTicketId(ticket.id)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${ticketId === ticket.id ? 'border-[#1267C4] bg-[#E7F1FC]' : 'border-[#D8E5F0] bg-white'} ${ticket.quantity_available === 0 ? 'cursor-not-allowed opacity-40' : ''}`}><span className="text-sm text-[#14253F]"><span className="block font-semibold">{ticket.name}</span><small className="block text-[#687A90]">{ticket.row ? `Row ${ticket.row}` : 'Seat details on request'} · {ticket.quantity_available} available</small><small className="block text-[#687A90]">{ticket.delivery_method || 'Mobile transfer'} · {ticket.delivery_timing || 'Delivery confirmed after purchase'}</small></span><strong className="text-right text-[#1267C4]">{(isBtsBaltimoreEvent(selected) || ticket.discount_percent !== undefined || /bts/i.test(selected.title)) ? <><span className="block text-xs font-normal text-[#8A9AB0] line-through">${ticket.price.toLocaleString()}</span><span>${discountedTicketPrice(ticket.price, btsDiscountPercent(ticket)).toLocaleString()} <small className="font-normal text-[#E85D9A]">{btsDiscountPercent(ticket)}% off</small></span></> : `$${ticket.price.toLocaleString()}`}</strong></button>)}</div><div className="mt-5 flex items-center justify-between"><label className="text-sm text-[#687A90]" htmlFor="quantity">Quantity</label><input id="quantity" type="number" min="1" max="10" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} className="w-20 rounded-lg border border-[#D8E5F0] bg-white px-3 py-2 text-center text-[#14253F]" /></div>{holdError && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{holdError}</div>}{holdInfo && <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#D8E5F0] bg-[#F7FAFD] p-3 text-xs text-[#687A90]"><Clock className="h-4 w-4 text-[#1267C4]" />Hold until {new Date(holdInfo.heldUntil).toLocaleTimeString()} — secure server hold (2 min)</div>}<div className="mt-4 flex items-center gap-2 text-[11px] text-[#8A9AB0]"><HelpCircle className="h-3.5 w-3.5" />Need help choosing? <button onClick={() => { closePurchase(); const chatBtn = document.querySelector('[aria-label=\"Open chat\"]') as HTMLElement; chatBtn?.click(); }} className="font-semibold text-[#1267C4] underline">Chat with concierge</button></div>{selectedTicket && <button onClick={addTicket} disabled={isHolding} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1267C4] py-4 font-bold text-white transition hover:bg-[#0F5AAC] disabled:bg-[#CBD5E1]">{isHolding ? 'Securing tickets…' : <><ShoppingCart className="h-4 w-4" />Add to checkout</>}</button>}</> : <div className="rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-4"><p className="font-semibold text-[#14253F]">Request this ticket</p><p className="mt-1 text-sm leading-relaxed text-[#687A90]">Tell us your preferred section and quantity. We verify inventory before payment.</p><button onClick={() => navigate('/contact')} className="mt-4 w-full rounded-xl bg-[#14253F] py-3 font-bold text-white">Request ticket</button></div>}</div></div></div>}

      {holdInfo && <StickyHoldBar heldUntil={holdInfo.heldUntil} ticketName={selected?.title || 'Your tickets'} onExpire={() => setHoldInfo(null)} />}

    </main>
  );
}
