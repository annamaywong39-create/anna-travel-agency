import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Calendar, Users, Plus, Edit2, Trash2,
  Eye, DollarSign, ArrowLeft, Search, Filter,
  Ticket, RefreshCw, Calendar as CalendarIcon, MapPin, X, Home, List, Grid2X2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData, type Booking, type Event, type EventTicket, type TicketOrder } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Card3D from '../components/Card3D';
import { formatVenueDate } from '../lib/eventDate';
import { uploadPublicImage } from '../lib/storage';

type Tab = 'overview' | 'listings' | 'bookings' | 'users' | 'events';

export default function Admin() {
  const { user } = useAuth();
  const {
    listings, orders, bookings, deleteListing, updateBooking, isDemo,
    fetchAllUsers, updateTicketOrder, fetchAllTicketOrders, fetchAllOrders, updateOrder, deleteOrder,
    fetchEvents, addEvent, updateEvent, deleteEvent,
    fetchEventTickets, addEventTicket, updateEventTicket, deleteEventTicket
  } = useData();
  const { format } = useCurrency();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  // Users
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Events
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventSearch, setEventSearch] = useState('');
  const [eventView, setEventView] = useState<'grid' | 'list'>('list');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'available' | 'sold_out'>('all');
  const [eventTickets, setEventTickets] = useState<EventTicket[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState<Partial<Event> | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editTicket, setEditTicket] = useState<Partial<EventTicket> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingEventImage, setUploadingEventImage] = useState(false);
  const [uploadingSeatMap, setUploadingSeatMap] = useState(false);
  const [uploadingTicketImage, setUploadingTicketImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Ticket Orders (for display)
  const [allTicketOrders, setAllTicketOrders] = useState<TicketOrder[]>([]);
  const [loadingTicketOrders, setLoadingTicketOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'events' || activeTab === 'overview') loadEvents();
    if (activeTab === 'bookings' || activeTab === 'overview') {
      loadTicketOrders();
      void fetchAllOrders();
    }
  }, [activeTab]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  if (isDemo) {
    return (
      <main className="min-h-screen bg-[#0A1128] px-4 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-amber-400/30 bg-amber-950/30 p-8 text-center">
          <h1 className="text-2xl font-bold">Supabase connection required</h1>
          <p className="mt-3 leading-7 text-amber-100/80">Admin changes and image uploads are disabled because this deployment is in Demo Mode. Add the Supabase variables to Vercel and redeploy before managing live data.</p>
        </div>
      </main>
    );
  }

  const loadUsers = async () => {
    setLoadingUsers(true);
    const users = await fetchAllUsers();
    setAllUsers(users);
    setLoadingUsers(false);
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    const data = await fetchEvents();
    setEvents(data);
    setLoadingEvents(false);
    const firstEvent = data.find((event) => new Date(event.date).getTime() >= Date.now()) || data[0];
    if (firstEvent) {
      setSelectedEvent(firstEvent);
      await loadTickets(firstEvent.id);
    } else {
      setSelectedEvent(null);
      setEventTickets([]);
    }
  };

  const loadTicketOrders = async () => {
    setLoadingTicketOrders(true);
    const data = await fetchAllTicketOrders();
    setAllTicketOrders(data);
    setLoadingTicketOrders(false);
  };

  const notify = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback(null), 4000);
  };

  const handleUploadEventImage = async (file?: File) => {
    if (!file) return;
    if (isDemo) return notify('error', 'Supabase is not connected. Image uploads are disabled in Demo Mode.');
    setUploadingEventImage(true);
    try {
      const imageUrl = await uploadPublicImage(file, 'events');
      setEditEvent((current) => ({ ...(current || {}), image_url: imageUrl }));
      notify('success', 'Event image uploaded. Save the event to publish it.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Event image upload failed.');
    } finally {
      setUploadingEventImage(false);
    }
  };

  const handleUploadSeatMap = async (file?: File) => {
    if (!file) return;
    if (isDemo) return notify('error', 'Supabase is not connected. Image uploads are disabled in Demo Mode.');
    setUploadingSeatMap(true);
    try {
      const imageUrl = await uploadPublicImage(file, 'events');
      setEditEvent((current) => ({ ...(current || {}), seat_map_url: imageUrl }));
      notify('success', 'Seat map uploaded. Save the event to publish it.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Seat map upload failed.');
    } finally {
      setUploadingSeatMap(false);
    }
  };

  const handleUploadTicketImage = async (file?: File) => {
    if (!file) return;
    if (isDemo) return notify('error', 'Supabase is not connected. Image uploads are disabled in Demo Mode.');
    setUploadingTicketImage(true);
    try {
      const imageUrl = await uploadPublicImage(file, 'tickets');
      setEditTicket((current) => ({ ...(current || {}), image_url: imageUrl }));
      notify('success', 'Ticket image uploaded. Save the ticket tier to publish it.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Ticket image upload failed.');
    } finally {
      setUploadingTicketImage(false);
    }
  };

  const loadTickets = async (eventId: string) => {
    const data = await fetchEventTickets(eventId);
    setEventTickets(data);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    loadTickets(event.id);
  };

  const handleSaveEvent = async (data: Partial<Event>) => {
    try {
      if (data.id) {
        await updateEvent(data.id, data);
      } else {
        await addEvent(data as Omit<Event, 'id' | 'created_at'>);
      }
      await loadEvents();
      setShowEventForm(false);
      setEditEvent(null);
      notify('success', data.id ? 'Event updated successfully.' : 'Event created successfully.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'The event could not be saved.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event and all its tickets?')) return;
    try {
      await deleteEvent(id);
      await loadEvents();
      if (selectedEvent?.id === id) setSelectedEvent(null);
      notify('success', 'Event deleted successfully.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'The event could not be deleted.');
    }
  };

  const handleSaveTicket = async (data: Partial<EventTicket>) => {
    if (!selectedEvent) return;
    const category = String(data.category_name || '').trim();
    const price = Number(data.price);
    const quantity = Number(data.quantity_available);
    if (!category) return notify('error', 'Enter a ticket category or section name.');
    if (!Number.isFinite(price) || price < 0) return notify('error', 'Enter a valid non-negative ticket price.');
    if (!Number.isInteger(quantity) || quantity < 0) return notify('error', 'Quantity must be a whole number of 0 or more.');

    try {
      if (data.id) {
        await updateEventTicket(data.id, { ...data, category_name: category, price, quantity_available: quantity });
      } else {
        await addEventTicket({
          event_id: selectedEvent.id,
          category_name: category,
          section: data.section,
          row: data.row,
          seat_details: data.seat_details,
          delivery_method: data.delivery_method,
          delivery_timing: data.delivery_timing,
          status: data.status || 'available',
          price,
          quantity_available: quantity,
        });
      }
      await loadTickets(selectedEvent.id);
      setShowTicketForm(false);
      setEditTicket(null);
      notify('success', data.id ? 'Ticket tier updated successfully.' : 'Ticket tier added successfully.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'The ticket tier could not be saved.');
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Delete this ticket tier?')) return;
    try {
      await deleteEventTicket(id);
      if (selectedEvent) await loadTickets(selectedEvent.id);
      notify('success', 'Ticket tier deleted successfully.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'The ticket tier could not be deleted.');
    }
  };

  const toggleSoldOut = async (ticket: EventTicket) => {
    if (ticket.quantity_available === 0) {
      setEditTicket(ticket);
      setShowTicketForm(true);
      notify('error', 'Enter a new quantity in Edit Ticket to reopen this inventory.');
      return;
    }
    try {
      await updateEventTicket(ticket.id, { quantity_available: 0, status: 'sold_out' });
      if (selectedEvent) await loadTickets(selectedEvent.id);
      notify('success', 'Ticket tier marked sold out. Quantity was not replaced with a made-up amount.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'The ticket status could not be updated.');
    }
  };

  // ─── Stats ──────────────────────────────────────────────

  const totalBookingsRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalTicketRevenue = allTicketOrders
    .filter(t => t.status === 'confirmed')
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const totalRevenue = totalBookingsRevenue + totalTicketRevenue;

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: Building2, color: 'text-blue-400' },
    { label: 'Hotel Bookings', value: bookings.length, icon: Home, color: 'text-green-400' },
    { label: 'Ticket Orders', value: allTicketOrders.length, icon: Ticket, color: 'text-purple-400' },
    { label: 'Total Revenue', value: format(totalRevenue), icon: DollarSign, color: 'text-amber-400' },
  ];

  // ─── Payment method display ─────────────────────────────

  const getPaymentMethodDisplay = (method?: string) => {
    if (!method || method === 'pending') return '⏳ Pending';
    const map: Record<string, { label: string; color: string }> = {
      paypal: { label: '🅿️ PayPal', color: 'bg-blue-500/20 text-blue-400' },
      pending: { label: '⏳ Pending', color: 'bg-gray-500/20 text-gray-400' },
    };
    return map[method] || { label: '⏳ Pending', color: 'bg-gray-500/20 text-gray-400' };
  };

  // ─── Render ─────────────────────────────────────────────

  const getPaymentBadge = (method?: string) => {
    const display = getPaymentMethodDisplay(method);
    return typeof display === 'string'
      ? { label: display, color: 'bg-gray-500/20 text-gray-400' }
      : display;
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {feedback && <div role="status" className={`fixed right-5 top-24 z-[60] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-2xl ${feedback.type === 'success' ? 'border-emerald-400/40 bg-emerald-950/95 text-emerald-200' : 'border-red-400/40 bg-red-950/95 text-red-200'}`}>{feedback.text}</div>}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#151d32] via-[#101729] to-[#0b1020] p-6 shadow-2xl shadow-black/20 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-purple-300">Operations centre</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-amber-400 text-sm mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-purple-400" />
              Admin Panel
              {isDemo && (
                <span className="ml-3 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-medium">
                  Demo Mode — localStorage
                </span>
              )}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">Manage live events, ticket inventory, stays, customer requests, and supplier confirmations from one workspace.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/listing/new"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/25"
            >
              <Plus className="w-5 h-5" />
              Add Listing
            </Link>
            <button
              onClick={() => { setEditEvent({}); setShowEventForm(true); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="sticky top-20 z-30 -mx-4 mb-8 flex gap-2 overflow-x-auto border-y border-white/10 bg-[#0a0a1a]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {[
            { id: 'overview' as Tab, icon: LayoutDashboard, label: 'Overview' },
            { id: 'listings' as Tab, icon: Building2, label: 'Listings' },
            { id: 'bookings' as Tab, icon: Calendar, label: 'Bookings & Tickets' },
            { id: 'events' as Tab, icon: Ticket, label: 'Events' },
            { id: 'users' as Tab, icon: Users, label: 'Users' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'listings' && <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{listings.length}</span>}
              {tab.id === 'bookings' && <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{bookings.length + allTicketOrders.length}</span>}
              {tab.id === 'events' && events.length > 0 && <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{events.length}</span>}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card3D>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">{stat.label}</span>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <p className="text-3xl font-black text-white">{stat.value}</p>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>

            <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#151d32] to-[#0e1425] p-5">
              <div className="mb-4 flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Today’s workspace</p><h3 className="mt-1 text-xl font-bold text-white">What needs your attention?</h3></div><button onClick={() => { setActiveTab('bookings'); void loadTicketOrders(); }} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10">Open all activity</button></div>
              <div className="grid gap-3 md:grid-cols-3">
                <button onClick={() => setActiveTab('bookings')} className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-left transition hover:bg-amber-400/15"><span className="text-2xl">⏳</span><span className="mt-3 block text-2xl font-black text-white">{bookings.filter((booking) => booking.status === 'pending').length}</span><span className="text-sm text-amber-100/70">Hotel requests pending</span></button>
                <button onClick={() => setActiveTab('bookings')} className="rounded-xl border border-purple-400/20 bg-purple-400/10 p-4 text-left transition hover:bg-purple-400/15"><span className="text-2xl">🎟️</span><span className="mt-3 block text-2xl font-black text-white">{allTicketOrders.filter((order) => order.status === 'pending').length}</span><span className="text-sm text-purple-100/70">Ticket orders pending</span></button>
                <button onClick={() => setActiveTab('events')} className="rounded-xl border border-blue-400/20 bg-blue-400/10 p-4 text-left transition hover:bg-blue-400/15"><span className="text-2xl">📅</span><span className="mt-3 block text-2xl font-black text-white">{events.filter((event) => new Date(event.date).getTime() >= Date.now()).length || '—'}</span><span className="text-sm text-blue-100/70">Upcoming events to manage</span></button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <Card3D>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Type</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Guest</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Details</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Amount</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Payment</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Hotel Bookings */}
                    {bookings.slice(0, 3).map((booking) => {
                      const pm = getPaymentBadge(booking.paymentMethod);
                      return (
                        <tr key={booking.id} className="border-b border-white/5">
                          <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">🏨 Hotel</span></td>
                          <td className="p-4 text-white text-sm">{booking.userName}</td>
                          <td className="p-4 text-gray-400 text-sm">{booking.checkIn} → {booking.checkOut}</td>
                          <td className="p-4 text-amber-400 text-sm font-medium">{format(booking.totalPrice)}</td>
                          <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${pm.color}`}>{pm.label}</span></td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Ticket Orders */}
                    {allTicketOrders.slice(0, 3).map((order) => {
                      const pm = getPaymentBadge(order.paymentMethod);
                      return (
                        <tr key={order.id} className="border-b border-white/5">
                          <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">🎟️ Ticket</span></td>
                          <td className="p-4 text-white text-sm">User #{order.userId.slice(0, 8)}</td>
                          <td className="p-4 text-gray-400 text-sm">{order.quantity} × Ticket (ID: {order.ticketId.slice(0, 8)})</td>
                          <td className="p-4 text-amber-400 text-sm font-medium">{format(order.totalPrice)}</td>
                          <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${pm.color}`}>{pm.label}</span></td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && allTicketOrders.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-gray-500">No activity yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card3D>
          </motion.div>
        )}

        {/* ═══ LISTINGS TAB ═══ */}
        {activeTab === 'listings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <button className="px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.filter(l =>
                l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.city.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((listing) => (
                <Card3D key={listing.id}>
                  <div className="relative">
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Link to={`/admin/listing/${listing.id}`} className="w-8 h-8 rounded-lg bg-blue-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-500"><Edit2 className="w-4 h-4" /></Link>
                      <button onClick={() => { if (confirm('Delete this listing?')) deleteListing(listing.id); }} className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-1">{listing.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{listing.city}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{format(listing.price)}/night</span>
                      <Link to={`/listing/${listing.id}`} className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></Link>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ BOOKINGS & TICKETS TAB ═══ */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">All Hotel Bookings & Ticket Orders</h3>
              <button onClick={loadTicketOrders} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {loadingTicketOrders ? (
              <div className="py-12 text-center text-gray-400">Loading...</div>
            ) : bookings.length === 0 && allTicketOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No bookings or ticket orders yet.</div>
            ) : (
              <div className="space-y-6">
                {orders.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between"><h4 className="flex items-center gap-2 text-lg font-bold text-white"><span>🧾</span> Customer Orders ({orders.length})</h4><button onClick={() => { void fetchAllOrders(); }} className="text-xs text-gray-400 hover:text-white">Refresh orders</button></div>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {orders.map((order) => <Card3D key={order.id}><div className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-sm font-bold text-amber-300">{order.bookingCode}</p><p className="mt-1 text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p></div><select value={order.status} onChange={(event) => { void updateOrder(order.id, { status: event.target.value }); }} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div><div className="grid grid-cols-2 gap-2 text-xs"><label className="text-gray-400">Payment<select value={order.paymentStatus} onChange={(event) => { void updateOrder(order.id, { paymentStatus: event.target.value }); }} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-white"><option value="pending">Pending</option><option value="requested">Requested</option><option value="paid">Paid</option><option value="failed">Failed</option></select></label><label className="text-gray-400">Supplier<select value={order.supplierStatus} onChange={(event) => { void updateOrder(order.id, { supplierStatus: event.target.value }); }} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-white"><option value="checking_availability">Checking</option><option value="held">Held</option><option value="confirmed">Confirmed</option><option value="unavailable">Unavailable</option></select></label></div><div className="grid grid-cols-2 gap-2"><input defaultValue={order.supplierConfirmationNumber || ''} onBlur={(event) => { if (event.target.value !== (order.supplierConfirmationNumber || '')) void updateOrder(order.id, { supplierConfirmationNumber: event.target.value }); }} placeholder="Supplier confirmation no." className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white" /><input defaultValue={order.roomNumber || ''} onBlur={(event) => { if (event.target.value !== (order.roomNumber || '')) void updateOrder(order.id, { roomNumber: event.target.value }); }} placeholder="Room number" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white" /></div><button type="button" onClick={() => { if (confirm(`Delete order ${order.bookingCode}? This cannot be undone.`)) void deleteOrder(order.id); }} className="text-xs font-semibold text-red-300 hover:text-red-200">Delete unnecessary order</button></div></Card3D>)}
                    </div>
                  </div>
                )}
                {/* Hotel Bookings Section */}
                {bookings.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Home className="w-5 h-5 text-green-400" /> Hotel Bookings ({bookings.length})
                    </h4>
                    <Card3D>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Booking ID</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Guest</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Check-in</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Check-out</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Guests</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Amount</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Payment</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => {
                              const pm = getPaymentBadge(booking.paymentMethod);
                              return (
                                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5">
                                  <td className="p-4 text-white text-sm font-mono"><span className="text-amber-400 font-bold">{booking.id.slice(-8).toUpperCase()}</span></td>
                                  <td className="p-4 text-white text-sm">{booking.userName}</td>
                                  <td className="p-4 text-gray-400 text-sm">{booking.userEmail}</td>
                                  <td className="p-4 text-gray-400 text-sm">{booking.checkIn}</td>
                                  <td className="p-4 text-gray-400 text-sm">{booking.checkOut}</td>
                                  <td className="p-4 text-gray-400 text-sm">{booking.guests}</td>
                                  <td className="p-4 text-amber-400 text-sm font-medium">{format(booking.totalPrice)}</td>
                                  <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${pm.color}`}>{pm.label}</span></td>
                                  <td className="p-4">
                                    <select
                                      value={booking.status}
                                      onChange={(e) => updateBooking(booking.id, { status: e.target.value as Booking['status'] })}
                                      className={`px-2 py-1 rounded text-xs focus:outline-none ${
                                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                        booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                      } border bg-white/5`}
                                    >
                                      <option value="pending">⏳ Pending</option>
                                      <option value="confirmed">✅ Confirm</option>
                                      <option value="cancelled">❌ Cancel</option>
                                      <option value="completed">✅ Complete</option>
                                    </select>
                                  </td>
                                  <td className="p-4"><button className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></button></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card3D>
                  </div>
                )}

                {/* Ticket Orders Section */}
                {allTicketOrders.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-purple-400" /> Ticket Orders ({allTicketOrders.length})
                    </h4>
                    <Card3D>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Order ID</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">User</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Event ID</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Quantity</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Amount</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Payment</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                              <th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allTicketOrders.map((order) => {
                              const pm = getPaymentBadge(order.paymentMethod);
                              return (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                                  <td className="p-4 text-white text-sm font-mono"><span className="text-amber-400 font-bold">{order.id.slice(-8).toUpperCase()}</span></td>
                                  <td className="p-4 text-white text-sm">User #{order.userId.slice(0, 8)}</td>
                                  <td className="p-4 text-gray-400 text-sm">{order.ticketId.slice(0, 12)}...</td>
                                  <td className="p-4 text-white text-sm">{order.quantity}</td>
                                  <td className="p-4 text-amber-400 text-sm font-medium">{format(order.totalPrice)}</td>
                                  <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${pm.color}`}>{pm.label}</span></td>
                                  <td className="p-4">
                                    <select
                                      value={order.status}
                                      onChange={(e) => updateTicketOrder(order.id, { status: e.target.value as TicketOrder['status'] })}
                                      className={`px-2 py-1 rounded text-xs focus:outline-none ${
                                        order.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                        'bg-red-500/20 text-red-400 border-red-500/30'
                                      } border bg-white/5`}
                                    >
                                      <option value="pending">⏳ Pending</option>
                                      <option value="confirmed">✅ Confirm</option>
                                      <option value="cancelled">❌ Cancel</option>
                                    </select>
                                  </td>
                                  <td className="p-4"><button className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></button></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card3D>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ EVENTS TAB ═══ (unchanged) */}
        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">All Events</h3>
                <p className="mt-1 text-sm text-gray-500">Choose an event, then manage its ticket inventory on the right.</p>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input value={eventSearch} onChange={(event) => setEventSearch(event.target.value)} placeholder="Search events..." className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-400/60" />
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                <button type="button" onClick={() => setEventView('list')} aria-label="List view" className={`rounded-lg p-2 ${eventView === 'list' ? 'bg-purple-500/30 text-purple-200' : 'text-gray-500 hover:text-white'}`}><List className="h-4 w-4" /></button>
                <button type="button" onClick={() => setEventView('grid')} aria-label="Grid view" className={`rounded-lg p-2 ${eventView === 'grid' ? 'bg-purple-500/30 text-purple-200' : 'text-gray-500 hover:text-white'}`}><Grid2X2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]">
              <div className="min-w-0">
                {loadingEvents ? (
                  <div className="py-8 text-center text-gray-400">Loading events...</div>
                ) : events.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">No events created yet.</div>
                ) : (
                  <div className={eventView === 'grid' ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3'}>
                    {events.filter((event) => `${event.title} ${event.city} ${event.venue}`.toLowerCase().includes(eventSearch.toLowerCase())).map((event) => (
                      <Card3D key={event.id}>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-bold">{event.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{formatVenueDate(event.date)}</span>
                                <MapPin className="w-3 h-3 ml-2" />
                                <span>{event.city}</span>
                              </div>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                                event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                                event.status === 'live' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {event.status}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setEditEvent(event); setShowEventForm(true); }}
                                className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleSelectEvent(event)}
                                className={`p-1.5 rounded-lg ${selectedEvent?.id === event.id ? 'bg-amber-500/30 text-amber-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                              >
                                <Ticket className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card3D>
                    ))}
                  </div>
                )}
              </div>

              <div className="min-w-0 md:sticky md:top-32 md:self-start">
                {selectedEvent ? (
                  <>
                    <div className="mb-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-bold text-white">Tickets for {selectedEvent.title}</h3><button
                        onClick={() => { setEditTicket({}); setShowTicketForm(true); }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Tier
                      </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {(['all', 'available', 'sold_out'] as const).map((filter) => <button key={filter} type="button" onClick={() => setTicketFilter(filter)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${ticketFilter === filter ? 'bg-purple-500/25 text-purple-200' : 'bg-white/5 text-gray-500 hover:text-white'}`}>{filter === 'all' ? `All (${eventTickets.length})` : filter === 'available' ? `Available (${eventTickets.filter((ticket) => ticket.quantity_available > 0).length})` : `Sold out (${eventTickets.filter((ticket) => ticket.quantity_available === 0).length})`}</button>)}
                    </div>
                    {eventTickets.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">No ticket tiers added.</div>
                    ) : (
                      <div className="space-y-2">
                        {eventTickets.filter((ticket) => ticketFilter === 'all' || (ticketFilter === 'available' ? ticket.quantity_available > 0 : ticket.quantity_available === 0)).map((ticket) => {
                          const isSoldOut = ticket.quantity_available === 0;
                          return (
                            <Card3D key={ticket.id}>
                              <div className="p-4 flex items-center justify-between">
                                <div>
                                  <p className="text-white font-medium">{ticket.category_name}</p>
                                  <p className="text-gray-400 text-xs">{ticket.section ? `Section ${ticket.section}` : 'Section on request'}{ticket.row ? ` · Row ${ticket.row}` : ''}</p>
                                  <p className="text-amber-400 text-sm">{isSoldOut ? 'Sold Out' : `$${ticket.price}`}</p>
                                  <p className="text-gray-500 text-xs">{ticket.quantity_available} available · {ticket.status || (isSoldOut ? 'sold_out' : 'available')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleSoldOut(ticket)}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                      isSoldOut
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                        : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                    }`}
                                  >
                                    {isSoldOut ? 'Sold Out' : 'Available'}
                                  </button>
                                  <button
                                    onClick={() => { setEditTicket(ticket); setShowTicketForm(true); }}
                                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTicket(ticket.id)}
                                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </Card3D>
                          );
                        })}
                      </div>
                    )}
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-gray-400">
                    <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Select an event to manage tickets</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ USERS TAB ═══ (unchanged) */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card3D>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">User Management</h3>
                  <button onClick={loadUsers} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 text-sm flex items-center gap-2">
                    <span>🔄</span> Refresh
                  </button>
                </div>
                {loadingUsers ? (
                  <div className="py-12 text-center text-gray-400">Loading users...</div>
                ) : allUsers.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">No users found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-4 text-gray-400 text-sm font-medium">Name</th>
                          <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                          <th className="text-left p-4 text-gray-400 text-sm font-medium">Role</th>
                          <th className="text-left p-4 text-gray-400 text-sm font-medium">Joined</th>
                          <th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((u) => (
                          <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-4 text-white text-sm">{u.first_name} {u.last_name}</td>
                            <td className="p-4 text-gray-400 text-sm">{u.email}</td>
                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>{u.role || 'user'}</span></td>
                            <td className="p-4 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                            <td className="p-4"><button className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card3D>
          </motion.div>
        )}
      </div>

      {/* ─── Event Form Modal ─── */}
      {showEventForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#14142a] rounded-2xl border border-white/10 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{editEvent?.id ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => { setShowEventForm(false); setEditEvent(null); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = {
                id: editEvent?.id,
                title: (form.querySelector('[name="title"]') as HTMLInputElement).value,
                description: (form.querySelector('[name="description"]') as HTMLTextAreaElement).value,
                date: (form.querySelector('[name="date"]') as HTMLInputElement).value,
                venue: (form.querySelector('[name="venue"]') as HTMLInputElement).value,
                city: (form.querySelector('[name="city"]') as HTMLInputElement).value,
                image_url: (form.querySelector('[name="image_url"]') as HTMLInputElement).value || undefined,
                seat_map_url: (form.querySelector('[name="seat_map_url"]') as HTMLInputElement).value || undefined,
                status: (form.querySelector('[name="status"]') as HTMLSelectElement).value as Event['status'],
              };
              await handleSaveEvent(data);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Title *</label>
                  <input name="title" required defaultValue={editEvent?.title || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <textarea name="description" rows={3} defaultValue={editEvent?.description || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Date & Time *</label>
                    <input name="date" type="datetime-local" required defaultValue={editEvent?.date ? new Date(editEvent.date).toISOString().slice(0, 16) : ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <select name="status" defaultValue={editEvent?.status || 'upcoming'} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Venue *</label>
                    <input name="venue" required defaultValue={editEvent?.venue || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">City *</label>
                    <input name="city" required defaultValue={editEvent?.city || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Image URL</label>
                  <div className="flex gap-2">
                    <input name="image_url" value={editEvent?.image_url || ''} onChange={(event) => setEditEvent((current) => ({ ...(current || {}), image_url: event.target.value }))} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    <label className="inline-flex cursor-pointer items-center rounded-xl border border-blue-400/30 bg-blue-500/15 px-3 text-xs font-semibold text-blue-200">
                      {uploadingEventImage ? 'Uploading…' : 'Upload'}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingEventImage || isDemo} onChange={(event) => { void handleUploadEventImage(event.target.files?.[0]); event.currentTarget.value = ''; }} />
                    </label>
                  </div>
                  {editEvent?.image_url && <button type="button" onClick={() => setPreviewImage(editEvent.image_url || null)} className="mt-3 block overflow-hidden rounded-xl border border-white/10 text-left"><img src={editEvent.image_url} alt="Event image preview" className="h-32 w-full object-cover" onError={(event) => { event.currentTarget.src = '/images/event-sport.jpg'; }} /><span className="block bg-black/50 px-3 py-1 text-xs text-white">Click to preview event image</span></button>}
                </div>
                <div>
                  <label className="text-sm text-gray-400">Stadium seating map (optional)</label>
                  <div className="mt-1 flex gap-2">
                    <input name="seat_map_url" value={editEvent?.seat_map_url || ''} onChange={(event) => setEditEvent((current) => ({ ...(current || {}), seat_map_url: event.target.value }))} placeholder="Optional seating map image URL" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    <label className="inline-flex cursor-pointer items-center rounded-xl border border-purple-400/30 bg-purple-500/15 px-3 text-xs font-semibold text-purple-200">
                      {uploadingSeatMap ? 'Uploading…' : 'Upload'}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingSeatMap || isDemo} onChange={(event) => { void handleUploadSeatMap(event.target.files?.[0]); event.currentTarget.value = ''; }} />
                    </label>
                  </div>
                  {editEvent?.seat_map_url && <button type="button" onClick={() => setPreviewImage(editEvent.seat_map_url || null)} className="mt-3 block overflow-hidden rounded-xl border border-white/10 text-left"><img src={editEvent.seat_map_url} alt="Stadium seating map preview" className="h-32 w-full object-contain bg-slate-900" onError={(event) => { event.currentTarget.src = '/images/seatmaps/mt-bank-stadium-bts-2026-08-10.png'; }} /><span className="block bg-black/50 px-3 py-1 text-xs text-white">Click to preview seating map</span></button>}
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-[1.02] transition-all">
                  {editEvent?.id ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ─── Ticket Form Modal ─── */}
      {showTicketForm && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="my-4 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#14142a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{editTicket?.id ? 'Edit Ticket' : 'Add Ticket Tier'}</h2>
              <button onClick={() => { setShowTicketForm(false); setEditTicket(null); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = {
                id: editTicket?.id,
                category_name: (form.querySelector('[name="category_name"]') as HTMLInputElement).value,
                section: (form.querySelector('[name="section"]') as HTMLInputElement).value || undefined,
                row: (form.querySelector('[name="row"]') as HTMLInputElement).value || undefined,
                seat_details: (form.querySelector('[name="seat_details"]') as HTMLInputElement).value || undefined,
                delivery_method: (form.querySelector('[name="delivery_method"]') as HTMLInputElement).value || undefined,
                delivery_timing: (form.querySelector('[name="delivery_timing"]') as HTMLInputElement).value || undefined,
                image_url: (form.querySelector('[name="image_url"]') as HTMLInputElement).value || undefined,
                status: (form.querySelector('[name="status"]') as HTMLSelectElement).value,
                price: parseInt((form.querySelector('[name="price"]') as HTMLInputElement).value),
                quantity_available: parseInt((form.querySelector('[name="quantity"]') as HTMLInputElement).value) || 0,
              };
              await handleSaveTicket(data);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Category Name *</label>
                  <input name="category_name" required defaultValue={editTicket?.category_name || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Ticket image</label>
                  <div className="mt-1 flex gap-2">
                    <input name="image_url" value={editTicket?.image_url || ''} onChange={(event) => setEditTicket((current) => ({ ...(current || {}), image_url: event.target.value }))} placeholder="Optional authorized image URL" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    <label className="inline-flex cursor-pointer items-center rounded-xl border border-purple-400/30 bg-purple-500/15 px-3 text-xs font-semibold text-purple-200">
                      {uploadingTicketImage ? 'Uploading…' : 'Upload'}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingTicketImage || isDemo} onChange={(event) => { void handleUploadTicketImage(event.target.files?.[0]); event.currentTarget.value = ''; }} />
                    </label>
                  </div>
                  {editTicket?.image_url && <button type="button" onClick={() => setPreviewImage(editTicket.image_url || null)} className="mt-3 block overflow-hidden rounded-xl border border-white/10 text-left"><img src={editTicket.image_url} alt="Ticket image preview" className="h-32 w-full object-cover" onError={(event) => { event.currentTarget.src = '/images/stadium.jpg'; }} /><span className="block bg-black/50 px-3 py-1 text-xs text-white">Click to preview ticket image</span></button>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Section</label>
                    <input name="section" defaultValue={editTicket?.section || ''} placeholder="e.g. 532 or Field R" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Row</label>
                    <input name="row" defaultValue={editTicket?.row || ''} placeholder="e.g. 16" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Seat details</label>
                  <input name="seat_details" defaultValue={editTicket?.seat_details || ''} placeholder="e.g. 2 mobile tickets or seat details on request" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Delivery method</label>
                    <input name="delivery_method" defaultValue={editTicket?.delivery_method || 'Mobile transfer'} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Delivery timing</label>
                    <input name="delivery_timing" defaultValue={editTicket?.delivery_timing || ''} placeholder="e.g. Evening before event" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <select name="status" defaultValue={editTicket?.status || (editTicket?.quantity_available === 0 ? 'sold_out' : 'available')} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="sold_out">Sold out</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Price (USD) *</label>
                  <input name="price" type="number" required min="0" step="1" defaultValue={editTicket?.price || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Quantity Available</label>
                  <input name="quantity" type="number" min="0" step="1" defaultValue={editTicket?.quantity_available || 0} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-[1.02] transition-all">
                  {editTicket?.id ? 'Update Ticket' : 'Add Ticket'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {previewImage && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-h-[90vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setPreviewImage(null)} aria-label="Close image preview" className="absolute -right-3 -top-3 z-10 rounded-full bg-white p-2 text-slate-900 shadow-xl"><X className="h-5 w-5" /></button>
            <img src={previewImage} alt="Large admin image preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" onError={(event) => { event.currentTarget.src = '/images/stadium.jpg'; }} />
          </div>
        </div>
      )}
    </main>
  );
}
