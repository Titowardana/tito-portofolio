"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteSkill } from "./actions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import type { Skill } from "@prisma/client";

const LEVEL_LABELS: Record<string, string> = {
  fundamental: "Fundamental",
  learning: "Learning",
  "used-in-projects": "Used in Projects",
  comfortable: "Comfortable",
};

const LEVEL_COLORS: Record<string, string> = {
  fundamental: "text-amber-400 bg-amber-400/10",
  learning: "text-blue-400 bg-blue-400/10",
  "used-in-projects": "text-emerald-400 bg-emerald-400/10",
  comfortable: "text-violet-400 bg-violet-400/10",
};

function DeleteButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);
    await deleteSkill(id);
    setIsPending(false);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
      >
        Del
      </button>
      <ConfirmModal
        open={open}
        title="Delete this skill?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

function SkillRow({ skill }: { skill: Skill }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-surface-light/30 ${!skill.active ? "opacity-40" : ""}`}>
      <span className="w-8 shrink-0 text-center text-lg leading-none">{skill.icon ?? ""}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{skill.name}</p>
        {!skill.active && <span className="text-xs text-text-muted">(hidden)</span>}
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_COLORS[skill.level] ?? "text-text-secondary bg-[var(--color-input)]"}`}>
        {LEVEL_LABELS[skill.level] ?? skill.level}
      </span>
      {skill.featured && (
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Featured
        </span>
      )}
      <div className="flex shrink-0 items-center gap-1">
        <Link
          href={`/admin/skills/${skill.id}/edit`}
          className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-[var(--color-input)] hover:text-text-primary"
        >
          Edit
        </Link>
        <DeleteButton id={skill.id} />
      </div>
    </div>
  );
}

export function SkillList({ grouped }: { grouped: Record<string, Skill[]> }) {
  const categories = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <div key={cat} className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="border-b border-border px-4 py-2.5 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {cat}
            </h3>
            <span className="text-xs text-text-muted">{grouped[cat].length} skill{grouped[cat].length !== 1 ? "s" : ""}</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {grouped[cat].map((skill) => (
              <SkillRow key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
