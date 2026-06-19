import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CreditCard, Shield, CheckCircle2, Calendar, Users, MapPin,
  Lock, AlertCircle, Sparkles, Clock, Info
} from 'lucide-react';
import Card3D from '../components/Card3D';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';

type Step = 'details' | 'payment' | 'confirmation';
type PaymentMethod = 'card' | 'crypto' | 'bank' | 'steam';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; time: string; timeColor: string; warning: string }[] = [
  {
    id: 'card',
    label: 'Debit / Credit Card',
    icon: '💳',
    time: '1hr – 24hrs',
    timeColor: 'text-blue-400',
    warning: '⏱️ Card payments typically take 1 hour to 24 hours to confirm. You will receive a confirmation email once payment is verified. Your booking is held during this period.',
  },
  {
    id: 'crypto',
    label: 'Cryptocurrency',
    icon: '₿',
    time: '~5 minutes',
    timeColor: 'text-green-400',
    warning: '⚡ Crypto payments are the fastest! Confirmation usually takes about 5 minutes after the transaction is broadcast on the blockchain. We accept BTC, ETH, USDT, and USDC.',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: '🏦',
    time: '24hrs – 72hrs',
    timeColor: 'text-orange-400',
    warning: '🕐 Bank transfers take 24 to 72 hours to confirm depending on your bank and country. International transfers may take up to 5 business days. Your booking is reserved during this period.',
  },
  {
    id: 'steam',
    label: 'Steam Card',
    icon: '🎮',
    time: '~2 hours',
    timeColor: 'text-purple-400',
    warning: '🎮 Steam card payments take approximately 2 hours to verify. Our team manually confirms the card codes. You will receive email confirmation once validated.',
  },
];

