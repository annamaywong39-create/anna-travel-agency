import { createContext, useContext, useEffect, useState } from 'react';

type WishlistItem = { id: string; type: 'listing' | 'ticket' | 'event'; title: string };

const WishlistContext = createContext<{
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
}>({ items: [], toggle: () => {}, has: () => false });

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('anna_wishlist') || '[]');
    } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('anna_wishlist', JSON.stringify(items));
  }, [items]);
  const toggle = (item: WishlistItem) => {
    setItems((cur) => cur.find((i) => i.id === item.id) ? cur.filter((i) => i.id !== item.id) : [...cur, item]);
  };
  const has = (id: string) => items.some((i) => i.id === id);
  return <WishlistContext.Provider value={{ items, toggle, has }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
