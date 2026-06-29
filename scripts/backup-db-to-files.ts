import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const DATA_DIR = join(process.cwd(), "data");

function q(v: string): string {
  return JSON.stringify(v);
}

function ensure(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function ensureArray(json: unknown): string[] {
  if (Array.isArray(json)) return json.filter((i): i is string => typeof i === "string");
  return [];
}

async function listTables() {
  const dbs = await prisma.$queryRawUnsafe<Record<string, string>[]>(
    "SHOW DATABASES"
  );
  console.log("Databases:", dbs.map(d => Object.values(d)[0]));
  
  // Try to find tables
  const tables = await prisma.$queryRawUnsafe<Record<string, string>[]>(
    "SHOW TABLES"
  );
  console.log("Tables in current db:", tables.map(t => Object.values(t)[0]));
  
  // Check what user we are
  const user = await prisma.$queryRawUnsafe<Record<string, string>[]>(
    "SELECT CURRENT_USER() as user"
  );
  console.log("Current user:", user[0]?.user);
}

async function backupProfile() {
  const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
    "SELECT * FROM Profile LIMIT 1"
  );
  if (!rows.length) { console.log("⚠️ No profile"); return; }
  const p = rows[0];

  const content = `export interface Profile {
  name: string;
  shortName: string;
  greeting: string;
  badge: string;
  primaryRole: string;
  secondaryRole: string;
  description: string;
  about: string;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  location: string;
  profileImage: string;
  lanyardImage: string;
  educationLogo: string;
  cvUrl: string;
  isAvailable: boolean;
}

export const profile: Profile = {
  name: ${q(ensure(p.name))},
  shortName: ${q(ensure(p.shortName))},
  greeting: ${q(ensure(p.greeting))},
  badge: ${q(ensure(p.badge))},
  primaryRole: ${q(ensure(p.primaryRole))},
  secondaryRole: ${q(ensure(p.secondaryRole))},
  description: ${q(ensure(p.description))},
  about: ${q(ensure(p.about))},
  email: ${q(ensure(p.email))},
  whatsapp: ${q(ensure(p.whatsapp))},
  github: ${q(ensure(p.githubUrl))},
  linkedin: ${q(ensure(p.linkedinUrl))},
  instagram: ${q(ensure(p.instagramUrl))},
  tiktok: ${q(ensure(p.tiktokUrl))},
  location: ${q(ensure(p.location))},
  profileImage: ${q(ensure(p.profileImage))},
  lanyardImage: ${q(ensure(p.lanyardImage))},
  educationLogo: ${q(ensure(p.educationLogo))},
  cvUrl: ${q(ensure(p.cvUrl))},
  isAvailable: ${p.isAvailable ? "true" : "false"},
};
`;
  writeFileSync(join(DATA_DIR, "profile.ts"), content, "utf-8");
  console.log("✅ Profile backed up → data/profile.ts");
}

