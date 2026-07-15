import { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  disableTilt?: boolean;
}

export default function Card3D({ children, className = '', glowColor = 'rgba(245, 158, 11, 0.15)', disableTilt = false }: Card3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (disableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -8);
    setRotateY((x - 0.5) * 8);
    setGlowPos({ x: x * 100, y: y * 100 });
  }, [disableTilt]);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlowPos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
      className={className}
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 60%)`,
        }}
        className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}
