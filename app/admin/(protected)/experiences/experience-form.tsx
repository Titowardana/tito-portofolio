"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createExperience, updateExperience, deleteExperience } from "./actions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import type { Experience } from "@prisma/client";

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
}

const TYPES = [
  { value: "work", label: "Work" },
  { value: "internship", label: "Internship" },
  { value: "education", label: "Education" },
  { value: "project", label: "Project" },
  { value: "organization", label: "Organization" },
] as const;

function Field({
  id, label, value, error, helper, type = "text", textarea, rows = 3, placeholder,
}: {
  id: string; label: string; value?: string | number; error?: string[];
  helper?: string; type?: string; textarea?: boolean; rows?: number; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">{label}</label>
      {textarea ? (
        <textarea
          id={id} name={id} rows={rows} defaultValue={value ?? ""} placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
        />
      ) : (
        <input
          id={id} name={id} type={type} defaultValue={value ?? ""} placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      )}
      {error && error.length > 0 && <p className="text-xs text-red-400">{error[0]}</p>}
      {helper && !error?.length && <p className="text-xs text-text-secondary">{helper}</p>}
    </div>
  );
}

function toLines(json: unknown): string {
  if (Array.isArray(json)) return json.filter((x): x is string => typeof x === "string").join("\n");
  return "";
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const router = useRouter();
  const isEdit = Boolean(experience);

  const action = isEdit
    ? updateExperience.bind(null, experience!.id)
    : createExperience;

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  // Navigate after successful submit — must be in useEffect, not render body
  useEffect(() => {
    if (state?.success) {
      router.push("/admin/experiences");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      {state && !state.success && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      {/* Type */}
      <div className="space-y-1.5">
        <label htmlFor="type" className="block text-sm font-medium text-text-primary">Type</label>
        <select
          id="type" name="type" defaultValue={experience?.type ?? "work"}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-surface px-3 py-2.5 text-sm text-text-primary focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>
          ))}
        </select>
        {state?.fieldErrors?.type && <p className="text-xs text-red-400">{state.fieldErrors.type[0]}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="title" label="Title / Degree / Position" value={experience?.title} error={state?.fieldErrors?.title} placeholder="e.g. Full-Stack Developer" />
        <Field id="institution" label="Company / Institution" value={experience?.institution} error={state?.fieldErrors?.institution} placeholder="e.g. PT Teknologi Nusantara" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="location" label="Location" value={experience?.location ?? ""} placeholder="e.g. Bandung, Indonesia" />
        <Field id="startDate" label="Start Date" value={experience?.startDate ?? ""} placeholder="e.g. Jan 2023" />
        <Field id="endDate" label="End Date" value={experience?.endDate ?? ""} placeholder="e.g. Dec 2023" helper="Leave blank if current" />
      </div>

      <label className="flex cursor-pointer items-center gap-2.5">
        <input type="checkbox" name="isCurrent" defaultChecked={experience?.isCurrent ?? false}
          className="h-4 w-4 rounded accent-primary" />
        <span className="text-sm text-text-primary">Currently working/studying here</span>
      </label>

      <Field
        id="description" label="Description" value={experience?.description}
        error={state?.fieldErrors?.description} textarea rows={4}
        placeholder="Brief summary of role or program..."
      />

      <Field
        id="responsibilities" label="Responsibilities (one per line)"
        value={toLines(experience?.responsibilities)} textarea rows={5}
        placeholder={"Developed REST APIs with Laravel\nManaged MySQL database schema\n..."}
        helper="Each line becomes a bullet point"
      />

      <Field
        id="technologies" label="Technologies Used (one per line)"
        value={toLines(experience?.technologies)} textarea rows={3}
        placeholder={"React\nNode.js\nMySQL"} helper="Each line becomes a tag"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sortOrder" label="Sort Order" type="number" value={experience?.sortOrder ?? 0} helper="Lower = first" />
        <div className="flex items-center gap-6 pt-7">
          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" name="active" defaultChecked={experience?.active ?? true}
                className="h-4 w-4 rounded accent-primary" />
              <span className="text-sm text-text-primary">Active (visible)</span>
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button
          type="submit" disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Entry"}
        </button>
        <button
          type="button" onClick={() => router.push("/admin/experiences")}
          className="rounded-lg border border-[var(--color-input-border)] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-[var(--color-input-border)] hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function DeleteExperienceButton({ id }: { id: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);
    const result = await deleteExperience(id);
    setIsPending(false);
    if (result.success) router.push("/admin/experiences");
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
        title="Delete this entry?"
        description="This will permanently remove the experience or education entry. This action cannot be undone."
        confirmLabel="Delete Entry"
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
