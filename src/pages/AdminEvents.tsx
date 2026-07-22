import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Edit2, Trash2, ArrowLeft, X, Calendar, MapPin, Ticket,
  RefreshCw
} from 'lucide-react';
import Card3D from '../components/Card3D';
import { useAuth } from '../contexts/AuthContext';
import { useData, type Event, type EventTicket } from '../contexts/DataContext';

export default function AdminEvents() {
  const { user } = useAuth();
  const {
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEventTickets,
    addEventTicket,
    updateEventTicket,
    deleteEventTicket
  } = useData();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState<Partial<Event> | null>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    setEvents(data);
    setLoading(false);
  };

  const loadTickets = async (eventId: string) => {
    const data = await fetchEventTickets(eventId);
    setTickets(data);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    loadTickets(event.id);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Delete this event and all its tickets?')) {
      await deleteEvent(id);
      await loadEvents();
      if (selectedEvent?.id === id) setSelectedEvent(null);
    }
  };

  const handleSaveEvent = async (data: Partial<Event>) => {
    if (data.id) {
      await updateEvent(data.id, data);
    } else {
      await addEvent(data as Omit<Event, 'id' | 'createdAt'>);
    }
    await loadEvents();
    setShowForm(false);
    setEditEvent(null);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#0A1128]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-[#DB8293] text-sm mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Ticket className="w-8 h-8 text-[#C49B55]" />
              Event Manager
            </h1>
          </div>
          <button
            onClick={() => { setEditEvent({}); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" /> New Event
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#DB8293] border-t-transparent" /><p className="text-gray-400 mt-4">Loading events...</p></div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No events created yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {events.map((event) => (
              <Card3D key={event.id}>
                <div className="p-5 bg-[#131C2E] rounded-2xl border border-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-lg">{event.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : event.status === 'live' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#DB8293]" /> {new Date(event.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#C49B55]" /> {event.venue}, {event.city}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditEvent(event); setShowForm(true); }} className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => handleSelectEvent(event)} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"><Ticket className="w-4 h-4" /></button>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        )}

        {/* Ticket Management */}
        {selectedEvent && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Tickets for {selectedEvent.title}</h2>
            <Card3D>
              <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400 text-sm">Manage ticket categories and prices</span>
                  <button
                    onClick={async () => {
                      const name = prompt('Category name (e.g., VIP):');
                      const price = prompt('Price in USD:');
                      if (name && price) {
                        await addEventTicket({
                          event_id: selectedEvent.id,
                          category_name: name,
                          price: parseInt(price),
                          quantity_available: 100,
                        });
                        await loadTickets(selectedEvent.id);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-[#DB8293]/20 text-[#DB8293] hover:bg-[#DB8293]/30 text-sm"
                  >
                    + Add Ticket Tier
                  </button>
                </div>
                {tickets.length === 0 ? (
                  <p className="text-gray-400 text-sm">No ticket tiers added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {tickets.map((t) => {
                      const isSoldOut = t.quantity_available === 0;
                      return (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <p className="text-white font-medium">{t.category_name}</p>
                            <p className="text-[#DB8293] text-sm">{isSoldOut ? 'Sold Out' : `$${t.price}`}</p>
                            <p className="text-gray-500 text-xs">{t.quantity_available} available</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const newPrice = prompt('New price:', String(t.price));
                                if (newPrice) {
                                  await updateEventTicket(t.id, { price: parseInt(newPrice) });
                                  await loadTickets(selectedEvent.id);
                                }
                              }}
                              className="p-1 rounded bg-blue-500/20 text-blue-400"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Delete this ticket tier?')) {
                                  await deleteEventTicket(t.id);
                                  await loadTickets(selectedEvent.id);
                                }
                              }}
                              className="p-1 rounded bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={async () => {
                                const newQty = t.quantity_available > 0 ? 0 : 100;
                                await updateEventTicket(t.id, { quantity_available: newQty });
                                await loadTickets(selectedEvent.id);
                              }}
                              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                isSoldOut
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                  : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                              }`}
                            >
                              {isSoldOut ? 'Sold Out' : 'Available'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card3D>
          </div>
        )}

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#131C2E] rounded-2xl border border-white/10 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {editEvent?.id ? 'Edit Event' : 'New Event'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
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
                    <label htmlFor="title" className="text-sm text-gray-400">Title *</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      defaultValue={editEvent?.title || ''}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="text-sm text-gray-400">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      defaultValue={editEvent?.description || ''}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="text-sm text-gray-400">Date & Time *</label>
                      <input
                        id="date"
                        name="date"
                        type="datetime-local"
                        required
                        defaultValue={editEvent?.date ? new Date(editEvent.date).toISOString().slice(0, 16) : ''}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="text-sm text-gray-400">Status</label>
                      <select
                        id="status"
                        name="status"
                        defaultValue={editEvent?.status || 'upcoming'}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="finished">Finished</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="venue" className="text-sm text-gray-400">Venue *</label>
                      <input
                        id="venue"
                        name="venue"
                        type="text"
                        required
                        defaultValue={editEvent?.venue || ''}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="text-sm text-gray-400">City *</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        defaultValue={editEvent?.city || ''}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="image_url" className="text-sm text-gray-400">Image URL</label>
                    <input
                      id="image_url"
                      name="image_url"
                      type="url"
                      defaultValue={editEvent?.image_url || ''}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50"
                    />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold hover:scale-[1.02] transition-all">
                    {editEvent?.id ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}