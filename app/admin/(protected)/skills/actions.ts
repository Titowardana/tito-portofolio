"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

interface FieldErrors {
  [key: string]: string[];
}

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: FieldErrors;
}

const VALID_CATEGORIES = ["frontend", "backend", "database", "programming", "tools", "design", "networking", "cybersecurity"] as const;
const VALID_LEVELS = ["fundamental", "learning", "used-in-projects", "comfortable"] as const;

function trim(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function createSkill(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const name = trim(formData.get("name"));
    const category = trim(formData.get("category"));
    const level = trim(formData.get("level"));
    const icon = trim(formData.get("icon"));
    const description = trim(formData.get("description"));
    const featured = formData.get("featured") === "on";
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;

    if (!name || name.length < 1 || name.length > 100) {
      fieldErrors.name = ["Name is required and must be under 100 characters"];
    }
    if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      fieldErrors.category = ["Invalid category"];
    }
    if (!VALID_LEVELS.includes(level as typeof VALID_LEVELS[number])) {
      fieldErrors.level = ["Invalid level"];
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    await prisma.skill.create({
      data: {
        name,
        category,
        level,
        icon: icon || null,
        description: description || null,
        featured,
        active: true,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, message: "Skill created successfully", fieldErrors: {} };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Unique constraint")) {
      return { success: false, message: "A skill with this name already exists", fieldErrors: {} };
    }
    console.error("[skills/actions] create:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function updateSkill(
  id: number,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const name = trim(formData.get("name"));
    const category = trim(formData.get("category"));
    const level = trim(formData.get("level"));
    const icon = trim(formData.get("icon"));
    const description = trim(formData.get("description"));
    const featured = formData.get("featured") === "on";
    const active = formData.get("active") === "on";
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;

    if (!name || name.length < 1 || name.length > 100) {
      fieldErrors.name = ["Name is required and must be under 100 characters"];
    }
    if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      fieldErrors.category = ["Invalid category"];
    }
    if (!VALID_LEVELS.includes(level as typeof VALID_LEVELS[number])) {
      fieldErrors.level = ["Invalid level"];
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        level,
        icon: icon || null,
        description: description || null,
        featured,
        active,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, message: "Skill updated successfully", fieldErrors: {} };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Unique constraint")) {
      return { success: false, message: "A skill with this name already exists", fieldErrors: {} };
    }
    console.error("[skills/actions] update:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function deleteSkill(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, message: "Skill deleted", fieldErrors: {} };
  } catch (error) {
    console.error("[skills/actions] delete:", error);
    return { success: false, message: "Failed to delete skill", fieldErrors: {} };
  }
}
