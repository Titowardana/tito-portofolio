"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { Project } from "@/data/projects";
import SectionTitle from "@/components/ui/SectionTitle";
import { ProjectCardLarge, ProjectCardSmall } from "@/components/ui/ProjectCard";

export default function Projects({ projects }: { projects: Project[] }) {
  const [showAll, setShowAll] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Max featured shown in the 2-column hero grid
  const FEATURED_LIMIT = 2;
  // How many "other" projects to show initially
  const OTHER_INITIAL = 3;

  const activeProjects = projects
    .filter((p) => p.active)
    .sort((a, b) => a.order - b.order);

  // Top 2 featured always shown in large grid
  const featuredProjects = activeProjects.filter((p) => p.featured).slice(0, FEATURED_LIMIT);

  // Everything else: featured overflow + non-featured, sorted by order
  const allOther = [
    ...activeProjects.filter((p) => p.featured).slice(FEATURED_LIMIT),
    ...activeProjects.filter((p) => !p.featured),
  ];

  // Shown other: limited initially, all on expand
  const visibleOther = showAll ? allOther : allOther.slice(0, OTHER_INITIAL);
  const hasMore = allOther.length > OTHER_INITIAL;

  const ease = [0.22, 1, 0.36, 1] as const;
  const viewport = { once: true, amount: 0.08 };

  const fadeUp = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease },
        },
      };

  const stagger = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
      };

  // Animation for cards entering via toggle (not scroll)
  const cardEnter = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease,
        delay: shouldReduceMotion ? 0 : i * 0.07,
      },
    }),
    exit: {
      opacity: 0,
      y: 12,
      scale: 0.97,
      transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const },
    },
  };

  // Restore scroll position when returning from project detail
  useEffect(() => {
    const storedSlug = sessionStorage.getItem("returnToProject");
    if (!storedSlug) return;

    sessionStorage.removeItem("returnToProject");

    // Determine if project is beyond initial visible set — use projects prop directly
    const featuredAfterLimit = activeProjects.filter((p) => p.featured).slice(FEATURED_LIMIT);
    const nonFeatured = activeProjects.filter((p) => !p.featured);
    const idx = [...featuredAfterLimit, ...nonFeatured].findIndex((p) => p.slug === storedSlug);
    const needsExpand = idx >= OTHER_INITIAL;

    // Defer setState + scroll to avoid cascading-render lint
    setTimeout(() => {
      if (needsExpand) {
        setShowAll(true);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document
            .getElementById("project-" + storedSlug)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }, 0);
    // Only runs once on mount — reads sessionStorage for scroll restoration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="projects" className="relative border-t border-border scroll-mt-24">
      <div aria-hidden className="pointer-events-none absolute -left-1/4 top-1/4 h-80 w-80 rounded-full bg-primary/[0.04] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 z-10">

        {/* Section heading */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}
        >
          <SectionTitle
            title="Featured Projects"
            subtitle="A selection of my recent work"
          />
        </motion.div>

        {/* Featured — 2-column large cards, scroll-triggered once */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}
          className="grid gap-6 md:grid-cols-2"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.slug} id={"project-" + project.slug} variants={fadeUp} className="h-full scroll-mt-28">
              <ProjectCardLarge project={project} />
            </motion.div>
          ))}
        </motion.div>

        {/* Other Projects section */}
        {allOther.length > 0 && (
          <>
            <motion.div
              initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}
              className="relative my-12 flex items-center gap-4"
            >
              <div className="flex-1 h-px bg-surface/50" />
              <span className="text-xs text-text-muted">Other Projects</span>
              <div className="flex-1 h-px bg-surface/50" />
            </motion.div>

            {/* Grid — always renders, AnimatePresence handles enter/exit of hidden cards */}
            <div id="other-projects-grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Initial cards — scroll-triggered once */}
              {visibleOther.slice(0, OTHER_INITIAL).map((project) => (
                <motion.div
                  key={project.slug}
                  id={"project-" + project.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.08 }}
                  variants={fadeUp}
                  className="h-full scroll-mt-28"
                >
                  <ProjectCardSmall project={project} />
                </motion.div>
              ))}

              {/* Extra cards — AnimatePresence for smooth enter/exit on toggle */}
              <AnimatePresence mode="sync">
                {showAll &&
                  allOther.slice(OTHER_INITIAL).map((project, i) => (
                    <motion.div
                      key={project.slug}
                      id={"project-" + project.slug}
                      custom={i}
                      variants={cardEnter}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-full scroll-mt-28"
                    >
                      <ProjectCardSmall project={project} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Toggle button */}
        {hasMore && (
          <motion.div
            initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}
            className="mt-14 flex justify-center"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              aria-expanded={showAll}
              aria-controls="other-projects-grid"
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
                : `Show all projects (${allOther.length})`}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
