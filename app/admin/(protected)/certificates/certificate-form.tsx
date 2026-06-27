"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createCertificate, updateCertificate, deleteCertificate } from "./actions";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import type { Certificate } from "@prisma/client";

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
}

function Field({
  id, label, value, error, helper, type = "text", required, placeholder,
}: {
  id: string; label: string; value?: string | number; error?: string[];
  helper?: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <input
        id={id} name={id} type={type} defaultValue={value ?? ""} placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
      />
      {error && error.length > 0 && <p className="text-xs text-red-400">{error[0]}</p>}
      {helper && !error?.length && <p className="text-xs text-text-secondary">{helper}</p>}
    </div>
  );
}

export function CertificateForm({ certificate }: { certificate?: Certificate }) {
  const router = useRouter();
  const isEdit = Boolean(certificate);

  const action = isEdit
    ? updateCertificate.bind(null, certificate!.id, certificate!.image)
    : createCertificate;

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/certificates");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="title" label="Certificate Title" value={certificate?.title} error={state?.fieldErrors?.title} required />
        <Field id="issuer" label="Issuer Organization" value={certificate?.issuer} error={state?.fieldErrors?.issuer} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="credentialId" label="Credential ID" value={certificate?.credentialId ?? ""} />
        <Field id="credentialUrl" label="Credential URL" type="url" value={certificate?.credentialUrl ?? ""} error={state?.fieldErrors?.credentialUrl} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="issueDate" label="Issue Date" value={certificate?.issueDate ?? ""} placeholder="e.g. Oct 2023" />
        <Field id="expiryDate" label="Expiry Date" value={certificate?.expiryDate ?? ""} placeholder="Leave blank if no expiry" />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Certificate Image</legend>
        {certificate?.image && (
          <div className="flex items-center gap-4">
            <Image src={certificate.image} alt="Current image" width={80} height={60} className="h-16 w-24 rounded-lg border border-[var(--color-input-border)] object-cover" />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" name="removeImage" className="h-4 w-4 accent-red-400" />
              Remove image
            </label>
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="image" className="block text-sm font-medium text-text-primary">
            {certificate?.image ? "Replace Image" : "Upload Image"}
          </label>
          <input
            id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border file:border-[var(--color-input-border)] file:bg-[var(--color-input)] file:px-3 file:py-1.5 file:text-xs file:text-text-primary file:transition-colors hover:file:bg-surface-light"
          />
          {state?.fieldErrors?.image && <p className="text-xs text-red-400">{state.fieldErrors.image[0]}</p>}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="sortOrder" label="Sort Order" type="number" value={certificate?.sortOrder ?? 0} helper="Lower = appears first" />
        <div className="flex items-center gap-6 pt-7">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" name="featured" defaultChecked={certificate?.featured ?? false}
              className="h-4 w-4 rounded border-[var(--color-input-border)] bg-[var(--color-input)] accent-primary" />
            <span className="text-sm text-text-primary">Featured</span>
          </label>
          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" name="active" defaultChecked={certificate?.active ?? true}
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
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Certificate"}
        </button>
        <button
          type="button" onClick={() => router.push("/admin/certificates")}
          className="rounded-lg border border-[var(--color-input-border)] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-[var(--color-input-border)] hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function DeleteCertificateButton({ id, imagePath }: { id: number; imagePath: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);
    const result = await deleteCertificate(id, imagePath);
    setIsPending(false);
    if (result.success) router.push("/admin/certificates");
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
        title="Delete this certificate?"
        description="This will permanently remove the certificate and its image. This action cannot be undone."
        confirmLabel="Delete Certificate"
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
