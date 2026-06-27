import { CertificateForm } from "../certificate-form";

export default function NewCertificatePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Add Certificate</h1>
        <p className="mt-1 text-sm text-text-secondary">Add a new certification or award.</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <CertificateForm />
      </div>
    </div>
  );
}
