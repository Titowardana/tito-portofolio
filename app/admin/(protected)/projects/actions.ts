"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { saveUpload, deleteUpload, getAllowedMimeTypes } from "@/lib/storage/local-storage";

interface FieldErrors {
  [key: string]: string[];
}

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: FieldErrors;
  redirectId?: number;
}

function trim(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function nullify(v: string): string | null {
  return v.length === 0 ? null : v;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function validateUrl(value: string, field: string, errors: FieldErrors): void {
  if (!value) return;
  try {
    const u = new URL(value);
    if (!["https:", "http:"].includes(u.protocol)) {
      errors[field] = ["Must be a valid URL"];
    }
  } catch {
    errors[field] = ["Invalid URL format"];
  }
}

export async function createProject(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const title = trim(formData.get("title"));
    const shortDescription = trim(formData.get("shortDescription"));
    const description = trim(formData.get("description"));
    const role = trim(formData.get("role"));
    const category = trim(formData.get("category"));
    const githubUrl = trim(formData.get("githubUrl"));
    const liveUrl = trim(formData.get("liveUrl"));
    const featured = formData.get("featured") === "on";
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = parseInt(sortOrderRaw || "0", 10);
    const techRaw = trim(formData.get("technologies")); // comma-separated

    const imageFile = formData.get("image");

    if (!title || title.length < 2 || title.length > 150) {
      fieldErrors.title = ["Title must be 2–150 characters"];
    }
    if (!shortDescription || shortDescription.length < 10 || shortDescription.length > 500) {
      fieldErrors.shortDescription = ["Short description must be 10–500 characters"];
    }
    if (githubUrl) validateUrl(githubUrl, "githubUrl", fieldErrors);
    if (liveUrl) validateUrl(liveUrl, "liveUrl", fieldErrors);
    if (imageFile instanceof File && imageFile.size > 0) {
      const allowed = getAllowedMimeTypes().filter((m) => m !== "application/pdf");
      if (!allowed.includes(imageFile.type)) {
        fieldErrors.image = ["Only JPG, PNG, WebP images are allowed"];
      } else if (imageFile.size > 8 * 1024 * 1024) {
        fieldErrors.image = ["Image must be under 8 MB"];
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    const slug = slugify(title);
    const techs = techRaw
      ? techRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    let imagePath: string | null = null;
    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imagePath = await saveUpload(buffer, imageFile.type);
    }

    const project = await prisma.project.create({
      data: {
        slug: slug || `project-${Date.now()}`,
        title,
        shortDescription,
        description: nullify(description),
        role: nullify(role),
        category: nullify(category),
        githubUrl: nullify(githubUrl),
        liveUrl: nullify(liveUrl),
        featured,
        active: true,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
        image: imagePath,
        technologies: {
          create: techs.map((name, i) => ({ name, sortOrder: i })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, message: "Project created", fieldErrors: {}, redirectId: project.id };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Unique constraint")) {
      return { success: false, message: "A project with this slug already exists. Please change the title slightly.", fieldErrors: {} };
    }
    console.error("[projects/actions] create:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function updateProject(
  id: number,
  oldImagePath: string | null,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const title = trim(formData.get("title"));
    const shortDescription = trim(formData.get("shortDescription"));
    const description = trim(formData.get("description"));
    const role = trim(formData.get("role"));
    const category = trim(formData.get("category"));
    const githubUrl = trim(formData.get("githubUrl"));
    const liveUrl = trim(formData.get("liveUrl"));
    const featured = formData.get("featured") === "on";
    const active = formData.get("active") === "on";
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = parseInt(sortOrderRaw || "0", 10);
    const techRaw = trim(formData.get("technologies"));
    const removeImage = formData.get("removeImage") === "on";
    const imageFile = formData.get("image");

    if (!title || title.length < 2 || title.length > 150) {
      fieldErrors.title = ["Title must be 2–150 characters"];
    }
    if (!shortDescription || shortDescription.length < 10 || shortDescription.length > 500) {
      fieldErrors.shortDescription = ["Short description must be 10–500 characters"];
    }
    if (githubUrl) validateUrl(githubUrl, "githubUrl", fieldErrors);
    if (liveUrl) validateUrl(liveUrl, "liveUrl", fieldErrors);
    if (imageFile instanceof File && imageFile.size > 0) {
      const allowed = getAllowedMimeTypes().filter((m) => m !== "application/pdf");
      if (!allowed.includes(imageFile.type)) {
        fieldErrors.image = ["Only JPG, PNG, WebP images are allowed"];
      } else if (imageFile.size > 8 * 1024 * 1024) {
        fieldErrors.image = ["Image must be under 8 MB"];
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    let newImagePath: string | null = oldImagePath;
    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      newImagePath = await saveUpload(buffer, imageFile.type);
    } else if (removeImage) {
      newImagePath = null;
    }

    const techs = techRaw
      ? techRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    await prisma.$transaction([
      prisma.projectTechnology.deleteMany({ where: { projectId: id } }),
      prisma.project.update({
        where: { id },
        data: {
          title,
          shortDescription,
          description: nullify(description),
          role: nullify(role),
          category: nullify(category),
          githubUrl: nullify(githubUrl),
          liveUrl: nullify(liveUrl),
          featured,
          active,
          sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
          image: newImagePath,
          technologies: {
            create: techs.map((name, i) => ({ name, sortOrder: i })),
          },
        },
      }),
    ]);

    if (oldImagePath && oldImagePath !== newImagePath) {
      await deleteUpload(oldImagePath).catch(() => {});
    }

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, message: "Project updated", fieldErrors: {}, redirectId: id };
  } catch (error) {
    console.error("[projects/actions] update:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function deleteProject(id: number, imagePath: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.project.delete({ where: { id } });
    if (imagePath) await deleteUpload(imagePath).catch(() => {});
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true, message: "Project deleted", fieldErrors: {} };
  } catch (error) {
    console.error("[projects/actions] delete:", error);
    return { success: false, message: "Failed to delete project", fieldErrors: {} };
  }
}
