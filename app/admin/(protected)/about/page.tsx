import { prisma } from "@/lib/prisma";
import { AboutForm } from "./about-form";

export const dynamic = "force-dynamic";

interface RawProfile {
  id: number;
  about: string | null;
  cvUrl: string | null;
  lanyardImage: string | null;
}

export default async function AboutAdminPage() {
  const rows = await prisma.$queryRaw<RawProfile[]>`
    SELECT id, about, cvUrl, lanyardImage FROM Profile LIMIT 1
  `;

  const profile = rows[0] ?? null;

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-red-400">Profile not found. Please run the seed first.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">About Me</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your biography, images, and CV/Resume.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <AboutForm profile={{
          about: profile.about,
          cvUrl: profile.cvUrl,
          lanyardImage: profile.lanyardImage,
        }} />
      </div>
    </div>
  );
}
