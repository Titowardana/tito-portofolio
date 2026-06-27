import Link from "next/link";
import type { Project } from "@/data/projects";
import SafeImage from "./SafeImage";
import { ExternalLinkIcon, GithubIcon } from "./Icons";

interface ProjectCardProps {
  project: Project;
}

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).slice(0, 2);
  return words.map((w) => w[0] ?? "").join("").toUpperCase();
}

function ProjectPlaceholder({ title }: { title: string }) {
  const initials = getInitials(title);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--background-dark)]">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06)_0%,transparent_70%)]" />
      <svg
        className="absolute text-text-primary/[0.04]"
        width={72}
        height={72}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
      <span className="relative font-heading text-3xl font-bold tracking-tight text-text-primary/[0.1] select-none">
        {initials}
      </span>
    </div>
  );
}

function FeaturedCardContent({
  project,
  hasExternal,
}: {
  project: Project;
  hasExternal: boolean;
}) {
  return (
    <>
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        {project.image ? (
          <SafeImage
            src={project.image}
            alt={`${project.title} screenshot`}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            fill
            fallback={<ProjectPlaceholder title={project.title} />}
            containerClassName="h-full w-full"
          />
        ) : (
          <ProjectPlaceholder title={project.title} />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0c1324] via-[#0c1324]/60 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary">
            {project.title}
          </h3>
          <ExternalLinkIcon
            size={16}
            className="mt-1 shrink-0 text-text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>

        <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-3">
          {project.shortDescription}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-5">
          {project.technologies.length > 0 && (
            <p className="text-[11px] leading-relaxed text-text-muted">
              {project.technologies.join(" · ")}
            </p>
          )}

          {hasExternal && (
            <div className="flex items-center gap-4">
              {project.liveUrl && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  <ExternalLinkIcon size={14} />
                  View Project
                </span>
              )}
              {project.githubUrl && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary">
                  <GithubIcon size={14} />
                  Source
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ProjectCardLarge({ project }: ProjectCardProps) {
  const hasExternal = !!(project.liveUrl || project.githubUrl);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-[var(--background)] transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-border-subtle hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      <FeaturedCardContent project={project} hasExternal={hasExternal} />
    </Link>
  );
}

function SmallCardContent({
  project,
  hasExternal,
}: {
  project: Project;
  hasExternal: boolean;
}) {
  return (
    <>
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        {project.image ? (
          <SafeImage
            src={project.image}
            alt={`${project.title} screenshot`}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            fill
            fallback={<ProjectPlaceholder title={project.title} />}
            containerClassName="h-full w-full"
          />
        ) : (
          <ProjectPlaceholder title={project.title} />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0c1324] to-transparent" />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-[15px] font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary line-clamp-2">
            {project.title}
          </h3>
          <ExternalLinkIcon
            size={14}
            className="mt-0.5 shrink-0 text-text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {project.shortDescription}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          {project.technologies.length > 0 && (
            <p className="text-[11px] leading-relaxed text-text-muted">
              {project.technologies.slice(0, 4).join(" · ")}
              {project.technologies.length > 4 && " …"}
            </p>
          )}

          {hasExternal && (
            <div className="flex items-center gap-3.5">
              {project.liveUrl && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <ExternalLinkIcon size={12} />
                  View
                </span>
              )}
              {project.githubUrl && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary">
                  <GithubIcon size={13} />
                  Code
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ProjectCardSmall({ project }: ProjectCardProps) {
  const hasExternal = !!(project.liveUrl || project.githubUrl);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-border bg-[var(--background)] transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-border-subtle hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      <SmallCardContent project={project} hasExternal={hasExternal} />
    </Link>
  );
}
