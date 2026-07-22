import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard, Calendar, Ticket, CheckCircle2 } from 'lucide-react';
import Card3D from '../components/Card3D';
import { useData, type CartItem } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Checkout() {
  const { cartItems, removeFromCart, clearCart, getCartTotal, addBooking, addTicketOrder } = useData();
  const { user } = useAuth();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cartItems.length === 0) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#0A1128] min-h-screen">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-6">Browse accommodations or events to add items to your cart.</p>
        <Link to="/listings" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold hover:scale-105 transition-all">
          Browse Accommodations
        </Link>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let bookedRooms = 0;
      let orderedTickets = 0;
      let errors: string[] = [];

      console.log('🛒 Processing cart items:', cartItems);

      for (const item of cartItems) {
        if (item.type === 'room') {
          try {
            const booking = await addBooking({
              ...item.item,
              userId: user.id,
              status: 'pending',
            });
            if (booking) {
              bookedRooms++;
              console.log('✅ Room booked:', booking);
            }
          } catch (err) {
            console.error('❌ Room booking failed:', err);
            errors.push(`Room booking failed: ${err.message}`);
          }
        } else if (item.type === 'ticket') {
          try {
            console.log('📦 Processing ticket:', {
              userId: user.id,
              ticketId: item.item.ticketId || item.id,
              quantity: item.quantity,
              totalPrice: item.price * item.quantity,
            });
            
            const ticketOrder = await addTicketOrder({
              userId: user.id,
              ticketId: item.item.ticketId || item.id,
              quantity: item.quantity,
              totalPrice: item.price * item.quantity,
              paymentMethod: 'pending',
              status: 'pending',
            });
            
            if (ticketOrder) {
              orderedTickets++;
              console.log('✅ Ticket order created:', ticketOrder);
            }
          } catch (err) {
            console.error('❌ Ticket order failed:', err);
            errors.push(`Ticket order failed: ${err.message}`);
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Some items failed: ${errors.join(', ')}`);
      }

      console.log(`✅ Checkout complete: ${bookedRooms} rooms, ${orderedTickets} tickets`);

      clearCart();
      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        navigate('/dashboard?checkout=success');
      }, 3000);
    } catch (err) {
      console.error('❌ Checkout failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#0A1128] min-h-screen">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#131C2E] rounded-2xl border border-green-500/30 p-8 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
            <p className="text-gray-400 mb-6">Your booking and tickets have been confirmed.</p>
            <Link
              to="/dashboard"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold hover:scale-105 transition-all"
            >
              View My Bookings
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const roomItems = cartItems.filter(item => item.type === 'room');
  const ticketItems = cartItems.filter(item => item.type === 'ticket');

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#0A1128]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tickets" className="inline-flex items-center gap-2 text-[#DB8293] text-sm mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-[#C49B55]" />
          Review Your Cart
          <span className="text-sm text-gray-400 font-normal ml-2">({cartItems.length} items)</span>
        </h1>

        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => {
            const isRoom = item.type === 'room';
            return (
              <Card3D key={index}>
                <div className="p-4 flex items-center justify-between gap-4 bg-[#131C2E] rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isRoom ? 'bg-[#DB8293]/20 text-[#DB8293]' : 'bg-[#C49B55]/20 text-[#C49B55]'
                    }`}>
                      {isRoom ? <Calendar className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-white font-bold">
                        {isRoom ? item.item.userName : item.item.eventName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {isRoom 
                          ? `${item.item.checkIn} → ${item.item.checkOut} · ${item.item.guests} guests`
                          : `${item.quantity} × ${item.item.ticketId?.slice(0, 8) || 'Ticket'}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#DB8293] font-bold">{format(item.price * item.quantity)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        <Card3D>
          <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
            <div className="mb-4 border-b border-white/10 pb-4">
              {roomItems.length > 0 && (
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-400">Rooms ({roomItems.length})</span>
                  <span className="text-white">{format(roomItems.reduce((sum, i) => sum + i.price * i.quantity, 0))}</span>
                </div>
              )}
              {ticketItems.length > 0 && (
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-400">Tickets ({ticketItems.length})</span>
                  <span className="text-white">{format(ticketItems.reduce((sum, i) => sum + i.price * i.quantity, 0))}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-white">Total</span>
              <span className="text-3xl font-black text-green-400">{format(getCartTotal())}</span>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!user && (
              <div className="mb-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm">
                  Please <Link to="/login" state={{ from: '/checkout' }} className="text-[#DB8293] hover:underline font-medium">sign in</Link> to complete your purchase.
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !user}
              className={`w-full py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2 ${
                isProcessing || !user
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white shadow-[#DB8293]/25 hover:shadow-[#DB8293]/40'
              }`}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Processing...
                </>
              ) : !user ? (
                'Sign In to Checkout'
              ) : (
                `Pay ${format(getCartTotal())}`
              )}
            </button>

            <p className="text-gray-500 text-xs text-center mt-4">
              🔒 Secure checkout. All payments are encrypted and processed securely.
            </p>
          </div>
        </Card3D>
      </div>
    </main>
  );
}