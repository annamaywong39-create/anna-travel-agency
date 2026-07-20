import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CreditCard, Shield, CheckCircle2, Calendar, Users, MapPin,
  Lock, AlertCircle, Sparkles, Clock, Info, Plus, X, Copy, Check, ShoppingCart
} from 'lucide-react';
import Card3D from '../components/Card3D';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';

type Step = 'details' | 'payment' | 'confirmation';
type PaymentMethod = 'bitcoin' | 'paypal' | 'steam';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; time: string; timeColor: string; warning: string }[] = [
  {
    id: 'bitcoin',
    label: 'Bitcoin (BTC)',
    icon: '₿',
    time: '~10-30 minutes',
    timeColor: 'text-[#DB8293]',
    warning: '⚡ Bitcoin payments require blockchain confirmations. Your booking will be confirmed once the transaction is verified on the network (typically 10-30 minutes).',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: '🅿️',
    time: 'Instant',
    timeColor: 'text-[#C49B55]',
    warning: '💳 PayPal payments are processed instantly. You will be redirected to PayPal to complete your payment, then returned to confirm your booking.',
  },
  {
    id: 'steam',
    label: 'Steam Card',
    icon: '🎮',
    time: '~2 hours',
    timeColor: 'text-[#DB8293]',
    warning: '🎮 Steam card payments take approximately 2 hours to verify. Our team manually confirms the card codes. You will receive email confirmation once validated.',
  },
];

const BITCOIN_WALLET = 'bc1q246ztlqc0gltax4dt77p50gxdzzqy67zg8aez4';

