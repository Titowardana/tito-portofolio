"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDownIcon } from "@/components/ui/Icons";

const TYPEWRITER_TEXT = "MY DIGITAL SPACE";
const TYPEWRITER_SPEED = 45;

/* ─── Typewriter ─── */

function useTypewriter(start: boolean) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!start || doneRef.current) return;
    doneRef.current = true;

    let i = 0;
    let then = performance.now();

    function tick(now: number) {
      if (now - then >= TYPEWRITER_SPEED) {
        i++;
        setDisplayed(TYPEWRITER_TEXT.slice(0, i));
        then = now;
      }
      if (i < TYPEWRITER_TEXT.length) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start]);

  return displayed;
}

/* ─── Reduced motion ─── */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setTimeout(() => setReduced(mq.matches), 0);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ─── Timelines ─── */

const NORMAL_TIMELINE = [
  { stage: 1, delay: 200 },
  { stage: 2, delay: 450 },
  { stage: 3, delay: 750 },
  { stage: 4, delay: 1350 },
  { stage: 5, delay: 1650 },
  { stage: 6, delay: 2200 },
] as const;

const REDUCED_TIMELINE = [
  { stage: 1, delay: 50 },
  { stage: 2, delay: 100 },
  { stage: 3, delay: 150 },
  { stage: 4, delay: 200 },
  { stage: 5, delay: 250 },
  { stage: 6, delay: 400 },
] as const;

/* ─── Component ─── */

export default function PortfolioIntro() {
  const [visible, setVisible] = useState(true);
  const [skipExit, setSkipExit] = useState(false);
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const seen = sessionStorage.getItem("portfolio-intro-seen");
    if (seen === "true") {
      document.body.style.overflow = "";
      setTimeout(() => setSkipExit(true), 0);
      setTimeout(() => setVisible(false), 0);
      return;
    }

    document.body.style.overflow = "hidden";

    const timeline = reduced ? REDUCED_TIMELINE : NORMAL_TIMELINE;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const { stage: s, delay } of timeline) {
      timers.push(setTimeout(() => setStage(s), delay));
    }

    // Start exit after last stage → triggers AnimatePresence exit animation
    const exitDelay = (timeline[timeline.length - 1]?.delay ?? 2200) + (reduced ? 100 : 650);
    timers.push(setTimeout(() => setVisible(false), exitDelay));

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  const typewriterText = useTypewriter(stage >= 3);

  const handleExitComplete = useCallback(() => {
    document.body.style.overflow = "";
    try {
      sessionStorage.setItem("portfolio-intro-seen", "true");
    } catch {
      /* noop */
    }
  }, []);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="portfolio-intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "var(--background, #0c1324)" }}
          exit={skipExit ? undefined : { y: "-100%" }}
          transition={{ duration: reduced ? 0.3 : 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* Radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Stage 1: WELCOME label */}
            {stage >= 1 && (
              <motion.span
                className="font-mono text-xs tracking-[0.2em] text-text-muted mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                WELCOME
              </motion.span>
            )}

            {/* Stage 2: WELCOME TO */}
            <h1 className="font-heading text-[clamp(1.75rem,5vw,3.5rem)] font-bold tracking-tight text-text-primary uppercase leading-tight">
              {stage >= 2 && (
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  WELCOME TO
                </motion.span>
              )}
            </h1>

            {/* Stage 3: MY DIGITAL SPACE (typewriter) */}
            <div
              className="font-heading text-[clamp(1.75rem,5vw,3.5rem)] font-bold tracking-tight mt-1 h-[1.2em]"
              aria-label={TYPEWRITER_TEXT}
            >
              {stage >= 3 && (
                <span
                  className="text-secondary"
                  style={{
                    textShadow: "0 0 20px rgba(76, 215, 246, 0.15)",
                  }}
                >
                  {typewriterText}
                  {!reduced && stage >= 3 && typewriterText.length < TYPEWRITER_TEXT.length && (
                    <span
                      className="inline-block w-[2px] h-[1em] bg-secondary/70 ml-0.5 align-middle animate-pulse"
                      aria-hidden
                    />
                  )}
                </span>
              )}
              {stage < 3 && (
                <span className="invisible" aria-hidden>
                  {TYPEWRITER_TEXT}
                </span>
              )}
            </div>

            {/* Stage 4: supporting text + accent line */}
            {stage >= 4 && (
              <motion.div
                className="flex flex-col items-center mt-8 sm:mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-sm sm:text-base text-text-secondary max-w-sm mx-auto leading-relaxed px-4">
                  A collection of ideas, experiences, and meaningful digital work.
                </p>
                <motion.div
                  className="h-px bg-secondary/70 mt-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ originX: 0.5, width: "64px" }}
                />
              </motion.div>
            )}

            {/* Stage 5: bottom indicator */}
            {stage >= 5 && (
              <motion.div
                className="flex flex-col items-center gap-3 mt-10 sm:mt-12"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase">
                  ENTERING PORTFOLIO
                </span>
                {!reduced ? (
                  <motion.span
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDownIcon className="text-text-muted" size={18} />
                  </motion.span>
                ) : (
                  <ChevronDownIcon className="text-text-muted" size={18} />
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
