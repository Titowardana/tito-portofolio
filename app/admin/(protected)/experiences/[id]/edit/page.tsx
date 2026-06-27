import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExperienceForm, DeleteExperienceButton } from "../../experience-form";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expId = parseInt(id, 10);

  if (isNaN(expId)) notFound();

  const experience = await prisma.experience.findUnique({
    where: { id: expId },
  });

  if (!experience) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit Entry</h1>
          <p className="mt-1 text-sm text-text-secondary">{experience.title} at {experience.institution}</p>
        </div>
        <DeleteExperienceButton id={experience.id} />
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <ExperienceForm experience={experience} />
      </div>
    </div>
  );
}
