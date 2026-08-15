import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BtsPromoBanner() {
  return (
    <aside
      className="relative w-full border-b border-[#D8E5F0] bg-gradient-to-r from-[#14253F] via-[#123A70] to-[#1267C4] text-white"
      aria-label="BTS special offer"
      role="note"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3.5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Ticket className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold tracking-[-0.01em]">
              Limited offer: <span className="text-[#F2C94C]">up to 70% off</span> eligible BTS ARIRANG tickets — remaining US shows
            </p>
            <p className="mt-0.5 text-[12px] text-white/70">Selected seats only. Discount applied at checkout. Availability verified before confirmation.</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start lg:self-auto">
          <Link to="/tickets" className="inline-flex rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#14253F] hover:bg-[#F2C94C] transition">
            View Tickets
          </Link>
        </div>
      </div>
    </aside>
  );
}
