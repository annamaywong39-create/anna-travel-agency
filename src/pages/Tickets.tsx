import { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter, MapPin, Search, Ticket as TicketIcon, X, ShoppingCart, Grid3X3, List, Clock, Heart, Star, HelpCircle, Plus, Minus, Check } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { useCurrency, getCurrencyForCity, CURRENCIES } from '../contexts/CurrencyContext';

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
  const { addToCart, cartItems, getCartTotal } = useData();
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlist();
  const { formatDual } = useCurrency();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(() => searchParams.get('search') || searchParams.get('event') || '');
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketGroupFilter, setTicketGroupFilter] = useState<'all' | 'Premium' | 'Lower bowl' | 'Upper bowl' | 'Other'>('all');
  const [isHolding, setIsHolding] = useState(false);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [holdInfo, setHoldInfo] = useState<{ holdId: string; heldUntil: string } | null>(null);
  const [multiCart, setMultiCart] = useState<Record<string, number>>({});

  useEffect(() => {
    const sp = searchParams.get('search') || searchParams.get('event');
    if (sp) setQuery(sp);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (!isSupabaseConfigured) {
          if (!cancelled) {
            const all = fallbackEvents().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setItems(all);
          }
          return;
        }
        const [{ data: matches, error: matchError }, { data: events, error: eventError }] = await Promise.all([
          supabase.from('matches').select('*').gte('match_date', new Date().toISOString()).order('match_date', { ascending: true }),
          supabase.from('events').select('*').gte('date', new Date().toISOString()).order('date', { ascending: true }),
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
          // Ticket tab = upcoming-only with tickets
          const upcomingOnly = [...matchItems, ...eventItems].filter((item) => new Date(item.date).getTime() >= Date.now()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setItems(upcomingOnly);
        }
      } catch (error) {
        console.error('Unable to load tickets:', error);
        if (!cancelled) {
          const all = fallbackEvents().filter((i) => new Date(i.date).getTime() >= Date.now()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setItems(all);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => ['all', ...Array.from(new Set(items.map((item) => item.category))).sort()], [items]);
  const countries = useMemo(() => ['all', ...Array.from(new Set(items.map((item) => item.country))).sort()], [items]);

  const ticketOptionsCount = useMemo(
    () => items.reduce((s, i) => s + i.tickets.filter((t) => t.quantity_available > 0).length, 0),
    [items]
  );

  const filtered = useMemo(() => {
    const now = Date.now();
    const maxDays = dateFilter === 'all' ? Infinity : Number(dateFilter);
    return items.filter((item) => {
      if (item.status === 'finished' || new Date(item.date).getTime() < now) return false;
      if (!item.tickets.some((t) => t.quantity_available > 0)) return false;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || `${item.title} ${item.city} ${item.venue} ${item.id}`.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || item.category === category;
      const matchesCountry = country === 'all' || item.country === country;
      const diff = (new Date(item.date).getTime() - now) / 86400000;
      const matchesDate = dateFilter === 'all' || (diff >= 0 && diff <= maxDays);
      return matchesQuery && matchesCategory && matchesCountry && matchesDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [items, query, category, country, dateFilter]);

  const releaseCurrentHold = async () => {
    if (holdInfo?.holdId && isSupabaseConfigured) {
      try { await supabase.rpc('release_ticket_hold', { p_hold_id: holdInfo.holdId }); } catch {}
      setHoldInfo(null);
    }
  };

  const closePurchase = () => {
    void releaseCurrentHold();
    setSelected(null);
    setMultiCart({});
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
    setMultiCart({});
  };

  const toggleMultiTicket = (tId: string) => {
    setMultiCart((prev) => {
      const next = { ...prev };
      if (next[tId]) delete next[tId];
      else next[tId] = 1;
      if (!next[tId] && ticketId === tId) {
        const remaining = Object.keys(next);
        setTicketId(remaining[0] || '');
      } else if (next[tId]) {
        setTicketId(tId);
      }
      return next;
    });
  };

  const updateMultiQty = (tId: string, q: number) => {
    const safe = Math.max(1, Math.min(10, q || 1));
    setMultiCart((prev) => ({ ...prev, [tId]: safe }));
  };

  const selectedTicket = selected?.tickets.find((ticket) => ticket.id === ticketId);
  const selectedSeatMap = selected?.seat_map_url || (selected && /bts|m&t bank stadium|baltimore/i.test(`${selected.title} ${selected.venue} ${selected.city}`) ? '/images/seatmaps/mt-bank-stadium-bts-2026-08-10.png' : null);
  const visibleTickets = (selected?.tickets || [])
    .filter((ticket) => ticket.quantity_available > 0)
    .filter((ticket) => ticketGroupFilter === 'all' || ticketGroup(ticket) === ticketGroupFilter)
    .filter((ticket) => !ticketSearch.trim() || `${ticket.name} ${ticket.section || ''} ${ticket.row || ''}`.toLowerCase().includes(ticketSearch.trim().toLowerCase()))
    .sort((a, b) => a.price - b.price);

  const mapPosition = selectedTicket?.section === '532' ? { left: '39%', top: '83%' } : selectedTicket?.section === '133' ? { left: '61%', top: '66%' } : selectedTicket?.section === 'Field R' ? { left: '40%', top: '48%' } : null;

  const multiTotal = useMemo(() => {
    if (!selected) return { count: 0, price: 0 };
    let c = 0; let p = 0;
    for (const [id, qty] of Object.entries(multiCart)) {
      const t = selected.tickets.find((x) => x.id === id);
      if (!t) continue;
      const disc = isBtsBaltimoreEvent(selected) || t.discount_percent !== undefined || /bts/i.test(selected.title) ? btsDiscountPercent(t) : 0;
      const final = disc ? discountedTicketPrice(t.price, disc) : t.price;
      c += qty; p += final * qty;
    }
    return { count: c, price: p };
  }, [multiCart, selected]);

  const addTicket = async () => {
    if (!selected) return;
    const toAdd: Array<{ ticket: TicketOption; qty: number }> = [];
    if (Object.keys(multiCart).length > 0) {
      for (const [id, qty] of Object.entries(multiCart)) {
        const t = selected.tickets.find((x) => x.id === id);
        if (t) toAdd.push({ ticket: t, qty });
      }
    } else if (selectedTicket) {
      toAdd.push({ ticket: selectedTicket, qty: quantity });
    }
    if (toAdd.length === 0) return;
    setIsHolding(true); setHoldError(null);
    try {
      for (const { ticket, qty } of toAdd) {
        let holdId: string | undefined; let heldUntil: string | undefined;
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.rpc('hold_ticket', { p_ticket_id: ticket.id, p_quantity: qty });
          if (error) throw new Error(error.message.includes('Not enough') ? `Not enough in ${ticket.name || ticket.section}: ${error.message}` : error.message);
          const row = Array.isArray(data) ? data[0] : data;
          if (row?.hold_id) { holdId = row.hold_id; heldUntil = row.held_until; setHoldInfo({ holdId: row.hold_id, heldUntil: row.held_until }); }
        }
        const discounted = isBtsBaltimoreEvent(selected) || ticket.discount_percent !== undefined || /bts/i.test(selected.title);
        const discountPercent = discounted ? btsDiscountPercent(ticket) : 0;
        addToCart({
          id: `${selected.id}-${ticket.id}`,
          type: 'ticket',
          item: { eventName: selected.title, ticketId: ticket.id, venue: selected.venue, city: selected.city, specialOffer: discounted, discountPercent, holdId, heldUntil } as any,
          quantity: qty,
          price: discounted ? discountedTicketPrice(ticket.price, discountPercent) : ticket.price,
        });
      }
      setSelected(null); setMultiCart({}); navigate('/checkout');
    } catch (err: any) {
      console.error('Hold failed', err);
      setHoldError(err.message || 'Unable to hold tickets. Please try again.');
    } finally { setIsHolding(false); }
  };

  const renderCards = (list: EventItem[]) => (
    <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
      {list.map((item) => {
        const available = item.tickets.filter((ticket) => ticket.quantity_available > 0);
        const isWish = hasWishlist(item.id);
        const cheapest = available.length ? available.reduce((min, t) => Math.min(min, t.price), Infinity) : 0;
        return (
          <Card3D key={item.id}>
            <article id={`event-card-${item.id}`} className="relative overflow-hidden rounded-2xl border border-[#D8E5F0] bg-white shadow-sm">
              <button onClick={(e)=>{ e.preventDefault(); toggleWishlist({ id: item.id, type: 'event', title: item.title }); }} aria-label={isWish?'Remove from wishlist':'Save to wishlist'} className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition ${isWish ? 'bg-[#E85D9A] border-[#E85D9A] text-white' : 'bg-white/90 border-[#D8E5F0] text-[#8A9AB0] hover:text-[#E85D9A]'}`}><Heart className={`h-4 w-4 ${isWish?'fill-white':''}`} /></button>
              <img src={item.image_url || FALLBACK_IMAGE} alt={item.title} width="900" height="520" decoding="async" className="h-52 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#D8E5F0] bg-[#E7F1FC] px-3 py-1 text-xs font-semibold text-[#1267C4]">{item.category}</span>
                  <span className="text-xs text-[#687A90]">{available.length} options</span>
                </div>
                <h2 className="line-clamp-2 text-xl font-bold text-[#14253F]">{item.title}</h2>
                <div className="mt-3 space-y-2 text-sm text-[#5B6B82]">
                  <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#1267C4]" />{formatVenueDate(item.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#1267C4]" />{item.venue}, {item.city}</p>
                  {cheapest > 0 && <p className="font-semibold text-[#14253F]">From ${cheapest.toLocaleString()}</p>}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => openPurchase(item)} className="rounded-xl bg-[#1267C4] px-3 py-3 text-sm font-bold text-white hover:bg-[#0F5AAC]">View Tickets</button>
                  <Link to={`/listings?city=${encodeURIComponent(item.city)}`} className="flex items-center justify-center rounded-xl border border-[#D8E5F0] bg-white px-3 py-2.5 text-xs font-semibold text-[#687A90] hover:border-[#1267C4]">Hotels</Link>
                </div>
              </div>
            </article>
          </Card3D>
        );
      })}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F7FAFD] pb-32 text-[#14253F] dark:bg-[#0A1931] dark:text-[#E2E8F0]">
      <BtsPromoBanner />
      <SEO title="Tickets - Available Inventory" description="Ticket tab shows only events with verified ticket inventory — multi-section select." path="/tickets" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <header className="mb-6 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#1267C4]">Tickets only</p>
          <h1 className="text-4xl font-black tracking-tight text-[#14253F] md:text-6xl">Verified tickets.</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#5B6B82]">This tab shows <strong>only upcoming events with tickets available</strong>. Events tab shows full catalog.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3"><TrustBadges /><RecentBookingsTicker /></div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => navigate('/events')} className="rounded-full border border-[#D8E5F0] bg-white px-4 py-2 text-sm font-semibold text-[#687A90] hover:text-[#1267C4]">Go to Events tab (all events)</button>
          </div>
        </header>

        <section className="mb-6">
          <div className="inline-flex rounded-2xl border border-[#D8E5F0] bg-white p-1 shadow-sm">
            <Link to="/events" className="rounded-xl px-6 py-2.5 text-sm font-bold text-[#687A90] hover:text-[#14253F]">Events</Link>
            <span className="rounded-xl bg-[#1267C4] px-6 py-2.5 text-sm font-bold text-white shadow-sm">Tickets</span>
          </div>
        </section>

        {!loading && filtered.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2"><Star className="h-4 w-4 text-[#F2C94C] fill-[#F2C94C]" /><h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#14253F]">Top picks for you</h2><span className="rounded-full bg-[#E7F1FC] px-2.5 py-1 text-[11px] font-semibold text-[#1267C4]">Best value • Verified • Multi-section</span></div>
            <div className="grid gap-4 md:grid-cols-3">
              {filtered.filter((i) => /bts/i.test(i.title)).slice(0, 3).map((item) => {
                const bestTicket = item.tickets.filter(t=>t.quantity_available>0).sort((a,b)=> (b.discount_percent||0)-(a.discount_percent||0))[0];
                return (
                  <div key={`top-${item.id}`} className="relative overflow-hidden rounded-2xl border border-[#FFD166]/40 bg-gradient-to-br from-[#14253F] via-[#123A70] to-[#1267C4] p-4 text-white shadow-lg">
                    <div className="absolute right-3 top-3 rounded-full bg-[#F2C94C] px-2.5 py-1 text-[11px] font-bold text-[#14253F]">{bestTicket?.discount_percent ? `${bestTicket.discount_percent}% off` : 'Special offer'}</div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#FFD166]">{item.category} • {item.city}</p>
                    <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-tight">{item.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/70"><Calendar className="h-3 w-3" />{formatVenueDate(item.date, { month: 'short', day: 'numeric' })} • {item.venue}</p>
                    <button onClick={() => { const el = document.getElementById(`event-card-${item.id}`); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="mt-3 w-full rounded-full bg-white px-4 py-2 text-xs font-bold text-[#14253F] hover:bg-[#FFD166]">View best seats</button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mb-8 rounded-2xl border border-[#D8E5F0] bg-white p-4 shadow-sm" aria-label="Ticket filters">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <label className="relative block"><span className="sr-only">Search tickets</span><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9AB0]" /><input id="event-search" name="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, city or venue" className="w-full rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] py-3 pl-11 pr-4 text-sm text-[#14253F] outline-none transition focus:border-[#1267C4]" /></label>
            <label><span className="sr-only">Event genre</span><select id="event-genre" name="genre" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-[#D8E5F0] bg-white px-4 py-3 text-sm text-[#14253F] outline-none focus:border-[#1267C4]"><option value="all">All genres</option>{categories.slice(1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span className="sr-only">Country</span><select id="event-country" name="country" value={country} onChange={(event) => setCountry(event.target.value)} className="w-full rounded-xl border border-[#D8E5F0] bg-white px-4 py-3 text-sm text-[#14253F] outline-none focus:border-[#1267C4]"><option value="all">All countries</option>{countries.slice(1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span className="sr-only">Date range</span><select id="event-date-range" name="dateRange" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-xl border border-[#D8E5F0] bg-white px-4 py-3 text-sm text-[#14253F] outline-none focus:border-[#1267C4]">{dateFilters.map((value) => <option key={value.id} value={value.id}>{value.label}</option>)}</select></label>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#687A90]"><span className="flex items-center gap-2"><Filter className="h-3.5 w-3.5" /> {filtered.length} ticket events • {ticketOptionsCount} options • multi-section enabled • sticky checkout</span><span className="flex items-center gap-1 rounded-lg border border-[#D8E5F0] bg-[#F7FAFD] p-1"><button type="button" onClick={() => setViewMode('grid')} aria-label="Grid view" className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-[#1267C4] text-white' : 'text-[#8A9AB0]'}`}><Grid3X3 className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setViewMode('list')} aria-label="List view" className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-[#1267C4] text-white' : 'text-[#8A9AB0]'}`}><List className="h-3.5 w-3.5" /></button></span></div>
        </section>

        {loading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-[#E7F1FC]" />)}</div> : filtered.length === 0 ? <div className="rounded-2xl border border-[#D8E5F0] bg-white py-20 text-center"><TicketIcon className="mx-auto mb-3 h-10 w-10 text-[#1267C4]" /><h2 className="text-xl font-bold text-[#14253F]">No tickets match those filters</h2><p className="mt-2 text-[#687A90]">Try another date or go to Events tab for full history.</p><button onClick={() => navigate('/events')} className="mt-4 rounded-full bg-[#14253F] px-5 py-2.5 text-sm font-bold text-white">Go to Events (all)</button></div> : renderCards(filtered)}
      </div>

      {/* Multi-section Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#14253F]/55 p-3 backdrop-blur-sm sm:p-4" onClick={() => closePurchase()}>
          <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[20px] border border-[#D8E5F0] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1267C4]">{selected.category}</p>
                  <h2 className="mt-1 text-2xl font-bold text-[#14253F]">{selected.title}</h2>
                  <p className="mt-1 text-sm text-[#687A90]">{selected.venue}, {selected.city} • {formatVenueDate(selected.date)}</p>
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Multi-section: select many → one checkout (sticky)</p>
                </div>
                <button onClick={() => closePurchase()} aria-label="Close" className="rounded-lg p-2 text-[#8A9AB0] hover:bg-[#F7FAFD] hover:text-[#14253F]"><X className="h-5 w-5" /></button>
              </div>

              {selectedSeatMap && (
                <div className="mb-5 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#687A90]">Venue seating map</p>
                  <div className="relative overflow-hidden rounded-lg bg-[#E7F1FC]"><img src={selectedSeatMap} alt="Seating map" className="block w-full object-contain" />{mapPosition && <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1267C4] p-2 shadow" style={mapPosition}><span className="sr-only">Selected section {selectedTicket?.section}</span></span>}</div>
                </div>
              )}

              {selected.tickets.length ? (
                <>
                  <div className="mb-4 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-3">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input value={ticketSearch} onChange={(event) => setTicketSearch(event.target.value)} placeholder="Search section" className="min-w-0 flex-1 rounded-lg border border-[#D8E5F0] bg-white px-3 py-2 text-sm" />
                      <select value={ticketGroupFilter} onChange={(event) => setTicketGroupFilter(event.target.value as typeof ticketGroupFilter)} className="rounded-lg border border-[#D8E5F0] bg-white px-3 py-2 text-sm"><option value="all">All</option><option value="Premium">Premium</option><option value="Lower bowl">Lower</option><option value="Upper bowl">Upper</option><option value="Other">Other</option></select>
                    </div>
                    <p className="mt-2 text-xs text-[#687A90]">{visibleTickets.length} options</p>
                  </div>

                  <label className="mb-2 flex items-center justify-between text-sm font-semibold"><span>Select tickets</span><span className="text-xs font-normal text-[#687A90]">{Object.keys(multiCart).length} selected</span></label>
                  <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
                    {visibleTickets.slice(0,12).map((ticket) => {
                      const isSelected = !!multiCart[ticket.id] || ticketId === ticket.id;
                      const qty = multiCart[ticket.id] || (ticketId === ticket.id ? quantity : 1);
                      return (
                        <div key={ticket.id} className={`flex items-center gap-3 rounded-xl border p-3 ${isSelected ? 'border-[#1267C4] bg-[#E7F1FC]' : 'border-[#D8E5F0] bg-white'}`}>
                          <button type="button" onClick={() => toggleMultiTicket(ticket.id)} className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${isSelected ? 'bg-[#1267C4] border-[#1267C4] text-white' : 'border-[#D8E5F0] bg-white'}`}><Check className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => toggleMultiTicket(ticket.id)} className="flex-1 text-left"><span className="block text-sm font-semibold">{ticket.section || ticket.name}</span><small className="block text-xs text-[#687A90]">Row {ticket.row || '—'} • {ticket.quantity_available} left</small></button>
                          <div className="text-right">
                            <strong className="block text-sm text-[#1267C4]">${ticket.price.toLocaleString()}</strong>
                            {isSelected && <div className="mt-1 flex items-center gap-1"><button onClick={()=>updateMultiQty(ticket.id, qty-1)} className="h-6 w-6 rounded-full border bg-white"><Minus className="h-3 w-3" /></button><span className="w-5 text-center text-xs font-bold">{qty}</span><button onClick={()=>updateMultiQty(ticket.id, qty+1)} className="h-6 w-6 rounded-full border bg-white"><Plus className="h-3 w-3" /></button></div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {holdError && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{holdError}</div>}
                  {holdInfo && <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F7FAFD] p-3 text-xs"><Clock className="h-4 w-4 text-[#1267C4]" />Hold until {new Date(holdInfo.heldUntil).toLocaleTimeString()}</div>}
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-[#8A9AB0]"><HelpCircle className="h-3.5 w-3.5" />Need help? <button onClick={()=>{ closePurchase(); (document.querySelector('[aria-label="Open chat"]') as HTMLElement)?.click(); }} className="font-semibold text-[#1267C4] underline">Chat concierge</button></div>
                </>
              ) : <div className="rounded-xl bg-[#F7FAFD] p-4">No tickets — request access <button onClick={()=>navigate('/contact')} className="mt-3 w-full rounded-xl bg-[#14253F] py-3 text-white font-bold">Request</button></div>}
            </div>

            {selected.tickets.length > 0 && (
              <div className="border-t bg-white p-4 shadow-[0_-8px_30px_rgba(20,37,63,0.08)]">
                {Object.keys(multiCart).length > 0 ? (
                  <>
                    <div className="flex justify-between text-sm"><span className="font-semibold">{multiTotal.count} tickets • {Object.keys(multiCart).length} sections</span><span className="font-black text-[#1267C4]">${multiTotal.price.toLocaleString()}</span></div>
                    <button onClick={addTicket} disabled={isHolding || multiTotal.count===0} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1267C4] py-4 font-bold text-white disabled:bg-[#CBD5E1]">{isHolding ? 'Securing…' : <><ShoppingCart className="h-5 w-5" /> Checkout {multiTotal.count} tickets →</>}</button>
                  </>
                ) : selectedTicket ? (
                  <>
                    <div className="flex justify-between text-sm"><span className="font-semibold">{selectedTicket.name} • Qty {quantity}</span><span className="font-black text-[#1267C4]">${(discountedTicketPrice(selectedTicket.price, btsDiscountPercent(selectedTicket)) * quantity).toLocaleString()}</span></div>
                    <div className="mt-3 flex gap-3">
                      <div className="flex items-center gap-2"><button onClick={()=>setQuantity(Math.max(1, quantity-1))} className="h-9 w-9 rounded-full border bg-white"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-bold">{quantity}</span><button onClick={()=>setQuantity(Math.min(10, quantity+1))} className="h-9 w-9 rounded-full border bg-white"><Plus className="h-4 w-4" /></button></div>
                      <button onClick={addTicket} disabled={isHolding} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1267C4] py-3.5 font-bold text-white"><ShoppingCart className="h-4 w-4" /> Add to checkout →</button>
                    </div>
                  </>
                ) : <p className="text-center text-sm text-[#8A9AB0]">Tick sections above — checkout appears here instantly, no scroll.</p>}
                <p className="mt-2 text-center text-[11px] text-[#8A9AB0]">Sticky checkout — no scrolling needed</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!selected && cartItems.length > 0 && (
        <div className="fixed bottom-[72px] left-0 right-0 z-[58] border-t bg-white/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(20,37,63,0.15)] md:bottom-4 md:left-1/2 md:right-auto md:w-[560px] md:-translate-x-1/2 md:rounded-2xl md:border">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1267C4] text-white"><ShoppingCart className="h-5 w-5" /></div><div><p className="text-sm font-bold">{cartItems.length} items • {cartItems.reduce((s,i)=>s+i.quantity,0)} tickets</p><p className="text-xs text-[#687A90]">${getCartTotal().toLocaleString()} • Ready</p></div></div>
            <button onClick={()=>navigate('/checkout')} className="rounded-full bg-[#1267C4] px-5 py-3 text-sm font-bold text-white">Checkout →</button>
          </div>
        </div>
      )}

      {holdInfo && <StickyHoldBar heldUntil={holdInfo.heldUntil} ticketName={selected?.title || 'Your tickets'} onExpire={() => setHoldInfo(null)} />}
    </main>
  );
}
