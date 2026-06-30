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
  const { user } = useAuth();
  const { 
    listings, bookings, deleteListing, updateBooking, isDemo, fetchAllUsers,
    events, fetchEvents, addEvent, deleteEvent, tickets, fetchTicketsByEvent, addTicketToEvent, updateTicket, ticketOrders
  } = useData();
  const { format } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ id: string; status: 'sending' | 'sent' | 'error' } | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Ticket State
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState('');
  const [newTicketData, setNewTicketData] = useState({ category_name: '', price: 0, quantity_available: 0, description: '' });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'tickets') { fetchEvents(); setTickets([]); }
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

  const sendConfirmationEmail = async (booking: Booking, listing: any) => { /* existing logic */ };

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId);
    await updateBooking(bookingId, { status: newStatus });
    if (newStatus === 'confirmed' && booking) { /* email logic */ }
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
        {/* Header (unchanged) */}
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

        {/* Overview Tab (same) */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card3D><div className="p-6"><div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">{stat.label}</span><stat.icon className={`w-5 h-5 ${stat.color}`} /></div><p className="text-3xl font-black text-white">{stat.value}</p></div></Card3D>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Listings / Bookings Tabs (unchanged) */}
        {activeTab === 'listings' && (/* ... unchanged ... */ <div>Listings Tab Content</div>)}
        {activeTab === 'bookings' && (/* ... unchanged ... */ <div>Bookings Tab Content</div>)}

        {/* ═══ TICKETS TAB (NEW) ═══ */}
        {activeTab === 'tickets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Match Events & Ticket Inventory</h2>
              <button onClick={() => setShowAddEvent(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"><Plus className="w-4 h-4" /> Add Event</button>
            </div>

            <AnimatePresence>
              {showAddEvent && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex gap-3">
                  <input type="text" placeholder="Event Name (e.g. USA vs Australia)" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white" />
                  <button onClick={handleAddEvent} className="px-6 py-2 rounded-lg bg-green-500 text-white font-bold">Create</button>
                  <button onClick={() => setShowAddEvent(false)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400">Cancel</button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {events.map((event) => {
                const isExpanded = expandedEvent === event.id;
                return (
                  <Card3D key={event.id}>
                    <div className="p-4">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => { setExpandedEvent(isExpanded ? null : event.id); if (!isExpanded) fetchTicketsByEvent(event.id); }}>
                        <div>
                          <h3 className="text-white font-bold text-lg">{event.name}</h3>
                          <p className="text-gray-400 text-sm">{new Date(event.match_date).toLocaleDateString()} · {event.venue || 'TBD'}</p>
                        </div>
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
                              
                              {/* Add Ticket Form */}
                              <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
                                <input type="text" placeholder="Category (e.g. VIP)" value={newTicketData.category_name} onChange={(e) => setNewTicketData({...newTicketData, category_name: e.target.value})} className="w-full mb-2 px-2 py-1 text-sm rounded bg-black/40 text-white border border-white/10" />
                                <div className="flex gap-2 mb-2">
                                  <input type="number" placeholder="Price" value={newTicketData.price || ''} onChange={(e) => setNewTicketData({...newTicketData, price: parseInt(e.target.value)})} className="w-1/2 px-2 py-1 text-sm rounded bg-black/40 text-white border border-white/10" />
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
          </motion.div>
        )}

        {/* ═══ USERS TAB (NEW – Expanded View) ═══ */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card3D>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">User Management</h3>
                  <button onClick={loadUsers} className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all text-sm flex items-center gap-2"><span>🔄</span> Refresh</button>
                </div>
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
                                <td className="p-4 text-gray-400 text-sm">
                                  <span className="text-green-400">{userBookings.length} Bookings</span> · <span className="text-blue-400">{userTicketOrders.length} Tickets</span>
                                </td>
                                <td className="p-4">{isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}</td>
                              </tr>
                              
                              {/* Expanded Row */}
                              {isExpanded && (
                                <tr className="bg-black/40">
                                  <td colSpan={5} className="p-4 border-b border-white/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-400" /> Room Bookings</h4>
                                        {userBookings.length === 0 ? <p className="text-gray-500 text-sm">No room bookings.</p> : (
                                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            {userBookings.map(b => (
                                              <div key={b.id} className="bg-white/5 p-3 rounded-lg flex items-center justify-between text-sm">
                                                <span className="text-gray-300">{b.checkIn} → {b.checkOut}</span>
                                                <span className="text-amber-400 font-bold">{format(b.totalPrice)}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{b.status}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Ticket className="w-4 h-4 text-amber-400" /> Ticket Orders</h4>
                                        {userTicketOrders.length === 0 ? <p className="text-gray-500 text-sm">No ticket purchases.</p> : (
                                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            {userTicketOrders.map(t => (
                                              <div key={t.id} className="bg-white/5 p-3 rounded-lg flex items-center justify-between text-sm">
                                                <span className="text-gray-300">x{t.quantity} Tickets</span>
                                                <span className="text-blue-400 font-bold">{format(t.total_price)}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${t.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{t.status}</span>
                                              </div>
                                            ))}
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