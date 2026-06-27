import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectForm, DeleteProjectButton } from "../../project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) notFound();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { technologies: { orderBy: { sortOrder: "asc" } } },
  });

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit Project</h1>
          <p className="mt-1 text-sm text-text-secondary">{project.title}</p>
        </div>
        <DeleteProjectButton id={project.id} imagePath={project.image} />
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
