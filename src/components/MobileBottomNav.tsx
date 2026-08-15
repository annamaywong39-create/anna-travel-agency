import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, Building2, ShoppingBag, UserRound } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartItems } = useData();
  const { user } = useAuth();
  const count = cartItems.reduce((s, i) => s + i.quantity, 0);
  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/listings', icon: Building2, label: 'Stays' },
    { to: '/checkout', icon: ShoppingBag, label: 'Cart', badge: count },
    { to: user ? '/dashboard' : '/login', icon: UserRound, label: user ? 'You' : 'Login' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D8E5F0] bg-white/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map(({ to, icon: Icon, label, badge }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition ${active ? 'text-[#1267C4] bg-[#E7F1FC]' : 'text-[#8A9AB0]'}`}>
              <div className="relative">
                <Icon className="h-5 w-5" />
                {badge ? <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1267C4] text-[9px] text-white">{badge}</span> : null}
              </div>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
