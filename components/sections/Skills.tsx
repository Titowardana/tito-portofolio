"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Skill, SkillCategory } from "@/data/skills";
import SectionTitle from "@/components/ui/SectionTitle";

const categoryLabels: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  programming: "Programming & AI",
  tools: "Tools",
  design: "Design",
  networking: "Networking",
  cybersecurity: "Cybersecurity",
};

/** Minimal SVG icons — one per category, all 14×14 stroke-based */
const CategoryIcon = ({ category }: { category: SkillCategory }) => {
  const props = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (category) {
    case "frontend":
      // Browser / layout
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "backend":
      // Server stack
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="5" rx="1" />
          <rect x="2" y="10" width="20" height="5" rx="1" />
          <circle cx="6" cy="5.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="6" cy="12.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "database":
      // Cylinder
      return (
        <svg {...props}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case "programming":
      // Code brackets
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "tools":
      // Wrench / settings
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "design":
      // Pen tool / vector
      return (
        <svg {...props}>
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case "networking":
      // Network nodes
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <path d="M12 7v4M8.5 17.5l3-4M15.5 17.5l-3-4" />
        </svg>
      );
    case "cybersecurity":
      // Shield
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
};

export default function Skills({ skills }: { skills: Skill[] }) {
  const shouldReduceMotion = useReducedMotion();

  const activeSkills = skills
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  const grouped = activeSkills.reduce<Partial<Record<SkillCategory, typeof activeSkills>>>(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category]!.push(skill);
      return acc;
    },
    {},
  );

  // Only render categories that have at least one skill
  const categories = (Object.keys(grouped) as SkillCategory[]).filter(
    (c) => (grouped[c]?.length ?? 0) > 0,
  );

  if (categories.length === 0) return null;

  const ease = [0.22, 1, 0.36, 1] as const;
  const transition = { duration: 0.5, ease };

  const containerVariant = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.04 },
        },
      };

  const groupVariant = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition },
      };

  const itemVariant = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: -6 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.26, ease },
        },
      };

  return (
    <section id="skills" className="relative border-t border-border overflow-hidden scroll-mt-24">
      {/* Ambient — decorative only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-1/3 h-[300px] w-[300px] rounded-full bg-primary/[0.04] blur-[120px]"
      />

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={transition}
        >
          <SectionTitle
            title="Technical Stack"
            subtitle="Technologies and tools I work with"
          />
        </motion.div>

        {/*
          CSS Columns (masonry-style): cards flow naturally across columns,
          short cards don't leave empty gaps. break-inside-avoid keeps each
          card intact. No fixed row height.
          Mobile: 1 col | Tablet (sm): 2 col | Desktop (lg): 3 col
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={containerVariant}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        >
          {categories.map((category) => {
            const categorySkills = grouped[category]!;
            const count = categorySkills.length;

            return (
              <motion.div
                key={category}
                variants={groupVariant}
                className={[
                  // break-inside-avoid keeps the card in one column
                  "group mb-4 break-inside-avoid",
                  "rounded-xl border border-border bg-surface/50",
                  "px-4 py-4",
                  // Hover: only color/border change — no translateY to avoid column reflow
                  "transition-colors duration-250",
                  "hover:border-border-subtle hover:bg-surface/75",
                  // Focus-visible for keyboard navigation
                  "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
                ].join(" ")}
              >
                {/* ── Card header ── */}
                <div className="mb-3 flex h-7 items-center gap-2">
                  {/* Category icon — SVG, no emoji */}
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface/50 text-text-secondary transition-colors duration-250 group-hover:bg-surface/75 group-hover:text-text-primary"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <CategoryIcon category={category} />
                  </span>

                  {/* Category label */}
                  <h3 className="font-heading text-[10px] font-semibold tracking-[0.13em] uppercase text-text-secondary transition-colors duration-250 group-hover:text-text-primary truncate">
                    {categoryLabels[category]}
                  </h3>

                  {/* Skill count — derived from rendered data, not hard-coded */}
                  <span
                    className="ml-auto shrink-0 font-mono text-[10px] text-text-muted transition-colors duration-250 group-hover:text-text-secondary"
                    aria-label={`${count} skill${count !== 1 ? "s" : ""}`}
                  >
                    {count}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="mb-3 h-px bg-surface/50 transition-colors duration-250 group-hover:bg-surface/80"
                  aria-hidden="true"
                />

                {/* ── Skill list ── */}
                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
                  variants={
                    shouldReduceMotion
                      ? undefined
                      : {
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.04, delayChildren: 0.06 },
                          },
                        }
                  }
                  className="space-y-0"
                  role="list"
                >
                  {categorySkills.map((skill) => (
                    <motion.li
                      key={skill.id}
                      variants={itemVariant}
                      role="listitem"
                      className={[
                        "group/skill relative flex cursor-default items-center gap-2",
                        "rounded pl-2 pr-3 py-[5px]",
                        "transition-colors duration-150",
                        "hover:bg-[var(--color-input)]",
                      ].join(" ")}
                    >
                      {/* Left accent bar — visible on skill row hover */}
                      <span
                        className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-full bg-primary/50 transition-all duration-200 group-hover/skill:h-[55%]"
                        aria-hidden="true"
                      />

                      {/* Skill name */}
                      <span
                        className={[
                          "flex-1 min-w-0 pl-1 text-[13px] leading-[1.5] truncate",
                          "transition-colors duration-150 group-hover/skill:text-text-primary",
                          skill.featured
                            ? "font-medium text-text-primary"
                            : "text-text-primary",       // raised from slate-400 → slate-300 for readability
                        ].join(" ")}
                      >
                        {/* Render emoji icon from admin if set */}
                        {skill.icon && /^\p{Emoji}/u.test(skill.icon.trim()) && (
                          <span className="mr-1.5 text-xs" aria-hidden="true">
                            {skill.icon.trim()}
                          </span>
                        )}
                        {skill.name}
                      </span>

                      {/* "Learning" badge — only shown when level === "learning".
                          Data-driven: if admin changes level, badge disappears automatically. */}
                      {skill.level === "learning" && (
                        <span
                          className={[
                            "shrink-0 rounded-[3px] px-[5px] py-[2px]",
                            "text-[10px] font-medium leading-none",  // up from 9px → 10px
                            "text-text-secondary",                         // up from slate-500 → slate-400
                            "ring-1 ring-white/[0.10]",               // slightly more visible ring
                            "transition-colors duration-150",
                            "group-hover/skill:text-text-primary group-hover/skill:ring-white/[0.16]",
                          ].join(" ")}
                        >
                          Learning
                        </span>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
