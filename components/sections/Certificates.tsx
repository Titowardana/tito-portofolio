"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { Certificate } from "@/data/certificates";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  CertificateCardFeatured,
  CertificateCardSmall,
} from "@/components/ui/CertificateCard";

const INITIAL_LIMIT = 3;
const ease = [0.22, 1, 0.36, 1] as const;

export default function Certificates({ certificates }: { certificates: Certificate[] }) {
  const [showAll, setShowAll] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeCertificates = certificates
    .filter((c) => c.active)
    .sort((a, b) => a.order - b.order);

  if (activeCertificates.length === 0) return null;

  const featured = activeCertificates.filter((c) => c.featured);
  const other = activeCertificates.filter((c) => !c.featured);
  const visibleOther = showAll ? other : other.slice(0, INITIAL_LIMIT);
  const hasMore = other.length > INITIAL_LIMIT;

  const fadeUp = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  };

  const cardEnter = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.4, ease, delay: shouldReduceMotion ? 0 : i * 0.06 },
    }),
    exit: {
      opacity: 0, y: 10, scale: 0.97,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
    },
  };

  return (
    <section
      id="certificates"
      className="relative border-t border-border bg-[var(--background-dark)] scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 z-10">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <SectionTitle
            title="Certificates & Achievements"
            subtitle="Professional certifications and accomplishments"
          />
        </motion.div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((cert, i) => (
              <CertificateCardFeatured key={cert.id} certificate={cert} index={i} />
            ))}
          </div>
        )}

        {/* Other */}
        {other.length > 0 && (
          <>
            {/* Divider */}
            {featured.length > 0 && (
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                className="relative my-12 flex items-center gap-4"
              >
                <div className="flex-1 h-px bg-surface/50" />
                <span className="text-xs text-text-muted">More Credentials</span>
                <div className="flex-1 h-px bg-surface/50" />
              </motion.div>
            )}

            <div id="other-certificates-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Initial cards — scroll-triggered */}
              {visibleOther.slice(0, INITIAL_LIMIT).map((cert, i) => (
                <CertificateCardSmall key={cert.id} certificate={cert} index={i} />
              ))}

              {/* Extra cards — toggle-triggered with enter/exit */}
              <AnimatePresence mode="sync">
                {showAll && other.slice(INITIAL_LIMIT).map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    custom={i}
                    variants={cardEnter}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CertificateCardSmall certificate={cert} index={INITIAL_LIMIT + i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Toggle button */}
        {hasMore && (
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            className="mt-12 flex justify-center"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              aria-expanded={showAll}
              aria-controls="other-certificates-grid"
              className="group flex items-center gap-2 border-b border-border pb-0.5 text-sm font-medium text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3, ease }}
                className="inline-flex"
                aria-hidden
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
              {showAll
                ? "Show fewer"
                : `Show all (${other.length})`}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
