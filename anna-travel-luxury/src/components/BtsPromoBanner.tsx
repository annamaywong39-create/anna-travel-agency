import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BtsPromoBanner() {
  return (
    <aside
      className="sticky top-[72px] z-40 w-full border-b border-[#FFD166]/30 bg-[#14253F] text-white shadow-sm"
      aria-label="BTS special offer"
      role="note"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-3.5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2C94C] text-[#14253F]">
            <Ticket className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold tracking-[-0.01em] text-white sm:text-[14px]">
              Limited offer: <span className="text-[#FFD166]">up to 70% off</span> eligible BTS ARIRANG tickets — remaining US shows
            </p>
            <p className="mt-1 text-[11px] font-medium text-white/85 sm:text-[12px]">Selected seats only • Discount applied at checkout • Availability verified</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start lg:self-auto">
          <Link to="/tickets" className="inline-flex rounded-full bg-[#F2C94C] px-5 py-2.5 text-[13px] font-bold text-[#14253F] hover:bg-white transition shadow-sm">
            View Tickets
          </Link>
        </div>
      </div>
    </aside>
  );
}
