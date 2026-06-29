import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Final match: July 19, 2026 at MetLife Stadium – 18:00 ET (22:00 UTC)
const WORLD_CUP_END = new Date('2026-07-19T22:00:00Z').getTime();

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = Date.now();
    const diff = Math.max(0, WORLD_CUP_END - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {blocks.map((block, i) => (
        <motion.div
          key={block.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.15, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-white font-mono">
                {String(block.value).padStart(2, '0')}
              </span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/5 to-transparent" />
          </div>
          <span className="mt-2 text-[10px] md:text-xs text-amber-400/70 uppercase tracking-wider font-medium">
            {block.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
