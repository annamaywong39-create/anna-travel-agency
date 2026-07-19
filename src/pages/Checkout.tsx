import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard, Calendar, Ticket } from 'lucide-react';
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

  if (cartItems.length === 0) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#0A1128] min-h-screen">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold text-white mb-2">Your cart is empty</h1>
        <Link to="/listings" className="text-[#DB8293] hover:underline">Browse rooms or tickets!</Link>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    setIsProcessing(true);

    try {
      for (const item of cartItems) {
        if (item.type === 'room') {
          await addBooking({
            ...item.item,
            userId: user.id,
            status: 'pending',
          });
        } else if (item.type === 'ticket') {
          await addTicketOrder({
            userId: user.id,
            ticketId: item.item.ticketId,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            paymentMethod: 'pending',
            status: 'pending',
          });
        }
      }

      clearCart();
      setIsProcessing(false);
      navigate('/dashboard?checkout=success');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#0A1128]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tickets" className="inline-flex items-center gap-2 text-[#DB8293] text-sm mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-[#C49B55]" />
          Review Your Cart
        </h1>

        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => (
            <Card3D key={index}>
              <div className="p-4 flex items-center justify-between gap-4 bg-[#131C2E] rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'room' ? 'bg-[#DB8293]/20 text-[#DB8293]' : 'bg-[#C49B55]/20 text-[#C49B55]'}`}>
                    {item.type === 'room' ? <Calendar className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      {item.type === 'room' ? item.item.userName : item.item.eventName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {item.type === 'room' 
                        ? `${item.item.checkIn} → ${item.item.checkOut}` 
                        : `${item.quantity} x ${item.item.ticketId?.slice(0, 8) || 'Ticket'}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#DB8293] font-bold">{format(item.price * item.quantity)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card3D>
          ))}
        </div>

        <Card3D>
          <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
              <span className="text-xl font-bold text-white">Total</span>
              <span className="text-3xl font-black text-green-400">{format(getCartTotal())}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-[#DB8293]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing...' : `Pay ${format(getCartTotal())}`}
            </button>
          </div>
        </Card3D>
      </div>
    </main>
  );
}