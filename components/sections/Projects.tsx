import { projects } from "@/data/projects";
import SectionTitle from "@/components/ui/SectionTitle";
import { ProjectCardLarge, ProjectCardSmall } from "@/components/ui/ProjectCard";

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative border-t border-border/50 bg-[var(--background-dark)]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionTitle
          title="Featured Projects"
          subtitle="A selection of my recent work"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCardLarge key={project.id} project={project} />
          ))}
        </div>

        {otherProjects.length > 0 && (
          <>
            <div className="relative my-12 flex items-center gap-4">
              <div className="flex-1 border-t border-border/50" />
              <span className="text-xs font-medium tracking-wider uppercase text-text-secondary">
                Other Projects
              </span>
              <div className="flex-1 border-t border-border/50" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project) => (
                <ProjectCardSmall key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
