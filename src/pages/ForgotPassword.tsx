import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import CaptchaBox from '../components/CaptchaBox';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); setError(''); setMessage('');
    const result = await requestPasswordReset(email.trim(), captchaToken);
    setLoading(false);
    if (!result.success) setError(result.error || 'Unable to send the reset email.');
    else setMessage('If an account exists for that email, a password reset link has been sent. Check your inbox and spam folder.');
  };

  return <main className="min-h-screen bg-[#0B1F3A] px-4 pb-20 pt-32 text-white"><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(217,140,155,0.18),transparent_35%),radial-gradient(circle_at_15%_90%,rgba(199,165,106,0.12),transparent_35%)]" /><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#132A46]/95 p-8 shadow-2xl shadow-black/30"><Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-white/65 hover:text-[#E6C98E]"><ArrowLeft className="h-4 w-4" />Back to sign in</Link><div className="mb-7"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D98C9B]/15 text-[#E6C98E]"><Mail className="h-5 w-5" /></div><h1 className="text-3xl font-semibold">Reset your password</h1><p className="mt-2 text-sm leading-6 text-white/65">Enter your email and we will send you a secure reset link.</p></div>{message && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}{error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#D98C9B] focus:ring-2 focus:ring-[#D98C9B]/20" placeholder="you@example.com" /></label><CaptchaBox value={captchaToken} onChange={setCaptchaToken} /><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D98C9B] py-3.5 font-semibold text-white hover:bg-[#c97888] disabled:opacity-50">{loading ? 'Sending…' : <><Send className="h-4 w-4" />Send reset link</>}</button></form></motion.div></main>;
}
