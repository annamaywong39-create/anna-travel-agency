import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Calendar, Users, Plus, Edit2, Trash2,
  Eye, DollarSign, TrendingUp, ArrowLeft, Search, Filter, Ticket, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData, type Booking } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Card3D from '../components/Card3D';

type Tab = 'overview' | 'listings' | 'bookings' | 'tickets' | 'users';

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    listings, bookings, deleteListing, updateBooking, isDemo, fetchAllUsers,
    events, fetchEvents, addEvent, deleteEvent, tickets, fetchTicketsByEvent, addTicketToEvent, updateTicket, ticketOrders,
    matches, fetchMatches, updateMatchPrices
  } = useData();
  const { format } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ id: string; status: 'sending' | 'sent' | 'error' } | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState('');
  const [newTicketData, setNewTicketData] = useState({ category_name: '', price: 0, quantity_available: 0, description: '' });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  if (authLoading) return <main className="min-h-screen flex items-center justify-center bg-[#0a0a1a]"><p className="text-gray-400 text-sm">Loading admin panel...</p></main>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'tickets') { fetchEvents(); fetchMatches(); }
  }, [activeTab]);

  const loadUsers = async () => { setLoadingUsers(true); const users = await fetchAllUsers(); setAllUsers(users); setLoadingUsers(false); };
  const totalRevenue = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0);

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: Building2, color: 'text-blue-400' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-green-400' },
    { label: 'Revenue', value: format(totalRevenue), icon: DollarSign, color: 'text-amber-400' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: TrendingUp, color: 'text-purple-400' },
  ];

  const filteredListings = listings.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.city.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    await updateBooking(bookingId, { status: newStatus });
  };

  const getPaymentMethodDisplay = (method?: 'bitcoin' | 'paypal' | 'steam') => {
    if (!method) return { label: '⏳ Pending', color: 'bg-gray-500/20 text-gray-400' };
    const map = { bitcoin: { label: '₿ Bitcoin', color: 'bg-orange-500/20 text-orange-400' }, paypal: { label: '🅿️ PayPal', color: 'bg-blue-500/20 text-blue-400' }, steam: { label: '🎮 Steam Card', color: 'bg-purple-500/20 text-purple-400' } };
    return map[method] || { label: '⏳ Pending', color: 'bg-gray-500/20 text-gray-400' };
  };

  const handleAddEvent = async () => {
    if (!newEventName) return;
    await addEvent({ name: newEventName, match_date: new Date().toISOString().split('T')[0], venue: '', city: '', image: '' });
    setNewEventName('');
    setShowAddEvent(false);
    fetchEvents();
  };

  const handleAddTicket = async (eventId: string) => {
    await addTicketToEvent({ ...newTicketData, event_id: eventId });
    setNewTicketData({ category_name: '', price: 0, quantity_available: 0, description: '' });
    fetchTicketsByEvent(eventId);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-amber-400 text-sm mb-2 hover:underline"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
            <h1 className="text-3xl font-black text-white flex items-center gap-3"><LayoutDashboard className="w-8 h-8 text-purple-400" /> Admin Panel</h1>
          </div>
          <Link to="/admin/listing/new" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/25"><Plus className="w-5 h-5" /> Add Listing</Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview' as Tab, icon: LayoutDashboard, label: 'Overview' },
            { id: 'listings' as Tab, icon: Building2, label: 'Listings' },
            { id: 'bookings' as Tab, icon: Calendar, label: 'Bookings' },
            { id: 'tickets' as Tab, icon: Ticket, label: 'Tickets' },
            { id: 'users' as Tab, icon: Users, label: 'Users' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card3D><div className="p-6"><div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">{stat.label}</span><stat.icon className={`w-5 h-5 ${stat.color}`} /></div><p className="text-3xl font-black text-white">{stat.value}</p></div></Card3D>
                </motion.div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
            <Card3D>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">ID</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Guest</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Dates</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Amount</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Payment Method</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => {
                      const pm = getPaymentMethodDisplay(booking.paymentMethod);
                      return (
                        <tr key={booking.id} className="border-b border-white/5">
                          <td className="p-4 text-white text-sm font-mono">{booking.id.slice(0, 12)}...</td>
                          <td className="p-4 text-white text-sm">{booking.userName}</td>
                          <td className="p-4 text-gray-400 text-sm">{booking.checkIn}</td>
                          <td className="p-4 text-amber-400 text-sm font-medium">{format(booking.totalPrice)}</td>
                          <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${pm.color}`}>{pm.label}</span></td>
                          <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{booking.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card3D>
          </motion.div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="text" placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" /></div>
              <button className="px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"><Filter className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <Card3D key={listing.id}>
                  <div className="relative"><img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover" /><div className="absolute top-3 right-3 flex gap-2"><Link to={`/admin/listing/${listing.id}`} className="w-8 h-8 rounded-lg bg-blue-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-500 transition-all"><Edit2 className="w-4 h-4" /></Link><button onClick={() => { if (confirm('Delete this listing?')) deleteListing(listing.id); }} className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-all"><Trash2 className="w-4 h-4" /></button></div></div>
                  <div className="p-4"><h3 className="text-white font-bold mb-1">{listing.title}</h3><p className="text-gray-400 text-sm mb-2">{listing.city}</p><div className="flex items-center justify-between"><span className="text-amber-400 font-bold">{format(listing.price)}/night</span><Link to={`/listing/${listing.id}`} className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></Link></div></div>
                </Card3D>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card3D>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-white/10"><th className="text-left p-4 text-gray-400 text-sm font-medium">ID</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Guest</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Check-in</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Check-out</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Amount</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Payment Method</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th></tr></thead>
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
                          <td className="p-4 text-amber-400 text-sm font-medium">{format(booking.totalPrice)}</td>
                          <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${pm.color}`}>{pm.label}</span></td>
                          <td className="p-4">
                            <select value={booking.status} onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])} className={`px-2 py-1 rounded text-xs focus:outline-none ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'} border bg-white/5`}>
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
                {bookings.length === 0 && <div className="p-12 text-center text-gray-500">No bookings yet</div>}
              </div>
            </Card3D>
          </motion.div>
        )}

        {/* ═══ TICKETS TAB ═══ */}
        {activeTab === 'tickets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Event & Match Inventory</h2>
              <button onClick={() => setShowAddEvent(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"><Plus className="w-4 h-4" /> Add Custom Event</button>
            </div>

            {/* Custom Events List */}
            <AnimatePresence>
              {showAddEvent && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex gap-3">
                  <input type="text" placeholder="Event Name" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
                  <button onClick={async () => { await addEvent({ name: newEventName, match_date: new Date().toISOString().split('T')[0], venue: '', city: '', image: '' }); setNewEventName(''); setShowAddEvent(false); fetchEvents(); }} className="px-6 py-2 rounded-lg bg-green-500 text-white font-bold">Create</button>
                  <button onClick={() => setShowAddEvent(false)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400">Cancel</button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4 mb-10">
              {events.map((event) => {
                const isExpanded = expandedEvent === event.id;
                return (
                  <Card3D key={event.id}>
                    <div className="p-4">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => { setExpandedEvent(isExpanded ? null : event.id); if (!isExpanded) fetchTicketsByEvent(event.id); }}>
                        <div><h3 className="text-white font-bold text-lg">{event.name}</h3><p className="text-gray-400 text-sm">{new Date(event.match_date).toLocaleDateString()} · {event.venue || 'TBD'}</p></div>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete this event?')) deleteEvent(event.id); }} className="text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-white/10 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              {tickets.filter(t => t.event_id === event.id).map((ticket) => (
                                <div key={ticket.id} className="p-4 rounded-xl bg-white/5 border border-white/10 relative group">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium">{ticket.category_name}</span>
                                    <span className="text-amber-400 font-bold">{format(ticket.price)}</span>
                                  </div>
                                  <p className="text-gray-400 text-xs mb-2">{ticket.description}</p>
                                  <p className="text-gray-500 text-xs mb-3">Available: {ticket.quantity_available}</p>
                                  <button onClick={() => { const newPrice = prompt('Update price:', ticket.price); if(newPrice) updateTicket(ticket.id, { price: parseInt(newPrice) }); }} className="w-full py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30 transition-all">Update Price</button>
                                </div>
                              ))}
                              
                              <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
                                <input type="text" placeholder="Category (e.g. VIP)" value={newTicketData.category_name} onChange={(e) => setNewTicketData({...newTicketData, category_name: e.target.value})} className="w-full mb-2 px-2 py-1 text-sm rounded bg-black/40 text-white border border-white/10" />
                                <div className="flex gap-2 mb-2">
                                  <input type="number" placeholder="Price" value={newTicketData.price === 0 ? '' : newTicketData.price} onChange={(e) => setNewTicketData({...newTicketData, price: e.target.value === '' ? 0 : parseInt(e.target.value)})} className="w-1/2 px-2 py-1 text-sm rounded bg-black/40 text-white border border-white/10" />
                                  <input type="number" placeholder="Qty" value={newTicketData.quantity_available || ''} onChange={(e) => setNewTicketData({...newTicketData, quantity_available: parseInt(e.target.value)})} className="w-1/2 px-2 py-1 text-sm rounded bg-black/40 text-white border border-white/10" />
                                </div>
                                <input type="text" placeholder="Description" value={newTicketData.description} onChange={(e) => setNewTicketData({...newTicketData, description: e.target.value})} className="w-full mb-2 px-2 py-1 text-sm rounded bg-black/40 text-white border border-white/10" />
                                <button onClick={() => handleAddTicket(event.id)} className="w-full py-1 rounded-lg bg-green-500/20 text-green-300 text-xs hover:bg-green-500/30 transition-all">Add Ticket Tier</button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card3D>
                );
              })}
            </div>

            {/* 🌟 MATCH PRICES SECTION */}
            <h2 className="text-xl font-bold text-white mb-4">⚽ Match Prices</h2>
            <div className="space-y-4">
              {matches.map((match) => {
                const isExpanded = expandedMatch === match.id;
                return (
                  <Card3D key={match.id}>
                    <div className="p-4">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedMatch(isExpanded ? null : match.id)}>
                        <div>
                          <h3 className="text-white font-bold text-lg">{match.home_team} vs {match.away_team}</h3>
                          <p className="text-gray-400 text-sm">{match.venue} · {match.city} · {new Date(match.match_date).toLocaleDateString()}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-white/10 overflow-hidden">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              {[
                                { label: 'Cat 1', key: 'cat1', val: match.category_1_price },
                                { label: 'Cat 2', key: 'cat2', val: match.category_2_price },
                                { label: 'Cat 3', key: 'cat3', val: match.category_3_price },
                                { label: 'Cat 4', key: 'cat4', val: match.category_4_price },
                                { label: 'Supporter', key: 'sup', val: match.supporter_entry_price },
                              ].map((cat) => (
                                <div key={cat.key} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <label className="text-xs text-gray-400 block mb-1">{cat.label} Price ($)</label>
                                  <input
                                    type="number" min={0}
                                    value={cat.val || ''}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      const safeVal = isNaN(val) ? 0 : val;
                                      updateMatchPrices(match.id, { [cat.key]: safeVal });
                                    }}
                                    className="w-full px-3 py-2 text-sm rounded-lg bg-black/40 text-white border border-white/10 focus:outline-none focus:border-amber-500/50"
                                  />
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ USERS TAB ═══ */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card3D>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-white">User Management</h3><button onClick={loadUsers} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm flex items-center gap-2"><span>🔄</span> Refresh</button></div>
                {loadingUsers ? <div className="py-12 text-center text-gray-400">Loading users...</div> : allUsers.length === 0 ? <div className="py-12 text-center text-gray-400">No users found.</div> : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="border-b border-white/10"><th className="text-left p-4 text-gray-400 text-sm font-medium">Name</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Role</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Stats</th><th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th></tr></thead>
                      <tbody>
                        {allUsers.map((u) => {
                          const userBookings = bookings.filter(b => b.userId === u.id);
                          const userTicketOrders = ticketOrders.filter(t => t.user_id === u.id);
                          const isExpanded = expandedUser === u.id;
                          return (
                            <React.Fragment key={u.id}>
                              <tr className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setExpandedUser(isExpanded ? null : u.id)}>
                                <td className="p-4 text-white text-sm">{u.first_name} {u.last_name}</td>
                                <td className="p-4 text-gray-400 text-sm">{u.email}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>{u.role || 'user'}</span></td>
                                <td className="p-4 text-gray-400 text-sm"><span className="text-green-400">{userBookings.length} Bookings</span> · <span className="text-blue-400">{userTicketOrders.length} Tickets</span></td>
                                <td className="p-4">{isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}</td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-black/40">
                                  <td colSpan={5} className="p-4 border-b border-white/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div><h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-400" /> Room Bookings</h4>
                                        {userBookings.length === 0 ? <p className="text-gray-500 text-sm">No room bookings.</p> : (
                                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            {userBookings.map(b => (<div key={b.id} className="bg-white/5 p-3 rounded-lg flex items-center justify-between text-sm"><span className="text-gray-300">{b.checkIn} → {b.checkOut}</span><span className="text-amber-400 font-bold">{format(b.totalPrice)}</span><span className={`px-2 py-0.5 rounded-full text-[10px] ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{b.status}</span></div>))}
                                          </div>
                                        )}
                                      </div>
                                      <div><h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Ticket className="w-4 h-4 text-amber-400" /> Ticket Orders</h4>
                                        {userTicketOrders.length === 0 ? <p className="text-gray-500 text-sm">No ticket purchases.</p> : (
                                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            {userTicketOrders.map(t => (<div key={t.id} className="bg-white/5 p-3 rounded-lg flex items-center justify-between text-sm"><span className="text-gray-300">x{t.quantity} Tickets</span><span className="text-blue-400 font-bold">{format(t.total_price)}</span><span className={`px-2 py-0.5 rounded-full text-[10px] ${t.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{t.status}</span></div>))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card3D>
          </motion.div>
        )}
      </div>
    </main>
  );
}