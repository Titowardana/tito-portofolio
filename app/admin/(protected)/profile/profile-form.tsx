"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { Profile } from "@/data/profile";
import { updateProfile } from "./actions";

interface ProfileFormProps {
  profile: Profile;
}

function Field({
  id,
  label,
  value,
  error,
  helper,
  type = "text",
  autocomplete,
  textarea,
}: {
  id: string;
  label: string;
  value: string;
  error?: string[];
  helper?: string;
  type?: string;
  autocomplete?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-muted">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          defaultValue={value}
          rows={4}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-4 py-2.5 text-sm text-text-primary placeholder-text-muted/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autocomplete}
          defaultValue={value}
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-4 py-2.5 text-sm text-text-primary placeholder-text-muted/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      )}
      {helper && <p className="mt-1 text-xs text-text-muted/60">{helper}</p>}
      {error && error.length > 0 && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error[0]}
        </p>
      )}
    </div>
  );
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-8">
      {state?.message && (
        <div
          className={`rounded-lg border px-5 py-3 text-sm ${
            state.success
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
          role="alert"
        >
          {state.message}
        </div>
      )}

      <fieldset>
        <legend className="mb-4 font-heading text-base font-bold text-text-primary">
          Identity
        </legend>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field id="name" label="Name" value={profile.name} error={state?.fieldErrors?.name} />
          <Field id="shortName" label="Short Name" value={profile.shortName} error={state?.fieldErrors?.shortName} />
          <Field id="greeting" label="Greeting" value={profile.greeting} error={state?.fieldErrors?.greeting} />
          <Field id="badge" label="Badge" value={profile.badge} error={state?.fieldErrors?.badge} />
          <Field id="primaryRole" label="Primary Role" value={profile.primaryRole} error={state?.fieldErrors?.primaryRole} />
          <Field id="secondaryRole" label="Secondary Role" value={profile.secondaryRole} error={state?.fieldErrors?.secondaryRole} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-4 font-heading text-base font-bold text-text-primary">
          Biography
        </legend>
        <div className="space-y-5">
          <Field id="description" label="Description" value={profile.description} textarea error={state?.fieldErrors?.description} />
          <Field id="about" label="About" value={profile.about} textarea error={state?.fieldErrors?.about} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-4 font-heading text-base font-bold text-text-primary">
          Contact and Social
        </legend>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field id="email" label="Email" type="email" autocomplete="email" value={profile.email} error={state?.fieldErrors?.email} />
          <Field id="whatsapp" label="WhatsApp" value={profile.whatsapp} helper="8–16 digits, no + spaces or dashes. Example: 6281234567890" error={state?.fieldErrors?.whatsapp} />
          <Field id="githubUrl" label="GitHub URL" type="url" value={profile.github} error={state?.fieldErrors?.githubUrl} />
          <Field id="linkedinUrl" label="LinkedIn URL" type="url" value={profile.linkedin} error={state?.fieldErrors?.linkedinUrl} />
          <Field id="instagramUrl" label="Instagram URL" type="url" value={profile.instagram} error={state?.fieldErrors?.instagramUrl} helper="https://instagram.com/username" />
          <Field id="tiktokUrl" label="TikTok URL" type="url" value={profile.tiktok} error={state?.fieldErrors?.tiktokUrl} helper="https://tiktok.com/@username" />
          <Field id="location" label="Location" value={profile.location} error={state?.fieldErrors?.location} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-4 font-heading text-base font-bold text-text-primary">
          Profile Photo
        </legend>
        <div className="space-y-4">
          {profile.profileImage && (
            <div className="flex items-center gap-4">
              <Image
                src={profile.profileImage}
                alt="Current profile photo"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full border border-[var(--color-input-border)] object-cover"
              />
              <span className="text-sm text-text-muted">
                Current photo
              </span>
            </div>
          )}
          <div>
            <label
              htmlFor="profilePhoto"
              className="mb-1.5 block text-sm font-medium text-text-muted"
            >
              Upload new photo
            </label>
            <input
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-4 py-2.5 text-sm text-text-primary file:mr-3 file:rounded file:border-0 file:bg-primary/20 file:px-3 file:py-1 file:text-sm file:text-primary file:transition-colors hover:file:bg-primary/30"
            />
            <p className="mt-1 text-xs text-text-muted/60">
              JPG, JPEG, PNG, or WebP. Max 5 MB.
            </p>
            {state?.fieldErrors?.profilePhoto && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {state.fieldErrors.profilePhoto[0]}
              </p>
            )}
          </div>
          {profile.profileImage && (
            <label className="flex cursor-pointer items-center gap-3">
              <input
                id="removeProfilePhoto"
                name="removeProfilePhoto"
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--color-input-border)] bg-[var(--color-input)] text-primary accent-primary"
              />
              <span className="text-sm text-text-muted">
                Remove current photo
              </span>
            </label>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-4 font-heading text-base font-bold text-text-primary">
          CV / Resume
        </legend>
        <div className="space-y-4">
          {profile.cvUrl && (
            <div>
              <a
                href={profile.cvUrl}
                target="_blank"
                className="text-sm text-primary underline hover:text-secondary"
              >
                View current CV
              </a>
            </div>
          )}
          <div>
            <label
              htmlFor="cvFile"
              className="mb-1.5 block text-sm font-medium text-text-muted"
            >
              Upload new CV
            </label>
            <input
              id="cvFile"
              name="cvFile"
              type="file"
              accept="application/pdf"
              className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-4 py-2.5 text-sm text-text-primary file:mr-3 file:rounded file:border-0 file:bg-primary/20 file:px-3 file:py-1 file:text-sm file:text-primary file:transition-colors hover:file:bg-primary/30"
            />
            <p className="mt-1 text-xs text-text-muted/60">
              PDF only. Max 10 MB.
            </p>
            {state?.fieldErrors?.cvFile && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {state.fieldErrors.cvFile[0]}
              </p>
            )}
          </div>
          {profile.cvUrl && (
            <label className="flex cursor-pointer items-center gap-3">
              <input
                id="removeCv"
                name="removeCv"
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--color-input-border)] bg-[var(--color-input)] text-primary accent-primary"
              />
              <span className="text-sm text-text-muted">
                Remove current CV
              </span>
            </label>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-4 font-heading text-base font-bold text-text-primary">
          Availability
        </legend>
        <label className="flex items-center gap-3">
          <input
            id="isAvailable"
            name="isAvailable"
            type="checkbox"
            defaultChecked={profile.isAvailable}
            className="h-4 w-4 rounded border-[var(--color-input-border)] bg-[var(--color-input)] text-primary accent-primary"
          />
          <span className="text-sm text-text-muted">Is Available for Opportunities</span>
        </label>
      </fieldset>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
        <a
          href="/admin"
          className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          Back to Dashboard
        </a>
      </div>
    </form>
  );
}
