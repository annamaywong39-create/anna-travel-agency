import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Calendar, Users, Plus, Edit2, Trash2,
  Eye, DollarSign, TrendingUp, ArrowLeft, Search, Filter, CheckCircle2,
  Ticket, Save, RefreshCw, Calendar as CalendarIcon, MapPin, X, Home, CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData, type Booking, type Event, type EventTicket, type TicketOrder } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Card3D from '../components/Card3D';

type Tab = 'overview' | 'listings' | 'bookings' | 'users' | 'events';

export default function Admin() {
  const { user } = useAuth();
  const {
    listings, bookings, ticketOrders, deleteListing, updateBooking, isDemo,
    fetchAllUsers, updateTicketOrder, fetchAllTicketOrders,
    fetchEvents, addEvent, updateEvent, deleteEvent,
    fetchEventTickets, addEventTicket, updateEventTicket, deleteEventTicket
  } = useData();
  const { format } = useCurrency();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ id: string; status: 'sending' | 'sent' | 'error' } | null>(null);

  // Users
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Events
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventTickets, setEventTickets] = useState<EventTicket[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState<Partial<Event> | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editTicket, setEditTicket] = useState<Partial<EventTicket> | null>(null);

  // Ticket Orders (for display)
  const [allTicketOrders, setAllTicketOrders] = useState<TicketOrder[]>([]);
  const [loadingTicketOrders, setLoadingTicketOrders] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'events') loadEvents();
    if (activeTab === 'bookings' || activeTab === 'overview') loadTicketOrders();
  }, [activeTab]);

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
    setSelectedEvent(null);
    setEventTickets([]);
  };

  const loadTicketOrders = async () => {
    setLoadingTicketOrders(true);
    const data = await fetchAllTicketOrders();
    setAllTicketOrders(data);
    setLoadingTicketOrders(false);
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
    if (data.id) {
      await updateEvent(data.id, data);
    } else {
      await addEvent(data as Omit<Event, 'id' | 'createdAt'>);
    }
    await loadEvents();
    setShowEventForm(false);
    setEditEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Delete this event and all its tickets?')) {
      await deleteEvent(id);
      await loadEvents();
      if (selectedEvent?.id === id) setSelectedEvent(null);
    }
  };

  const handleSaveTicket = async (data: Partial<EventTicket>) => {
    if (!selectedEvent) return;
    if (data.id) {
      await updateEventTicket(data.id, data);
    } else {
      await addEventTicket({
        event_id: selectedEvent.id,
        category_name: data.category_name!,
        price: data.price!,
        quantity_available: data.quantity_available || 0,
      });
    }
    await loadTickets(selectedEvent.id);
    setShowTicketForm(false);
    setEditTicket(null);
  };

  const handleDeleteTicket = async (id: string) => {
    if (confirm('Delete this ticket tier?')) {
      await deleteEventTicket(id);
      if (selectedEvent) await loadTickets(selectedEvent.id);
    }
  };

  const toggleSoldOut = async (ticket: EventTicket) => {
    const newQty = ticket.quantity_available > 0 ? 0 : 100;
    await updateEventTicket(ticket.id, { quantity_available: newQty });
    if (selectedEvent) await loadTickets(selectedEvent.id);
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
      bitcoin: { label: '₿ Bitcoin', color: 'bg-orange-500/20 text-orange-400' },
      paypal: { label: '🅿️ PayPal', color: 'bg-blue-500/20 text-blue-400' },
      steam: { label: '🎮 Steam Card', color: 'bg-purple-500/20 text-purple-400' },
      card: { label: '💳 Card', color: 'bg-green-500/20 text-green-400' },
    };
    return map[method] || { label: '⏳ Pending', color: 'bg-gray-500/20 text-gray-400' };
  };

  // ─── Render ─────────────────────────────────────────────

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
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
          </div>
          <div className="flex gap-2">
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
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 flex-wrap">
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
              {tab.label}
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
                      const pm = getPaymentMethodDisplay(booking.paymentMethod);
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
                      const pm = getPaymentMethodDisplay(order.paymentMethod);
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
                              const pm = getPaymentMethodDisplay(booking.paymentMethod);
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
                              const pm = getPaymentMethodDisplay(order.paymentMethod);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">All Events</h3>
                {loadingEvents ? (
                  <div className="py-8 text-center text-gray-400">Loading events...</div>
                ) : events.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">No events created yet.</div>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => (
                      <Card3D key={event.id}>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-bold">{event.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
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

              <div>
                {selectedEvent ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Tickets for {selectedEvent.title}</h3>
                      <button
                        onClick={() => { setEditTicket({}); setShowTicketForm(true); }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Tier
                      </button>
                    </div>
                    {eventTickets.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">No ticket tiers added.</div>
                    ) : (
                      <div className="space-y-2">
                        {eventTickets.map((ticket) => {
                          const isSoldOut = ticket.quantity_available === 0;
                          return (
                            <Card3D key={ticket.id}>
                              <div className="p-4 flex items-center justify-between">
                                <div>
                                  <p className="text-white font-medium">{ticket.category_name}</p>
                                  <p className="text-amber-400 text-sm">{isSoldOut ? 'Sold Out' : `$${ticket.price}`}</p>
                                  <p className="text-gray-500 text-xs">{ticket.quantity_available} available</p>
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
                  <input name="image_url" defaultValue={editEvent?.image_url || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#14142a] rounded-2xl border border-white/10 max-w-md w-full p-6">
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
    </main>
  );
}