"use client";

import { motion, useReducedMotion } from "motion/react";
import { GithubIcon, LinkedinIcon, EmailIcon, WhatsappIcon, InstagramIcon, TiktokIcon, ArrowRightIcon } from "@/components/ui/Icons";
import type { Profile } from "@/data/profile";

export default function Contact({ profile }: { profile: Profile }) {
  const shouldReduceMotion = useReducedMotion();
  const viewport = { once: true, amount: 0.2 };
  
  const fadeUp = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
  };
  
  const stagger = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const scaleIn = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
  };

  return (
    <section id="contact" className="relative border-t border-border/50 bg-[var(--background-dark)] overflow-hidden scroll-mt-24">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28 z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="space-y-6">
          <motion.h2 variants={fadeUp} className="font-heading text-4xl font-bold leading-tight text-text-primary md:text-5xl lg:text-6xl">
            Let&apos;s Build Something{" "}
            <span className="text-primary">Meaningful.</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="mx-auto max-w-lg text-base leading-relaxed text-text-secondary">
            I&apos;m currently open to new opportunities and collaborations.
            Whether you have a project in mind or just want to say hello, feel
            free to reach out.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}
          className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8"
        >
          {profile.email && (
            <motion.a
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${profile.email}`}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto"
            >
              <EmailIcon size={18} />
              {profile.email}
            </motion.a>
          )}
          {profile.whatsapp && (
            <motion.a
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface/50 px-8 py-4 text-sm font-semibold text-text-primary transition-all hover:border-border-subtle hover:bg-surface sm:w-auto"
            >
              <WhatsappIcon size={18} />
              WhatsApp
            </motion.a>
          )}
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}
          className="mt-8 flex items-center justify-center gap-6"
        >
          {profile.github && (
            <motion.a
              variants={scaleIn}
              whileHover={{ scale: 1.08, y: -3 }}
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface/80 text-text-secondary transition-all hover:border-border-subtle hover:text-text-primary"
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </motion.a>
          )}
          {profile.linkedin && (
            <motion.a
              variants={scaleIn}
              whileHover={{ scale: 1.08, y: -3 }}
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface/80 text-text-secondary transition-all hover:border-border-subtle hover:text-text-primary"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </motion.a>
          )}
          {profile.whatsapp && (
            <motion.a
              variants={scaleIn}
              whileHover={{ scale: 1.08, y: -3 }}
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface/80 text-text-secondary transition-all hover:border-border-subtle hover:text-text-primary"
              aria-label="WhatsApp"
            >
              <WhatsappIcon size={20} />
            </motion.a>
          )}
          {profile.instagram && (
            <motion.a
              variants={scaleIn}
              whileHover={{ scale: 1.08, y: -3 }}
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface/80 text-text-secondary transition-all hover:border-border-subtle hover:text-text-primary"
              aria-label="Instagram"
            >
              <InstagramIcon size={20} />
            </motion.a>
          )}
          {profile.tiktok && (
            <motion.a
              variants={scaleIn}
              whileHover={{ scale: 1.08, y: -3 }}
              href={profile.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface/80 text-text-secondary transition-all hover:border-border-subtle hover:text-text-primary"
              aria-label="TikTok"
            >
              <TiktokIcon size={20} />
            </motion.a>
          )}
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}
          className="mt-16"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-text-secondary transition-colors hover:text-primary"
          >
            Back to Projects
            <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
