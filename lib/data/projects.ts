import { prisma } from "@/lib/prisma";
import type { Project } from "@/data/projects";
import { projects as fallbackProjects } from "@/data/projects";
import { mapProject } from "./mappers";

export async function getPublicProjects(): Promise<Project[]> {
  try {
    const db = await prisma.project.findMany({
      where: { active: true },
      include: { technologies: true },
      orderBy: { sortOrder: "asc" },
    });
    return db.map(mapProject);
  } catch (error) {
    console.warn("[data/projects] Database unavailable, using fallback:", error);
    return fallbackProjects
      .filter((p) => p.active)
      .sort((a, b) => a.order - b.order);
  }
}

export async function getPublicProject(slug: string): Promise<Project | null> {
  try {
    const db = await prisma.project.findUnique({
      where: { slug, active: true },
      include: { technologies: { orderBy: { sortOrder: "asc" } } },
    });
    if (!db) return null;
    return mapProject(db);
  } catch (error) {
    console.warn("[data/projects] Database unavailable, using fallback:", error);
    const fallback = fallbackProjects.filter((p) => p.active && p.slug === slug);
    return fallback.length > 0 ? fallback[0] : null;
  }
}
