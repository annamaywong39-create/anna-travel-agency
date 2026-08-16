import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Calendar, Ticket } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { cartItems, removeFromCart, getCartTotal } = useData();
  const { format } = useCurrency();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-96 max-w-[90vw] bg-[#131C2E] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#DB8293]" />
                Your Cart ({totalItems})
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-5xl mb-3">🛒</div>
                <p className="text-gray-400">Your cart is empty</p>
                <Link
                  to="/listings"
                  onClick={onClose}
                  className="mt-3 inline-block text-[#DB8293] hover:underline text-sm"
                >
                  Start browsing →
                </Link>
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto p-3 space-y-3">
                  {cartItems.map((item, index) => {
                    const isRoom = item.type === 'room';
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-[#DB8293]/20 transition-all"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isRoom ? 'bg-[#DB8293]/20 text-[#DB8293]' : 'bg-[#C49B55]/20 text-[#C49B55]'
                        }`}>
                          {isRoom ? <Calendar className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {isRoom ? item.item.userName : item.item.eventName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {isRoom 
                              ? `${item.item.checkIn} → ${item.item.checkOut}` 
                              : `${item.quantity} × ${item.item.ticketId?.slice(0, 8) || 'Ticket'}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#DB8293] font-bold text-sm">{format(item.price * item.quantity)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Subtotal</span>
                    <span className="text-white font-bold text-lg">{format(getCartTotal())}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-center block hover:scale-105 transition-all shadow-lg shadow-[#DB8293]/25"
                  >
                    Go to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}