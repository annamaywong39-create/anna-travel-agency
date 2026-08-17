import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BtsOfferModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('anna_bts_simple_v1') !== 'seen') {
        window.sessionStorage.setItem('anna_bts_simple_v1', 'seen');
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A1931]/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => setOpen(false)}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bts-simple-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_rgba(20,37,63,0.25)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full bg-[#F7FAFD] p-2 text-[#8A9AB0] hover:text-[#14253F]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-7 pt-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1267C4] text-white">★</div>
          <h2 id="bts-simple-title" className="mt-4 font-serif text-[26px] font-bold leading-tight text-[#14253F]">
            BTS ARIRANG<br />
            <span className="text-[#1267C4]">Special Offer</span>
          </h2>
          <p className="mt-3 text-[14px] leading-6 text-[#5B6B82]">
            Save up to <span className="font-bold text-[#14253F]">70% off</span> eligible tickets for remaining US shows.
          </p>
          <p className="mt-1 text-[12px] text-[#8A9AB0]">Limited availability. Selected sections only.</p>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/tickets"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#1267C4] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#0F5AAC]"
            >
              Shop BTS Tickets
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#D8E5F0] bg-white px-6 py-2.5 text-[13px] font-semibold text-[#687A90] hover:bg-[#F7FAFD]"
            >
              Maybe later
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
