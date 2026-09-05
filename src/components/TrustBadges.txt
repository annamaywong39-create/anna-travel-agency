import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8A9AB0]">
      <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E5F0] bg-white px-2.5 py-1"><ShieldCheck className="h-3.5 w-3.5 text-[#1267C4]" /> Verified availability</span>
      <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E5F0] bg-white px-2.5 py-1"><Lock className="h-3.5 w-3.5 text-[#1267C4]" /> SSL secure</span>
      <span className="inline-flex items-center gap-1 rounded-full border border-[#D8E5F0] bg-white px-2.5 py-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> PayPal verified</span>
    </div>
  );
}
