import { useEffect, useState } from 'react';
import { Clock, Ticket } from 'lucide-react';

export default function StickyHoldBar({ heldUntil, ticketName, onExpire }: { heldUntil: string; ticketName?: string; onExpire?: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Math.ceil((new Date(heldUntil).getTime() - Date.now()) / 1000)));

  useEffect(() => {
    const iv = setInterval(() => {
      const left = Math.max(0, Math.ceil((new Date(heldUntil).getTime() - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(iv);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [heldUntil, onExpire]);

  if (secondsLeft <= 0) return null;
  const pct = Math.max(0, (secondsLeft / 120) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#D8E5F0] bg-white/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(20,37,63,0.12)] md:bottom-4 md:left-1/2 md:right-auto md:w-[560px] md:-translate-x-1/2 md:rounded-2xl md:border">
      <div className="relative h-1 w-full overflow-hidden bg-[#E7F1FC] md:rounded-t-2xl">
        <div className="absolute left-0 top-0 h-full bg-[#1267C4] transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F1FC] text-[#1267C4]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#14253F] flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5" /> {secondsLeft <= 20 ? 'Hurry — hold expiring!' : 'Tickets held for you'}
            </p>
            <p className="text-[11px] text-[#687A90]">{ticketName ? `${ticketName} • ` : ''}Verified inventory • Expires in {minutes}:{String(secs).padStart(2, '0')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${secondsLeft <= 20 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-[#F7FAFD] text-[#14253F]'}`}>
            {secondsLeft}s
          </div>
        </div>
      </div>
    </div>
  );
}
