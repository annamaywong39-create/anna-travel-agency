import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, Building2, ShoppingBag, UserRound } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartItems } = useData();
  const { user } = useAuth();
  const count = cartItems.reduce((s, i) => s + i.quantity, 0);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 120) setHidden(true);
      else setHidden(false);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/listings', icon: Building2, label: 'Stays' },
    { to: '/checkout', icon: ShoppingBag, label: 'Cart', badge: count },
    { to: user ? '/dashboard' : '/login', icon: UserRound, label: user ? 'You' : 'Login' },
  ];
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t border-[#D8E5F0] bg-white/95 backdrop-blur-xl transition-transform duration-300 md:hidden pb-[env(safe-area-inset-bottom)] ${hidden ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
        {tabs.map(({ to, icon: Icon, label, badge }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link key={to} to={to} className={`relative flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-semibold transition ${active ? 'text-[#1267C4] bg-[#E7F1FC]' : 'text-[#8A9AB0] active:bg-[#F7FAFD]'}`}>
              <div className="relative">
                <Icon className="h-[22px] w-[22px]" />
                {badge ? <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#1267C4] px-1 text-[9px] font-bold text-white">{badge}</span> : null}
              </div>
              <span className="mt-0.5">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
