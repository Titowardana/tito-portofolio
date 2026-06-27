import { prisma } from "@/lib/prisma";
import type { Experience as ExperienceType } from "@/data/experiences";
import { experiences as fallbackExperiences } from "@/data/experiences";
import { mapExperience } from "./mappers";

export async function getPublicExperiences(): Promise<ExperienceType[]> {
  try {
    const db = await prisma.experience.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    const mapped = db.map(mapExperience);
    return mapped.filter((e): e is ExperienceType => e !== null);
  } catch (error) {
    console.warn("[data/experiences] Database unavailable, using fallback:", error);
    return fallbackExperiences
      .filter((e) => e.active)
      .sort((a, b) => a.order - b.order);
  }
}
