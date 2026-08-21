import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'CAD' | 'COP' | 'PEN' | 'CLP' | 'ARS' | 'BRL' | 'TWD' | 'THB' | 'MYR' | 'SGD' | 'IDR' | 'JPY' | 'KRW';

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Rate relative to USD - how much 1 USD = X local
  locale?: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1, locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92, locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.79, locale: 'en-GB' },
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽', rate: 17.15, locale: 'es-MX' },
  CAD: { code: 'CAD', symbol: '$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.36, locale: 'en-CA' },
  COP: { code: 'COP', symbol: '$', name: 'Colombian Peso', flag: '🇨🇴', rate: 4100, locale: 'es-CO' },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', flag: '🇵🇪', rate: 3.73, locale: 'es-PE' },
  CLP: { code: 'CLP', symbol: '$', name: 'Chilean Peso', flag: '🇨🇱', rate: 920, locale: 'es-CL' },
  ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso', flag: '🇦🇷', rate: 900, locale: 'es-AR' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', rate: 5.2, locale: 'pt-BR' },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', flag: '🇹🇼', rate: 32, locale: 'zh-TW' },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭', rate: 36, locale: 'th-TH' },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾', rate: 4.7, locale: 'ms-MY' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.32, locale: 'en-SG' },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩', rate: 16000, locale: 'id-ID' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 150, locale: 'ja-JP' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', rate: 1330, locale: 'ko-KR' },
};

export function getCurrencyForCity(city: string): Currency {
  const c = city.toLowerCase();
  if (/toronto|vancouver|canada/i.test(c)) return 'CAD';
  if (/mexico|guadalajara|monterrey/i.test(c)) return 'MXN';
  if (/bogot[aá]|colombia/i.test(c)) return 'COP';
  if (/lima|peru/i.test(c)) return 'PEN';
  if (/santiago|chile/i.test(c)) return 'CLP';
  if (/buenos aires|argentina|la plata/i.test(c)) return 'ARS';
  if (/são paulo|sao paulo|brazil/i.test(c)) return 'BRL';
  if (/kaohsiung|taiwan/i.test(c)) return 'TWD';
  if (/bangkok|thailand/i.test(c)) return 'THB';
  if (/kuala lumpur|malaysia/i.test(c)) return 'MYR';
  if (/singapore/i.test(c)) return 'SGD';
  if (/jakarta|indonesia/i.test(c)) return 'IDR';
  if (/tokyo|japan/i.test(c)) return 'JPY';
  if (/goyang|busan|seoul|korea/i.test(c)) return 'KRW';
  if (/madrid|brussels|paris|munich|spain|belgium|germany|france/i.test(c)) return 'EUR';
  if (/london|uk|united kingdom/i.test(c)) return 'GBP';
  return 'USD';
}

interface CurrencyContextType {
  currency: Currency;
  currencyInfo: CurrencyInfo;
  setCurrency: (currency: Currency) => void;
  convert: (amountUSD: number, target?: Currency) => number;
  format: (amountUSD: number, target?: Currency) => string;
  formatDual: (amountUSD: number, city?: string) => { usd: string; local: string; rateText: string; localCode: Currency };
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

  const convert = (amountUSD: number, target?: Currency) => {
    const info = target ? CURRENCIES[target] : currencyInfo;
    return Math.round(amountUSD * info.rate);
  };

  const format = (amountUSD: number, target?: Currency) => {
    const info = target ? CURRENCIES[target] : currencyInfo;
    const converted = convert(amountUSD, target);
    if (info.code === 'MXN') return `MX$${converted.toLocaleString()}`;
    if (info.code === 'CAD') return `CA$${converted.toLocaleString()}`;
    if (info.code === 'COP') return `$${converted.toLocaleString()} COP`;
    if (info.code === 'CLP') return `$${converted.toLocaleString()} CLP`;
    if (info.code === 'ARS') return `$${converted.toLocaleString()} ARS`;
    if (info.code === 'IDR') return `Rp${converted.toLocaleString()} IDR`;
    return `${info.symbol}${converted.toLocaleString()} ${info.code !== 'USD' ? info.code : ''}`.trim();
  };

  const formatDual = (amountUSD: number, city?: string) => {
    const localCode = city ? getCurrencyForCity(city) : currency;
    const localInfo = CURRENCIES[localCode];
    const usdText = `$${amountUSD.toLocaleString()} USD`;
    const localText = format(amountUSD, localCode);
    const rateText = `1 USD = ${localInfo.rate.toLocaleString()} ${localCode} • ${localInfo.name} ${localInfo.flag}`;
    return { usd: usdText, local: localText, rateText, localCode };
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencyInfo, setCurrency, convert, format, formatDual }}>
      {children}
    </CurrencyContext.Provider>
  );
}
