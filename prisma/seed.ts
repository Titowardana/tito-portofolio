import { PrismaClient, Prisma } from "@prisma/client";
import { profile as profileData } from "../data/profile";
import { projects as projectsData } from "../data/projects";
import { skills as skillsData } from "../data/skills";
import { experiences as experiencesData } from "../data/experiences";
import { certificates as certificatesData } from "../data/certificates";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

type Tx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

async function seedProfile(tx: Tx) {
  const existing = await tx.profile.findFirst();
  const data = {
    name: profileData.name,
    shortName: profileData.shortName,
    greeting: profileData.greeting,
    badge: profileData.badge,
    primaryRole: profileData.primaryRole,
    secondaryRole: profileData.secondaryRole || null,
    description: profileData.description,
    about: null,
    email: profileData.email || null,
    whatsapp: profileData.whatsapp || null,
    githubUrl: profileData.github || null,
    linkedinUrl: profileData.linkedin || null,
    location: profileData.location || null,
    profileImage: profileData.profileImage || null,
    cvUrl: profileData.cvUrl || null,
    isAvailable: true,
  };

  if (existing) {
    await tx.profile.update({ where: { id: existing.id }, data });
    console.log("Profile updated");
  } else {
    await tx.profile.create({ data });
    console.log("Profile created");
  }
}

async function seedProjects(tx: Tx) {
  for (const p of projectsData) {
    await tx.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description || null,
        role: p.role || null,
        category: p.category || null,
        image: p.image || null,
        githubUrl: p.githubUrl || null,
        liveUrl: p.liveUrl || null,
        featured: p.featured,
        active: p.active,
        sortOrder: p.order,
      },
      create: {
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description || null,
        role: p.role || null,
        category: p.category || null,
        image: p.image || null,
        githubUrl: p.githubUrl || null,
        liveUrl: p.liveUrl || null,
        featured: p.featured,
        active: p.active,
        sortOrder: p.order,
      },
    });

    const project = await tx.project.findUnique({ where: { slug: p.slug } });
    if (project) {
      await tx.projectTechnology.deleteMany({ where: { projectId: project.id } });
      if (p.technologies.length > 0) {
        await tx.projectTechnology.createMany({
          data: p.technologies.map((tech, idx) => ({
            projectId: project.id,
            name: tech,
            sortOrder: idx + 1,
          })),
        });
      }
    }

    console.log(`Project "${p.slug}" seeded`);
  }
}

async function seedSkills(tx: Tx) {
  for (const s of skillsData) {
    await tx.skill.upsert({
      where: { name: s.name },
      update: {
        category: s.category,
        level: s.level,
        icon: s.icon || null,
        description: s.description || null,
        featured: s.featured,
        active: s.active,
        sortOrder: s.order,
      },
      create: {
        name: s.name,
        category: s.category,
        level: s.level,
        icon: s.icon || null,
        description: s.description || null,
        featured: s.featured,
        active: s.active,
        sortOrder: s.order,
      },
    });
    console.log(`Skill "${s.name}" seeded`);
  }
}

async function seedExperiences(tx: Tx) {
  for (const e of experiencesData) {
    const responsibilities = e.responsibilities.length > 0 ? e.responsibilities : null;
    const technologies = e.technologies.length > 0 ? e.technologies : null;
    const existing = await tx.experience.findFirst({
      where: { type: e.type, title: e.title, institution: e.institution },
    });
    if (existing) {
      await tx.experience.update({
        where: { id: existing.id },
        data: {
          location: e.location || null,
          startDate: e.startDate || null,
          endDate: e.endDate || null,
          isCurrent: e.isCurrent,
          description: e.description,
          responsibilities: responsibilities ?? Prisma.NullableJsonNullValueInput.DbNull,
          technologies: technologies ?? Prisma.NullableJsonNullValueInput.DbNull,
          active: e.active,
          sortOrder: e.order,
        },
      });
      console.log(`Experience "${e.id}" updated`);
    } else {
      await tx.experience.create({
        data: {
          type: e.type,
          title: e.title,
          institution: e.institution,
          location: e.location || null,
          startDate: e.startDate || null,
          endDate: e.endDate || null,
          isCurrent: e.isCurrent,
          description: e.description,
          responsibilities: responsibilities ?? Prisma.NullableJsonNullValueInput.DbNull,
          technologies: technologies ?? Prisma.NullableJsonNullValueInput.DbNull,
          active: e.active,
          sortOrder: e.order,
        },
      });
      console.log(`Experience "${e.id}" created`);
    }
  }
}

async function seedCertificates(tx: Tx) {
  if (certificatesData.length === 0) {
    console.log("Certificates source empty — skipped (0 records, none deleted)");
    return;
  }
  for (const c of certificatesData) {
    const existing = await tx.certificate.findFirst({
      where: {
        title: c.title,
        issuer: c.issuer,
        credentialId: c.credentialId || undefined,
      },
    });
    if (existing) {
      await tx.certificate.update({
        where: { id: existing.id },
        data: {
          issueDate: c.issueDate || null,
          expiryDate: c.expiryDate || null,
          image: c.image || null,
          credentialUrl: c.credentialUrl || null,
          featured: c.featured,
          active: c.active,
          sortOrder: c.order,
        },
      });
      console.log(`Certificate "${c.id}" updated`);
    } else {
      await tx.certificate.create({
        data: {
          title: c.title,
          issuer: c.issuer,
          credentialId: c.credentialId || null,
          issueDate: c.issueDate || null,
          expiryDate: c.expiryDate || null,
          image: c.image || null,
          credentialUrl: c.credentialUrl || null,
          featured: c.featured,
          active: c.active,
          sortOrder: c.order,
        },
      });
      console.log(`Certificate "${c.id}" created`);
    }
  }
}

async function seedSiteSettings(tx: Tx) {
  await tx.siteSetting.upsert({
    where: { key: "portfolio_seed_version" },
    update: { value: "1" },
    create: { key: "portfolio_seed_version", value: "1" },
  });
  console.log("Site settings seeded (portfolio_seed_version=1)");
}

async function main() {
  console.log("Seeding started...");

  await prisma.$transaction(async (tx) => {
    await seedProfile(tx);
    await seedProjects(tx);
    await seedSkills(tx);
    await seedExperiences(tx);
    await seedCertificates(tx);
    await seedSiteSettings(tx);
  });

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