export default function Booking() {
  const { id } = useParams();
  const { user } = useAuth();
  const { listings, addBooking } = useData();
  const { format } = useCurrency();

  const listing = listings.find((l) => l.id === id);
  const [step, setStep] = useState<Step>('details');
  const [bookingId, setBookingId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '', phone: user?.phone || '',
    country: user?.country || '', checkIn: '2026-06-11',
    checkOut: '2026-06-18', guests: '2', specialRequests: '',
  });
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cryptoData, setCryptoData] = useState({ wallet: '', coin: 'BTC' });
  const [bankData, setBankData] = useState({ accountName: '', bankName: '', reference: '' });
  const [steamData, setSteamData] = useState({ code1: '', code2: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!listing) {
    return (
      <main className="pt-32 pb-20 text-center">
        <h1 className="text-3xl font-bold text-white">Listing not found</h1>
        <Link to="/listings" className="text-amber-400 mt-4 inline-block">← Back to listings</Link>
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
    if (paymentMethod === 'card') {
      if (!cardData.number.trim() || cardData.number.replace(/\s/g, '').length < 16) e.number = 'Valid card number required';
      if (!cardData.name.trim()) e.name = 'Required';
      if (!cardData.expiry.trim()) e.expiry = 'Required';
      if (!cardData.cvv.trim() || cardData.cvv.length < 3) e.cvv = 'Required';
    } else if (paymentMethod === 'crypto') {
      if (!cryptoData.wallet.trim()) e.wallet = 'Wallet address required';
    } else if (paymentMethod === 'bank') {
      if (!bankData.accountName.trim()) e.accountName = 'Required';
    } else if (paymentMethod === 'steam') {
      if (!steamData.code1.trim()) e.code1 = 'At least one code required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDetailsSubmit = () => {
    if (validateDetails()) setStep('payment');
  };

  const handlePayment = async () => {
  if (!validatePayment()) return;
  setIsProcessing(true);
  await new Promise(r => setTimeout(r, 2500));

  const booking = await addBooking({
    listingId: listing.id,
    userId: user?.id || 'guest',
    userEmail: formData.email,
    userName: `${formData.firstName} ${formData.lastName}`,
    checkIn: formData.checkIn,
    checkOut: formData.checkOut,
    guests: parseInt(formData.guests),
    totalPrice: total,
    status: paymentMethod === 'card' ? 'confirmed' : 'pending',
    specialRequests: formData.specialRequests,
  });

  // ✅ Use the ID from the booking (which is now a real ID)
  // ✅ The DataContext now generates a proper ID like 'ANA-123456-ABCD'
  setBookingId(booking.id);
  setIsProcessing(false);
  setStep('confirmation');
};
    setBookingId(booking.id);
    setIsProcessing(false);
    setStep('confirmation');
  };

  const fmtCard = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${
      errors[field] ? 'border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20'
    }`;

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/listing/${id}`} className="inline-flex items-center gap-2 text-amber-400 text-sm mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to listing
        </Link>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {(['details', 'payment', 'confirmation'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-amber-500 text-white' :
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

              {/* ═══ STEP 1: DETAILS ═══ */}
              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card3D>
                    <div className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-amber-400" /> Guest Information
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
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 appearance-none">
                            <option value="">Select country</option>
                            {['US','UK','BR','AR','DE','FR','JP','NG','MX','CA','GH','EG','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Guests</label>
                          <select value={formData.guests} onChange={(e) => setFormData(p => ({ ...p, guests: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 appearance-none">
                            {[...Array(listing.maxGuests)].map((_, i) => <option key={i} value={i+1}>{i+1} Guest{i>0?'s':''}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div><label className="text-sm text-gray-400 mb-1 block">Check-in</label>
                          <input type="date" value={formData.checkIn} onChange={(e) => setFormData(p => ({ ...p, checkIn: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50" /></div>
                        <div><label className="text-sm text-gray-400 mb-1 block">Check-out</label>
                          <input type="date" value={formData.checkOut} onChange={(e) => setFormData(p => ({ ...p, checkOut: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50" /></div>
                      </div>
                      <div className="mt-4"><label className="text-sm text-gray-400 mb-1 block">Special Requests (optional)</label>
                        <textarea value={formData.specialRequests} onChange={(e) => setFormData(p => ({ ...p, specialRequests: e.target.value }))}
                          placeholder="Any special requirements..." rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none" /></div>
                      <button onClick={handleDetailsSubmit}
                        className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/25">
                        Continue to Payment →
                      </button>
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* ═══ STEP 2: PAYMENT ═══ */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card3D>
                    <div className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-amber-400" /> Choose Payment Method
                      </h2>
                      <p className="text-gray-400 text-sm mb-6 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> All payments are encrypted and secure
                      </p>

                      {/* ── Payment method selector ── */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                        {PAYMENT_METHODS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => { setPaymentMethod(m.id); setErrors({}); }}
                            className={`p-3 rounded-xl text-center transition-all border ${
                              paymentMethod === m.id
                                ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-500/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className="text-2xl block mb-1">{m.icon}</span>
                            <span className={`text-xs font-medium block ${paymentMethod === m.id ? 'text-amber-300' : 'text-gray-400'}`}>{m.label}</span>
                            <span className={`text-[10px] block mt-0.5 ${m.timeColor}`}>{m.time}</span>
                          </button>
                        ))}
                      </div>

                      {/* ── Confirmation time warning ── */}
                      <motion.div
                        key={paymentMethod}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                          paymentMethod === 'crypto' ? 'bg-green-500/10 border-green-500/20' :
                          paymentMethod === 'bank' ? 'bg-orange-500/10 border-orange-500/20' :
                          paymentMethod === 'steam' ? 'bg-purple-500/10 border-purple-500/20' :
                          'bg-blue-500/10 border-blue-500/20'
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

                      {/* ── CARD FORM ── */}
                      {paymentMethod === 'card' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Card Number</label>
                            <div className="relative">
                              <input type="text" placeholder="4242 4242 4242 4242" value={cardData.number} maxLength={19}
                                onChange={(e) => setCardData(p => ({ ...p, number: fmtCard(e.target.value) }))} className={inputCls('number')} />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">💳</span>
                            </div>
                            {errors.number && <p className="text-red-400 text-xs mt-1">{errors.number}</p>}
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Cardholder Name</label>
                            <input type="text" placeholder="John Doe" value={cardData.name}
                              onChange={(e) => setCardData(p => ({ ...p, name: e.target.value }))} className={inputCls('name')} />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-sm text-gray-400 mb-1 block">Expiry</label>
                              <input type="text" placeholder="MM/YY" value={cardData.expiry} maxLength={5}
                                onChange={(e) => setCardData(p => ({ ...p, expiry: e.target.value }))} className={inputCls('expiry')} /></div>
                            <div><label className="text-sm text-gray-400 mb-1 block">CVV</label>
                              <input type="text" placeholder="123" value={cardData.cvv} maxLength={4}
                                onChange={(e) => setCardData(p => ({ ...p, cvv: e.target.value }))} className={inputCls('cvv')} /></div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── CRYPTO FORM ── */}
                      {paymentMethod === 'crypto' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Select Cryptocurrency</label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { id: 'BTC', label: 'Bitcoin', icon: '₿' },
                                { id: 'ETH', label: 'Ethereum', icon: 'Ξ' },
                                { id: 'USDT', label: 'Tether', icon: '₮' },
                                { id: 'USDC', label: 'USD Coin', icon: '$' },
                              ].map(c => (
                                <button key={c.id} onClick={() => setCryptoData(p => ({ ...p, coin: c.id }))}
                                  className={`p-3 rounded-xl text-center border transition-all ${
                                    cryptoData.coin === c.id ? 'bg-green-500/15 border-green-500/40 text-green-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                  }`}>
                                  <span className="text-xl block">{c.icon}</span>
                                  <span className="text-[10px] block mt-1">{c.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-gray-400 text-xs mb-2">Send {format(total)} equivalent in {cryptoData.coin} to:</p>
                            <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-green-400 break-all select-all">
                              {cryptoData.coin === 'BTC' ? 'bc1qanna2026worldcup...f8k9x' :
                               cryptoData.coin === 'ETH' ? '0xAnnA2026...WorldCup...e4F8' :
                               cryptoData.coin === 'USDT' ? 'TAnna2026WorldCup...J8kL' :
                               '0xAnnA2026USDC...Cup...d9E2'}
                            </div>
                            <p className="text-gray-500 text-[10px] mt-2">Click address to copy · Network: {cryptoData.coin === 'BTC' ? 'Bitcoin' : cryptoData.coin === 'USDT' ? 'TRC-20' : 'ERC-20'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Your Wallet Address (for refunds)</label>
                            <input type="text" placeholder="Paste your wallet address..." value={cryptoData.wallet}
                              onChange={(e) => setCryptoData(p => ({ ...p, wallet: e.target.value }))} className={inputCls('wallet')} />
                            {errors.wallet && <p className="text-red-400 text-xs mt-1">{errors.wallet}</p>}
                          </div>
                        </motion.div>
                      )}

                      {/* ── BANK TRANSFER FORM ── */}
                      {paymentMethod === 'bank' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <p className="text-white font-medium text-sm mb-2">Transfer {format(total)} to:</p>
                            {[
                              { label: 'Bank', value: 'First National Bank' },
                              { label: 'Account Name', value: 'Anna Travel Agency LLC' },
                              { label: 'Account Number', value: '2026-FIFA-WC-8834' },
                              { label: 'Routing / SWIFT', value: 'ANTRVL2026' },
                              { label: 'Reference', value: `WC26-${formData.lastName.toUpperCase().slice(0,4) || 'XXXX'}-${Date.now().toString().slice(-6)}` },
                            ].map(r => (
                              <div key={r.label} className="flex justify-between text-sm">
                                <span className="text-gray-500">{r.label}</span>
                                <span className="text-white font-mono text-xs">{r.value}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Your Name (on bank account)</label>
                            <input type="text" placeholder="John Doe" value={bankData.accountName}
                              onChange={(e) => setBankData(p => ({ ...p, accountName: e.target.value }))} className={inputCls('accountName')} />
                            {errors.accountName && <p className="text-red-400 text-xs mt-1">{errors.accountName}</p>}
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Your Bank Name</label>
                            <input type="text" placeholder="Chase, Barclays, etc." value={bankData.bankName}
                              onChange={(e) => setBankData(p => ({ ...p, bankName: e.target.value }))} className={inputCls('bankName')} />
                          </div>
                        </motion.div>
                      )}

                      {/* ── STEAM CARD FORM ── */}
                      {paymentMethod === 'steam' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <p className="text-purple-300 text-sm font-medium mb-1">Steam Card Payment</p>
                            <p className="text-gray-400 text-xs">
                              Purchase Steam wallet cards totalling {format(total)} and enter the codes below. 
                              You may use multiple cards. Our team will verify the codes within ~2 hours.
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Steam Card Code #1 *</label>
                            <input type="text" placeholder="XXXXX-XXXXX-XXXXX" value={steamData.code1}
                              onChange={(e) => setSteamData(p => ({ ...p, code1: e.target.value.toUpperCase() }))}
                              className={`${inputCls('code1')} font-mono tracking-wider`} />
                            {errors.code1 && <p className="text-red-400 text-xs mt-1">{errors.code1}</p>}
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Steam Card Code #2 (optional)</label>
                            <input type="text" placeholder="XXXXX-XXXXX-XXXXX" value={steamData.code2}
                              onChange={(e) => setSteamData(p => ({ ...p, code2: e.target.value.toUpperCase() }))}
                              className={`${inputCls('code2')} font-mono tracking-wider`} />
                          </div>
                        </motion.div>
                      )}

                      {/* ── Action buttons ── */}
                      <div className="flex gap-3 mt-6">
                        <button onClick={() => setStep('details')}
                          className="px-6 py-4 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all">
                          ← Back
                        </button>
                        <button onClick={handlePayment} disabled={isProcessing}
                          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                          {isProcessing ? (
                            <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Processing...</>
                          ) : (
                            <><Lock className="w-4 h-4" /> Pay {format(total)} via {selectedMethod.label}</>
                          )}
                        </button>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              )}

              {/* ═══ STEP 3: CONFIRMATION ═══ */}
              {step === 'confirmation' && (
                <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card3D glowColor="rgba(34, 197, 94, 0.2)">
                    <div className="p-8 md:p-12 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h2 className="text-3xl font-black text-white mb-2">
                          {paymentMethod === 'card' ? 'Booking Confirmed! 🎉' : 'Booking Submitted! ⏳'}
                        </h2>
                        <p className="text-gray-400 mb-4">Your World Cup accommodation is secured.</p>

                        {/* Payment confirmation time warning */}
                        <div className={`mx-auto max-w-md mb-6 p-4 rounded-xl border flex items-start gap-3 text-left ${
                          paymentMethod === 'crypto' ? 'bg-green-500/10 border-green-500/20' :
                          paymentMethod === 'bank' ? 'bg-orange-500/10 border-orange-500/20' :
                          paymentMethod === 'steam' ? 'bg-purple-500/10 border-purple-500/20' :
                          'bg-blue-500/10 border-blue-500/20'
                        }`}>
                          <Info className={`w-5 h-5 shrink-0 mt-0.5 ${selectedMethod.timeColor}`} />
                          <div>
                            <p className={`text-sm font-bold ${selectedMethod.timeColor}`}>
                              {selectedMethod.icon} {selectedMethod.label} — {selectedMethod.time}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {paymentMethod === 'card' && 'Your payment is being processed. You will receive a confirmation email within 1–24 hours.'}
                              {paymentMethod === 'crypto' && 'Awaiting blockchain confirmation. Your booking will be confirmed in approximately 5 minutes.'}
                              {paymentMethod === 'bank' && 'Your booking is reserved. Please complete the bank transfer within 48 hours. Confirmation takes 24–72 hours after transfer.'}
                              {paymentMethod === 'steam' && 'Our team is verifying your Steam card codes. Confirmation email will arrive within approximately 2 hours.'}
                            </p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
                          <Sparkles className="w-4 h-4" /> Confirmation #{bookingId.slice(-8).toUpperCase()}
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 text-left max-w-md mx-auto mb-6 space-y-3">
                          <div className="flex justify-between text-sm"><span className="text-gray-400">Property</span><span className="text-white font-medium">{listing.title}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-400">Location</span><span className="text-white">{listing.city}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-400">Check-in</span><span className="text-white">{formData.checkIn}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-400">Check-out</span><span className="text-white">{formData.checkOut}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-400">Guests</span><span className="text-white">{formData.guests}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-400">Payment Method</span><span className="text-white">{selectedMethod.icon} {selectedMethod.label}</span></div>
                          <div className="border-t border-white/10 pt-3 flex justify-between">
                            <span className="text-white font-bold">Total</span>
                            <span className="text-green-400 font-bold">{format(total)}</span>
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm mb-6">
                          A confirmation email will be sent to <strong className="text-white">{formData.email}</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          {user && <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all">View My Bookings</Link>}
                          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:scale-105 transition-all">Back to Home ⚽</Link>
                        </div>
                      </motion.div>
                    </div>
                  </Card3D>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card3D>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
                  <div className="flex gap-3 mb-4">
                    <img src={listing.images[0]} alt={listing.title} className="w-20 h-16 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-white font-medium text-sm">{listing.title}</h4>
                      <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.city}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-3.5 h-3.5" />{formData.checkIn} → {formData.checkOut}</div>
                    <div className="flex items-center gap-2 text-gray-400"><Users className="w-3.5 h-3.5" />{formData.guests} guest(s)</div>
                  </div>
                  <div className="space-y-2 text-sm border-t border-white/10 mt-4 pt-4">
                    <div className="flex justify-between"><span className="text-gray-400">{format(listing.price)} × {nights} nights</span><span className="text-white">{format(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Service fee</span><span className="text-white">{format(serviceFee)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Cleaning fee</span><span className="text-white">{format(cleaningFee)}</span></div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                      <span className="text-white">Total</span><span className="text-amber-400">{format(total)}</span>
                    </div>
                  </div>

                  {/* Payment method indicator */}
                  {step === 'payment' && (
                    <div className={`mt-4 p-3 rounded-lg border ${
                      paymentMethod === 'crypto' ? 'bg-green-500/10 border-green-500/20' :
                      paymentMethod === 'bank' ? 'bg-orange-500/10 border-orange-500/20' :
                      paymentMethod === 'steam' ? 'bg-purple-500/10 border-purple-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
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
