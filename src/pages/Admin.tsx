import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Calendar, Users, Plus, Edit2, Trash2,
  Eye, DollarSign, TrendingUp, ArrowLeft, Search, Filter, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData, type Booking } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Card3D from '../components/Card3D';

type Tab = 'overview' | 'listings' | 'bookings' | 'users';

export default function Admin() {
  const { user } = useAuth();
  const { listings, bookings, deleteListing, updateBooking, isDemo } = useData();
  const { format } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ id: string; status: 'sending' | 'sent' | 'error' } | null>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: Building2, color: 'text-blue-400' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-green-400' },
    { label: 'Revenue', value: format(totalRevenue), icon: DollarSign, color: 'text-amber-400' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: TrendingUp, color: 'text-purple-400' },
  ];

  const filteredListings = listings.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Send confirmation email when booking is confirmed
  const sendConfirmationEmail = async (booking: Booking, listing: any) => {
    try {
      setEmailStatus({ id: booking.id, status: 'sending' });
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: booking.userEmail,
          template: 'bookingConfirmation',
          data: {
            guestName: booking.userName,
            propertyName: listing.title,
            city: listing.city,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            totalPrice: `$${booking.totalPrice}`,
            bookingId: booking.id,
          }
        })
      });

      if (response.ok) {
        setEmailStatus({ id: booking.id, status: 'sent' });
        setTimeout(() => setEmailStatus(null), 3000);
      } else {
        setEmailStatus({ id: booking.id, status: 'error' });
        setTimeout(() => setEmailStatus(null), 3000);
      }
    } catch (error) {
      setEmailStatus({ id: booking.id, status: 'error' });
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId);
    const oldStatus = booking?.status;
    
    await updateBooking(bookingId, { status: newStatus });

    if (newStatus === 'confirmed' && oldStatus !== 'confirmed' && booking) {
      const listing = listings.find(l => l.id === booking.listingId);
      if (listing) {
        await sendConfirmationEmail(booking, listing);
      }
    }
  };

  // ✅ Payment method display helper
  const getPaymentMethodDisplay = (method?: 'bitcoin' | 'paypal' | 'steam') => {
    if (!method) return '⏳ Pending';
    const map = {
      bitcoin: { label: '₿ Bitcoin', color: 'bg-orange-500/20 text-orange-400' },
      paypal: { label: '🅿️ PayPal', color: 'bg-blue-500/20 text-blue-400' },
      steam: { label: '🎮 Steam Card', color: 'bg-purple-500/20 text-purple-400' },
    };
    return map[method] || { label: '⏳ Pending', color: 'bg-gray-500/20 text-gray-400' };
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          <Link
            to="/admin/listing/new"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-5 h-5" />
            Add Listing
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview' as Tab, icon: LayoutDashboard, label: 'Overview' },
            { id: 'listings' as Tab, icon: Building2, label: 'Listings' },
            { id: 'bookings' as Tab, icon: Calendar, label: 'Bookings' },
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
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

            {/* Recent bookings */}
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
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs ${pm.color}`}>{pm.label}</span>
                          </td>
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
              <button className="px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <Card3D key={listing.id}>
                  <div className="relative">
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Link
                        to={`/admin/listing/${listing.id}`}
                        className="w-8 h-8 rounded-lg bg-blue-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-500 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Delete this listing?')) deleteListing(listing.id);
                        }}
                        className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-1">{listing.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{listing.city}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{format(listing.price)}/night</span>
                      <Link to={`/listing/${listing.id}`} className="text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ BOOKINGS TAB WITH PAYMENT METHOD ═══ */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card3D>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">ID</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Guest</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Check-in</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Check-out</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Amount</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Payment Method</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const pm = getPaymentMethodDisplay(booking.paymentMethod);
                      return (
                        <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4 text-white text-sm font-mono">
                            <span className="text-amber-400 font-bold">{booking.id.slice(-8).toUpperCase()}</span>
                          </td>
                          <td className="p-4 text-white text-sm">{booking.userName}</td>
                          <td className="p-4 text-gray-400 text-sm">{booking.userEmail}</td>
                          <td className="p-4 text-gray-400 text-sm">{booking.checkIn}</td>
                          <td className="p-4 text-gray-400 text-sm">{booking.checkOut}</td>
                          <td className="p-4 text-amber-400 text-sm font-medium">{format(booking.totalPrice)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${pm.color}`}>
                              {pm.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
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
                            {emailStatus && emailStatus.id === booking.id && (
                              <span className={`ml-2 text-xs ${
                                emailStatus.status === 'sending' ? 'text-yellow-400' :
                                emailStatus.status === 'sent' ? 'text-green-400' :
                                'text-red-400'
                              }`}>
                                {emailStatus.status === 'sending' ? '📧 Sending...' :
                                 emailStatus.status === 'sent' ? '✅ Email sent!' :
                                 '❌ Failed'}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <button className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="p-12 text-center text-gray-500">No bookings yet</div>
                )}
              </div>
            </Card3D>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card3D>
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
                <p className="text-gray-400">
                  User data is stored in localStorage. In production, this would connect to your database.
                </p>
              </div>
            </Card3D>
          </motion.div>
        )}
      </div>
    </main>
  );
}