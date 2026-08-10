import { Heart, Ticket } from 'lucide-react';

/** Persistent full-width campaign banner. It remains visible until the campaign is removed from the site. */
export default function BtsSupporterBanner() {
  return (
    <aside className="relative isolate w-full overflow-hidden border-y border-[#B783FF]/50 bg-[#160D35] text-white shadow-[0_12px_40px_rgba(91,45,160,0.24)]" aria-label="BTS supporter offer" role="note">
      <div className="pointer-events-none absolute -left-16 -top-24 -z-10 h-64 w-64 rounded-full bg-[#7D3CFF]/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 -z-10 h-64 w-64 rounded-full bg-[#E8338A]/25 blur-3xl" />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7D3CFF] via-[#C13CFF] to-[#E8338A] shadow-lg shadow-[#7D3CFF]/30"><Ticket className="h-6 w-6" /></div>
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#F2C94C] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#21103F]">BTS fan gift</span><span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D6B7FF]">Ongoing offer</span></div>
            <h2 className="mt-2 text-xl font-black leading-tight sm:text-2xl">30–70% off tickets for the remaining BTS show in the US</h2>
            <p className="mt-1 text-sm leading-6 text-white/75"><Heart className="mr-1 inline h-4 w-4 text-[#FF7AB8]" />A private supporter has made special ticket discounts possible so more BTS fans can enjoy the show.</p>
            <p className="mt-1 text-xs font-medium text-[#E7D9FF]">Each eligible ticket has its own discount, ranging from 30% to 70%. Terms and conditions apply. Final availability and confirmation are required.</p>
          </div>
        </div>
        <a href="#/tickets" className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#F2C94C] to-[#FF9F68] px-5 py-3 text-sm font-black text-[#21103F] shadow-lg shadow-[#F2C94C]/20 transition hover:scale-[1.02]">See BTS tickets</a>
      </div>
    </aside>
  );
}
