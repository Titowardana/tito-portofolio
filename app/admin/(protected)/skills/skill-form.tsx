"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSkill, updateSkill, deleteSkill } from "./actions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import type { Skill } from "@prisma/client";

const CATEGORIES = ["frontend", "backend", "database", "programming", "tools", "design", "networking", "cybersecurity"] as const;
const LEVELS = [
  { value: "fundamental", label: "Fundamental" },
  { value: "learning", label: "Currently Learning" },
  { value: "used-in-projects", label: "Used in Projects" },
  { value: "comfortable", label: "Comfortable" },
] as const;

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
}

function Field({
  id, label, value, error, helper, type = "text", textarea,
}: {
  id: string; label: string; value?: string | number;
  error?: string[]; helper?: string; type?: string; textarea?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">{label}</label>
      {textarea ? (
        <textarea
          id={id} name={id} rows={3} defaultValue={value ?? ""}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
        />
      ) : (
        <input
          id={id} name={id} type={type} defaultValue={value ?? ""}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      )}
      {error && error.length > 0 && (
        <p className="text-xs text-red-400">{error[0]}</p>
      )}
      {helper && !error?.length && (
        <p className="text-xs text-text-secondary">{helper}</p>
      )}
    </div>
  );
}

export function SkillForm({ skill }: { skill?: Skill }) {
  const router = useRouter();
  const isEdit = Boolean(skill);

  const action = isEdit
    ? updateSkill.bind(null, skill!.id)
    : createSkill;

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/skills");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      {state && !state.success && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Skill Name" value={skill?.name} error={state?.fieldErrors?.name} />
        <Field id="icon" label="Icon (emoji or SVG name)" value={skill?.icon ?? ""} helper="e.g. 🐍 or typescript" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-medium text-text-primary">Category</label>
          <select
            id="category" name="category" defaultValue={skill?.category ?? "frontend"}
            className="w-full rounded-lg border border-[var(--color-input-border)] bg-surface px-3 py-2.5 text-sm text-text-primary focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-surface">
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          {state?.fieldErrors?.category && (
            <p className="text-xs text-red-400">{state.fieldErrors.category[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="level" className="block text-sm font-medium text-text-primary">Proficiency Level</label>
          <select
            id="level" name="level" defaultValue={skill?.level ?? "learning"}
            className="w-full rounded-lg border border-[var(--color-input-border)] bg-surface px-3 py-2.5 text-sm text-text-primary focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value} className="bg-surface">{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Field id="description" label="Description (optional)" value={skill?.description ?? ""} textarea />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sortOrder" label="Sort Order" type="number" value={skill?.sortOrder ?? 0} helper="Lower = appears first" />
        <div className="flex items-center gap-6 pt-7">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" name="featured" defaultChecked={skill?.featured ?? false}
              className="h-4 w-4 rounded border-[var(--color-input-border)] bg-[var(--color-input)] accent-primary" />
            <span className="text-sm text-text-primary">Featured</span>
          </label>
          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" name="active" defaultChecked={skill?.active ?? true}
                className="h-4 w-4 rounded border-[var(--color-input-border)] bg-[var(--color-input)] accent-primary" />
              <span className="text-sm text-text-primary">Active</span>
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button
          type="submit" disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Skill"}
        </button>
        <button
          type="button" onClick={() => router.push("/admin/skills")}
          className="rounded-lg border border-[var(--color-input-border)] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-[var(--color-input-border)] hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function DeleteSkillButton({ id }: { id: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);
    const result = await deleteSkill(id);
    setIsPending(false);
    if (result.success) router.push("/admin/skills");
    else { setOpen(false); alert(result.message); }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
      >
        Delete
      </button>
      <ConfirmModal
        open={open}
        title="Delete this skill?"
        description="This action cannot be undone. The skill will be permanently removed."
        confirmLabel="Delete Skill"
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
