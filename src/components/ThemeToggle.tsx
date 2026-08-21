import { Moon, Sun, Clock, Eye, Contrast, Text, Accessibility, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle, autoMode, enableAuto, reducedMotion, setReducedMotion, highContrast, setHighContrast, eyeComfort, setEyeComfort, fontScale, setFontScale } = useTheme();
  const [auto, setAuto] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

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

  const handleEnableAuto = () => {
    enableAuto();
    setAuto(true);
    try { localStorage.setItem('anna_theme_auto', 'true'); localStorage.removeItem('anna_theme'); } catch {}
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowPanel((v) => !v)}
          aria-label={`Accessibility and theme - current ${theme} mode`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E5F0] bg-white text-[#536071] hover:border-[#1267C4] hover:text-[#1267C4] dark:border-[#1A2E4D] dark:bg-[#0F1E33] dark:text-[#8A9AB0] dark:hover:text-white"
        >
          <Accessibility className="h-4 w-4" />
        </button>
        {showPanel && (
          <div className="fixed inset-0 z-[80] md:hidden" onClick={() => setShowPanel(false)}>
            <div className="absolute bottom-20 left-4 right-4 rounded-2xl border border-[#D8E5F0] bg-white p-4 shadow-2xl dark:border-[#1E3A5F] dark:bg-[#132040]" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#14253F] dark:text-white"><Eye className="h-4 w-4" /> Comfort & Light Sensitivity</h4>
                <button onClick={() => setShowPanel(false)} className="rounded-full p-1 text-[#8A9AB0]"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between"><span className="font-medium text-[#14253F] dark:text-[#E2E8F0]">Dark / Night (less glare)</span><button onClick={handleToggle} className={`rounded-full px-3 py-1 font-bold ${theme === 'dark' ? 'bg-[#14253F] text-white' : 'bg-[#E7F1FC] text-[#1267C4]'}`}>{theme === 'dark' ? 'Dark ON' : 'Light'}</button></div>
                <div className="flex items-center justify-between"><span className="font-medium">Warm Eye-Comfort (reduces blue light)</span><button onClick={() => setEyeComfort(!eyeComfort)} className={`rounded-full px-3 py-1 font-bold ${eyeComfort ? 'bg-amber-500 text-white' : 'bg-[#F1F5F9] text-[#687A90] dark:bg-[#1A2E4D] dark:text-[#8A9AB0]'}`}>{eyeComfort ? 'ON' : 'OFF'}</button></div>
                <div className="flex items-center justify-between"><span className="font-medium">Reduce motion (no floating/shimmer)</span><button onClick={() => setReducedMotion(!reducedMotion)} className={`rounded-full px-3 py-1 font-bold ${reducedMotion ? 'bg-[#1267C4] text-white' : 'bg-[#F1F5F9] text-[#687A90] dark:bg-[#1A2E4D]'}`}>{reducedMotion ? 'ON' : 'OFF'}</button></div>
                <div className="flex items-center justify-between"><span className="font-medium">High contrast (stronger text)</span><button onClick={() => setHighContrast(!highContrast)} className={`rounded-full px-3 py-1 font-bold ${highContrast ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-[#F1F5F9] text-[#687A90] dark:bg-[#1A2E4D]'}`}>{highContrast ? 'ON' : 'OFF'}</button></div>
                <div className="flex items-center justify-between"><span className="font-medium">Larger text</span><div className="flex gap-1">{(['normal','large','xl'] as const).map(s => <button key={s} onClick={()=>setFontScale(s)} className={`rounded-full px-2 py-1 text-[11px] ${fontScale===s ? 'bg-[#14253F] text-white' : 'bg-[#F1F5F9] text-[#687A90]'}`}>{s}</button>)}</div></div>
                <button onClick={handleEnableAuto} className={`mt-2 flex w-full items-center justify-center gap-1 rounded-full px-3 py-2 text-[11px] ${auto ? 'bg-[#E7F1FC] text-[#1267C4] dark:bg-[#0A1929] dark:text-[#5BA7E8]' : 'bg-[#F7FAFD] text-[#687A90]'}`}><Clock className="h-3 w-3" /> Auto time-based (7pm-6am = dark)</button>
              </div>
            </div>
          </div>
        )}
        {/* Desktop compact still shows panel on hover? Use click */}
        <div className="hidden md:block">
          {showPanel && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setShowPanel(false)} />
              <div className="absolute right-0 top-12 z-[71] w-72 rounded-2xl border border-[#D8E5F0] bg-white p-4 shadow-2xl dark:border-[#1E3A5F] dark:bg-[#132040]">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-[#14253F] dark:text-white"><Eye className="h-4 w-4" /> Eye Comfort</h4>
                  <button onClick={() => setShowPanel(false)} className="rounded-full p-1 text-[#8A9AB0]"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between"><span>Dark / Night</span><button onClick={handleToggle} className={`rounded-full px-3 py-1 font-bold ${theme === 'dark' ? 'bg-[#14253F] text-white' : 'bg-[#E7F1FC] text-[#1267C4]'}`}>{theme === 'dark' ? 'Dark' : 'Light'}</button></div>
                  <div className="flex items-center justify-between"><span>Warm filter (reduce blue)</span><button onClick={() => setEyeComfort(!eyeComfort)} className={`rounded-full px-3 py-1 ${eyeComfort ? 'bg-amber-500 text-white' : 'bg-[#F1F5F9] text-[#687A90]'}`}>{eyeComfort ? 'ON' : 'OFF'}</button></div>
                  <div className="flex items-center justify-between"><span>Reduce motion</span><button onClick={() => setReducedMotion(!reducedMotion)} className={`rounded-full px-3 py-1 ${reducedMotion ? 'bg-[#1267C4] text-white' : 'bg-[#F1F5F9] text-[#687A90]'}`}>{reducedMotion ? 'ON' : 'OFF'}</button></div>
                  <div className="flex items-center justify-between"><span>High contrast</span><button onClick={() => setHighContrast(!highContrast)} className={`rounded-full px-3 py-1 ${highContrast ? 'bg-black text-white' : 'bg-[#F1F5F9] text-[#687A90]'}`}>{highContrast ? 'ON' : 'OFF'}</button></div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 rounded-full border border-[#D8E5F0] bg-white p-1 dark:border-[#1A2E4D] dark:bg-[#0F1E33]">
        <button onClick={() => { if (theme !== 'light') handleToggle(); }} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === 'light' ? 'bg-[#1267C4] text-white shadow-sm' : 'text-[#8A9AB0] hover:text-[#536071] dark:text-[#687A90]'}`}><Sun className="h-3.5 w-3.5" /> Light</button>
        <button onClick={() => { if (theme !== 'dark') handleToggle(); }} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === 'dark' ? 'bg-[#14253F] text-white shadow-sm dark:bg-[#1A2E4D]' : 'text-[#8A9AB0] hover:text-[#536071] dark:text-[#687A90]'}`}><Moon className="h-3.5 w-3.5" /> Night</button>
        <div className="mx-1 h-4 w-px bg-[#D8E5F0] dark:bg-[#1A2E4D]" />
        <button onClick={handleEnableAuto} title={auto ? 'Auto: using your time (7pm-6am = night)' : 'Enable auto'} className={`flex items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-medium transition ${auto ? 'bg-[#E7F1FC] text-[#1267C4] dark:bg-[#0A1929] dark:text-[#5BA7E8]' : 'text-[#8A9AB0] hover:text-[#1267C4]'}`}><Clock className="h-3 w-3" /> Auto</button>
      </div>

      {/* Eye-sensitive controls */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#D8E5F0] bg-white px-2 py-1 dark:border-[#1A2E4D] dark:bg-[#0F1E33]">
        <span className="mx-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A9AB0]"><Eye className="h-3 w-3" /> Comfort</span>
        <button onClick={() => setEyeComfort(!eyeComfort)} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${eyeComfort ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300' : 'bg-[#F7FAFD] text-[#687A90] dark:bg-[#162E55] dark:text-[#8A9AB0]'}`}><Eye className="h-3 w-3" /> Warm {eyeComfort ? 'ON' : 'OFF'}</button>
        <button onClick={() => setReducedMotion(!reducedMotion)} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${reducedMotion ? 'bg-[#1267C4] text-white' : 'bg-[#F7FAFD] text-[#687A90] dark:bg-[#162E55] dark:text-[#8A9AB0]'}`}>Reduce Motion {reducedMotion ? 'ON' : ''}</button>
        <button onClick={() => setHighContrast(!highContrast)} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${highContrast ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-[#F7FAFD] text-[#687A90] dark:bg-[#162E55]'}`}><Contrast className="h-3 w-3" /> Contrast</button>
        <button onClick={() => setFontScale(fontScale === 'normal' ? 'large' : fontScale === 'large' ? 'xl' : 'normal')} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#F7FAFD] dark:bg-[#162E55]`}><Text className="h-3 w-3" /> {fontScale === 'normal' ? 'A' : fontScale === 'large' ? 'A+' : 'A++'}</button>
      </div>
    </div>
  );
}
