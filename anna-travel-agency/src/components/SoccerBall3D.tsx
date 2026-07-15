import { motion } from 'framer-motion';

const LOOP_DURATION = 6; // seconds for full cycle

export default function SoccerBall3D({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: 340, height: 180 }}>

      {/* ═══════ SKY BACKGROUND ═══════ */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0c1445] via-[#0f1d5e] to-[#162052]">
        {/* Stars */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              top: `${5 + Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* ═══════ RUNWAY ═══════ */}
      <div className="absolute bottom-0 left-0 right-0 h-[42px] overflow-hidden rounded-b-2xl">
        {/* Tarmac */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#111122]" />
        {/* Runway surface - perspective strip */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[28px]"
          style={{
            width: '110%',
            background: 'linear-gradient(to bottom, #2a2a3e, #222236)',
            clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)',
          }}
        />
        {/* Center dashed line */}
        <div className="absolute bottom-[8px] left-0 right-0 flex justify-center gap-[10px]">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={`dash-${i}`}
              className="w-[12px] h-[2px] bg-white/40 rounded-full"
              animate={{ x: [0, -20] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear', delay: i * 0.05 }}
            />
          ))}
        </div>
        {/* Edge lights left */}
        <div className="absolute bottom-[2px] left-[15%] right-[52%] flex justify-between">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`ll-${i}`}
              className="w-[3px] h-[3px] rounded-full bg-blue-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        {/* Edge lights right */}
        <div className="absolute bottom-[2px] left-[52%] right-[15%] flex justify-between">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`lr-${i}`}
              className="w-[3px] h-[3px] rounded-full bg-blue-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        {/* Threshold markings */}
        <div className="absolute bottom-[18px] right-[8%] flex gap-[3px]">
          {[...Array(4)].map((_, i) => (
            <div key={`tm-${i}`} className="w-[2px] h-[10px] bg-white/30 rounded" />
          ))}
        </div>
      </div>

      {/* ═══════ PLANE + TAKEOFF ANIMATION ═══════ */}
      <motion.div
        className="absolute"
        animate={{
          // Taxi on runway → accelerate → lift off → fly up & away → reset
          x: [-60, 20, 80, 160, 260, 400],
          y: [110, 110, 108, 85, 30, -40],
          rotate: [0, 0, 0, -12, -25, -30],
          scale: [0.55, 0.6, 0.7, 0.85, 1, 1.05],
        }}
        transition={{
          duration: LOOP_DURATION,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.45, 0.6, 0.8, 1],
        }}
      >
        {/* Engine exhaust */}
        <motion.div
          className="absolute -left-4 top-[18px] w-8 h-3"
          animate={{ opacity: [0, 0.8, 0.4, 0.9, 0.5] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-to-l from-amber-400/60 via-orange-500/30 to-transparent rounded-full blur-sm" />
        </motion.div>

        {/* THE PLANE */}
        <svg width="100" height="42" viewBox="0 0 100 42" fill="none"
          className="drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
        >
          {/* Fuselage */}
          <ellipse cx="52" cy="21" rx="34" ry="6.5" fill="url(#fuse)" />
          {/* Nose cone */}
          <path d="M86 21 L100 20.2 L100 21.8 L86 21Z" fill="#f5f5f5" />
          {/* Cockpit windshield */}
          <path d="M84 18 L92 17.5 L92 20 L84 19.5Z" fill="#60a5fa" fillOpacity="0.8" />
          {/* Top wing */}
          <path d="M42 21 L24 5 L56 17Z" fill="url(#wing1)" />
          {/* Bottom wing */}
          <path d="M42 21 L24 37 L56 25Z" fill="url(#wing2)" />
          {/* Tail fin vertical */}
          <path d="M20 21 L10 8 L26 18Z" fill="url(#tail1)" />
          {/* Tail fin bottom */}
          <path d="M20 21 L14 32 L26 24Z" fill="#b45309" />
          {/* Window dots */}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <circle key={i} cx={46 + i * 5.5} cy={19.5} r={1.2} fill="white" fillOpacity={0.7} />
          ))}
          {/* Engine under wing */}
          <ellipse cx="35" cy="26" rx="4" ry="2.5" fill="#92400e" />
          <ellipse cx="35" cy="16" rx="4" ry="2.5" fill="#92400e" />

          {/* ═══ FIFA 2026 TEXT on fuselage ═══ */}
          <text x="44" y="24.5" fontSize="5.5" fontWeight="900" fill="#f59e0b" fontFamily="Arial, sans-serif" letterSpacing="0.5">
            FIFA 2026
          </text>

          <defs>
            <linearGradient id="fuse" x1="18" y1="14" x2="86" y2="28">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="50%" stopColor="#f0f0f0" />
              <stop offset="100%" stopColor="#e8e8e8" />
            </linearGradient>
            <linearGradient id="wing1" x1="24" y1="5" x2="56" y2="21">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="wing2" x1="24" y1="37" x2="56" y2="21">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="tail1" x1="10" y1="8" x2="26" y2="21">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ═══════ SMOKE / EXHAUST TRAIL on runway ═══════ */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`smoke-${i}`}
          className="absolute rounded-full bg-white/10"
          style={{ width: 6 + i * 2, height: 6 + i * 2 }}
          animate={{
            x: [-40 + i * 15, -60 + i * 10],
            y: [125, 120 + i * 2],
            opacity: [0, 0.3, 0],
            scale: [0.5, 1.5, 2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 2 + i * 0.2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ═══════ LANDING LIGHTS (flash as plane goes) ═══════ */}
      <motion.div
        className="absolute bottom-[28px] left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-amber-400/40 blur-sm"
        animate={{
          opacity: [0, 0.6, 0.8, 0.3, 0],
          x: [-80, -20, 40, 120, 200],
        }}
        transition={{
          duration: LOOP_DURATION,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.45, 0.6, 0.8],
        }}
      />

      {/* ═══════ "ANNA TRAVEL AGENCY" on terminal building ═══════ */}
      <div className="absolute top-3 right-4 z-10">
        <div className="bg-[#1a1a3a]/80 border border-white/10 rounded px-2 py-1">
          <span className="text-[6px] tracking-widest text-amber-400/80 font-bold uppercase">
            Anna Travel Agency
          </span>
        </div>
      </div>

      {/* ═══════ CONTROL TOWER ═══════ */}
      <div className="absolute bottom-[38px] right-[20px]">
        {/* Tower body */}
        <div className="w-[6px] h-[20px] bg-gradient-to-b from-gray-400 to-gray-600 mx-auto" />
        {/* Tower top */}
        <div className="w-[14px] h-[6px] bg-gradient-to-b from-green-400/60 to-green-600/40 rounded-t -mt-[1px] -ml-[4px] border border-green-400/30" />
        {/* Beacon */}
        <motion.div
          className="w-[3px] h-[3px] bg-red-500 rounded-full mx-auto -mt-[7px] ml-[1px]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      {/* ═══════ SMALL BUILDINGS SILHOUETTE ═══════ */}
      <div className="absolute bottom-[38px] left-[12px] flex gap-[2px] items-end">
        <div className="w-[8px] h-[10px] bg-[#1a1a35] rounded-t-sm" />
        <div className="w-[12px] h-[14px] bg-[#1a1a35] rounded-t-sm" />
        <div className="w-[6px] h-[8px] bg-[#1a1a35] rounded-t-sm" />
      </div>
    </div>
  );
}
