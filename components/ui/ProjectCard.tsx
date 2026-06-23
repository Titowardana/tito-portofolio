import type { Project } from "@/data/projects";
import SafeImage from "./SafeImage";
import { ExternalLinkIcon, GithubIcon } from "./Icons";

interface ProjectCardProps {
  project: Project;
}

function ProjectPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/10">
      <span className="font-heading text-lg font-bold text-text-primary/50">
        {title}
      </span>
    </div>
  );
}

export function ProjectCardLarge({ project }: ProjectCardProps) {
  return (
    <div className="group glass overflow-hidden rounded-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]">
      <div className="relative aspect-video w-full overflow-hidden">
        <SafeImage
          src={project.imagePath}
          alt={`${project.title} screenshot`}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          fallback={<ProjectPlaceholder title={project.title} />}
          containerClassName="h-full w-full"
        />
      </div>
      <div className="space-y-4 p-6">
        <h3 className="font-heading text-xl font-bold text-text-primary">
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 pt-2">
          {/* TODO: Ganti href dengan link project yang sebenarnya */}
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            <ExternalLinkIcon />
            View Project
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <GithubIcon size={16} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSmall({ project }: ProjectCardProps) {
  return (
    <div className="group glass overflow-hidden rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]">
      <div className="relative aspect-video w-full overflow-hidden">
        <SafeImage
          src={project.imagePath}
          alt={`${project.title} screenshot`}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          fallback={<ProjectPlaceholder title={project.title} />}
          containerClassName="h-full w-full"
        />
      </div>
      <div className="space-y-3 p-5">
        <h3 className="font-heading text-lg font-bold text-text-primary">
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-text-secondary line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          {/* TODO: Ganti href dengan link project yang sebenarnya */}
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            <ExternalLinkIcon size={14} />
            View
          </a>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <GithubIcon size={14} />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
