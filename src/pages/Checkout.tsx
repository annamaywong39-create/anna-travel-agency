import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard, Calendar, Ticket, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import Card3D from '../components/Card3D';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useState } from 'react';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export default function Checkout() {
  const { cartItems, removeFromCart, clearCart, getCartTotal, createOrder, addBooking, addTicketOrder } = useData();
  const { user } = useAuth();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cartItems.length === 0) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#F7FAFD] min-h-screen text-[#14253F]">
        <div className="mx-auto max-w-md px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F1FC] text-[#1267C4]">🛒</div>
          <h1 className="mt-4 text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-[#687A90]">Browse accommodations or events to add items to your cart.</p>
          <Link to="/listings" className="mt-6 inline-block rounded-full bg-[#1267C4] px-6 py-3 font-bold text-white hover:bg-[#0F5AAC]">
            Browse Accommodations
          </Link>
        </div>
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
      const order = await createOrder({
        userId: user.id,
        orderType: cartItems.some((item) => item.type === 'room') && cartItems.some((item) => item.type === 'ticket') ? 'mixed' : cartItems.some((item) => item.type === 'room') ? 'accommodation' : 'tickets',
      });
      let bookedRooms = 0;
      let orderedTickets = 0;
      let errors: string[] = [];

      for (const item of cartItems) {
        if (item.type === 'room') {
          try {
            const booking = await addBooking({
              ...item.item,
              orderId: order.id,
              userId: user.id,
              status: 'pending',
            });
            if (booking) bookedRooms++;
          } catch (err) {
            errors.push(`Room booking failed: ${getErrorMessage(err)}`);
          }
        } else if (item.type === 'ticket') {
          try {
            const ticketOrder = await addTicketOrder({
              userId: user.id,
              orderId: order.id,
              ticketId: item.item.ticketId || item.id,
              quantity: item.quantity,
              totalPrice: item.price * item.quantity,
              paymentMethod: 'paypal',
              status: 'pending',
            });
            if (ticketOrder) orderedTickets++;

            // Release / convert server hold if present
            const holdId = (item.item as any)?.holdId;
            if (holdId && isSupabaseConfigured) {
              try {
                await supabase.rpc('release_ticket_hold', { p_hold_id: holdId });
              } catch {
                // non-critical
              }
            }
          } catch (err) {
            errors.push(`Ticket order failed: ${getErrorMessage(err)}`);
          }
        }
      }

      if (errors.length > 0) throw new Error(`Some items failed: ${errors.join(', ')}`);

      clearCart();
      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        navigate('/dashboard?checkout=success');
      }, 3000);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#F7FAFD] min-h-screen">
        <div className="mx-auto max-w-md px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-[24px] border border-[#D8E5F0] bg-white p-8 shadow-xl"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#14253F]">Booking request received</h2>
            <p className="mt-2 text-[14px] leading-6 text-[#687A90]">Your order is awaiting availability verification and PayPal confirmation. We will contact you with the next steps.</p>
            <div className="mt-4 flex justify-center gap-2 text-xs text-[#8A9AB0]">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Verified check</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 2-min hold secured</span>
            </div>
            <Link to="/dashboard" className="mt-6 inline-block rounded-full bg-[#1267C4] px-8 py-3.5 font-bold text-white hover:bg-[#0F5AAC]">
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
    <main className="pt-24 pb-20 min-h-screen bg-[#F7FAFD] text-[#14253F]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/tickets" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1267C4] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>

        <h1 className="mb-8 flex items-center gap-3 text-3xl font-black">
          <CreditCard className="h-8 w-8 text-[#1267C4]" />
          Review Your Cart
          <span className="ml-2 text-sm font-normal text-[#687A90]">({cartItems.length} items)</span>
        </h1>

        <div className="mb-8 space-y-3">
          {cartItems.map((item, index) => {
            const isRoom = item.type === 'room';
            return (
              <Card3D key={index}>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#D8E5F0] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isRoom ? 'bg-[#E7F1FC] text-[#1267C4]' : 'bg-[#FFF0F6] text-[#E85D9A]'}`}>
                      {isRoom ? <Calendar className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-[#14253F]">{isRoom ? item.item.userName || item.item.title || 'Accommodation' : item.item.eventName}</p>
                      <p className="text-xs text-[#687A90]">
                        {isRoom
                          ? `${item.item.checkIn} → ${item.item.checkOut} · ${item.item.guests} guests`
                          : `${item.quantity} × ${item.item.ticketId?.slice(0, 8) || 'Ticket'}${item.item.specialOffer ? ` · ${item.item.discountPercent}% special pricing` : ''}${(item.item as any).heldUntil ? ` · hold until ${new Date((item.item as any).heldUntil).toLocaleTimeString()}` : ''}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#1267C4]">{format(item.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-[#8A9AB0] transition hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        <Card3D>
          <div className="rounded-2xl border border-[#D8E5F0] bg-white p-6 shadow-sm">
            <div className="mb-4 border-b border-[#E7F1FC] pb-4">
              {roomItems.length > 0 && (
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-[#687A90]">Rooms ({roomItems.length})</span>
                  <span className="font-semibold">{format(roomItems.reduce((sum, i) => sum + i.price * i.quantity, 0))}</span>
                </div>
              )}
              {ticketItems.length > 0 && (
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-[#687A90]">Tickets ({ticketItems.length})</span>
                  <span className="font-semibold">{format(ticketItems.reduce((sum, i) => sum + i.price * i.quantity, 0))}</span>
                </div>
              )}
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-black text-[#1267C4]">{format(getCartTotal())}</span>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {!user && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  Please <Link to="/login" state={{ from: '/checkout' }} className="font-medium text-[#1267C4] underline">sign in</Link> to complete your purchase.
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !user}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-[16px] font-bold shadow-sm transition ${isProcessing || !user ? 'cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]' : 'bg-[#1267C4] text-white hover:bg-[#0F5AAC] hover:shadow'}`}
            >
              {isProcessing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
                  Processing…
                </>
              ) : !user ? (
                'Sign In to Checkout'
              ) : (
                `Pay ${format(getCartTotal())} • PayPal`
              )}
            </button>

            <p className="mt-4 text-center text-xs text-[#8A9AB0]">🔒 Secure checkout. Verified inventory. Concierge support included.</p>
          </div>
        </Card3D>
      </div>
    </main>
  );
}
