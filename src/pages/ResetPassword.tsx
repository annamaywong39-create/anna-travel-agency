import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    if (password.length < 8) return setError('Use at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (!result.success) setError(result.error || 'Unable to update password. The link may have expired.');
    else setDone(true);
  };

  return <main className="min-h-screen bg-[#F8F5F0] px-4 pb-20 pt-32 text-[#0B1F3A]"><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md rounded-2xl border border-[#E4DCD2] bg-white p-8 shadow-xl"><div className="mb-7"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E1E5] text-[#C97888]"><Lock className="h-5 w-5" /></div><h1 className="text-3xl font-semibold">Choose a new password</h1><p className="mt-2 text-sm leading-6 text-[#637083]">Use at least 8 characters and keep it private.</p></div>{done ? <div role="status" className="space-y-4"><CheckCircle2 className="h-10 w-10 text-emerald-600" /><p className="text-sm text-[#637083]">Your password has been updated.</p><button onClick={() => navigate('/login')} className="w-full rounded-xl bg-[#D98C9B] py-3.5 font-semibold text-white">Go to sign in</button></div> : <form onSubmit={submit} className="space-y-4">{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium">New password<input required type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E4DCD2] px-4 py-3 outline-none focus:border-[#D98C9B]" /></label><label className="block text-sm font-medium">Confirm password<input required type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E4DCD2] px-4 py-3 outline-none focus:border-[#D98C9B]" /></label><button disabled={loading} className="w-full rounded-xl bg-[#D98C9B] py-3.5 font-semibold text-white disabled:opacity-50">{loading ? 'Updating…' : 'Update password'}</button><Link to="/login" className="block text-center text-sm text-[#637083]">Cancel</Link></form>}</motion.div></main>;
}
