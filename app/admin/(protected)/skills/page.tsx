import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SkillList } from "./skill-list";

export const dynamic = "force-dynamic";

export default async function SkillsAdminPage() {
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];
  let dbError = false;

  try {
    skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
  } catch {
    dbError = true;
  }

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Skills</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your technical skills. {skills.length} skill{skills.length !== 1 ? "s" : ""} total.
          </p>
        </div>
        <Link
          href="/admin/skills/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Skill
        </Link>
      </div>

      {dbError && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          ⚠️ Could not connect to database. Showing empty state.
        </div>
      )}

      {skills.length === 0 && !dbError ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-text-secondary">No skills yet.</p>
          <Link href="/admin/skills/new" className="mt-3 inline-block text-sm text-primary hover:underline">
            Add your first skill →
          </Link>
        </div>
      ) : (
        <SkillList grouped={grouped} />
      )}
    </div>
  );
}
