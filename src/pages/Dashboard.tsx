import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Calendar, MapPin, Settings, LogOut,
  Clock, CheckCircle2, XCircle, ChevronRight, Edit2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Card3D from '../components/Card3D';

type Tab = 'bookings' | 'profile' | 'settings';

const statusConfig = {
  pending: { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Pending' },
  confirmed: { color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle2, label: 'Confirmed' },
  cancelled: { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Cancelled' },
  completed: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: CheckCircle2, label: 'Completed' },
};

export default function Dashboard() {
  const { user, logout, updateProfile } = useAuth();
  const { getUserBookings, cancelBooking, listings } = useData();
  const { format } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    country: user?.country || '',
  });

  if (!user) {
    return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;
  }

  const userBookings = getUserBookings(user.id);

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setEditMode(false);
  };

  const getListingById = (id: string) => listings.find(l => l.id === id);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#0A1128]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center text-2xl font-bold text-white">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Welcome, {user.firstName}!
              </h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          {user.role === 'admin' && (
            <Link to="/admin" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#DB8293]/20 border border-[#DB8293]/30 text-[#DB8293] text-sm hover:bg-[#DB8293]/30 transition-all">
              <Settings className="w-4 h-4" /> Go to Admin Panel
            </Link>
          )}
        </motion.div>

        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
          {[
            { id: 'bookings' as Tab, icon: Calendar, label: 'My Bookings' },
            { id: 'profile' as Tab, icon: User, label: 'Profile' },
            { id: 'settings' as Tab, icon: Settings, label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#DB8293]/20 text-[#DB8293] border border-[#DB8293]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold text-white mb-4">
              Your Bookings ({userBookings.length})
            </h2>

            {userBookings.length === 0 ? (
              <Card3D>
                <div className="p-12 text-center bg-[#131C2E] rounded-2xl border border-white/5">
                  <div className="text-5xl mb-4">📅</div>
                  <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                  <p className="text-gray-400 mb-6">Start planning your next adventure!</p>
                  <Link
                    to="/listings"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold hover:scale-105 transition-all"
                  >
                    Browse Accommodations <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card3D>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => {
                  const listing = getListingById(booking.listingId);
                  const status = statusConfig[booking.status];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card3D>
                        <div className="p-5 flex flex-col md:flex-row gap-4 bg-[#131C2E] rounded-2xl border border-white/5">
                          {listing && (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full md:w-32 h-24 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="text-white font-bold">{listing?.title || 'Property'}</h3>
                                <p className="text-gray-400 text-sm flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#C49B55]" /> {listing?.city}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${status.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#DB8293]" />
                                {booking.checkIn} → {booking.checkOut}
                              </span>
                              <span>{booking.guests} guest(s)</span>
                              <span className="text-[#DB8293] font-medium">{format(booking.totalPrice)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Booked on {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => cancelBooking(booking.id)}
                                  className="text-xs text-red-400 hover:text-red-300 ml-auto"
                                >
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card3D>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card3D>
              <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                  <button
                    onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DB8293]/20 text-[#DB8293] border border-[#DB8293]/30 hover:bg-[#DB8293]/30 transition-all text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'firstName', label: 'First Name' },
                    { key: 'lastName', label: 'Last Name' },
                    { key: 'phone', label: 'Phone Number' },
                    { key: 'country', label: 'Country' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-sm text-gray-400 mb-1 block">{field.label}</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={profileData[field.key as keyof typeof profileData]}
                          onChange={(e) => setProfileData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293] transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-xl bg-white/5 text-white">
                          {profileData[field.key as keyof typeof profileData] || '—'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Email Address</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Verified</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-500 text-sm">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card3D>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card3D>
              <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4">Notifications</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Email notifications for bookings', checked: true },
                    { label: 'Promotional emails', checked: false },
                    { label: 'Event reminders', checked: true },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">{item.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        className="w-5 h-5 rounded border-gray-600 bg-white/5 text-[#DB8293] focus:ring-[#DB8293]/20"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </Card3D>

            <Card3D>
              <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all flex items-center justify-between">
                    <span>Change Password</span>
                    <ChevronRight className="w-4 h-4 text-[#C49B55]" />
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all flex items-center justify-between">
                    <span>Download My Data</span>
                    <ChevronRight className="w-4 h-4 text-[#C49B55]" />
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </Card3D>
          </motion.div>
        )}
      </div>
    </main>
  );
}