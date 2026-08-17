import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'CAD';

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Rate relative to USD
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽', rate: 17.15 },
  CAD: { code: 'CAD', symbol: '$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.36 },
};

interface CurrencyContextType {
  currency: Currency;
  currencyInfo: CurrencyInfo;
  setCurrency: (currency: Currency) => void;
  convert: (amountUSD: number) => number;
  format: (amountUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    const stored = localStorage.getItem('ath_currency') as Currency;
    if (stored && CURRENCIES[stored]) {
      setCurrencyState(stored);
    }
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('ath_currency', curr);
  };

  const currencyInfo = CURRENCIES[currency];

  const convert = (amountUSD: number) => {
    return Math.round(amountUSD * currencyInfo.rate);
  };

  const format = (amountUSD: number) => {
    const converted = convert(amountUSD);
    if (currency === 'MXN') {
      return `MX${currencyInfo.symbol}${converted.toLocaleString()}`;
    }
    if (currency === 'CAD') {
      return `CA${currencyInfo.symbol}${converted.toLocaleString()}`;
    }
    return `${currencyInfo.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencyInfo, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}
