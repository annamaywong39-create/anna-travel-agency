import { useEffect, useState } from 'react';

const MESSAGES = [
  'Someone from Toronto requested 2 tickets for Baltimore • 3 min ago',
  'A fan from New York saved a stay near M&T Bank Stadium • 5 min ago',
  '2 tickets for Chicago were verified • 8 min ago',
  'A group from Dallas is viewing Arlington stays • 12 min ago',
  'Ticket hold secured for Field R • just now',
];

export default function RecentBookingsTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#D8E5F0] bg-white px-3 py-1.5 text-[11px] text-[#687A90] shadow-sm">
      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
      <span className="truncate">{MESSAGES[idx]}</span>
    </div>
  );
}
