import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import CurrencySelector from './CurrencySelector';
import CartDropdown from './CartDropdown';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Accommodations' },
  { to: '/events', label: 'Events' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthReady } = useAuth();
  const { cartItems } = useData();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
    setCartOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0B1220]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* ─── LOGO ─── */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12">
                <img
                  src="/logo.png"
                  alt="Anna Travel Agency"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('nav-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div id="nav-fallback" className="hidden flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center shadow-lg shadow-[#DB8293]/30">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white">Anna</span>
                    <span className="block text-[10px] tracking-[0.3em] text-[#C49B55] uppercase font-medium">
                      TRAVEL AGENCY
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* ─── Desktop Nav ─── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-[#DB8293]/20 text-[#DB8293]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ─── Right Side ─── */}
            <div className="hidden lg:flex items-center gap-3">
              <CurrencySelector />

              {/* ─── Cart Button ─── */}
              <div className="relative">
                <button
                  onClick={() => setCartOpen(!cartOpen)}
                  className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#DB8293] text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-[#DB8293]/30">
                      {cartCount}
                    </span>
                  )}
                </button>
                <CartDropdown isOpen={cartOpen} onClose={() => setCartOpen(false)} />
              </div>

              {/* ─── User Menu ─── */}
              {!isAuthReady ? (
                <div className="flex items-center gap-2">
                  <div className="h-9 w-20 rounded-xl bg-white/5 animate-pulse" />
                  <div className="h-9 w-20 rounded-xl bg-white/5 animate-pulse" />
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName.charAt(0)}
                    </div>
                    <span className="text-gray-300 text-sm">{user.firstName}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 z-50 w-48 py-2 rounded-xl bg-[#131C2E] border border-white/10 shadow-xl"
                        >
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 transition-all"
                          >
                            <User className="w-4 h-4" />
                            Dashboard
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:bg-white/5 transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/5 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-semibold text-sm shadow-lg shadow-[#DB8293]/25 hover:shadow-[#DB8293]/40 hover:scale-105 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0B1220]/98 backdrop-blur-xl pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-6 py-4 rounded-xl text-lg font-medium transition-all ${
                    location.pathname === link.to
                      ? 'bg-[#DB8293]/20 text-[#DB8293]'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Cart */}
              <Link
                to="/checkout"
                className="flex items-center justify-between px-6 py-4 rounded-xl text-gray-300 hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#DB8293] text-white text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="mt-4 pt-4 border-t border-white/10">
                {!isAuthReady ? (
                  <div className="space-y-2">
                    <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
                    <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
                  </div>
                ) : user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-6 py-4 rounded-xl text-gray-300 hover:bg-white/5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center text-white font-bold">
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-6 py-4 rounded-xl text-purple-400 hover:bg-white/5"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-6 py-4 rounded-xl text-red-400 hover:bg-white/5"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-6 py-4 rounded-xl text-gray-300 text-center hover:bg-white/5"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-6 py-4 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <CurrencySelector />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}