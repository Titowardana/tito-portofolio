import type { Profile } from "@/data/profile";
import type { Project } from "@/data/projects";
import type { Skill, SkillCategory, SkillLevel } from "@/data/skills";
import type { Experience as ExperienceType } from "@/data/experiences";
import type { Certificate } from "@/data/certificates";

import type {
  Profile as DbProfile,
  Project as DbProject,
  ProjectTechnology as DbProjectTechnology,
  Skill as DbSkill,
  Experience as DbExperience,
  Certificate as DbCertificate,
} from "@prisma/client";

const ALLOWED_SKILL_CATEGORIES = new Set([
  "frontend", "backend", "database", "programming",
  "tools", "design", "networking", "cybersecurity",
]);

const ALLOWED_SKILL_LEVELS = new Set([
  "fundamental", "learning", "used-in-projects", "comfortable",
]);

const ALLOWED_EXPERIENCE_TYPES = new Set([
  "education", "internship", "work", "project", "organization",
]);

function ensureString(value: string | null | undefined): string {
  return value ?? "";
}

function ensureStringArray(
  json: unknown,
): string[] {
  if (Array.isArray(json)) {
    return json.filter(
      (item): item is string => typeof item === "string",
    );
  }
  return [];
}

function isSkillCategory(value: string): value is SkillCategory {
  return ALLOWED_SKILL_CATEGORIES.has(value);
}

function isSkillLevel(value: string): value is SkillLevel {
  return ALLOWED_SKILL_LEVELS.has(value);
}

function isExperienceType(value: string): value is ExperienceType["type"] {
  return ALLOWED_EXPERIENCE_TYPES.has(value);
}

export function mapProfile(db: DbProfile): Profile {
  return {
    name: db.name,
    shortName: db.shortName,
    greeting: db.greeting,
    badge: db.badge,
    primaryRole: db.primaryRole,
    secondaryRole: ensureString(db.secondaryRole),
    description: db.description,
    about: ensureString(db.about),
    email: ensureString(db.email),
    whatsapp: ensureString(db.whatsapp),
    github: ensureString(db.githubUrl),
    linkedin: ensureString(db.linkedinUrl),
    instagram: ensureString((db as unknown as Record<string, string | null>).instagramUrl),
    tiktok: ensureString((db as unknown as Record<string, string | null>).tiktokUrl),
    location: ensureString(db.location),
    profileImage: ensureString(db.profileImage),
    lanyardImage: ensureString((db as unknown as Record<string, string | null>).lanyardImage),
    educationLogo: ensureString((db as unknown as Record<string, string | null>).educationLogo),
    cvUrl: ensureString(db.cvUrl),
    isAvailable: db.isAvailable,
  };
}

export function mapProject(
  db: DbProject & { technologies: DbProjectTechnology[] },
): Project {
  return {
    id: db.slug,
    slug: db.slug,
    title: db.title,
    shortDescription: db.shortDescription,
    description: ensureString(db.description),
    role: ensureString(db.role),
    category: ensureString(db.category),
    technologies: db.technologies
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((t) => t.name),
    image: ensureString(db.image),
    githubUrl: ensureString(db.githubUrl),
    liveUrl: ensureString(db.liveUrl),
    featured: db.featured,
    active: db.active,
    order: db.sortOrder,
  };
}

export function mapSkill(db: DbSkill): Skill | null {
  if (!isSkillCategory(db.category)) {
    console.warn(`[mapper] Skill "${db.name}" has invalid category "${db.category}", skipping`);
    return null;
  }
  if (!isSkillLevel(db.level)) {
    console.warn(`[mapper] Skill "${db.name}" has invalid level "${db.level}", skipping`);
    return null;
  }
  return {
    id: String(db.id),
    name: db.name,
    category: db.category as SkillCategory,
    level: db.level as SkillLevel,
    icon: ensureString(db.icon),
    description: ensureString(db.description),
    featured: db.featured,
    active: db.active,
    order: db.sortOrder,
  };
}

export function mapExperience(db: DbExperience): ExperienceType | null {
  if (!isExperienceType(db.type)) {
    console.warn(`[mapper] Experience "${db.title}" has invalid type "${db.type}", skipping`);
    return null;
  }
  return {
    id: String(db.id),
    type: db.type as ExperienceType["type"],
    title: db.title,
    institution: db.institution,
    location: ensureString(db.location),
    startDate: ensureString(db.startDate),
    endDate: ensureString(db.endDate),
    isCurrent: db.isCurrent,
    description: db.description,
    responsibilities: ensureStringArray(db.responsibilities),
    technologies: ensureStringArray(db.technologies),
    active: db.active,
    order: db.sortOrder,
  };
}

export function mapCertificate(db: DbCertificate): Certificate {
  return {
    id: String(db.id),
    title: db.title,
    issuer: db.issuer,
    credentialId: ensureString(db.credentialId),
    issueDate: ensureString(db.issueDate),
    expiryDate: ensureString(db.expiryDate),
    image: ensureString(db.image),
    credentialUrl: ensureString(db.credentialUrl),
    featured: db.featured,
    active: db.active,
    order: db.sortOrder,
  };
}
