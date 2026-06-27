"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { ExternalLinkIcon, GithubIcon } from "@/components/ui/Icons";

const ease = [0.22, 1, 0.36, 1] as const;

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).slice(0, 2);
  return words.map((w) => w[0] ?? "").join("").toUpperCase();
}

function ProjectDetailsPlaceholder({ title }: { title: string }) {
  const initials = getInitials(title);
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--background-dark)]">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <span className="font-heading text-6xl font-bold tracking-tight text-text-primary/[0.06] select-none">
        {initials}
      </span>
    </div>
  );
}

function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function ProjectDetailClient({ project }: { project: Project }) {
  const shouldReduce = useReducedMotion();
  const hasImage = Boolean(project.image);
  const hasRole = Boolean(project.role);
  const hasCategory = Boolean(project.category);
  const hasMeta = hasRole || hasCategory;

  const fadeUp = (delay: number) =>
    shouldReduce
      ? { initial: {}, animate: {} }
      : {
          initial: { opacity: 0, y: 24 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease, delay },
          },
        };

  useEffect(() => {
    sessionStorage.setItem("returnToProject", project.slug);
  }, [project.slug]);

  return (
    <div className="min-h-screen bg-[var(--background-dark)]">
      {/* ── Hero ── */}
      <section className="relative h-[40vh] min-h-[260px] max-h-[500px] w-full overflow-hidden">
        <motion.div
          initial={shouldReduce ? {} : { scale: 1.06, opacity: 0 }}
          animate={shouldReduce ? {} : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease }}
          className="absolute inset-0"
        >
          {hasImage ? (
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <ProjectDetailsPlaceholder title={project.title} />
          )}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background-dark)] via-[var(--background-dark)]/20 to-transparent" />

        {/* Back button */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
          animate={shouldReduce ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.15 }}
          className="absolute left-4 top-4 sm:left-8 sm:top-8 z-10"
        >
          <Link
            href={"/#project-" + project.slug}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-[var(--background)]/70 px-3.5 py-1.5 text-xs text-text-primary backdrop-blur-sm transition-colors hover:border-border-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary sm:px-4 sm:py-2 sm:text-sm"
          >
            <BackArrow />
            Back
          </Link>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <div className="mx-auto max-w-4xl px-6 pb-24 lg:max-w-5xl">
        {/* ── Title ── */}
        <motion.div {...fadeUp(0.25)} className="mt-8 sm:mt-10">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            {project.title}
          </h1>
        </motion.div>

        {/* ── Metadata ── */}
        {hasMeta && (
          <motion.div {...fadeUp(0.3)} className="mt-6">
            <div className="inline-flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border bg-surface/20 px-5 py-3">
              {hasRole && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-muted">Role</span>
                  <span className="text-text-primary">{project.role}</span>
                </div>
              )}
              {hasRole && hasCategory && (
                <span className="hidden h-4 w-px bg-surface/75 sm:block" aria-hidden />
              )}
              {hasCategory && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-muted">Category</span>
                  <span className="text-text-primary">{project.category}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Project Overview ── */}
        <motion.div {...fadeUp(0.35)} className="mt-12">
          <h2 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
            Project Overview
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-sm leading-[1.8] text-text-secondary sm:text-base">
            {project.description.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph || "\u00A0"}</p>
            ))}
          </div>
        </motion.div>

        {/* ── Technologies ── */}
        {project.technologies.length > 0 && (
          <motion.div {...fadeUp(0.45)} className="mt-12">
            <h2 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
              Technologies
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
                  animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease, delay: 0.55 + i * 0.04 }}
                  className="rounded-lg border border-border bg-[var(--color-input)] px-3.5 py-1.5 text-sm font-medium text-text-primary"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Links ── */}
        {(project.liveUrl || project.githubUrl) && (
          <motion.div {...fadeUp(0.55)} className="mt-12">
            <h2 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
              Links
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <ExternalLinkIcon size={16} />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-medium text-text-primary transition-all hover:border-border-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <GithubIcon size={16} />
                  Source Code
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Back to Projects ── */}
        <motion.div {...fadeUp(0.65)} className="mt-16 border-t border-border pt-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            <BackArrow />
            Back to all projects
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
