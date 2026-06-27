"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";

interface FieldErrors { [key: string]: string[] }
interface ActionResult { success: boolean; message: string; fieldErrors: FieldErrors; }

const VALID_TYPES = ["work", "internship", "education", "project", "organization"] as const;

function trim(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function nullify(v: string): string | null { return v.length === 0 ? null : v; }

function parseLines(raw: string): string[] {
  return raw.split("\n").map((l) => l.trim()).filter(Boolean);
}

export async function createExperience(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const type = trim(formData.get("type"));
    const title = trim(formData.get("title"));
    const institution = trim(formData.get("institution"));
    const location = trim(formData.get("location"));
    const startDate = trim(formData.get("startDate"));
    const endDate = trim(formData.get("endDate"));
    const isCurrent = formData.get("isCurrent") === "on";
    const description = trim(formData.get("description"));
    const responsibilitiesRaw = trim(formData.get("responsibilities"));
    const technologiesRaw = trim(formData.get("technologies"));
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = parseInt(sortOrderRaw || "0", 10);

    if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
      fieldErrors.type = ["Invalid type"];
    }
    if (!title || title.length < 2 || title.length > 200) {
      fieldErrors.title = ["Title must be 2–200 characters"];
    }
    if (!institution || institution.length < 2 || institution.length > 200) {
      fieldErrors.institution = ["Institution/Company must be 2–200 characters"];
    }
    if (!description || description.length < 10) {
      fieldErrors.description = ["Description must be at least 10 characters"];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    await prisma.experience.create({
      data: {
        type,
        title,
        institution,
        location: nullify(location),
        startDate: nullify(startDate),
        endDate: isCurrent ? null : nullify(endDate),
        isCurrent,
        description,
        responsibilities: parseLines(responsibilitiesRaw),
        technologies: parseLines(technologiesRaw),
        active: true,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experiences");

    return { success: true, message: "Entry created successfully", fieldErrors: {} };
  } catch (error) {
    console.error("[experiences/actions] create:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function updateExperience(
  id: number,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const type = trim(formData.get("type"));
    const title = trim(formData.get("title"));
    const institution = trim(formData.get("institution"));
    const location = trim(formData.get("location"));
    const startDate = trim(formData.get("startDate"));
    const endDate = trim(formData.get("endDate"));
    const isCurrent = formData.get("isCurrent") === "on";
    const description = trim(formData.get("description"));
    const responsibilitiesRaw = trim(formData.get("responsibilities"));
    const technologiesRaw = trim(formData.get("technologies"));
    const active = formData.get("active") === "on";
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = parseInt(sortOrderRaw || "0", 10);

    if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
      fieldErrors.type = ["Invalid type"];
    }
    if (!title || title.length < 2 || title.length > 200) {
      fieldErrors.title = ["Title must be 2–200 characters"];
    }
    if (!institution || institution.length < 2 || institution.length > 200) {
      fieldErrors.institution = ["Institution/Company must be 2–200 characters"];
    }
    if (!description || description.length < 10) {
      fieldErrors.description = ["Description must be at least 10 characters"];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    await prisma.experience.update({
      where: { id },
      data: {
        type,
        title,
        institution,
        location: nullify(location),
        startDate: nullify(startDate),
        endDate: isCurrent ? null : nullify(endDate),
        isCurrent,
        description,
        responsibilities: parseLines(responsibilitiesRaw),
        technologies: parseLines(technologiesRaw),
        active,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experiences");
    revalidatePath("/admin/education");

    return { success: true, message: "Entry updated successfully", fieldErrors: {} };
  } catch (error) {
    console.error("[experiences/actions] update:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function deleteExperience(id: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/experiences");
    revalidatePath("/admin/education");
    return { success: true, message: "Entry deleted", fieldErrors: {} };
  } catch (error) {
    console.error("[experiences/actions] delete:", error);
    return { success: false, message: "Failed to delete", fieldErrors: {} };
  }
}
