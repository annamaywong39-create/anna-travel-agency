import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}>({ theme: 'light', toggle: () => {}, setTheme: () => {} });

function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  // Night 7pm - 6am
  if (hour >= 19 || hour < 6) return 'dark';
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('anna_theme') as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    // Auto use time
    return getTimeBasedTheme();
  });

  const [autoMode, setAutoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('anna_theme_auto') !== 'false';
    } catch { return true; }
  });

  // Auto switch based on time every minute if autoMode
  useEffect(() => {
    if (!autoMode) return;
    const iv = setInterval(() => {
      const timeTheme = getTimeBasedTheme();
      setThemeState((cur) => {
        if (cur !== timeTheme) {
          try { localStorage.setItem('anna_theme', timeTheme); } catch {}
          return timeTheme;
        }
        return cur;
      });
    }, 60 * 1000);
    return () => clearInterval(iv);
  }, [autoMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('anna_theme', theme);
      localStorage.setItem('anna_theme_auto', String(autoMode));
    } catch {}
  }, [theme, autoMode]);

  const toggle = () => {
    setAutoMode(false);
    setThemeState((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: Theme) => {
    setAutoMode(false);
    setThemeState(t);
  };

  // Allow auto again if user wants time-based
  const enableAuto = () => {
    setAutoMode(true);
    setThemeState(getTimeBasedTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {/* expose enableAuto via window for debugging */}
      <div data-auto={autoMode} data-theme={theme} style={{ display: 'none' }} />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
