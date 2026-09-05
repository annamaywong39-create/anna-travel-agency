import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, UserRound, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import CurrencySelector from './CurrencySelector';
import CartDropdown from './CartDropdown';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/listings', label: 'Selected stays' },
  { to: '/about', label: 'Our approach' },
  { to: '/contact', label: 'Concierge' },
];

export default function Navbar() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');
  const { user, logout, isAuthReady } = useAuth();
  const { cartItems } = useData();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => { setOpen(false); setCartOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      if (top) {
        const y = parseInt(top || '0', 10) * -1;
        window.scrollTo(0, y);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[70] border-b backdrop-blur-xl ${isAdminArea ? 'border-white/10 bg-[#14253F]/95 text-white' : 'border-[#E7F1FC] bg-white/90 text-[#14253f]'}`}>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img src="/logo.png" alt="Anna Travel Agency" width="56" height="56" className="h-10 w-10 rounded-xl object-cover" />
            <span className="hidden sm:block">
              <span className={`block font-serif text-[18px] leading-none ${isAdminArea ? 'text-white' : 'text-[#14253f]'}`}>Anna</span>
              <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[.28em] text-[#b08a42]">Travel agency</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className={`text-[13px] font-semibold transition ${location.pathname === link.to ? 'text-[#1267C4]' : isAdminArea ? 'text-white/75 hover:text-white' : 'text-[#536071] hover:text-[#172033]'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle compact />
            <Link to="/tickets" className="rounded-full bg-[#1267C4] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d56a5]">Plan a trip</Link>
            <CurrencySelector />
            <div className="relative">
              <button onClick={() => setCartOpen((v) => !v)} aria-label="Open cart" className="relative rounded-full border border-[#D8E5F0] p-2.5 text-[#536071] hover:border-[#1267C4] hover:text-[#1267C4]">
                <ShoppingBag className="h-4 w-4" />
                {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1267C4] text-[10px] font-bold text-white">{count}</span>}
              </button>
              <CartDropdown isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
            {isAuthReady && (user ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full border border-[#D8E5F0] px-3 py-2 text-sm font-semibold text-[#536071]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#172033] text-xs text-[#f3d99a]">{user.firstName?.charAt(0) || 'U'}</span>
                  <span className="max-w-[80px] truncate">{user.firstName}</span>
                </button>
                <div className="invisible absolute right-0 top-full mt-2 w-48 rounded-2xl border border-[#D8E5F0] bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                  <Link to="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#536071] hover:bg-[#F7FAFD]"><UserRound className="h-4 w-4" />Dashboard</Link>
                  {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1267C4] hover:bg-[#E7F1FC]"><Shield className="h-4 w-4" />Admin panel</Link>}
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-[#D8E5F0] px-4 py-2 text-sm font-semibold text-[#536071] hover:bg-[#F7FAFD]">Login</Link>
                <Link to="/signup" className="rounded-full bg-[#14253F] px-4 py-2 text-sm font-bold text-white hover:bg-black">Sign up</Link>
              </>
            ))}
          </div>

          <button onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8E5F0] bg-white text-[#14253F] shadow-sm md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <>
          <div className="fixed inset-0 z-[60] bg-[#14253F]/25 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="fixed inset-x-0 top-[72px] bottom-0 z-[65] overflow-y-auto overscroll-contain bg-[#F7FAFD] px-5 pb-28 pt-6 shadow-[0_20px_60px_-20px_rgba(20,37,63,0.35)] md:hidden">
            <div className="flex flex-col gap-1.5">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className={`rounded-2xl px-5 py-4 text-[18px] font-semibold ${location.pathname === link.to ? 'bg-[#E7F1FC] text-[#1267C4]' : 'text-[#14253F] hover:bg-white'}`}>
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/tickets" className="rounded-2xl bg-[#1267C4] px-5 py-4 text-center font-bold text-white">Tickets</Link>
                <Link to="/listings" className="rounded-2xl border border-[#D8E5F0] bg-white px-5 py-4 text-center font-semibold text-[#14253F]">Stays</Link>
              </div>

              <div className="mt-4 rounded-2xl border border-[#D8E5F0] bg-white p-4">
                {isAuthReady && user ? (
                  <>
                    <p className="text-sm font-bold text-[#14253F]">Hi, {user.firstName}</p>
                    <div className="mt-3 flex flex-col gap-2">
                      <Link to="/dashboard" className="rounded-xl bg-[#F7FAFD] px-4 py-3 text-sm font-semibold text-[#14253F]">Dashboard</Link>
                      {user.role === 'admin' && <Link to="/admin" className="rounded-xl bg-[#14253F] px-4 py-3 text-sm font-bold text-white">Admin panel</Link>}
                      <Link to="/checkout" className="flex items-center justify-between rounded-xl border border-[#D8E5F0] px-4 py-3 text-sm">Cart {count ? `(${count})` : ''} <ShoppingBag className="h-4 w-4" /></Link>
                      <button onClick={logout} className="rounded-xl px-4 py-3 text-left text-sm text-red-600">Sign out</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#14253F]">Account</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link to="/login" className="rounded-xl border border-[#D8E5F0] bg-white px-4 py-3 text-center text-sm font-semibold">Login</Link>
                      <Link to="/signup" className="rounded-xl bg-[#14253F] px-4 py-3 text-center text-sm font-bold text-white">Sign up</Link>
                    </div>
                    <div className="mt-3 text-center">
                      <Link to="/forgot-password" className="text-xs text-[#687A90] underline hover:text-[#1267C4]">Forgot password?</Link>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#D8E5F0] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Currency</span>
                  <CurrencySelector />
                </div>
              </div>

              {isAuthReady && !user && <Link to="/admin" className="mt-2 text-center text-xs text-[#8A9AB0] underline">Admin login</Link>}
            </div>
          </div>
        </>
      )}
    </>
  );
}
