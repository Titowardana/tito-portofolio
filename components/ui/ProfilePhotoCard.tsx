"use client";

import { useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface ProfilePhotoCardProps {
  src: string;
  alt: string;
  primaryRole: string;
  isAvailable: boolean;
  onRevealComplete?: () => void;
  reducedMotion: boolean;
}

export default function ProfilePhotoCard({
  src,
  alt,
  primaryRole,
  isAvailable,
  onRevealComplete,
  reducedMotion,
}: ProfilePhotoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // floatWrapRef: GSAP floats this wrapper (y only); keeps drag/tilt separation clean
  const floatWrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const hasImage = Boolean(src);

  const gsapRef = useRef<typeof import("gsap").gsap | null>(null);

  const isDraggingRef = useRef(false);

  const tiltXRef = useRef<((v: number) => void) | null>(null);
  const tiltYRef = useRef<((v: number) => void) | null>(null);
  const moveXRef = useRef<((v: number) => void) | null>(null);
  const moveYRef = useRef<((v: number) => void) | null>(null);

  const isMobile = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false,
  );

  useEffect(() => {
    if (reducedMotion) {
      if (imageWrapperRef.current) {
        imageWrapperRef.current.style.clipPath = "inset(0% 0% 0% 0%)";
        imageWrapperRef.current.style.transform = "scale(1)";
      }
      if (glowRef.current) glowRef.current.style.opacity = "0.65";
      if (badgeRef.current) {
        badgeRef.current.style.opacity = "1";
        badgeRef.current.style.transform = "translateY(0)";
      }
      onRevealComplete?.();
      return;
    }

    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      gsapRef.current = gsap;

      const card = cardRef.current;
      const imgWrapper = imageWrapperRef.current;
      const floatWrap = floatWrapRef.current;

      if (card) {
        tiltXRef.current = gsap.quickTo(card, "rotateX", {
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        tiltYRef.current = gsap.quickTo(card, "rotateY", {
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (imgWrapper) {
        moveXRef.current = gsap.quickTo(imgWrapper, "x", {
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        moveYRef.current = gsap.quickTo(imgWrapper, "y", {
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      ctx = gsap.context(() => {
        // ── Reveal timeline ──────────────────────────────────
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.to(glowRef.current, {
              opacity: 0.65,
              duration: 0.8,
              ease: "power2.out",
            });
            gsap.to(badgeRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            });

            // ── Floating loop (starts after reveal) ──────────
            // Target: floatWrapRef — GSAP owns Y on this element only
            if (floatWrap) {
              gsap.to(floatWrap, {
                y: -10,
                duration: 2.4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            }

            onRevealComplete?.();
          },
        });

        tl.fromTo(
          imageWrapperRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power3.inOut",
          },
        );

        tl.fromTo(
          imageWrapperRef.current,
          { scale: 1.06 },
          { scale: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        );
      }, containerRef);
    };

    init();

    return () => {
      ctx?.revert();
      tiltXRef.current = null;
      tiltYRef.current = null;
      moveXRef.current = null;
      moveYRef.current = null;
    };
  }, [reducedMotion, onRevealComplete, src]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      if (e.pointerType === "touch" || isDraggingRef.current) return;

      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      tiltXRef.current?.(-py * 8);
      tiltYRef.current?.(px * 8);
      moveXRef.current?.(-px * 16);
      moveYRef.current?.(-py * 16);
    },
    [reducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    if (reducedMotion) return;

    const gsap = gsapRef.current;
    if (gsap) {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
      if (imageWrapperRef.current) {
        gsap.to(imageWrapperRef.current, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center w-full select-none"
    >
      {/* Very subtle depth shadow — no colored glow */}
      <div
        ref={glowRef}
        className="absolute -inset-8 rounded-full bg-surface/40 blur-3xl pointer-events-none opacity-0 transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Perspective wrapper */}
      <div
        className="w-full max-w-[300px] sm:max-w-[320px] lg:max-w-[330px] aspect-[4/5] relative"
        style={{ perspective: "1000px" }}
      >
        {/* Subtle offset back frame — purely decorative, sits behind everything */}
        <div
          className="absolute inset-0 rounded-2xl border border-primary/15 bg-primary/5 pointer-events-none"
          style={{
            transform: "translate(8px, 10px)",
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* Motion wrapper — owns drag + press scale */}
        <motion.div
          drag={!isMobile && !reducedMotion}
          dragConstraints={{ left: -28, right: 28, top: -24, bottom: 24 }}
          dragElastic={0.12}
          dragSnapToOrigin
          whileTap={reducedMotion ? {} : { scale: 0.97 }}
          onDragStart={() => { isDraggingRef.current = true; }}
          onDragEnd={() => { isDraggingRef.current = false; }}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
          style={{ touchAction: isMobile ? "pan-y" : "none", zIndex: 1 }}
        >
          {/* Float wrapper — GSAP owns Y translation here for floating loop */}
          <div ref={floatWrapRef} className="relative w-full h-full">
            {/* Card — GSAP owns rotateX / rotateY for tilt */}
            <div
              ref={cardRef}
              className="relative w-full h-full overflow-hidden rounded-2xl"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              {/* Image layer — GSAP owns clipPath + scale reveal, then X/Y parallax */}
              <div
                ref={imageWrapperRef}
                className="absolute inset-0 overflow-hidden rounded-2xl"
                style={{
                  clipPath: reducedMotion ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                  willChange: "transform, clip-path",
                }}
              >
                {hasImage ? (
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    style={{
                      objectPosition: "66% 48%",
                      transform: "scale(1.42)",
                      transformOrigin: "66% 48%",
                    }}
                    priority
                    draggable={false}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/10" />
                )}
              </div>

              {/* Fallback initials */}
              {!hasImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-5xl font-bold text-text-primary/20">
                    TPW
                  </span>
                </div>
              )}

              {/* Subtle color-blend overlays — tone & integration with dark theme */}
              <div className="absolute inset-0 pointer-events-none bg-[var(--background)]/20 mix-blend-color" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background-dark/40 via-transparent to-transparent" />

              {/* ── Badge — integrated inside photo card, bottom-right ── */}
              <div
                ref={badgeRef}
                className="absolute bottom-4 right-4 rounded-md px-2.5 py-1 text-[10px] font-mono text-text-primary bg-[var(--background-dark)]/92 border border-border-subtle opacity-0 translate-y-2 transition-all duration-300 flex items-center gap-1.5 pointer-events-none"
              >
                {isAvailable ? (
                  <>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
                    </span>
                    <span>Open to Work</span>
                  </>
                ) : (
                  <span>{primaryRole || "Developer"}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
