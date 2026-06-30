import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ShoppingCart, Plus, Minus } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export default function Tickets() {
  const { events, fetchEvents, tickets, fetchTicketsByEvent, addToCart } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (selectedEventId) fetchTicketsByEvent(selectedEventId);
  }, [selectedEventId]);

  const handleQuantityChange = (ticketId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[ticketId] || 0;
      const newVal = Math.max(0, current + delta);
      if (newVal === 0) { const { [ticketId]: _, ...rest } = prev; return rest; }
      return { ...prev, [ticketId]: newVal };
    });
  };

  const handleAddToCart = (ticket: any) => {
    const qty = quantities[ticket.id] || 0;
    if (qty === 0) return;
    if (!user) return navigate('/login');

    addToCart({
      type: 'ticket',
      data: {
        ticketId: ticket.id,
        eventName: events.find(e => e.id === ticket.event_id)?.name || 'Event',
        quantity: qty,
        unitPrice: ticket.price,
      }
    });
    setQuantities({});
    alert(`Added ${qty} ${ticket.category_name} ticket(s) to your cart!`);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Buy Tickets" description="Buy FIFA World Cup 2026 tickets. Browse available matches and secure your spot." path="/tickets" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white">🎟️ Buy Match Tickets</h1>
          <Link to="/checkout" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold hover:scale-105 transition-all">
            <ShoppingCart className="w-4 h-4" /> View Cart
          </Link>
        </div>

        {!selectedEventId ? (
          /* Event Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card3D>
                  <div className="p-6 cursor-pointer hover:bg-white/5 transition-all" onClick={() => setSelectedEventId(event.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-lg">{event.name}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">{new Date(event.match_date).toLocaleDateString()} · {event.venue || 'TBD'}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Ticket Selection */
          <div>
            <button onClick={() => setSelectedEventId(null)} className="inline-flex items-center gap-2 text-amber-400 text-sm mb-6 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">{events.find(e => e.id === selectedEventId)?.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.filter(t => t.event_id === selectedEventId).map((ticket) => (
                <Card3D key={ticket.id}>
                  <div className="p-6">
                    <div className="text-2xl mb-2">🎟️</div>
                    <h3 className="text-white font-bold text-lg">{ticket.category_name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{ticket.description}</p>
                    <p className="text-amber-400 font-bold text-xl mb-4">${ticket.price}</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <button onClick={() => handleQuantityChange(ticket.id, -1)} className="p-1 rounded bg-white/10 text-white hover:bg-white/20"><Minus className="w-4 h-4" /></button>
                      <span className="text-white font-bold">{quantities[ticket.id] || 0}</span>
                      <button onClick={() => handleQuantityChange(ticket.id, 1)} className="p-1 rounded bg-white/10 text-white hover:bg-white/20"><Plus className="w-4 h-4" /></button>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(ticket)}
                      disabled={!quantities[ticket.id]}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}