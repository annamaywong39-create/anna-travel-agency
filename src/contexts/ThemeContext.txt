import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type FontScale = 'normal' | 'large' | 'xl';

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  autoMode: boolean;
  enableAuto: () => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  eyeComfort: boolean;
  setEyeComfort: (v: boolean) => void;
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggle: () => {},
  setTheme: () => {},
  autoMode: true,
  enableAuto: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
  eyeComfort: false,
  setEyeComfort: () => {},
  fontScale: 'normal',
  setFontScale: () => {},
});

function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  if (hour >= 19 || hour < 6) return 'dark';
  return 'light';
}

function getSystemTheme(): Theme | null {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  } catch {}
  return null;
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('anna_theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    const sys = getSystemTheme();
    if (sys) return sys;
  } catch {}
  return getTimeBasedTheme();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  const [autoMode, setAutoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('anna_theme_auto') !== 'false';
    } catch { return true; }
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('anna_reduce_motion');
      if (saved) return saved === 'true';
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch { return false; }
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    try { return localStorage.getItem('anna_high_contrast') === 'true'; } catch { return false; }
  });

  const [eyeComfort, setEyeComfortState] = useState<boolean>(() => {
    try { return localStorage.getItem('anna_eye_comfort') === 'true'; } catch { return false; }
  });

  const [fontScale, setFontScaleState] = useState<FontScale>(() => {
    try {
      const s = localStorage.getItem('anna_font_scale') as FontScale | null;
      if (s === 'large' || s === 'xl') return s;
    } catch {}
    return 'normal';
  });

  // Auto switch based on time + system preference
  useEffect(() => {
    if (!autoMode) return;
    const applyAuto = () => {
      const timeTheme = getTimeBasedTheme();
      const sysTheme = getSystemTheme();
      // Prefer system if set, else time-based — both are automatic
      const autoTheme = sysTheme || timeTheme;
      setThemeState((cur) => {
        if (cur !== autoTheme) {
          try { localStorage.setItem('anna_theme', autoTheme); } catch {}
          return autoTheme;
        }
        return cur;
      });
    };
    applyAuto();
    const iv = setInterval(applyAuto, 60 * 1000);

    // Listen to system preference changes
    let mql: MediaQueryList | null = null;
    let handler: ((e: MediaQueryListEvent) => void) | null = null;
    try {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      handler = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState((cur) => {
          if (cur !== newTheme) {
            try { localStorage.setItem('anna_theme', newTheme); } catch {}
            return newTheme;
          }
          return cur;
        });
      };
      mql.addEventListener('change', handler);
    } catch {}

    return () => {
      clearInterval(iv);
      if (mql && handler) {
        try { mql.removeEventListener('change', handler); } catch {}
      }
    };
  }, [autoMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    root.classList.toggle('reduce-motion', reducedMotion);
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('eye-comfort', eyeComfort);
    root.classList.remove('font-normal', 'font-large', 'font-xl');
    root.classList.add(`font-${fontScale}`);
    try {
      localStorage.setItem('anna_theme', theme);
      localStorage.setItem('anna_theme_auto', String(autoMode));
      localStorage.setItem('anna_reduce_motion', String(reducedMotion));
      localStorage.setItem('anna_high_contrast', String(highContrast));
      localStorage.setItem('anna_eye_comfort', String(eyeComfort));
      localStorage.setItem('anna_font_scale', fontScale);
    } catch {}
  }, [theme, autoMode, reducedMotion, highContrast, eyeComfort, fontScale]);

  const toggle = () => {
    setAutoMode(false);
    setThemeState((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: Theme) => {
    setAutoMode(false);
    setThemeState(t);
  };

  const enableAuto = () => {
    setAutoMode(true);
    setThemeState(getTimeBasedTheme());
  };

  const setReducedMotion = (v: boolean) => setReducedMotionState(v);
  const setHighContrast = (v: boolean) => setHighContrastState(v);
  const setEyeComfort = (v: boolean) => setEyeComfortState(v);
  const setFontScale = (s: FontScale) => setFontScaleState(s);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme, autoMode, enableAuto, reducedMotion, setReducedMotion, highContrast, setHighContrast, eyeComfort, setEyeComfort, fontScale, setFontScale }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
