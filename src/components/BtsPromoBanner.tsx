import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BtsPromoBanner() {
  return (
    <aside
      className="relative z-30 w-full border-b border-[#FFD166]/20 bg-[#14253F] text-white"
      aria-label="BTS special offer"
      role="note"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-3.5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2C94C] text-[#14253F]">
            <Ticket className="h-4 w-4" />
          </div>
          <p className="text-[13px] font-semibold leading-tight text-white sm:text-[14px]">
            Limited offer: <span className="font-black text-[#FFD166]">up to 70% off</span> eligible BTS ARIRANG tickets — remaining US shows
            <span className="ml-2 hidden text-[11px] font-normal text-white/70 sm:inline">• Selected seats • Discount at checkout • Verified</span>
          </p>
        </div>
        <Link to="/tickets" className="inline-flex shrink-0 self-start rounded-full bg-[#F2C94C] px-4 py-2 text-[12px] font-bold text-[#14253F] hover:bg-white sm:self-auto">
          View Tickets
        </Link>
      </div>
    </aside>
  );
}
