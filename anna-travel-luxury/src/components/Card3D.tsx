import type { ReactNode } from 'react';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  disableTilt?: boolean;
}

/** Lightweight card surface. Avoiding per-pointer React state keeps filters and taps responsive. */
export default function Card3D({ children, className = '', glowColor = 'rgba(245, 158, 11, 0.15)' }: Card3DProps) {
  return (
    <div className={className}>
      <div
        style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 60%)` }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1"
      >
        {children}
      </div>
    </div>
  );
}
