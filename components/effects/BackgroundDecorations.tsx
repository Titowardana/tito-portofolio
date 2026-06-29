"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function BackgroundDecorations() {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
      {/* Dynamic Animated Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] bg-grid"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent)",
          WebkitMaskImage: "-webkit-linear-gradient(top, black 0%, black 80%, transparent)"
        }}
      />

      {/* Decorative Orbs */}
      {!reduceMotion && (
        <>
          {/* Top Right Primary Blue Orb */}
          <motion.div
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-[15%] -right-[5%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[130px] mix-blend-screen opacity-70 dark:opacity-60"
          />

          {/* Bottom Left Cyan Accent Orb */}
          <motion.div
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 40, -40, 0],
              scale: [1, 1.3, 0.8, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
              delay: 1,
            }}
            className="absolute top-[40%] -left-[10%] w-[45%] h-[45%] rounded-full bg-secondary/25 blur-[140px] mix-blend-screen opacity-60 dark:opacity-50"
          />

          {/* Bottom Right Deep Blue Orb */}
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, 50, -30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-[20%] right-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px] mix-blend-screen opacity-50 dark:opacity-40"
          />

          {/* Center subtle glow */}
          <motion.div
            animate={{
              opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] mix-blend-screen"
          />
        </>
      )}

      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
