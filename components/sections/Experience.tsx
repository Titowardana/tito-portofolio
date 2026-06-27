"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Experience as ExperienceType } from "@/data/experiences";
import SectionTitle from "@/components/ui/SectionTitle";

const typeLabels: Record<ExperienceType["type"], string> = {
  education: "Education",
  internship: "Internship",
  work: "Work",
  project: "Project",
  organization: "Organization",
};

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Typewriter — only for short key text ── */

function TypewriterText({
  text,
  start,
  delay = 0,
  speed = 32,
}: {
  text: string;
  start: boolean;
  delay?: number;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const shouldReduce = useReducedMotion();
  const doneRef = useRef(false);

  useEffect(() => {
    if (shouldReduce) {
      setTimeout(() => { setDisplayed(text); setIsTyping(false); }, 0);
      return;
    }
    if (!start) return;
    if (doneRef.current) return;
    doneRef.current = true;

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setIsTyping(false); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [start, delay, text, speed, shouldReduce]);

  return (
    <>
      {displayed}
      {isTyping && (
        <span className="inline-block w-[2px] h-[1.1em] bg-primary/60 ml-0.5 align-text-bottom animate-pulse" />
      )}
    </>
  );
}

/* ── Fade-in block for longer content ── */

function RevealBlock({
  start,
  delay = 0,
  children,
  className,
}: {
  start: boolean;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [start, delay]);

  return (
    <div
      className={`${className ?? ""} transition-all duration-500 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {children}
    </div>
  );
}

/* ── Single experience item ── */

function ExperienceItem({
  experience,
  startTyping,
}: {
  experience: ExperienceType;
  startTyping: boolean;
}) {
  const hasDate = experience.startDate || experience.endDate;
  const dateStr = [experience.startDate, experience.endDate].filter(Boolean).join(" – ");

  return (
    <div className="group">
      {/* Metadata row: date + type + current badge */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
        {hasDate && (
          <span className="font-mono text-xs text-primary/80">
            {dateStr}
          </span>
        )}
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          {typeLabels[experience.type]}
        </span>
        {experience.isCurrent && (
          <span className="inline-flex items-center gap-1 text-[10px] text-primary/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Current
          </span>
        )}
      </div>

      {/* Title — typewriter */}
      <h3 className="font-heading text-base font-bold text-text-primary leading-snug group-hover:text-primary transition-colors duration-200">
        <TypewriterText text={experience.title} start={startTyping} delay={0} />
      </h3>

      {/* Institution — typewriter, overlaps with title */}
      <p className="mt-0.5 text-sm font-medium text-text-primary">
        <TypewriterText text={experience.institution} start={startTyping} delay={300} speed={28} />
      </p>

      {/* Location — reveal */}
      {experience.location && (
        <RevealBlock start={startTyping} delay={800}>
          <p className="mt-0.5 text-xs text-text-muted">{experience.location}</p>
        </RevealBlock>
      )}

      {/* Description — reveal */}
      {experience.description && (
        <RevealBlock start={startTyping} delay={900} className="mt-3">
          <p className="text-sm leading-[1.75] text-text-secondary">{experience.description}</p>
        </RevealBlock>
      )}

      {/* Responsibilities — reveal */}
      {experience.responsibilities.length > 0 && (
        <RevealBlock start={startTyping} delay={1000} className="mt-3">
          <ul className="space-y-1.5">
            {experience.responsibilities.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-text-muted" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </RevealBlock>
      )}

      {/* Technologies — reveal */}
      {experience.technologies.length > 0 && (
        <RevealBlock start={startTyping} delay={1100} className="mt-3">
          <p className="text-[11px] text-text-muted leading-relaxed">
            {experience.technologies.join(" · ")}
          </p>
        </RevealBlock>
      )}
    </div>
  );
}

/* ── Desktop node with connector ── */

function TimelineNode({ isLeft, active }: { isLeft: boolean; active: boolean }) {
  return (
    <div className="relative flex justify-center pt-[6px]">
      {/* Node dot */}
      <div
        className={`z-10 h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500 ${
          active
            ? "border-primary/60 bg-primary/10"
            : "border-border-subtle bg-[var(--background-dark)]"
        }`}
        aria-hidden
      />
      {/* Connector line to card */}
      <div
        className={`absolute top-[11px] h-px w-6 bg-gradient-to-r ${
          isLeft
            ? "right-0 from-white/[0.06] to-transparent"
            : "left-0 from-transparent to-white/[0.06]"
        }`}
        aria-hidden
      />
    </div>
  );
}

/* ── Single timeline card ── */

function TimelineCard({
  exp,
  isLeft,
  index,
}: {
  exp: ExperienceType;
  isLeft: boolean;
  index: number;
}) {
  const [inView, setInView] = useState(false);
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dir = isLeft ? -1 : 1;

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? {} : { opacity: 0, x: dir * 28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease, delay: index * 0.07 }}
      className="relative"
    >
      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2rem_1fr] lg:items-start">
        {/* Left content (even) / spacer (odd) */}
        <div className={isLeft ? "pr-6 text-left" : ""}>
          {isLeft && <ExperienceItem experience={exp} startTyping={inView} />}
        </div>

        {/* Timeline column */}
        <TimelineNode isLeft={isLeft} active={inView} />

        {/* Right content (odd) / spacer (even) */}
        <div className={!isLeft ? "pl-6 text-left" : ""}>
          {!isLeft && <ExperienceItem experience={exp} startTyping={inView} />}
        </div>
      </div>

      {/* ── Mobile: single column, left timeline ── */}
      <div className="lg:hidden">
        <div className="relative pl-9">
          {/* Mobile node */}
          <div
            className={`absolute left-0 top-[6px] z-10 h-3 w-3 rounded-full border-2 transition-colors duration-500 ${
              inView
                ? "border-primary/60 bg-primary/10"
                : "border-border-subtle bg-[var(--background-dark)]"
            }`}
            aria-hidden
          />
          <ExperienceItem experience={exp} startTyping={inView} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section ── */

export default function Experience({ experiences }: { experiences: ExperienceType[] }) {
  const activeExperiences = experiences
    .filter((e) => e.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="experience" className="relative border-t border-border bg-[var(--background-dark)] scroll-mt-24">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-surface-light/20 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0, y: 22 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
          }}
        >
          <SectionTitle
            title="Experience & Education"
            subtitle="My academic and professional journey"
          />
        </motion.div>

        <div className="relative">
          {/* Desktop: center timeline line */}
          <div
            className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent hidden lg:block"
            aria-hidden
          />

          {/* Mobile: left timeline line */}
          <div
            className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 to-transparent lg:hidden"
            aria-hidden
          />

          <div className="space-y-10 lg:space-y-12">
            {activeExperiences.map((exp, i) => (
              <TimelineCard
                key={exp.id}
                exp={exp}
                isLeft={i % 2 === 0}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
