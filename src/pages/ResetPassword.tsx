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

  return <main className="min-h-screen bg-[#0B1F3A] px-4 pb-20 pt-32 text-[#14253F]"><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md rounded-2xl border border-[#D8E5F0] bg-[#132A46] p-8 shadow-xl"><div className="mb-7"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D98C9B]/15 text-[#E6C98E]"><Lock className="h-5 w-5" /></div><h1 className="text-3xl font-semibold">Choose a new password</h1><p className="mt-2 text-sm leading-6 text-[#14253F]/65">Use at least 8 characters and keep it private.</p></div>{done ? <div role="status" className="space-y-4"><CheckCircle2 className="h-10 w-10 text-emerald-600" /><p className="text-sm text-[#14253F]/65">Your password has been updated.</p><button onClick={() => navigate('/login')} className="w-full rounded-xl bg-[#D98C9B] py-3.5 font-semibold text-[#14253F] hover:bg-[#c97888]">Go to sign in</button></div> : <form onSubmit={submit} className="space-y-4">{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium">New password<input id="new-password" name="password" required type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] px-4 py-3 text-[#14253F] outline-none focus:border-[#D98C9B] focus:ring-2 focus:ring-[#D98C9B]/20" /></label><label className="block text-sm font-medium">Confirm password<input id="confirm-password" name="confirmPassword" required type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 w-full rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] px-4 py-3 text-[#14253F] outline-none focus:border-[#D98C9B] focus:ring-2 focus:ring-[#D98C9B]/20" /></label><button disabled={loading} className="w-full rounded-xl bg-[#D98C9B] py-3.5 font-semibold text-[#14253F] hover:bg-[#c97888] disabled:opacity-50">{loading ? 'Updating…' : 'Update password'}</button><Link to="/login" className="block text-center text-sm text-[#14253F]/65">Cancel</Link></form>}</motion.div></main>;
}
