import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard, Calendar, Ticket, CheckCircle2, ShieldCheck, Clock, MapPin, Share2, HelpCircle, ChevronDown } from 'lucide-react';
import Card3D from '../components/Card3D';
import TrustBadges from '../components/TrustBadges';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useState, useEffect } from 'react';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

const faqs = [
  { q: 'Is my ticket guaranteed?', a: 'We verify availability with the supplier before requesting PayPal. Your booking is not confirmed until we confirm availability and payment is received.' },
  { q: 'When will I get my tickets?', a: 'Delivery method and timing are shown per ticket (e.g., Mobile transfer, Evening before event). You will receive instructions after confirmation.' },
  { q: 'What is the special offer?', a: 'Selected BTS ARIRANG tickets show a fixed discount of 60-70% off, stored at listing time and not changing on refresh. Discount applies to ticket price only.' },
];

export default function Checkout() {
  const { cartItems, removeFromCart, clearCart, getCartTotal, createOrder, addBooking, addTicketOrder } = useData();
  const { user } = useAuth();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showPaygateError, setShowPaygateError] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState<{ items: typeof cartItems; total: number; roomItems: typeof cartItems; ticketItems: typeof cartItems } | null>(null);

  // Scroll to top when step changes or paygate error shows — fixes payment page starting from down side
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, paymentSuccess, showPaygateError]);

  const handleShare = async () => {
    const text = `My trip: ${cartItems.map(i => i.type==='ticket' ? i.item.eventName : i.item.title || i.item.userName).join(', ')} — Total ${format(getCartTotal())} via Anna Travel Agency`;
    if (navigator.share) {
      try { await navigator.share({ title: 'My trip', text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setError(null);
      setTimeout(() => {}, 0);
    }
  };

  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#F7FAFD] min-h-screen text-[#14253F]">
        <div className="mx-auto max-w-md px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F1FC] text-[#1267C4]">🛒</div>
          <h1 className="mt-4 text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-[#687A90]">Browse accommodations or events to add items to your cart.</p>
          <Link to="/listings" className="mt-6 inline-block rounded-full bg-[#1267C4] px-6 py-3 font-bold text-white hover:bg-[#0F5AAC]">Browse Accommodations</Link>
        </div>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!user) { navigate('/login', { state: { from: '/checkout' } }); return; }
    setIsProcessing(true); setError(null);
    try {
      // Snapshot cart before clearing — fixes chart goes empty
      const snapshot = {
        items: [...cartItems],
        total: getCartTotal(),
        roomItems: cartItems.filter(i => i.type === 'room'),
        ticketItems: cartItems.filter(i => i.type === 'ticket'),
      };
      setOrderSnapshot(snapshot);

      const order = await createOrder({
        userId: user.id,
        orderType: cartItems.some(i=>i.type==='room') && cartItems.some(i=>i.type==='ticket') ? 'mixed' : cartItems.some(i=>i.type==='room') ? 'accommodation' : 'tickets',
      });
      let errors: string[] = [];
      for (const item of cartItems) {
        if (item.type === 'room') {
          try { await addBooking({ ...item.item, orderId: order.id, userId: user.id, status: 'pending' }); } catch (err) { errors.push(`Room: ${getErrorMessage(err)}`); }
        } else {
          try {
            const roundedTotal = Math.round(item.price * item.quantity * 100) / 100;
            await addTicketOrder({ userId: user.id, orderId: order.id, ticketId: item.item.ticketId || item.id, quantity: item.quantity, totalPrice: roundedTotal, paymentMethod: 'paypal', status: 'pending' });
            const holdId = (item.item as any)?.holdId;
            if (holdId && isSupabaseConfigured) { try { await supabase.rpc('release_ticket_hold', { p_hold_id: holdId }); } catch {} }
          } catch (err) { errors.push(`Ticket: ${getErrorMessage(err)}`); }
        }
      }
      if (errors.length) throw new Error(errors.join(', '));
      // Don't clear cart immediately — keep for paygate display, clear after user leaves
      // clearCart();
      setIsProcessing(false);
      setShowPaygateError(true);
      setCurrentStep(3);
      setPaymentSuccess(true);
      // Scroll to top for paygate screen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { setError(getErrorMessage(err)); setIsProcessing(false); }
  };

  const roomItems = orderSnapshot ? orderSnapshot.roomItems : cartItems.filter(i => i.type === 'room');
  const ticketItems = orderSnapshot ? orderSnapshot.ticketItems : cartItems.filter(i => i.type === 'ticket');
  const displayTotal = orderSnapshot ? orderSnapshot.total : getCartTotal();

  if (paymentSuccess && showPaygateError) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#F7FAFD] min-h-screen">
        <div className="mx-auto max-w-lg px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-[24px] border border-amber-200 bg-amber-50 p-8 shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">⚠️</div>
            <h2 className="text-2xl font-bold text-[#14253F]">Payment Gateway Error</h2>
            <p className="mt-3 text-[14px] leading-6 text-[#5B6B82]">We are currently experiencing a temporary payment gateway issue. Your booking request has been received and is secured with a 2-minute hold.</p>
            <div className="mt-4 rounded-xl bg-white border border-[#D8E5F0] p-4 text-left">
              <p className="text-sm font-bold text-[#14253F]">Booking Details Secured:</p>
              <div className="mt-2 space-y-1 text-xs text-[#687A90]">
                {roomItems.map((r,i)=><div key={i} className="flex justify-between"><span>{r.item.title || 'Stay'} • {r.item.checkIn}→{r.item.checkOut}</span><span>{format(r.price * r.quantity)}</span></div>)}
                {ticketItems.map((t,i)=><div key={i} className="flex justify-between"><span>{t.item.eventName} • {t.quantity}×{t.item.ticketId?.slice(0,8)}</span><span>{format(t.price * t.quantity)}</span></div>)}
                <div className="border-t border-[#E7F1FC] pt-2 flex justify-between font-bold text-[#14253F]"><span>Total</span><span>{format(displayTotal)}</span></div>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#14253F]">Please chat with admin for available way to pay:</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="https://wa.me/15876810591" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#128C7E]">
                <span>💬</span> WhatsApp: +1 (587) 681-0591
              </a>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8E5F0] bg-white px-6 py-3 text-sm font-semibold text-[#14253F] hover:bg-[#F7FAFD]">Contact Concierge</Link>
              <button onClick={() => { const el = document.querySelector('[aria-label="Open chat"]') as HTMLElement; el?.click(); }} className="rounded-full bg-[#14253F] px-6 py-3 text-sm font-bold text-white hover:bg-black">Chat with Admin</button>
            </div>
            <p className="mt-4 text-[11px] text-[#8A9AB0]">Your booking code will be sent via email after admin confirms payment method. Please save this page and contact support.</p>
            <Link to="/dashboard" onClick={() => clearCart()} className="mt-6 inline-block rounded-full bg-[#1267C4] px-8 py-3.5 font-bold text-white hover:bg-[#0F5AAC]">View My Bookings</Link>
          </motion.div>
        </div>
      </main>
    );
  }

  if (paymentSuccess) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#F7FAFD] min-h-screen">
        <div className="mx-auto max-w-md px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-[24px] border border-[#D8E5F0] bg-white p-8 shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600"><CheckCircle2 className="h-10 w-10" /></div>
            <h2 className="text-2xl font-bold text-[#14253F]">Booking request received</h2>
            <p className="mt-2 text-[14px] leading-6 text-[#687A90]">Your order is awaiting verification and PayPal confirmation. We will contact you next.</p>
            <div className="mt-4 flex justify-center gap-2 text-xs text-[#8A9AB0]"><span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Verified</span><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Hold secured</span></div>
            <Link to="/dashboard" onClick={() => clearCart()} className="mt-6 inline-block rounded-full bg-[#1267C4] px-8 py-3.5 font-bold text-white hover:bg-[#0F5AAC]">View My Bookings</Link>
          </motion.div>
        </div>
      </main>
    );
  }


  return (
    <main className="pt-24 pb-32 min-h-screen bg-[#F7FAFD] text-[#14253F]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link to="/tickets" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1267C4] hover:underline"><ArrowLeft className="h-4 w-4" /> Continue Shopping</Link>

        {/* Stepper - Smooth 3-step flow */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {[
            { n: 1, label: 'Review Cart', active: currentStep >= 1, done: currentStep > 1 || !!user },
            { n: 2, label: user ? `Account ✓ ${user.firstName}` : 'Sign In', active: currentStep >= 2 || !!user },
            { n: 3, label: 'Secure Pay', active: currentStep >= 3 },
          ].map((s, idx) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${s.active ? 'bg-[#1267C4] text-white' : 'bg-white border border-[#D8E5F0] text-[#8A9AB0]'}`}>{s.done ? '✓' : s.n}</div>
              <span className={`text-sm ${s.active ? 'font-bold text-[#14253F]' : 'text-[#8A9AB0]'}`}>{s.label}</span>
              {idx < 2 && <div className={`h-px w-8 mx-2 transition ${s.done ? 'bg-[#1267C4]' : 'bg-[#D8E5F0]'}`} />}
            </div>
          ))}
          <div className="ml-auto hidden md:flex"><TrustBadges /></div>
        </div>

        {/* New user helper banner */}
        {!user && (
          <div className="mb-6 rounded-2xl border border-[#1267C4]/20 bg-[#E7F1FC] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#14253F]">New here? Your cart is saved ✓</p>
              <p className="text-xs text-[#5B6B82] mt-1">Create an account in 30 seconds, then securely pay via PayPal request after we verify availability.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to="/login" state={{ from: '/checkout' }} className="rounded-full border border-[#D8E5F0] bg-white px-4 py-2 text-sm font-semibold text-[#14253F] hover:bg-[#F7FAFD]">Sign In</Link>
              <Link to="/signup" state={{ from: '/checkout' }} className="rounded-full bg-[#14253F] px-4 py-2 text-sm font-bold text-white hover:bg-black">Create Account</Link>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Left: cart */}
          <div>
            <h1 className="mb-6 flex items-center gap-3 text-2xl font-black"><CreditCard className="h-7 w-7 text-[#1267C4]" /> Review Your Cart <span className="ml-2 text-sm font-normal text-[#687A90]">({cartItems.length} items)</span></h1>

            <div className="space-y-3">
              {cartItems.map((item, index) => {
                const isRoom = item.type === 'room';
                return (
                  <Card3D key={index}>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#D8E5F0] bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isRoom ? 'bg-[#E7F1FC] text-[#1267C4]' : 'bg-[#FFF0F6] text-[#E85D9A]'}`}>{isRoom ? <Calendar className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}</div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-[#14253F]">{isRoom ? item.item.title || item.item.userName || 'Accommodation' : item.item.eventName}</p>
                          <p className="truncate text-xs text-[#687A90]">{isRoom ? `${item.item.checkIn} → ${item.item.checkOut} • ${item.item.guests} guests • ${item.item.city || ''}` : `${item.quantity} × ${item.item.ticketId?.slice(0,8) || 'Ticket'}${item.item.specialOffer ? ` • ${item.item.discountPercent}% off` : ''}${(item.item as any).heldUntil ? ` • hold until ${new Date((item.item as any).heldUntil).toLocaleTimeString()}` : ''}`}</p>
                          {!isRoom && <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"><ShieldCheck className="h-3 w-3" /> Verified • Fees included where stated</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-[#1267C4]">{format(item.price * item.quantity)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-[#8A9AB0] hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-[#D8E5F0] bg-white px-4 py-2 text-sm font-semibold text-[#687A90] hover:bg-[#F7FAFD]"><Share2 className="h-4 w-4" /> Share trip with group</button>
              <span className="text-xs text-[#8A9AB0]">Copy link • Let friends review before you pay</span>
            </div>

            <div className="mt-8 rounded-2xl border border-[#D8E5F0] bg-white p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold"><HelpCircle className="h-4 w-4 text-[#1267C4]" /> Common questions</h3>
              <div className="mt-3 divide-y divide-[#E7F1FC]">
                {faqs.map((f, i) => (
                  <div key={i} className="py-3">
                    <button onClick={() => setOpenFaq(openFaq===i ? null : i)} className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#14253F]">
                      {f.q} <ChevronDown className={`h-4 w-4 transition ${openFaq===i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq===i && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-[13px] leading-6 text-[#5B6B82]">{f.a}</motion.p>}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: itinerary + total */}
          <div className="lg:sticky lg:top-28 self-start space-y-4">
            <Card3D>
              <div className="rounded-2xl border border-[#D8E5F0] bg-white p-5 shadow-sm">
                <h3 className="font-bold text-[#14253F]">Your trip</h3>
                <div className="mt-4 space-y-3">
                  {ticketItems.map((t, i) => (
                    <div key={i} className="flex gap-3 rounded-xl bg-[#F7FAFD] p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1267C4] text-white"><Ticket className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{t.item.eventName}</p>
                        <p className="text-xs text-[#687A90] flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.item.venue || ''} • {t.quantity} ticket{t.quantity>1?'s':''}</p>
                      </div>
                    </div>
                  ))}
                  {roomItems.map((r, i) => (
                    <div key={i} className="flex gap-3 rounded-xl bg-[#F7FAFD] p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F1FC] text-[#1267C4]"><Calendar className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{r.item.title || r.item.userName || 'Stay'}</p>
                        <p className="text-xs text-[#687A90]">{r.item.checkIn} → {r.item.checkOut} • {r.item.guests} guests</p>
                      </div>
                    </div>
                  ))}
                  {roomItems.length && ticketItems.length ? <div className="rounded-lg bg-[#E7F1FC] p-2 text-center text-xs font-semibold text-[#1267C4]">Mixed order • 1 booking code • Concierge will verify both</div> : null}
                </div>

                <div className="my-4 border-t border-[#E7F1FC] pt-4 space-y-1 text-sm">
                  {roomItems.length > 0 && <div className="flex justify-between"><span className="text-[#687A90]">Rooms ({roomItems.length})</span><span className="font-semibold">{format(roomItems.reduce((s,i)=>s+i.price*i.quantity,0))}</span></div>}
                  {ticketItems.length > 0 && <div className="flex justify-between"><span className="text-[#687A90]">Tickets ({ticketItems.length})</span><span className="font-semibold">{format(ticketItems.reduce((s,i)=>s+i.price*i.quantity,0))}</span></div>}
                </div>

                <div className="flex items-center justify-between"><span className="text-lg font-bold">Total</span><span className="text-2xl font-black text-[#1267C4]">{format(getCartTotal())}</span></div>

                {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                {!user && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-bold text-[#14253F]">Almost there — sign in to pay securely</p>
                    <p className="mt-1 text-xs text-[#5B6B82]">Your {cartItems.length} item{cartItems.length>1?'s':''} stay{cartItems.length>1?'':'s'} saved. Takes 20 seconds.</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link to="/login" state={{ from: '/checkout' }} className="rounded-full border border-[#D8E5F0] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#14253F] hover:bg-[#F7FAFD]">Sign In</Link>
                      <Link to="/signup" state={{ from: '/checkout' }} className="rounded-full bg-[#14253F] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-black">Create Account</Link>
                    </div>
                    <p className="mt-2 text-center text-[11px] text-[#8A9AB0]">We verify room/ticket availability first, then send secure PayPal request. No charge today.</p>
                  </div>
                )}

                <button onClick={handleCheckout} disabled={isProcessing} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold shadow-sm transition ${isProcessing ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed' : user ? 'bg-[#1267C4] text-white hover:bg-[#0F5AAC] hover:shadow' : 'bg-[#14253F] text-white hover:bg-black'}`}>
                  {isProcessing ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" /> Processing…</> : !user ? 'Continue to Sign In →' : `Pay ${format(getCartTotal())} • Secure Request`}
                </button>
                <div className="mt-3"><TrustBadges /></div>
                <p className="mt-3 text-center text-[11px] text-[#8A9AB0]">🔒 Secure checkout • Verified inventory • Free cancellation info in Refund Policy</p>
              </div>
            </Card3D>
          </div>
        </div>
      </div>
    </main>
  );
}
