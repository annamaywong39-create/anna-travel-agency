import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BtsPromoBanner() {
  return (
    <aside
      className="relative z-30 w-full border-b border-[#FFD166]/30 bg-[#0F1E3A] text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] mt-0"
      aria-label="BTS special offer"
      role="note"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD166] text-[#0F1E3A] shadow-sm">
            <Ticket className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold leading-tight text-white sm:text-[14px]">
              Limited offer: <span className="font-black text-[#FFD166]">up to 70% off</span> eligible BTS ARIRANG tickets
              <span className="hidden sm:inline"> — remaining US shows</span>
            </p>
            <p className="mt-1 text-[11px] font-medium leading-tight text-white/90 sm:text-[12px]">
              Selected seats • Discount applied at checkout • Availability verified • Sep 1, 2, 5, 6 SoFi Stadium
            </p>
          </div>
        </div>
        <Link to="/tickets" className="inline-flex shrink-0 items-center justify-center self-start rounded-full bg-[#FFD166] px-5 py-2.5 text-[13px] font-black text-[#0F1E3A] shadow-sm transition hover:bg-white sm:self-auto">
          View Tickets
        </Link>
      </div>
    </aside>
  );
}

