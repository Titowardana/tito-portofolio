import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CertificateForm, DeleteCertificateButton } from "../../certificate-form";

export const dynamic = "force-dynamic";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certId = parseInt(id, 10);

  if (isNaN(certId)) notFound();

  const certificate = await prisma.certificate.findUnique({
    where: { id: certId },
  });

  if (!certificate) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit Certificate</h1>
          <p className="mt-1 text-sm text-text-secondary">{certificate.title}</p>
        </div>
        <DeleteCertificateButton id={certificate.id} imagePath={certificate.image} />
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <CertificateForm certificate={certificate} />
      </div>
    </div>
  );
}
