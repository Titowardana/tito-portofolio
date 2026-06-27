"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SplashCursor = dynamic(
  () => import("@/components/effects/SplashCursor"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function SplashCursorBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMedia = window.matchMedia("(max-width: 768px)");

    const updatePreference = () => {
      setReduceMotion(motionMedia.matches);
      setIsMobile(mobileMedia.matches);
    };

    updatePreference();
    motionMedia.addEventListener("change", updatePreference);
    mobileMedia.addEventListener("change", updatePreference);

    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "300px" },
    );
    if (el) observer.observe(el);

    return () => {
      motionMedia.removeEventListener("change", updatePreference);
      mobileMedia.removeEventListener("change", updatePreference);
      observer.disconnect();
    };
  }, []);

  if (reduceMotion || !isInView) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden opacity-45"
    >
      <SplashCursor
        SIM_RESOLUTION={isMobile ? 64 : 128}
        DYE_RESOLUTION={isMobile ? 512 : 1024}
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.13}
        SPLAT_FORCE={isMobile ? 2000 : 3500}
        COLOR_UPDATE_SPEED={6}
      />
    </div>
  );
}
