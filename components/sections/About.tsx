"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import AboutLanyard from "@/components/effects/AboutLanyard";
import type { Profile } from "@/data/profile";
import type { Project } from "@/data/projects";
import type { Skill } from "@/data/skills";

const INTERESTS = [
  "Web Development",
  "Cybersecurity",
  "AI / Machine Learning",
  "Mobile Apps",
  "Backend Systems",
] as const;

/** Calculate years coding from a fixed start year */
function getYearsCoding(startYear = 2022): string {
  const years = new Date().getFullYear() - startYear;
  return years > 0 ? `${years}+` : "1+";
}

export default function About({
  profile,
  projects,
  skills,
}: {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
}) {
  const shouldReduceMotion = useReducedMotion();

  // ── Realtime stats derived from actual data ──────────────────
  const projectCount = projects.filter((p) => p.active).length;
  const techCount = skills.filter((s) => s.active).length;
  const yearsCoding = getYearsCoding(2024);

  const STATS = [
    { value: `${projectCount}`,  label: "Projects"     },
    { value: `${techCount}+`,    label: "Technologies" },
    { value: yearsCoding,        label: "Years Coding" },
    { value: "∞",                label: "Curiosity"   },
  ] as const;

  const isMobile = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false,
  );

  const viewport = { once: true, amount: isMobile ? 0.04 : 0.08 };
  const ease = [0.22, 1, 0.36, 1] as const;
  const base = { duration: 0.65, ease };

  const fadeUp   = (delay = 0) => shouldReduceMotion ? undefined
    : { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { ...base, delay } } };
  const fadeLeft = (delay = 0) => shouldReduceMotion ? undefined
    : { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { ...base, delay } } };
  const fadeRight = (delay = 0) => shouldReduceMotion ? undefined
    : { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { ...base, delay } } };
  const stagger  = (s = 0.07, d = 0.1) => shouldReduceMotion ? undefined
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: s, delayChildren: d } } };
  const popIn = shouldReduceMotion ? undefined : {
    hidden : { opacity: 0, scale: 0.9, y: 6 },
    visible: { opacity: 1, scale: 1,   y: 0, transition: { duration: 0.3, ease: [0, 0, 0.58, 1] as const } },
  };

  return (
    <section
      id="about"
      className="relative border-t border-border overflow-hidden scroll-mt-24"
    >
      {/* Subtle ambient — reduced opacity */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/[0.04] blur-[140px]" />

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">

        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp(0)}>
          <SectionTitle title="About Me" />
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">

          {/* RIGHT: Lanyard — first on mobile */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={viewport}
            variants={fadeRight(0.05)}
            className="order-first lg:order-last flex flex-col gap-6"
          >
            <div className="relative flex w-full h-[480px] sm:h-[560px] lg:h-[640px] xl:h-[720px] items-center justify-center rounded-2xl bg-[#0a1530]">
              {/* Very subtle ambient — no colored glow */}
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-light/30 blur-[120px]" />
              <div className="absolute inset-0 z-10 overflow-visible">
                <AboutLanyard
                  reducedMotion={!!shouldReduceMotion}
                  frontImage={profile.lanyardImage || undefined}
                />
              </div>
            </div>

            {/* Quick info — text-based, no pills */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={viewport}
              variants={stagger(0.06, 0.1)}
              className="flex flex-wrap justify-center gap-x-6 gap-y-2"
            >
              {[
                { icon: <svg key="pin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, text: "Tanjungpinang, ID" },
                { icon: <svg key="briefcase" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, text: "Open to Work" },
                { icon: <svg key="code" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, text: "Full-Stack Developer" },
              ].map((item) => (
                <motion.span
                  key={item.text}
                  variants={popIn}
                  className="flex items-center gap-1.5 text-xs text-text-muted"
                >
                  <span aria-hidden className="shrink-0 text-text-muted">{item.icon}</span>
                  {item.text}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* LEFT: Content */}
          <div className="order-last lg:order-first flex flex-col gap-8">

            {/* Bio — uses profile.about from DB if set, falls back to static text */}
            <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeLeft(0.05)}>
              {profile.about ? (
                /* Render paragraphs from admin-managed about text */
                profile.about.split(/\n\n+/).map((para, i) => (
                  <p key={i} className={`text-[15px] leading-[1.8] text-text-primary ${i > 0 ? "mt-4" : ""}`}>
                    {para.trim().split("\n").map((line, j) => (
                      <span key={j}>
                        {j > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                ))
              ) : (
                /* Fallback static text when about field is empty */
                <>
                  <p className="text-[15px] leading-[1.8] text-text-primary">
                    I am{" "}
                    <span className="font-semibold text-text-primary">{profile.name}</span>
                    , an Informatics Engineering student with a strong passion for
                    technology and software development. My academic journey has
                    equipped me with a solid foundation in web development,
                    database management, UI design, and cybersecurity fundamentals.
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.8] text-text-primary">
                    I enjoy building modern, responsive web applications using React,
                    Next.js, and Tailwind CSS. I also have experience with
                    CodeIgniter&nbsp;4 and Laravel, and I&apos;m always eager to
                    learn and grow in the tech industry.
                  </p>
                </>
              )}
            </motion.div>

            {/* Stats — horizontal strip, no individual card borders */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={viewport}
              variants={stagger(0.08, 0.1)}
              className="grid grid-cols-4 border-t border-b border-border py-5"
            >
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={popIn}
                  className="flex flex-col items-center text-center"
                >
                  <p className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-muted">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Education + Focus + Interests — single surface, sub-blocks with dividers */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={viewport}
              variants={fadeLeft(0.12)}
              className="rounded-xl border border-border bg-surface/60 p-5"
            >
              <div className="flex items-start gap-3">
                {/* Education logo — hardcoded UMRAH logo as static asset */}
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/umrah-logo.png"
                    alt="Logo Universitas Maritim Raja Ali Haji"
                    className="h-full w-full object-contain p-0.5"
                    onError={(e) => {
                      // Fallback to emoji if image not found
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        e.currentTarget.style.display = "none";
                        parent.textContent = "🎓";
                        parent.style.fontSize = "1rem";
                        parent.style.display = "flex";
                        parent.style.alignItems = "center";
                        parent.style.justifyContent = "center";
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-[15px]">Informatics Engineering</p>
                  <p className="mt-0.5 text-sm text-text-secondary">Universitas Maritim Raja Ali Haji</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/70" aria-hidden />
                    2023 – Present
                  </p>
                </div>
              </div>

              <div className="my-4 border-t border-border" />

              <div>
                <p className="mb-2 text-[11px] font-medium text-text-muted">Focus Areas</p>
                <p className="text-sm text-text-primary">Web Development · AI / Machine Learning · Mobile Apps</p>
              </div>

              <div className="my-4 border-t border-border" />

              <div>
                <p className="mb-2.5 text-[11px] font-medium text-text-muted">Interests</p>
                <motion.ul
                  initial="hidden" whileInView="visible" viewport={viewport}
                  variants={stagger(0.05, 0.05)}
                  className="flex flex-wrap gap-x-4 gap-y-1.5"
                >
                  {INTERESTS.map((interest) => (
                    <motion.li key={interest} variants={popIn} className="text-sm text-text-secondary">
                      {interest}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
