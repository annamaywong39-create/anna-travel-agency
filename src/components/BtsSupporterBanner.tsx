import { useState } from 'react';
import { Heart, Ticket, X } from 'lucide-react';

const DISMISS_KEY = 'anna_bts_supporter_banner_dismissed';

export default function BtsSupporterBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return window.localStorage.getItem(DISMISS_KEY) !== '1';
    } catch {
      return true;
    }
  });

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // The banner can still be dismissed for this render if storage is unavailable.
    }
  };

  return (
    <aside className="relative isolate overflow-hidden rounded-3xl border border-[#B783FF]/50 bg-[#160D35] p-5 text-white shadow-[0_18px_60px_rgba(91,45,160,0.28)] sm:p-6" aria-label="BTS supporter offer" role="note">
      <div className="pointer-events-none absolute -left-10 -top-16 -z-10 h-48 w-48 rounded-full bg-[#7D3CFF]/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 -z-10 h-52 w-52 rounded-full bg-[#E8338A]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-16 top-5 -z-10 text-2xl text-[#F2C94C]/70">✦</div>
      <div className="pointer-events-none absolute bottom-5 right-32 -z-10 text-sm text-[#B783FF]/80">✦</div>
      <button type="button" onClick={dismiss} aria-label="Dismiss BTS supporter offer" className="absolute right-3 top-3 rounded-full border border-white/15 p-2 text-white/65 transition hover:border-white/40 hover:bg-white/10 hover:text-white">
        <X className="h-4 w-4" />
      </button>
      <div className="flex flex-col gap-5 pr-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7D3CFF] via-[#C13CFF] to-[#E8338A] shadow-lg shadow-[#7D3CFF]/30"><Ticket className="h-7 w-7" /></div>
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#F2C94C] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#21103F]">BTS fan gift</span><span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D6B7FF]">Limited secured inventory</span></div>
            <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">30–70% off tickets for the remaining BTS show in the US</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75"><Heart className="mr-1 inline h-4 w-4 text-[#FF7AB8]" />A private supporter has made special ticket discounts possible so more BTS fans can enjoy the show.</p>
            <p className="mt-2 text-xs font-medium text-[#E7D9FF]">Each eligible ticket has its own discount, ranging from 30% to 70%. Terms and conditions apply.</p>
          </div>
        </div>
        <a href="#/tickets" className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#F2C94C] to-[#FF9F68] px-5 py-3 text-sm font-black text-[#21103F] shadow-lg shadow-[#F2C94C]/20 transition hover:scale-[1.02]">See BTS tickets</a>
      </div>
    </aside>
  );
}
