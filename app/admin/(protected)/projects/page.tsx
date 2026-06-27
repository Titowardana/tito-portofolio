import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

type ProjectWithTech = Prisma.ProjectGetPayload<{ include: { technologies: true } }>;

export default async function ProjectsAdminPage() {
  let projects: ProjectWithTech[] = [];
  let dbError = false;

  try {
    projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { technologies: { orderBy: { sortOrder: "asc" } } },
    });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Project
        </Link>
      </div>

      {dbError && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          ⚠️ Could not connect to database.
        </div>
      )}

      {projects.length === 0 && !dbError ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-text-secondary">No projects yet.</p>
          <Link href="/admin/projects/new" className="mt-3 inline-block text-sm text-primary hover:underline">
            Add your first project →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-light ${!project.active ? "opacity-50" : ""}`}
            >
              {/* Image thumbnail */}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-[var(--color-input)] flex items-center justify-center">
                {project.image ? (
                  <Image src={project.image} alt={project.title} width={56} height={56} className="h-full w-full object-cover" />
                ) : (
                  <svg className="text-text-muted" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-text-primary truncate">{project.title}</p>
                  {project.featured && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Featured</span>
                  )}
                  {!project.active && (
                    <span className="rounded-full bg-[var(--color-input)] px-2 py-0.5 text-xs text-text-muted">Hidden</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary truncate">{project.shortDescription}</p>
                {project.technologies.length > 0 && (
                  <p className="mt-1 text-xs text-text-muted truncate">
                    {project.technologies.map((t) => t.name).join(", ")}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1.5 text-text-secondary hover:bg-[var(--color-input)] hover:text-secondary"
                    title="View live"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-lg border border-[var(--color-input-border)] px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-[var(--color-input-border)] hover:text-text-primary"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
