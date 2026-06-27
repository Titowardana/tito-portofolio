import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function CertificatesAdminPage() {
  let certificates: Awaited<ReturnType<typeof prisma.certificate.findMany>> = [];
  let dbError = false;

  try {
    certificates = await prisma.certificate.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Certificates</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {certificates.length} certificate{certificates.length !== 1 ? "s" : ""} total.
          </p>
        </div>
        <Link
          href="/admin/certificates/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Certificate
        </Link>
      </div>

      {dbError && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          ⚠️ Could not connect to database.
        </div>
      )}

      {certificates.length === 0 && !dbError ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <p className="text-text-secondary">No certificates yet.</p>
          <Link href="/admin/certificates/new" className="mt-3 inline-block text-sm text-primary hover:underline">
            Add your first certificate →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-light ${!cert.active ? "opacity-50" : ""}`}
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-[var(--color-input)] flex items-center justify-center">
                {cert.image ? (
                  <Image src={cert.image} alt={cert.title} width={64} height={48} className="h-full w-full object-cover" />
                ) : (
                  <svg className="text-text-muted" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-text-primary truncate">{cert.title}</p>
                  {cert.featured && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Featured</span>}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary truncate">
                  {cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-text-secondary hover:bg-[var(--color-input)] hover:text-secondary" title="View Credential">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}
                <Link
                  href={`/admin/certificates/${cert.id}/edit`}
                  className="rounded-lg border border-[var(--color-input-border)] px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-border-subtle hover:text-text-primary"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
