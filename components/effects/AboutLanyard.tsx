'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import Lanyard from '@/components/effects/Lanyard';
import './Lanyard.css';

export default function AboutLanyard({ reducedMotion, frontImage }: { reducedMotion: boolean; frontImage?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.classList.contains("light"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const isInView     = useInView(containerRef, { once: true, amount: 0.05 });
  const [shouldRender, setShouldRender] = useState(false);
  const [contextLost, setContextLost]   = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setShouldRender(true), 150);
    return () => clearTimeout(t);
  }, [isInView]);

  const DEFAULT_BACK = useMemo(() => {
    if (typeof document === 'undefined') return undefined;
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 364;
    const ctx = c.getContext('2d');
    if (!ctx) return undefined;
    const g = ctx.createLinearGradient(0, 0, 256, 364);
    g.addColorStop(0, '#0a0f22');
    g.addColorStop(0.5, '#0f1729');
    g.addColorStop(1, '#131b36');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 364);
    ctx.strokeStyle = 'rgba(37,99,235,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect?.(12, 12, 232, 340, 12);
    ctx.stroke();
    return c.toDataURL();
  }, []);

  if (reducedMotion || contextLost) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center w-full h-full"
      >
        <div className="relative w-[220px] h-[293px] rounded-2xl overflow-hidden border-2 border-border shadow-2xl shadow-black/40 bg-[var(--color-input)]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="lanyard-wrapper relative w-full h-full"
      style={{ touchAction: 'pan-y' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/12 blur-[60px]"
      />
      {shouldRender ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Lanyard
            gravity={[0, -40, 0]}
            frontImage={frontImage || "/images/profile/tito-profile.jpeg"}
            backImage={DEFAULT_BACK}
            imageFit="cover"
            isLight={isLight}
            onContextLost={() => setContextLost(true)}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-input)] w-[220px] h-[293px]" />
        </div>
      )}
    </div>
  );
}
