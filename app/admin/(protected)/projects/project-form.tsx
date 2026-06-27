"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProject, updateProject, deleteProject } from "./actions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import type { Project, ProjectTechnology } from "@prisma/client";

type ProjectWithTech = Project & { technologies: ProjectTechnology[] };

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
  redirectId?: number;
}

function Field({
  id, label, value, error, helper, type = "text", textarea, rows = 3, required,
}: {
  id: string; label: string; value?: string | number; error?: string[];
  helper?: string; type?: string; textarea?: boolean; rows?: number; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id} name={id} rows={rows} defaultValue={value ?? ""}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
        />
      ) : (
        <input
          id={id} name={id} type={type} defaultValue={value ?? ""}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      )}
      {error && error.length > 0 && <p className="text-xs text-red-400">{error[0]}</p>}
      {helper && !error?.length && <p className="text-xs text-text-secondary">{helper}</p>}
    </div>
  );
}

export function ProjectForm({ project }: { project?: ProjectWithTech }) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const action = isEdit
    ? updateProject.bind(null, project!.id, project!.image)
    : createProject;

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/projects");
    }
  }, [state, router]);

  const techString = project?.technologies.map((t) => t.name).join(", ") ?? "";

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      {/* Basic info */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Basic Info</legend>
        <Field id="title" label="Project Title" value={project?.title} error={state?.fieldErrors?.title} required />
        <Field id="shortDescription" label="Short Description" value={project?.shortDescription} error={state?.fieldErrors?.shortDescription} textarea rows={2} required helper="Shown on the project card (max 500 chars)" />
        <Field id="description" label="Full Description" value={project?.description ?? ""} textarea rows={5} helper="Detailed description (optional)" />
      </fieldset>

      {/* Details */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="role" label="Your Role" value={project?.role ?? ""} helper="e.g. Full-Stack Developer" />
          <Field id="category" label="Category" value={project?.category ?? ""} helper="e.g. Web App, Mobile, API" />
        </div>
        <Field
          id="technologies"
          label="Technologies (comma-separated)"
          value={techString}
          helper="e.g. React, Next.js, TypeScript, MySQL"
        />
      </fieldset>

      {/* Links */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Links</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="githubUrl" label="GitHub URL" value={project?.githubUrl ?? ""} error={state?.fieldErrors?.githubUrl} helper="https://github.com/..." />
          <Field id="liveUrl" label="Live Demo URL" value={project?.liveUrl ?? ""} error={state?.fieldErrors?.liveUrl} helper="https://..." />
        </div>
      </fieldset>

      {/* Image */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Cover Image</legend>
        {project?.image && (
          <div className="flex items-center gap-4">
            <Image src={project.image} alt="Current cover" width={80} height={60} className="h-16 w-24 rounded-lg border border-[var(--color-input-border)] object-cover" />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" name="removeImage" className="h-4 w-4 accent-red-400" />
              Remove image
            </label>
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="image" className="block text-sm font-medium text-text-primary">
            {project?.image ? "Replace Image" : "Upload Image"}
          </label>
          <input
            id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border file:border-[var(--color-input-border)] file:bg-[var(--color-input)] file:px-3 file:py-1.5 file:text-xs file:text-text-primary file:transition-colors hover:file:bg-surface-light"
          />
          {state?.fieldErrors?.image && <p className="text-xs text-red-400">{state.fieldErrors.image[0]}</p>}
          <p className="text-xs text-text-secondary">JPG, PNG, WebP — max 8 MB</p>
        </div>
      </fieldset>

      {/* Options */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Options</legend>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false}
              className="h-4 w-4 rounded accent-primary" />
            <span className="text-sm text-text-primary">Featured (shown on homepage)</span>
          </label>
          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" name="active" defaultChecked={project?.active ?? true}
                className="h-4 w-4 rounded accent-primary" />
              <span className="text-sm text-text-primary">Active (visible to public)</span>
            </label>
          )}
        </div>
        <Field id="sortOrder" label="Sort Order" type="number" value={project?.sortOrder ?? 0} helper="Lower = appears first" />
      </fieldset>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button
          type="submit" disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button" onClick={() => router.push("/admin/projects")}
          className="rounded-lg border border-[var(--color-input-border)] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-[var(--color-input-border)] hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function DeleteProjectButton({ id, imagePath }: { id: number; imagePath: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);
    const result = await deleteProject(id, imagePath);
    setIsPending(false);
    if (result.success) router.push("/admin/projects");
    else { setOpen(false); alert(result.message); }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
      >
        Delete Project
      </button>
      <ConfirmModal
        open={open}
        title="Delete this project?"
        description="This will permanently remove the project and its cover image. This action cannot be undone."
        confirmLabel="Delete Project"
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