async function backupProjects() {
  const projects = await prisma.project.findMany({
    include: { technologies: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  if (projects.length === 0) { console.log("⚠️ No projects"); return; }
  const entries = projects.map((p) => {
    const techs = p.technologies.map((t) => q(t.name)).join(", ");
    return `  {
    id: ${q(p.slug)},
    slug: ${q(p.slug)},
    title: ${q(p.title)},
    shortDescription: ${q(p.shortDescription)},
    description: ${q(ensure(p.description))},
    role: ${q(ensure(p.role))},
    category: ${q(ensure(p.category))},
    technologies: [${techs}],
    image: ${q(ensure(p.image))},
    githubUrl: ${q(ensure(p.githubUrl))},
    liveUrl: ${q(ensure(p.liveUrl))},
    featured: ${p.featured ? "true" : "false"},
    active: ${p.active ? "true" : "false"},
    order: ${p.sortOrder},
  }`;
  }).join(",\n");

  const content = `export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  role: string;
  category: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export const projects: Project[] = [
${entries},
];
`;
  writeFileSync(join(DATA_DIR, "projects.ts"), content, "utf-8");
  console.log(`✅ ${projects.length} projects backed up → data/projects.ts`);
}

async function backupSkills() {
  const skills = await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });

  const entries = skills.map((s) => {
    const lvl = s.level === "used-in-projects" ? `"used-in-projects"` : q(s.level);
    return `  { id: ${q(s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))}, name: ${q(s.name)}, category: ${q(s.category)}, level: ${lvl}, icon: ${q(ensure(s.icon))}, description: ${q(ensure(s.description))}, featured: ${s.featured ? "true" : "false"}, active: ${s.active ? "true" : "false"}, order: ${s.sortOrder} }`;
  }).join(",\n");

  const content = `export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "programming"
  | "tools"
  | "design"
  | "networking"
  | "cybersecurity";

export type SkillLevel =
  | "fundamental"
  | "learning"
  | "used-in-projects"
  | "comfortable";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon: string;
  description: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export const skills: Skill[] = [
${entries},
];
`;
  writeFileSync(join(DATA_DIR, "skills.ts"), content, "utf-8");
  console.log(`✅ ${skills.length} skills backed up → data/skills.ts`);
}

async function backupExperiences() {
  const exps = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });

  const entries = exps.map((e) => {
    const resp = ensureArray(e.responsibilities).map((r) => q(r)).join(", ");
    const techs = ensureArray(e.technologies).map((t) => q(t)).join(", ");
    return `  {
    id: ${q(e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + e.type)},
    type: ${q(e.type)},
    title: ${q(e.title)},
    institution: ${q(e.institution)},
    location: ${q(ensure(e.location))},
    startDate: ${q(ensure(e.startDate))},
    endDate: ${q(ensure(e.endDate))},
    isCurrent: ${e.isCurrent ? "true" : "false"},
    description: ${q(e.description)},
    responsibilities: [${resp}],
    technologies: [${techs}],
    active: ${e.active ? "true" : "false"},
    order: ${e.sortOrder},
  }`;
  }).join(",\n");

  const content = `export type ExperienceType =
  | "education"
  | "internship"
  | "work"
  | "project"
  | "organization";

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  active: boolean;
  order: number;
}

export const experiences: Experience[] = [
${entries},
];
`;
  writeFileSync(join(DATA_DIR, "experiences.ts"), content, "utf-8");
  console.log(`✅ ${exps.length} experiences backed up → data/experiences.ts`);
}

async function backupCertificates() {
  const certs = await prisma.certificate.findMany({ orderBy: { sortOrder: "asc" } });

  const entries = certs.map((c) => {
    return `  {
    id: ${q(c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + c.issuer.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))},
    title: ${q(c.title)},
    issuer: ${q(c.issuer)},
    credentialId: ${q(ensure(c.credentialId))},
    issueDate: ${q(ensure(c.issueDate))},
    expiryDate: ${q(ensure(c.expiryDate))},
    image: ${q(ensure(c.image))},
    credentialUrl: ${q(ensure(c.credentialUrl))},
    featured: ${c.featured ? "true" : "false"},
    active: ${c.active ? "true" : "false"},
    order: ${c.sortOrder},
  }`;
  }).join(",\n");

  const content = `export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  credentialId: string;
  issueDate: string;
  expiryDate: string;
  image: string;
  credentialUrl: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export const certificates: Certificate[] = [
${entries},
];
`;
  writeFileSync(join(DATA_DIR, "certificates.ts"), content, "utf-8");
  console.log(`✅ ${certs.length} certificates backed up → data/certificates.ts`);
}

async function main() {
  console.log("Backing up database to static data files...\n");

  try {
    await listTables();
    await backupProfile();
    await backupProjects();
    await backupSkills();
    await backupExperiences();
    await backupCertificates();
    console.log("\n✅ All data backed up successfully");
  } catch (error) {
    console.error("Backup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
