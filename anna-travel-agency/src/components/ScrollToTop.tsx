import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // 🛑 PREVENT SCROLL RESET ON ADMIN PANEL
    if (!pathname.startsWith('/admin')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}