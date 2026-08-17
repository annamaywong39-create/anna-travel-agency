import { Moon, Sun, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    try {
      const a = localStorage.getItem('anna_theme_auto');
      setAuto(a !== 'false');
    } catch {}
  }, []);

  const handleToggle = () => {
    toggle();
    setAuto(false);
    try { localStorage.setItem('anna_theme_auto', 'false'); } catch {}
  };

  const enableAuto = () => {
    try {
      localStorage.setItem('anna_theme_auto', 'true');
      localStorage.removeItem('anna_theme');
    } catch {}
    // Reload to trigger time-based
    window.location.reload();
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E5F0] bg-white text-[#536071] hover:border-[#1267C4] hover:text-[#1267C4] dark:border-[#1A2E4D] dark:bg-[#0F1E33] dark:text-[#8A9AB0]"
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#D8E5F0] bg-white p-1 dark:border-[#1A2E4D] dark:bg-[#0F1E33]">
      <button
        onClick={() => {
          const newTheme = 'light' as const;
          // Use setTheme from context if available, else toggle logic
          if (theme !== newTheme) handleToggle();
        }}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === 'light' ? 'bg-[#1267C4] text-white shadow-sm' : 'text-[#8A9AB0] hover:text-[#536071] dark:text-[#687A90]'}`}
      >
        <Sun className="h-3.5 w-3.5" /> Light
      </button>
      <button
        onClick={() => {
          if (theme !== 'dark') handleToggle();
        }}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === 'dark' ? 'bg-[#14253F] text-white shadow-sm dark:bg-[#1A2E4D]' : 'text-[#8A9AB0] hover:text-[#536071] dark:text-[#687A90]'}`}
      >
        <Moon className="h-3.5 w-3.5" /> Night
      </button>
      <div className="mx-1 h-4 w-px bg-[#D8E5F0] dark:bg-[#1A2E4D]" />
      <button
        onClick={enableAuto}
        title={auto ? 'Auto: using your time (7pm-6am = night)' : 'Enable auto time-based'}
        className={`flex items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-medium transition ${auto ? 'bg-[#E7F1FC] text-[#1267C4] dark:bg-[#0A1929] dark:text-[#5BA7E8]' : 'text-[#8A9AB0] hover:text-[#1267C4]'}`}
      >
        <Clock className="h-3 w-3" /> {auto ? 'Auto' : 'Auto'}
      </button>
    </div>
  );
}
