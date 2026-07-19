import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaTiktok, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-[#0B1220] border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DB8293]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ─── Brand with Logo ─── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12">
                <img
                  src="/logo.png"
                  alt="Anna Travel Agency"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('footer-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                {/* Fallback text logo */}
                <div id="footer-fallback" className="hidden flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white">Anna</span>
                    <div className="flex items-center gap-1 text-[10px] text-[#C49B55] tracking-wider">
                      TRAVEL AGENCY
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              YOUR JOURNEY, OUR PRIORITY. Hotels, apartments, shortlets, airport transfers, experiences — and more.
            </p>
          </div>

          {/* ─── Quick Links ─── */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/listings', label: 'All Accommodations' },
                { to: '/events', label: 'Events' },
                { to: '/tickets', label: 'Tickets' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-gray-400 hover:text-[#DB8293] transition-colors text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ─── Services ─── */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <span>🏨 Hotel Bookings</span>
              <span>✈️ Airport Transfers</span>
              <span>🌍 Experiences & Tours</span>
              <span>🎫 Event Tickets</span>
            </div>
          </div>

          {/* ─── Contact & Social ─── */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="mailto:hello@annatravelagency.com" className="flex items-center gap-2 hover:text-[#DB8293] transition-colors">
                <Mail className="w-4 h-4" /> hello@annatravelagency.com
              </a>
              <a href="tel:+15876810591" className="flex items-center gap-2 hover:text-[#DB8293] transition-colors">
                <Phone className="w-4 h-4" /> +1 (587) 681-0591
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> New York, NY, USA
              </span>
            </div>

            <div className="flex gap-4 mt-4">
              <a
                href="https://www.tiktok.com/@annatravelhost"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#DB8293] transition-colors text-2xl"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.instagram.com/annatravelhost"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#DB8293] transition-colors text-2xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/15876810591"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#DB8293] transition-colors text-2xl"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.facebook.com/share/1bsMeqRN77/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#DB8293] transition-colors text-2xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 Anna Travel Agency. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/refund" className="hover:text-gray-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}