import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/** Shows the text-only campaign popup on the visitor's first site visit in each browser session. */
export default function BtsSupporterOfferModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('anna_bts_visit_popup_seen') !== '1') {
        window.sessionStorage.setItem('anna_bts_visit_popup_seen', '1');
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071A36]/35 p-6" role="presentation" onMouseDown={() => setOpen(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="bts-offer-title" className="relative w-full max-w-5xl text-center text-white" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close BTS ticket discount popup" className="absolute -right-2 -top-16 rounded-full border-2 border-white/70 p-2.5 text-white transition hover:bg-white/15 hover:text-white sm:right-0 sm:-top-20">
          <X className="h-7 w-7" />
        </button>
        <div className="relative px-2 py-6 sm:px-8 sm:py-10">
          <h2 id="bts-offer-title" className="text-5xl font-black leading-[0.92] tracking-[-0.05em] drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] sm:text-7xl lg:text-8xl">
            <span className="block">BTS tickets.</span>
            <span className="mt-3 block text-[#F2C94C]">Big discounts.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-4xl text-2xl font-black uppercase leading-tight tracking-[-0.02em] text-[#FF7AB8] drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)] sm:text-4xl lg:text-5xl">SAVE 60–70% ON ELIGIBLE BTS TICKETS</p>
        </div>
      </section>
    </div>
  );
}
