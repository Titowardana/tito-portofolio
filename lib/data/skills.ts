import { prisma } from "@/lib/prisma";
import type { Skill } from "@/data/skills";
import { skills as fallbackSkills } from "@/data/skills";
import { mapSkill } from "./mappers";

export async function getPublicSkills(): Promise<Skill[]> {
  try {
    const db = await prisma.skill.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    const mapped: Skill[] = [];
    for (const skill of db) {
      const result = mapSkill(skill);
      if (result !== null) {
        mapped.push(result);
      }
    }
    return mapped;
  } catch (error) {
    console.warn("[data/skills] Database unavailable, using fallback:", error);
    return fallbackSkills
      .filter((s) => s.active)
      .sort((a, b) => a.order - b.order);
  }
}
