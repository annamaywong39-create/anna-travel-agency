import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, UserRound, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import CurrencySelector from './CurrencySelector';
import CartDropdown from './CartDropdown';

const links = [
  { to: '/tickets', label: 'Events & tickets' },
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
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  return <>
    <header className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl ${isAdminArea ? 'border-white/10 bg-[#14253F]/95 text-white' : 'border-transparent bg-white/80 text-[#14253f]'}`}>
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex shrink-0 items-center gap-3"><img src="/logo.png" alt="Anna Travel Agency" width="56" height="56" className="h-11 w-11 rounded-xl object-cover" /><span className="hidden sm:block"><span className={`block font-serif text-xl leading-none ${isAdminArea ? 'text-white' : 'text-[#14253f]'}`}>Anna</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.28em] text-[#b08a42]">Travel agency</span></span></Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => <Link key={link.to} to={link.to} className={`text-sm font-semibold transition ${location.pathname === link.to ? 'text-[#c49b55]' : isAdminArea ? 'text-white/75 hover:text-white' : 'text-[#536071] hover:text-[#172033]'}`}>{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/tickets" className="rounded-full bg-[#1267c4] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d56a5]">Plan a trip</Link>
          <CurrencySelector />
          <div className="relative"><button onClick={() => setCartOpen((value) => !value)} aria-label="Open cart" className="rounded-full border border-[#ddd3c3] p-2.5 text-[#536071] hover:border-[#c49b55] hover:text-[#a87931]"><ShoppingBag className="h-4 w-4" />{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c49b55] text-[10px] font-bold text-white">{count}</span>}</button><CartDropdown isOpen={cartOpen} onClose={() => setCartOpen(false)} /></div>
          {isAuthReady && (user ? <div className="group relative"><button className="flex items-center gap-2 rounded-full border border-[#ddd3c3] px-3 py-2 text-sm font-semibold text-[#536071]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#172033] text-xs text-[#f3d99a]">{user.firstName.charAt(0)}</span>{user.firstName}</button><div className="invisible absolute right-0 top-full mt-2 w-44 rounded-2xl border border-[#e5dccb] bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100"><Link to="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#536071] hover:bg-[#f7f4ee]"><UserRound className="h-4 w-4" />Dashboard</Link>{user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1267C4] hover:bg-[#E7F1FC]">Admin panel</Link>}<button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign out</button></div></div> : <Link to="/login" className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#a87931]">Sign in</Link>)}
        </div>
        <button onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'} className="rounded-full border border-[#ddd3c3] p-2 text-[#172033] lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
    </header>
    {open && <div className="fixed inset-0 z-40 bg-[#fbf9f4] px-6 pb-10 pt-28 lg:hidden"><div className="flex flex-col gap-2">{links.map((link) => <Link key={link.to} to={link.to} className="rounded-2xl px-5 py-4 font-serif text-2xl text-[#172033] hover:bg-[#eee5d5]">{link.label}</Link>)}<Link to="/checkout" className="mt-4 flex items-center gap-2 rounded-2xl bg-[#172033] px-5 py-4 font-semibold text-white"><ShoppingBag className="h-5 w-5" />Cart {count ? `(${count})` : ''}</Link>{user?.role === 'admin' && <Link to="/admin" className="mt-2 rounded-2xl bg-[#E7F1FC] px-5 py-4 font-semibold text-[#1267C4]">Admin panel</Link>}<div className="mt-4 flex justify-center"><CurrencySelector /></div></div></div>}
  </>;
}
