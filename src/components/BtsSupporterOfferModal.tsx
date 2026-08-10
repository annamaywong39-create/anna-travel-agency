import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/** Shows the campaign popup on the visitor's first site visit in each browser session. */
export default function BtsSupporterOfferModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('anna_bts_visit_popup_seen') !== '1') {
        window.sessionStorage.setItem('anna_bts_visit_popup_seen', '1');
        setOpen(true);
      }
    } catch {
      // Private browsing can disable storage; the banner remains visible on the site.
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071A36]/85 p-4 backdrop-blur-sm" role="presentation" onMouseDown={() => setOpen(false)}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bts-offer-title"
        className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border-2 border-[#F2C94C] bg-[#0B0620] px-6 py-14 text-center text-white shadow-[0_0_0_6px_rgba(125,60,255,0.28),0_28px_120px_rgba(91,45,160,0.75)] sm:px-14 sm:py-20"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#7D3CFF]/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#E8338A]/35 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-1 w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F2C94C] to-transparent shadow-[0_0_30px_8px_rgba(242,201,76,0.45)]" />
        <button type="button" onClick={() => setOpen(false)} aria-label="Close BTS ticket discount popup" className="absolute right-4 top-4 rounded-full border-2 border-white/30 p-2.5 text-white/80 transition hover:bg-white/15 hover:text-white">
          <X className="h-6 w-6" />
        </button>
        <div className="relative">
          <h2 id="bts-offer-title" className="text-6xl font-black uppercase leading-[0.88] tracking-[-0.06em] [text-shadow:0_4px_24px_rgba(125,60,255,0.6)] sm:text-8xl lg:text-9xl">
            <span className="block">BTS tickets.</span>
            <span className="mt-3 block text-[#F2C94C]">Big discounts.</span>
          </h2>
          <p className="mx-auto mt-10 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-[#FF7AB8] [text-shadow:0_3px_18px_rgba(232,51,138,0.5)] sm:text-5xl">SAVE UP TO 70% ON THE REMAINING US SHOW</p>
        </div>
      </section>
    </div>
  );
}