export default function Booking() {
  const { id } = useParams();
  const { user } = useAuth();
  const { listings, addToCart } = useData();
  const { format } = useCurrency();
  const navigate = useNavigate();

  const listing = listings.find((l) => l.id === id);
  const [step, setStep] = useState<Step>('details');
  const [bookingId, setBookingId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bitcoin');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '', phone: user?.phone || '',
    country: user?.country || '', checkIn: '2026-06-11',
    checkOut: '2026-06-18', guests: '2', specialRequests: '',
  });

  const [steamCodes, setSteamCodes] = useState<string[]>(['']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cartAdded, setCartAdded] = useState(false);

  if (!listing) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#0A1128]">
        <h1 className="text-3xl font-bold text-white">Listing not found</h1>
        <Link to="/listings" className="text-[#DB8293] mt-4 inline-block">← Back to listings</Link>
      </main>
    );
  }

  const nights = 7;
  const subtotal = listing.price * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const cleaningFee = 75;
  const total = subtotal + serviceFee + cleaningFee;
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod)!;

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.email.trim() || !formData.email.includes('@')) e.email = 'Valid email required';
    if (!formData.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (paymentMethod === 'steam') {
      const validCodes = steamCodes.filter(c => c.trim().length > 0);
      if (validCodes.length === 0) {
        e.steam = 'At least one Steam card code is required';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDetailsSubmit = () => {
    if (validateDetails()) setStep('payment');
  };

  // ─── Unified: Add to Cart ───
  const handleAddToCart = () => {
    if (!validatePayment()) return;

    const roomData = {
      listingId: listing.id,
      userId: user?.id || 'guest',
      userEmail: formData.email,
      userName: `${formData.firstName} ${formData.lastName}`,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: parseInt(formData.guests),
      totalPrice: total,
      status: 'pending',
      specialRequests: formData.specialRequests,
      paymentMethod: paymentMethod,
    };

    addToCart({
      id: `room-${listing.id}-${Date.now()}`,
      type: 'room',
      item: roomData,
      quantity: 1,
      price: total,
    });

    setCartAdded(true);
    setBookingId('CART-ADDED');
    setStep('confirmation');
  };

  // ─── Unified: Add to Cart + Go to Checkout ───
  const handleBuyNow = () => {
    if (!validatePayment()) return;

    const roomData = {
      listingId: listing.id,
      userId: user?.id || 'guest',
      userEmail: formData.email,
      userName: `${formData.firstName} ${formData.lastName}`,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: parseInt(formData.guests),
      totalPrice: total,
      status: 'pending',
      specialRequests: formData.specialRequests,
      paymentMethod: paymentMethod,
    };

    addToCart({
      id: `room-${listing.id}-${Date.now()}`,
      type: 'room',
      item: roomData,
      quantity: 1,
      price: total,
    });

    navigate('/checkout');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(BITCOIN_WALLET);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      alert('Please copy the address manually: ' + BITCOIN_WALLET);
    }
  };

  const addSteamCode = () => {
    setSteamCodes([...steamCodes, '']);
  };

  const removeSteamCode = (index: number) => {
    if (steamCodes.length > 1) {
      setSteamCodes(steamCodes.filter((_, i) => i !== index));
    }
  };

  const updateSteamCode = (index: number, value: string) => {
    const newCodes = [...steamCodes];
    newCodes[index] = value.toUpperCase();
    setSteamCodes(newCodes);
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${
      errors[field] ? 'border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-[#DB8293]/50 focus:ring-[#DB8293]/20'
    }`;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#0A1128]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/listing/${id}`} className="inline-flex items-center gap-2 text-[#DB8293] text-sm mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to listing
        </Link>

        <div className="flex items-center justify-center gap-4 mb-10">
          {(['details', 'payment', 'confirmation'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white' :
                (['details', 'payment', 'confirmation'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                'bg-white/10 text-gray-500'
              }`}>{(['details', 'payment', 'confirmation'].indexOf(step) > i) ? '✓' : i + 1}</div>
              <span className={`text-sm hidden sm:inline ${step === s ? 'text-white font-medium' : 'text-gray-500'}`}>
                {s === 'details' ? 'Guest Details' : s === 'payment' ? 'Payment' : 'Confirmed!'}
              </span>
              {i < 2 && <div className="w-12 h-px bg-white/10 mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card3D>
                    <div className="p-6 md:p-8 bg-[#131C2E] rounded-2xl border border-white/5">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-[#DB8293]" /> Guest Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'firstName', label: 'First Name', placeholder: 'John', type: 'text' },
                          { key: 'lastName', label: 'Last Name', placeholder: 'Doe', type: 'text' },
                          { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
                          { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8900', type: 'tel' },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="text-sm text-gray-400 mb-1 block">{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder} value={formData[f.key as keyof typeof formData]}
                              onChange={(e) => setFormData(p => ({ ...p, [f.key]: e.target.value }))} className={inputCls(f.key)} />
                            {errors[f.key] && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[f.key]}</p>}
                          </div>
                        ))}
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Country</label>
                          <select value={formData.country} onChange={(e) => setFormData(p => ({ ...p, country: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50 appearance-none">
                            <option value="">Select country</option>
                            {['US','UK','BR','AR','DE','FR','JP','NG','MX','CA','GH','EG','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Guests</label>
                          <select value={formData.guests} onChange={(e) => setFormData(p => ({ ...p, guests: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50 appearance-none">
                            {[...Array(listing.maxGuests)].map((_, i) => <option key={i} value={i+1}>{i+1} Guest{i>0?'s':''}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div><label className="text-sm text-gray-400 mb-1 block">Check-in</label>
                          <input type="date" value={formData.checkIn} onChange={(e) => setFormData(p => ({ ...p, checkIn: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50" /></div>
                        <div><label className="text-sm text-gray-400 mb-1 block">Check-out</label>
                          <input type="date" value={formData.checkOut} onChange={(e) => setFormData(p => ({ ...p, checkOut: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#DB8293]/50" /></div>
                      </div>
                      <div className="mt-4"><label className="text-sm text-gray-400 mb-1 block">Special Requests (optional)</label>
                        <textarea value={formData.specialRequests} onChange={(e) => setFormData(p => ({ ...p, specialRequests: e.target.value }))}
                          placeholder="Any special requirements..." rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#DB8293]/50 resize-none" /></div>
                      <button onClick={handleDetailsSubmit}
                        className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-[#DB8293]/25">
                        Continue to Payment →
                      </button>
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card3D>
                    <div className="p-6 md:p-8 bg-[#131C2E] rounded-2xl border border-white/5">
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-[#C49B55]" /> Choose Payment Method
                      </h2>
                      <p className="text-gray-400 text-sm mb-6 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> All payments are encrypted and secure
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-6">
                        {PAYMENT_METHODS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => { setPaymentMethod(m.id); setErrors({}); }}
                            className={`p-3 rounded-xl text-center transition-all border ${
                              paymentMethod === m.id
                                ? 'bg-[#DB8293]/15 border-[#DB8293]/40 ring-1 ring-[#DB8293]/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className="text-2xl block mb-1">{m.icon}</span>
                            <span className={`text-xs font-medium block ${paymentMethod === m.id ? 'text-[#DB8293]' : 'text-gray-400'}`}>{m.label}</span>
                            <span className={`text-[10px] block mt-0.5 ${m.timeColor}`}>{m.time}</span>
                          </button>
                        ))}
                      </div>

                      <motion.div
                        key={paymentMethod}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                          paymentMethod === 'bitcoin' ? 'bg-[#DB8293]/10 border-[#DB8293]/20' :
                          paymentMethod === 'paypal' ? 'bg-[#C49B55]/10 border-[#C49B55]/20' :
                          'bg-[#DB8293]/10 border-[#DB8293]/20'
                        }`}
                      >
                        <Clock className={`w-5 h-5 shrink-0 mt-0.5 ${selectedMethod.timeColor}`} />
                        <div>
                          <p className={`text-sm font-semibold ${selectedMethod.timeColor}`}>
                            Estimated confirmation: {selectedMethod.time}
                          </p>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{selectedMethod.warning}</p>
                        </div>
                      </motion.div>

                      {paymentMethod === 'bitcoin' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div className="p-4 rounded-xl bg-[#DB8293]/5 border border-[#DB8293]/20">
                            <p className="text-gray-400 text-xs mb-2 text-center">
                              Send <strong className="text-white">{format(total)}</strong> in Bitcoin (BTC) to:
                            </p>
                            <div className="flex justify-center my-3">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${BITCOIN_WALLET}&bgcolor=131C2E&color=DB8293&margin=10`}
                                alt="Bitcoin QR Code"
                                className="rounded-lg border border-[#DB8293]/20"
                              />
                            </div>
                            <p className="text-center text-gray-400 text-xs mb-3">Scan with Trust Wallet or any Bitcoin wallet</p>
                            <div className="flex items-center gap-2 bg-black/30 rounded-lg p-3 border border-[#DB8293]/20">
                              <code className="text-sm text-[#DB8293] break-all flex-1 font-mono">
                                {BITCOIN_WALLET}
                              </code>
                              <button
                                type="button"
                                onClick={copyToClipboard}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#DB8293]/20 hover:bg-[#DB8293]/30 transition-all text-[#DB8293] text-sm whitespace-nowrap"
                              >
                                {copied ? (
                                  <><Check className="w-4 h-4" /> Copied!</>
                                ) : (
                                  <><Copy className="w-4 h-4" /> Copy</>
                                )}
                              </button>
                            </div>
                            <p className="text-gray-500 text-[10px] mt-2 text-center">
                              ⚠️ Send the exact amount. Your booking will be confirmed once the transaction has 3+ confirmations.
                            </p>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <p className="text-yellow-400 text-xs flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Bitcoin network fees apply. Please check current network fees before sending.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === 'paypal' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div className="p-6 rounded-xl bg-[#C49B55]/10 border border-[#C49B55]/30">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-3xl">⚠️</span>
                              <h3 className="text-[#C49B55] font-bold text-lg">PayPal Temporarily Unavailable</h3>
                            </div>
                            <p className="text-gray-300 text-sm mb-4">
                              We're experiencing a temporary issue with PayPal. Please choose an alternative payment method.
                            </p>
                            <div className="bg-white/5 rounded-lg p-4 mb-4">
                              <p className="text-gray-400 text-sm">
                                <strong className="text-white">Alternative Payment Options:</strong>
                              </p>
                              <ul className="text-gray-400 text-sm list-disc list-inside mt-2 space-y-1">
                                <li>Pay with <strong className="text-[#DB8293]">Bitcoin (BTC)</strong></li>
                                <li>Pay with <strong className="text-[#DB8293]">Steam Card</strong></li>
                                <li><strong className="text-[#C49B55]">PayPal invoice</strong> will be emailed within 24 hours</li>
                              </ul>
                            </div>
                            <p className="text-gray-500 text-xs">
                              Questions? Email <a href="mailto:hello@annatravelagency.com" className="text-[#DB8293] hover:underline">hello@annatravelagency.com</a>
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === 'steam' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div className="p-4 rounded-xl bg-[#DB8293]/10 border border-[#DB8293]/20">
                            <p className="text-[#DB8293] text-sm font-medium mb-1">🎮 Steam Card Payment</p>
                            <p className="text-gray-400 text-xs">
                              Purchase Steam wallet cards totaling <strong className="text-white">{format(total)}</strong> and enter the codes below.
                              You may use multiple cards. Our team will verify the codes within ~2 hours.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-400 block">Steam Card Codes</label>
                            {steamCodes.map((code, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder={`Code #${index + 1}`}
                                  value={code}
                                  onChange={(e) => updateSteamCode(index, e.target.value)}
                                  className={`${inputCls('steam')} font-mono tracking-wider flex-1`}
                                />
                                {steamCodes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSteamCode(index)}
                                    className="px-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            ))}
                            {errors.steam && <p className="text-red-400 text-xs">{errors.steam}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={addSteamCode}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DB8293]/20 text-[#DB8293] hover:bg-[#DB8293]/30 transition-all border border-[#DB8293]/30"
                          >
                            <Plus className="w-4 h-4" />
                            Add Another Code
                          </button>
                        </motion.div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <button onClick={() => setStep('details')}
                          className="px-6 py-4 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all">
                          ← Back
                        </button>
                        <button onClick={handleAddToCart}
                          className="flex-1 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </button>
                        <button onClick={handleBuyNow}
                          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold hover:scale-[1.02] transition-all shadow-lg shadow-[#DB8293]/25 flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" /> Buy Now
                        </button>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card3D glowColor={cartAdded ? 'rgba(219, 130, 147, 0.2)' : 'rgba(34, 197, 94, 0.2)'}>
                    <div className="p-8 md:p-12 text-center bg-[#131C2E] rounded-2xl border border-white/5">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-[#DB8293]/20 border-2 border-[#DB8293] flex items-center justify-center mx-auto mb-6">
                        {cartAdded ? (
                          <ShoppingCart className="w-10 h-10 text-[#DB8293]" />
                        ) : (
                          <CheckCircle2 className="w-10 h-10 text-green-400" />
                        )}
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h2 className="text-3xl font-black text-white mb-2">
                          {cartAdded ? 'Added to Cart! 🛒' : 'Booking Submitted! ⏳'}
                        </h2>
                        <p className="text-gray-400 mb-4">
                          {cartAdded
                            ? 'Your room has been added to your cart. You can continue browsing or proceed to checkout.'
                            : 'Your World Cup accommodation is secured.'}
                        </p>

                        {cartAdded && (
                          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                            <button
                              onClick={() => navigate('/checkout')}
                              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-lg hover:scale-105 transition-all"
                            >
                              Proceed to Checkout
                            </button>
                            <button
                              onClick={() => navigate('/listings')}
                              className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-all"
                            >
                              Continue Browsing
                            </button>
                          </div>
                        )}

                        {!cartAdded && (
                          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                            {user && <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all">View My Bookings</Link>}
                            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-lg hover:scale-105 transition-all">Back to Home ⚽</Link>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </Card3D>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card3D>
                <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
                  <div className="flex gap-3 mb-4">
                    <img src={listing.images[0]} alt={listing.title} className="w-20 h-16 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-white font-medium text-sm">{listing.title}</h4>
                      <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3 text-[#C49B55]" /> {listing.city}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-3.5 h-3.5 text-[#DB8293]" />{formData.checkIn} → {formData.checkOut}</div>
                    <div className="flex items-center gap-2 text-gray-400"><Users className="w-3.5 h-3.5 text-[#C49B55]" />{formData.guests} guest(s)</div>
                  </div>
                  <div className="space-y-2 text-sm border-t border-white/10 mt-4 pt-4">
                    <div className="flex justify-between"><span className="text-gray-400">{format(listing.price)} × {nights} nights</span><span className="text-white">{format(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Service fee</span><span className="text-white">{format(serviceFee)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Cleaning fee</span><span className="text-white">{format(cleaningFee)}</span></div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                      <span className="text-white">Total</span><span className="text-[#DB8293]">{format(total)}</span>
                    </div>
                  </div>
                  {step === 'payment' && (
                    <div className={`mt-4 p-3 rounded-lg border ${
                      paymentMethod === 'bitcoin' ? 'bg-[#DB8293]/10 border-[#DB8293]/20' :
                      paymentMethod === 'paypal' ? 'bg-[#C49B55]/10 border-[#C49B55]/20' :
                      'bg-[#DB8293]/10 border-[#DB8293]/20'
                    }`}>
                      <p className={`text-xs flex items-center justify-center gap-1 ${selectedMethod.timeColor}`}>
                        <Clock className="w-3 h-3" /> {selectedMethod.icon} {selectedMethod.label} · {selectedMethod.time}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                    <p className="text-green-400 text-xs flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" /> Free cancellation until June 4, 2026
                    </p>
                  </div>
                </div>
              </Card3D>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}