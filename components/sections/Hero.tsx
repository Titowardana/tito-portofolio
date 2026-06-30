"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "motion/react";
import {
  GithubIcon,
  LinkedinIcon,
  EmailIcon,
  WhatsappIcon,
  InstagramIcon,
  TiktokIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";
import type { Profile } from "@/data/profile";
import ProfilePhotoCard from "@/components/ui/ProfilePhotoCard";
import TextType from "@/components/ui/TextType";
import SplashCursorBackground from "@/components/effects/SplashCursorBackground";

/* ─── Sub-components ────────────────────────────────────────────── */

function ScrollIndicator({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 8 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.5 }}
      aria-hidden="true"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary/50">
        scroll
      </span>
      <div className="flex h-8 w-5 items-start justify-center rounded-full border border-text-secondary/15 p-1">
        <motion.div
          className="h-1.5 w-1 rounded-full bg-text-secondary/40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Main Hero Component ───────────────────────────────────────── */

export default function Hero({ profile }: { profile: Profile }) {
  /* Refs for GSAP targets */
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);

  /* Detect reduced-motion preference */
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  /* Callback from ProfilePhotoCard when slices finish */
  const handleRevealComplete = useCallback(() => {
    setTimeout(() => setScrollIndicatorVisible(true), 400);
  }, []);

  /* GSAP timeline for left-column content */
  useEffect(() => {
    if (reducedMotion) {
      // Show everything immediately via DOM manipulation (no setState in sync body)
      const els = [
        badgeRef.current,
        greetingRef.current,
        nameRef.current,
        roleRef.current,
        descRef.current,
        buttonsRef.current,
        socialRef.current,
      ];
      els.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      // Defer setState to avoid synchronous setState-in-effect lint violation
      const t = window.setTimeout(() => {
        setScrollIndicatorVisible(true);
      }, 0);
      return () => window.clearTimeout(t);
    }

    // Use a minimal interface since gsap.Context type isn't directly importable
    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        /* 1. Badge */
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
        );

        /* 2. Greeting */
        tl.fromTo(
          greetingRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.2",
        );

        /* 3. Name — reveal per-line using overflow hidden */
        tl.fromTo(
          nameRef.current,
          { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.65,
            ease: "power4.out",
          },
          "-=0.15",
        );

        /* 4. Role block */
        tl.fromTo(
          roleRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.2",
        );

        /* 5. Description */
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.2",
        );

        /* 6. Buttons */
        tl.fromTo(
          buttonsRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.15",
        );

        /* 7. Social icons — stagger children */
        tl.fromTo(
          socialRef.current ? Array.from(socialRef.current.children) : [],
          { opacity: 0, y: 10, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            stagger: 0.07,
          },
          "-=0.15",
        );
      }, sectionRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, [reducedMotion]);

  /* Social links filtered to non-empty */
  const socialLinks = [
    profile.github && {
      href: profile.github,
      label: "GitHub Profile",
      icon: <GithubIcon size={20} />,
      external: true,
    },
    profile.linkedin && {
      href: profile.linkedin,
      label: "LinkedIn Profile",
      icon: <LinkedinIcon size={20} />,
      external: true,
    },
    profile.email && {
      href: `mailto:${profile.email}`,
      label: "Email Tito",
      icon: <EmailIcon size={20} />,
      external: false,
    },
    profile.whatsapp && {
      href: `https://wa.me/${profile.whatsapp}`,
      label: "WhatsApp Tito",
      icon: <WhatsappIcon size={20} />,
      external: true,
    },
    profile.instagram && {
      href: profile.instagram,
      label: "Instagram Tito",
      icon: <InstagramIcon size={20} />,
      external: true,
    },
    profile.tiktok && {
      href: profile.tiktok,
      label: "TikTok Tito",
      icon: <TiktokIcon size={20} />,
      external: true,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: React.ReactNode;
    external: boolean;
  }[];

  const roles = [
    profile.primaryRole,
    profile.secondaryRole,
  ].filter((role): role is string => Boolean(role));

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden bg-grid"
      style={{
        minHeight: "calc(100svh - 80px)",
      }}
    >
      {/* Layer 0: SplashCursor background */}
      <SplashCursorBackground />

      {/* Layer 1: Background — very subtle, no colored glow */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[400px] w-[300px] rounded-full bg-primary/4 blur-[160px] sm:w-[500px]"
        aria-hidden="true"
      />

      {/* Geometric line decoration (desktop only) */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block overflow-hidden"
        aria-hidden="true"
      >
        {/* Top-right corner accent — minimal */}
        <svg
          className="absolute top-16 right-8 opacity-[0.045] text-text-secondary"
          width="160"
          height="160"
          viewBox="0 0 160 160"
          fill="none"
        >
          <circle cx="80" cy="80" r="79" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="80" cy="80" r="55" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        {/* Bottom-left dot grid */}
        <svg
          className="absolute bottom-16 left-8 opacity-[0.06]"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 24 + 12}
                cy={row * 24 + 12}
                r="1.5"
                fill="#4cd7f6"
              />
            )),
          )}
        </svg>
      </div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pt-28 pb-24 lg:flex-row lg:items-center lg:gap-16 lg:pt-32 lg:pb-28">

        {/* ── Left column: text ── */}
        <div className="flex-1 space-y-5 text-center lg:text-left">

          {/* Eyebrow — editorial label, not a pill */}
          <div
            ref={badgeRef}
            className={reducedMotion ? "" : "opacity-0"}
          >
            <p className="font-mono text-[11px] tracking-[0.16em] text-text-secondary">
              {profile.isAvailable && (
                <span className="mr-2 inline-flex items-center gap-1.5" aria-hidden="true">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                </span>
              )}
              {profile.badge}
            </p>
          </div>

          {/* Greeting + Name + Role */}
          <div className="space-y-2">
            <p
              ref={greetingRef}
              className={`font-mono text-xs tracking-[0.12em] text-text-secondary ${reducedMotion ? "" : "opacity-0"}`}
            >
              {profile.greeting}
            </p>

            <h1
              ref={nameRef}
              className={`font-heading text-4xl font-bold leading-[1.08] text-text-primary sm:text-5xl lg:text-6xl xl:text-7xl ${reducedMotion ? "" : "opacity-0"}`}
              style={{ willChange: "opacity, transform, clip-path" }}
            >
              {profile.name.split(" ").length > 2 ? (
                <>
                  {profile.name.split(" ").slice(0, -1).join(" ")}
                  <br />
                  <span className="text-primary">
                    {profile.name.split(" ").slice(-1)[0]}
                  </span>
                </>
              ) : (
                profile.name
              )}
            </h1>

            <div
              ref={roleRef}
              className={`pt-1 min-h-[3.5rem] md:min-h-[4.5rem] ${reducedMotion ? "" : "opacity-0"}`}
            >
              {reducedMotion ? (
                <h2 className="font-heading text-2xl font-semibold leading-tight text-secondary md:text-4xl">
                  {roles[0] || ""}
                </h2>
              ) : (
                <TextType
                  as="h2"
                  text={roles}
                  typingSpeed={52}
                  deletingSpeed={26}
                  pauseDuration={1800}
                  initialDelay={1100}
                  cursorCharacter="_"
                  cursorBlinkDuration={0.55}
                  className="font-heading text-2xl font-semibold leading-tight text-secondary md:text-4xl"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <p
            ref={descRef}
            className={`mx-auto max-w-md text-[15px] leading-[1.75] text-text-primary lg:mx-0 ${reducedMotion ? "" : "opacity-0"}`}
          >
            {profile.description}
          </p>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            className={`flex flex-col items-center gap-3 sm:flex-row lg:justify-start ${reducedMotion ? "" : "opacity-0"}`}
          >
            <motion.a
              href="#projects"
              variants={{
                hover: { scale: 1.03, y: -2 },
                tap: { scale: 0.97 },
              }}
              whileHover={reducedMotion ? {} : "hover"}
              whileTap={reducedMotion ? {} : "tap"}
              className="group inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-primary px-6 sm:px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto focus-visible:outline-2 focus-visible:outline-primary"
            >
              View Projects
              <motion.span
                variants={{ hover: { x: 4 } }}
                className="inline-flex"
              >
                <ArrowRightIcon size={15} />
              </motion.span>
            </motion.a>

            <motion.a
              href="#contact"
              variants={{
                hover: { scale: 1.03, y: -2 },
                tap: { scale: 0.97 },
              }}
              whileHover={reducedMotion ? {} : "hover"}
              whileTap={reducedMotion ? {} : "tap"}
              className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-secondary/30 bg-secondary/8 px-6 sm:px-8 py-3.5 text-sm font-semibold text-secondary transition-colors hover:border-secondary/60 hover:bg-secondary/15 sm:w-auto focus-visible:outline-2 focus-visible:outline-secondary"
            >
              Contact Me
            </motion.a>
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div
              ref={socialRef}
              className="flex items-center justify-center gap-3 pt-1 lg:justify-start"
            >
              {socialLinks.map(({ href, label, icon, external }) => (
                <motion.a
                  key={label}
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={label}
                  whileHover={
                    reducedMotion
                      ? {}
                      : { scale: 1.15, backgroundColor: "rgba(37,99,235,0.9)" }
                  }
                  whileTap={reducedMotion ? {} : { scale: 0.92 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  style={{ willChange: "transform" }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column: photo ── */}
        <div className="flex flex-1 justify-center lg:justify-end w-full lg:w-auto">
          <ProfilePhotoCard
            src={profile.profileImage}
            alt="Tito Pamungkas Wardana"
            primaryRole={profile.primaryRole}
            isAvailable={profile.isAvailable}
            onRevealComplete={handleRevealComplete}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator visible={scrollIndicatorVisible || reducedMotion} />
    </section>
  );
}
