"use client";

import { useActionState } from "react";
import Image from "next/image";
import { updateAbout } from "./actions";

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
}

interface AboutFormProps {
  profile: {
    about: string | null;
    cvUrl: string | null;
    lanyardImage: string | null;
  };
}

function ImageUploadField({
  fieldName,
  removeFieldName,
  label,
  hint,
  currentSrc,
  currentAlt,
  error,
  accept = "image/jpeg,image/png,image/webp",
  maxSize = "5 MB",
  previewSize = "h-20 w-20",
  previewFit = "object-contain",
}: {
  fieldName: string;
  removeFieldName: string;
  label: string;
  hint: string;
  currentSrc: string | null;
  currentAlt: string;
  error?: string[];
  accept?: string;
  maxSize?: string;
  previewSize?: string;
  previewFit?: string;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </legend>
      <p className="text-xs text-text-secondary">{hint}</p>

      {currentSrc && (
        <div className="flex items-center gap-4">
          <div className={`relative ${previewSize} overflow-hidden rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] shrink-0`}>
            <Image
              src={currentSrc}
              alt={currentAlt}
              fill
              className={`${previewFit} p-1`}
              unoptimized
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-text-primary">Current image</p>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" name={removeFieldName} className="h-4 w-4 accent-red-400" />
              Remove image
            </label>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor={fieldName} className="block text-sm font-medium text-text-primary">
          {currentSrc ? "Replace Image" : "Upload Image"}
        </label>
        <input
          id={fieldName}
          name={fieldName}
          type="file"
          accept={accept}
          className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border file:border-[var(--color-input-border)] file:bg-[var(--color-input)] file:px-3 file:py-1.5 file:text-xs file:text-text-primary file:transition-colors hover:file:bg-surface-light"
        />
        {error && error.length > 0 && <p className="text-xs text-red-400">{error[0]}</p>}
        <p className="text-xs text-text-secondary">JPG, PNG, or WebP — max {maxSize}</p>
      </div>
    </fieldset>
  );
}

export function AboutForm({ profile }: AboutFormProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    updateAbout,
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state && (
        <div className={`rounded-lg px-4 py-3 text-sm ${
          state.success
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {state.message}
        </div>
      )}

      {/* About Me textarea */}
      <div className="space-y-1.5">
        <label htmlFor="about" className="block text-sm font-medium text-text-primary">
          About Me
        </label>
        <textarea
          id="about"
          name="about"
          rows={8}
          defaultValue={profile.about ?? ""}
          placeholder="Tell visitors about yourself..."
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
        />
        {state?.fieldErrors?.about && (
          <p className="text-xs text-red-400">{state.fieldErrors.about[0]}</p>
        )}
        <p className="text-xs text-text-secondary">
          Single Enter = line break, double Enter = new paragraph. Leave blank to use the default bio text.
        </p>
      </div>

      {/* Lanyard Card Image */}
      <ImageUploadField
        fieldName="lanyardImage"
        removeFieldName="removeLanyardImage"
        label="Lanyard Card Image"
        hint="Photo shown on the swinging card in the About section. Separate from your Hero photo."
        currentSrc={profile.lanyardImage}
        currentAlt="Current Lanyard image"
        error={state?.fieldErrors?.lanyardImage}
        maxSize="5 MB"
        previewSize="h-20 w-16"
        previewFit="object-cover"
      />

      {/* Resume / CV */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Resume / CV
        </legend>

        {profile.cvUrl && (
          <div className="flex items-center gap-4">
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[var(--color-input)] px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-light"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              View Current CV
            </a>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" name="removeCv" className="h-4 w-4 accent-red-400" />
              Remove CV
            </label>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="cvUrl" className="block text-sm font-medium text-text-primary">
            {profile.cvUrl ? "Replace CV" : "Upload CV"}
          </label>
          <input
            id="cvUrl"
            name="cvUrl"
            type="file"
            accept="application/pdf"
            className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border file:border-[var(--color-input-border)] file:bg-[var(--color-input)] file:px-3 file:py-1.5 file:text-xs file:text-text-primary file:transition-colors hover:file:bg-surface-light"
          />
          {state?.fieldErrors?.cvUrl && (
            <p className="text-xs text-red-400">{state.fieldErrors.cvUrl[0]}</p>
          )}
          <p className="text-xs text-text-secondary">PDF format only — max 10 MB</p>
        </div>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
