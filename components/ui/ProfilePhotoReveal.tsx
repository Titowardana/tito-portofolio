"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

interface ProfilePhotoRevealProps {
  src: string;
  alt: string;
  /** Fired after reveal completes so parent can animate glow */
  onRevealComplete?: () => void;
  reducedMotion?: boolean;
}

const SLICE_COUNT = 5;

export default function ProfilePhotoReveal({
  src,
  alt,
  onRevealComplete,
  reducedMotion = false,
}: ProfilePhotoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasImage = Boolean(src);

  useEffect(() => {
    if (reducedMotion) {
      // Reveal everything immediately
      if (containerRef.current) {
        containerRef.current.style.opacity = "1";
      }
      sliceRefs.current.forEach((el) => {
        if (el) el.style.clipPath = "inset(0% 0% 0% 0%)";
      });
      onRevealComplete?.();
      return;
    }

    // Use a minimal interface since gsap.Context type isn't directly importable
    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => onRevealComplete?.(),
        });

        // Each slice reveals top-to-bottom with a slight stagger
        sliceRefs.current.forEach((el, i) => {
          if (!el) return;
          tl.fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.7,
              ease: "power3.inOut",
            },
            i * 0.08, // stagger offset
          );
        });

        // Subtle zoom-out after all slices complete
        tl.fromTo(
          sliceRefs.current.filter(Boolean),
          { scale: 1.06 },
          { scale: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        );
      }, containerRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, [reducedMotion, onRevealComplete]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      aria-hidden={!hasImage}
    >
      {/* The actual Next/Image rendered once, visually behind slices */}
      {hasImage && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      {/* Slice overlays that reveal the image */}
      <div className="absolute inset-0 flex rounded-2xl overflow-hidden">
        {Array.from({ length: SLICE_COUNT }).map((_, i) => {
          const pct = 100 / SLICE_COUNT;
          const left = `${i * pct}%`;
          const width = `${pct}%`;

          return (
            <div
              key={i}
              ref={(el) => {
                sliceRefs.current[i] = el;
              }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left,
                width,
                clipPath: reducedMotion
                  ? "inset(0% 0% 0% 0%)"
                  : "inset(0% 0% 100% 0%)",
                overflow: "hidden",
              }}
              aria-hidden="true"
            >
              {hasImage ? (
                /* Each slice shows the same image at the correct horizontal offset */
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `-${i * 100}%`,
                    width: `${SLICE_COUNT * 100}%`,
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    aria-hidden="true"
                  />
                </div>
              ) : (
                /* Fallback gradient slice */
                <div
                  style={{ position: "absolute", inset: 0 }}
                  className="bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/10"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Fallback initials if no image */}
      {!hasImage && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/10">
          <span className="font-heading text-5xl font-bold text-text-primary/20">
            TPW
          </span>
        </div>
      )}
    </div>
  );
}
