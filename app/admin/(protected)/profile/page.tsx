import { prisma } from "@/lib/prisma";
import { mapProfile } from "@/lib/data/mappers";
import { profile as fallbackProfile } from "@/data/profile";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const dbProfile = await prisma.profile.findFirst();
  const profile = dbProfile ? mapProfile(dbProfile) : fallbackProfile;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--color-input-border)] bg-[var(--background-dark)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-heading text-lg font-bold text-text-primary">
              Edit Profile
            </h1>
            <p className="text-sm text-text-muted">
              Manage your public profile information
            </p>
          </div>
          <a
            href="/admin"
            className="rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-5 py-2 text-sm font-medium text-text-muted transition-all hover:bg-surface-light hover:text-text-primary"
          >
            Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <ProfileForm profile={profile} />
      </main>
    </div>
  );
}
