import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  work: "Work", internship: "Internship", education: "Education",
  project: "Project", organization: "Organization",
};
const TYPE_COLORS: Record<string, string> = {
  work: "text-blue-400 bg-blue-400/10",
  internship: "text-cyan-400 bg-cyan-400/10",
  education: "text-violet-400 bg-violet-400/10",
  project: "text-emerald-400 bg-emerald-400/10",
  organization: "text-amber-400 bg-amber-400/10",
};

export default async function ExperiencesAdminPage() {
  let entries: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  let dbError = false;

  try {
    entries = await prisma.experience.findMany({
      where: { type: { not: "education" } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Experience & Education</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {entries.length} entr{entries.length !== 1 ? "ies" : "y"} total.
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Entry
        </Link>
      </div>

      {dbError && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          ⚠️ Could not connect to database.
        </div>
      )}

      {entries.length === 0 && !dbError ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-text-secondary">No entries yet.</p>
          <Link href="/admin/experiences/new" className="mt-3 inline-block text-sm text-primary hover:underline">
            Add your first experience →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-surface-light ${!entry.active ? "opacity-50" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[entry.type] ?? "text-text-secondary bg-[var(--color-input)]"}`}>
                    {TYPE_LABELS[entry.type] ?? entry.type}
                  </span>
                  <p className="font-medium text-text-primary truncate">{entry.title}</p>
                </div>
                <p className="mt-0.5 text-xs text-text-secondary truncate">
                  {entry.institution}
                  {entry.startDate ? ` • ${entry.startDate}${entry.isCurrent ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}` : ""}
                </p>
              </div>
              <Link
                href={`/admin/experiences/${entry.id}/edit`}
                className="shrink-0 rounded-lg border border-[var(--color-input-border)] px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-border-subtle hover:text-text-primary"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
