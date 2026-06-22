import { Link } from 'react-router-dom';
import { Plane, Trophy, Mail, Phone, MapPin, MessageCircle, AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#050510] border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-amber-300">Anna Travel Agency</span>
                <div className="flex items-center gap-1 text-[10px] text-amber-400/60">
                  <Trophy className="w-3 h-3" /> FIFA 2026
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier accommodation partner for the FIFA World Cup 2026. Hotels, apartments, and shortlets across all host cities in USA, Mexico, and Canada.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/listings', label: 'All Accommodations' },
                { to: '/schedule', label: 'Match Schedule' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-gray-400 hover:text-amber-300 transition-colors text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Host Countries */}
          <div>
            <h4 className="text-white font-semibold mb-4">Host Countries</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <span>🇺🇸 United States (11 cities)</span>
              <span>🇲🇽 Mexico (3 cities)</span>
              <span>🇨🇦 Canada (2 cities)</span>
            </div>
          </div>

          {/* Contact & Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="mailto:hello@annatravelagency.com" className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                <Mail className="w-4 h-4" /> hello@annatravelagency.com
              </a>
              <a href="tel:+15876810591" className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                <Phone className="w-4 h-4" /> +1 (587) 681-0591
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> New York, NY, USA
              </span>
            </div>
            {/* Social Media Icons */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.tiktok.com/@annatravelhost"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-300 transition-colors text-xl"
                aria-label="TikTok"
              >
                🎵
              </a>
              <a
                href="https://www.instagram.com/annatravelhost"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-300 transition-colors"
                aria-label="Instagram"
              >
                <AtSign className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/15876810591"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1bsMeqRN77/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-300 transition-colors text-xl"
                aria-label="Facebook"
              >
                📘
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