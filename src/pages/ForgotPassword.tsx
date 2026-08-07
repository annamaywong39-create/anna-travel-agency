import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); setError(''); setMessage('');
    const result = await requestPasswordReset(email.trim());
    setLoading(false);
    if (!result.success) setError(result.error || 'Unable to send the reset email.');
    else setMessage('If an account exists for that email, a password reset link has been sent. Check your inbox and spam folder.');
  };

  return <main className="min-h-screen bg-[#F8F5F0] px-4 pb-20 pt-32 text-[#0B1F3A]"><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md rounded-2xl border border-[#E4DCD2] bg-white p-8 shadow-xl"><Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-[#637083]"><ArrowLeft className="h-4 w-4" />Back to sign in</Link><div className="mb-7"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E1E5] text-[#C97888]"><Mail className="h-5 w-5" /></div><h1 className="text-3xl font-semibold">Reset your password</h1><p className="mt-2 text-sm leading-6 text-[#637083]">Enter your email and we will send you a secure reset link.</p></div>{message && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}{error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E4DCD2] px-4 py-3 outline-none focus:border-[#D98C9B]" placeholder="you@example.com" /></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D98C9B] py-3.5 font-semibold text-white disabled:opacity-50">{loading ? 'Sending…' : <><Send className="h-4 w-4" />Send reset link</>}</button></form></motion.div></main>;
}
