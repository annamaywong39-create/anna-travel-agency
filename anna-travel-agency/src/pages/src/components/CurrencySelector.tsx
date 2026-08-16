import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../contexts/CurrencyContext';

export default function CurrencySelector() {
  const { currency, setCurrency, currencyInfo } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all text-sm"
      >
        <span>{currencyInfo.flag}</span>
        <span className="font-medium">{currency}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 z-50 w-48 py-2 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-xl"
            >
              {Object.values(CURRENCIES).map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/5 transition-all ${
                    currency === curr.code ? 'text-amber-300' : 'text-gray-300'
                  }`}
                >
                  <span className="text-lg">{curr.flag}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{curr.code}</p>
                    <p className="text-xs text-gray-500">{curr.name}</p>
                  </div>
                  {currency === curr.code && (
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
