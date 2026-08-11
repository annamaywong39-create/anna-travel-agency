import { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter, MapPin, Search, Ticket as TicketIcon, X, ShoppingCart, Hotel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { useData } from '../contexts/DataContext';
import { FEATURED_US_EVENTS } from '../data/events';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { eventImageFor } from '../lib/eventImages';
import { formatVenueDate } from '../lib/eventDate';

type TicketOption = { id: string; name: string; section?: string; row?: string; seat_details?: string; delivery_method?: string; delivery_timing?: string; image_url?: string; price: number; quantity_available: number };
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

function btsDiscountPercent(ticket: Pick<TicketOption, 'section' | 'name'>) {
  // The supporter offer is fixed per secured listing so customers see the same rate before checkout.
  if (/field\s*r/i.test(`${ticket.section || ''} ${ticket.name}`)) return 70;
  if (/133/i.test(`${ticket.section || ''} ${ticket.name}`)) return 30;
  return 50;
}

function discountedTicketPrice(price: number, discountPercent: number) {
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
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
      price: ticket.price,
      quantity_available: ticket.quantity_available,
    })),
  }));
}

export default function Tickets() {
  const { addToCart } = useData();
  const navigate = useNavigate();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [quantity, setQuantity] = useState(1);

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
          category: 'Football',
          description: 'Match tickets with verified inventory subject to availability.',
          image_url: '/images/event-sport.jpg',
          status: eventStatus(match.match_date, match.status),
          tickets: [
            ['category_1', 'Category 1', match.category_1_price],
            ['category_2', 'Category 2', match.category_2_price],
            ['category_3', 'Category 3', match.category_3_price],
            ['category_4', 'Category 4', match.category_4_price],
          ].filter(([, , price]) => Number(price) > 0).map(([id, name, price]) => ({ id: `${match.id}-${id}`, name: String(name), price: Number(price), quantity_available: 10 })),
        }));
        if (!cancelled) setItems([...matchItems, ...eventItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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
      // Past events remain available on the Events page as historical records,
      // but they must never appear as ticket inventory.
      if (item.status === 'finished' || new Date(item.date).getTime() < Date.now()) return false;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || `${item.title} ${item.city} ${item.venue}`.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || item.category === category;
      const matchesCountry = country === 'all' || item.country === country;
      const diff = (new Date(item.date).getTime() - now) / 86400000;
      const matchesDate = dateFilter === 'all' || (diff >= 0 && diff <= maxDays);
      return matchesQuery && matchesCategory && matchesCountry && matchesDate;
    });
  }, [items, query, category, country, dateFilter]);

  const openPurchase = (item: EventItem) => {
    setSelected(item);
    setTicketId(item.tickets.find((ticket) => ticket.quantity_available > 0)?.id || '');
    setQuantity(1);
  };

  const selectedTicket = selected?.tickets.find((ticket) => ticket.id === ticketId);
  const selectedSeatMap = selected?.seat_map_url || (selected && /bts|m&t bank stadium|baltimore/i.test(`${selected.title} ${selected.venue} ${selected.city}`)
    ? '/images/seatmaps/mt-bank-stadium-bts-2026-08-10.png'
    : null);
  const mapPosition = selectedTicket?.section === '532'
    ? { left: '39%', top: '83%' }
    : selectedTicket?.section === '133'
      ? { left: '61%', top: '66%' }
      : selectedTicket?.section === 'Field R'
        ? { left: '40%', top: '48%' }
        : null;
  const addTicket = () => {
    if (!selected || !selectedTicket) return;
    const discounted = isBtsBaltimoreEvent(selected);
    const discountPercent = discounted ? btsDiscountPercent(selectedTicket) : 0;
    addToCart({
      id: `${selected.id}-${selectedTicket.id}`,
      type: 'ticket',
      item: { eventName: selected.title, ticketId: selectedTicket.id, venue: selected.venue, city: selected.city, supporterOffer: discounted, discountPercent },
      quantity,
      price: discounted ? discountedTicketPrice(selectedTicket.price, discountPercent) : selectedTicket.price,
    });
    setSelected(null);
    navigate('/checkout');
  };

  return (
    <main className="min-h-screen bg-[#071A36] pt-24 pb-20">
      <SEO title="Curated Events & Tickets" description="Explore high-demand events and verified ticket access with accommodation options." path="/tickets" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#DB8293]">Curated access</p>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">The moments worth travelling for.</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#A7B0C0]">A considered selection of major sporting, music, and cultural events — with a stay to match.</p>
        </header>

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4" aria-label="Event filters">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <label className="relative block">
              <span className="sr-only">Search events</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A7B0C0]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, city or venue" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#DB8293]" />
            </label>
            <label><span className="sr-only">Event genre</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-[#DB8293]"><option value="all">All genres</option>{categories.slice(1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span className="sr-only">Country</span><select value={country} onChange={(event) => setCountry(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-[#DB8293]"><option value="all">All countries</option>{countries.slice(1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span className="sr-only">Date range</span><select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none focus:border-[#DB8293]">{dateFilters.map((value) => <option key={value.id} value={value.id}>{value.label}</option>)}</select></label>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#A7B0C0]"><Filter className="h-3.5 w-3.5" /> {filtered.length} curated event{filtered.length === 1 ? '' : 's'}</div>
        </section>

        {loading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-white/[0.06]" />)}</div> : filtered.length === 0 ? <div className="rounded-2xl border border-white/10 bg-white/[0.04] py-20 text-center"><TicketIcon className="mx-auto mb-3 h-10 w-10 text-[#DB8293]" /><h2 className="text-xl font-bold text-white">No events match those filters</h2><p className="mt-2 text-[#A7B0C0]">Try another date, country, or genre.</p></div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => { const available = item.tickets.filter((ticket) => ticket.quantity_available > 0); return <Card3D key={item.id}><article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]"><img src={item.image_url || FALLBACK_IMAGE} alt={item.title} width="900" height="520" decoding="async" className={`h-52 w-full object-cover ${item.status === 'finished' ? 'grayscale' : ''}`} loading="lazy" />{item.status === 'finished' && <div className="border-y border-slate-500/40 bg-slate-700/70 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-100">This event has passed</div>}<div className="p-5"><div className="mb-3 flex items-center justify-between gap-3"><span className="rounded-full border border-[#DB8293]/30 bg-[#DB8293]/10 px-3 py-1 text-xs font-semibold text-[#DB8293]">{item.category}</span><span className="text-xs text-[#A7B0C0]">{item.status === 'finished' ? 'Event ended' : item.status === 'sold_out' ? 'Sold out' : available.length ? 'Tickets available' : 'Request access'}</span></div><h2 className="line-clamp-2 text-xl font-bold text-white">{item.title}</h2><div className="mt-3 space-y-2 text-sm text-[#A7B0C0]"><p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#C49B55]" />{formatVenueDate(item.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#DB8293]" />{item.venue}, {item.city}</p></div><div className="mt-5 grid grid-cols-2 gap-2"><button disabled={item.status === 'finished' || item.status === 'sold_out'} onClick={() => openPurchase(item)} className="rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] px-3 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:from-[#637083] disabled:to-[#637083]">{item.status === 'finished' ? 'Event ended' : item.status === 'sold_out' ? 'Sold out' : 'Buy tickets'}</button><button onClick={() => navigate(`/listings?city=${encodeURIComponent(item.city)}`)} className="flex items-center justify-center gap-1 rounded-xl border border-white/10 px-3 py-3 text-sm font-semibold text-[#A7B0C0] transition hover:border-[#DB8293] hover:text-white"><Hotel className="h-4 w-4" />Find a stay</button></div></div></article></Card3D>; })}</div>}
      </div>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/75 p-3 sm:p-4" onClick={() => setSelected(null)}><div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220] shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-sm text-[#DB8293]">{selected.category}</p><h2 className="mt-1 text-2xl font-bold text-white">{selected.title}</h2><p className="mt-1 text-sm text-[#A7B0C0]">{selected.venue}, {selected.city}</p></div><button onClick={() => setSelected(null)} aria-label="Close" className="rounded-lg p-2 text-[#A7B0C0] hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button></div>{selectedSeatMap && <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-3"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A7B0C0]">Venue seating map</p><div className="relative overflow-hidden rounded-lg bg-[#526B75]"><img src={selectedSeatMap} alt="M&T Bank Stadium seating map for BTS" className="block w-full object-contain" />{mapPosition && <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#D98C9B] p-2 shadow-[0_0_0_6px_rgba(217,140,155,0.25)]" style={mapPosition} aria-label={`Selected section ${selectedTicket?.section}`}><span className="sr-only">Selected section {selectedTicket?.section}</span></span>}</div><p className="mt-2 text-xs text-[#A7B0C0]">The highlighted marker shows the selected section. Exact seat positions are shown after inventory is verified.</p></div>}{selectedTicket?.image_url && <div className="mb-5 overflow-hidden rounded-xl border border-white/10"><img src={selectedTicket.image_url} alt={`${selected.title} ticket view`} width="800" height="450" className="h-48 w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></div>}{selected.tickets.length ? <><label className="mb-2 block text-sm text-[#A7B0C0]">Ticket category</label><div className="space-y-2">{selected.tickets.map((ticket) => <button key={ticket.id} disabled={ticket.quantity_available === 0} onClick={() => setTicketId(ticket.id)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${ticketId === ticket.id ? 'border-[#DB8293] bg-[#DB8293]/10' : 'border-white/10 bg-white/[0.03]'} ${ticket.quantity_available === 0 ? 'cursor-not-allowed opacity-40' : ''}`}><span className="text-sm text-white"><span className="block">{ticket.name}</span><small className="block text-[#A7B0C0]">{ticket.row ? `Row ${ticket.row}` : 'Seat details on request'} · {ticket.quantity_available} available</small><small className="block text-[#A7B0C0]">{ticket.delivery_method || 'Mobile transfer'} · {ticket.delivery_timing || 'Delivery timing confirmed after purchase'}</small></span><strong className="text-right text-[#C49B55]">{isBtsBaltimoreEvent(selected) ? <><span className="block text-xs font-normal text-white/45 line-through">${ticket.price.toLocaleString()}</span><span>${discountedTicketPrice(ticket.price, btsDiscountPercent(ticket)).toLocaleString()} <small className="font-normal text-[#D98C9B]">{btsDiscountPercent(ticket)}% off</small></span></> : `$${ticket.price.toLocaleString()}`}</strong></button>)}</div><div className="mt-5 flex items-center justify-between"><label className="text-sm text-[#A7B0C0]" htmlFor="quantity">Quantity</label><input id="quantity" type="number" min="1" max="10" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-white" /></div>{selectedTicket && <button onClick={addTicket} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] py-4 font-bold text-white"><ShoppingCart className="h-4 w-4" />Add to checkout</button>}</> : <div className="rounded-xl border border-[#C49B55]/30 bg-[#C49B55]/10 p-4"><p className="font-semibold text-[#C49B55]">Request this ticket</p><p className="mt-1 text-sm leading-relaxed text-[#A7B0C0]">Tell us your preferred section, row, seat range, and quantity. We will verify the inventory before requesting payment.</p><button onClick={() => navigate('/contact')} className="mt-4 w-full rounded-xl bg-[#C49B55] py-3 font-bold text-[#071A36]">Request ticket</button></div>}</div></div></div>}
    </main>
  );
}
