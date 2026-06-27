import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SkillForm, DeleteSkillButton } from "../../skill-form";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skillId = parseInt(id, 10);

  if (isNaN(skillId)) notFound();

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit Skill</h1>
          <p className="mt-1 text-sm text-text-secondary">{skill.name}</p>
        </div>
        <DeleteSkillButton id={skill.id} />
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <SkillForm skill={skill} />
      </div>
    </div>
  );
}
