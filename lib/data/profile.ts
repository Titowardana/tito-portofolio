import { existsSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import type { Profile } from "@/data/profile";
import { profile as fallbackProfile } from "@/data/profile";

/** Raw DB row type — includes lanyardImage which may not exist in stale generated client */
interface RawProfileRow {
  id: number;
  name: string;
  shortName: string;
  greeting: string;
  badge: string;
  primaryRole: string;
  secondaryRole: string | null;
  description: string;
  about: string | null;
  email: string | null;
  whatsapp: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  location: string | null;
  profileImage: string | null;
  lanyardImage: string | null;
  educationLogo: string | null;
  cvUrl: string | null;
  isAvailable: boolean | number;
}

function ensure(v: string | null | undefined): string {
  return v ?? "";
}

/** Only return local path if the file actually exists in public/ */
function safeFile(v: string | null | undefined): string {
  const path = v ?? "";
  if (!path) return "";
  // Skip validation for external URLs
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const full = join(process.cwd(), "public", path);
  try {
    return existsSync(full) ? path : "";
  } catch {
    return "";
  }
}

function mapRaw(row: RawProfileRow): Profile {
  return {
    name: row.name,
    shortName: row.shortName,
    greeting: row.greeting,
    badge: row.badge,
    primaryRole: row.primaryRole,
    secondaryRole: ensure(row.secondaryRole),
    description: row.description,
    about: ensure(row.about),
    email: ensure(row.email),
    whatsapp: ensure(row.whatsapp),
    github: ensure(row.githubUrl),
    linkedin: ensure(row.linkedinUrl),
    instagram: ensure(row.instagramUrl),
    tiktok: ensure(row.tiktokUrl),
    location: ensure(row.location),
    profileImage: safeFile(row.profileImage),
    lanyardImage: safeFile(row.lanyardImage),
    educationLogo: safeFile(row.educationLogo),
    cvUrl: safeFile(row.cvUrl),
    isAvailable: Boolean(row.isAvailable),
  };
}

export async function getPublicProfile(): Promise<Profile> {
  try {
    // Use $queryRaw to always get lanyardImage regardless of Prisma client version
    const rows = await prisma.$queryRaw<RawProfileRow[]>`
      SELECT
        id, name, shortName, greeting, badge,
        primaryRole, secondaryRole, description, about,
        email, whatsapp, githubUrl, linkedinUrl, instagramUrl, tiktokUrl,
        location, profileImage, lanyardImage, educationLogo, cvUrl, isAvailable
      FROM Profile
      LIMIT 1
    `;

    if (rows.length > 0) {
      return mapRaw(rows[0]);
    }

    console.warn("[data/profile] No profile found in database, using fallback");
    return fallbackProfile;
  } catch (error) {
    console.warn("[data/profile] Database unavailable, using fallback:", error);
    return fallbackProfile;
  }
}
