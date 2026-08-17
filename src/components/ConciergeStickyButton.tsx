import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function ConciergeStickyButton() {
  const loc = useLocation();
  if (loc.pathname.startsWith('/admin')) return null;
  return (
    <Link
      to="/contact"
      className="fixed bottom-20 right-4 z-40 hidden items-center gap-2 rounded-full bg-[#14253F] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 hover:bg-black md:bottom-6 md:right-6 md:flex"
    >
      <MessageCircle className="h-4 w-4" />
      Speak to concierge
    </Link>
  );
}
