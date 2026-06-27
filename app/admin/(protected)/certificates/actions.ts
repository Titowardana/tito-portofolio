"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { saveUpload, deleteUpload, getAllowedMimeTypes } from "@/lib/storage/local-storage";

interface FieldErrors { [key: string]: string[] }
interface ActionResult { success: boolean; message: string; fieldErrors: FieldErrors; }

function trim(v: FormDataEntryValue | null): string { return typeof v === "string" ? v.trim() : ""; }
function nullify(v: string): string | null { return v.length === 0 ? null : v; }

function validateUrl(value: string, field: string, errors: FieldErrors): void {
  if (!value) return;
  try {
    const u = new URL(value);
    if (!["https:", "http:"].includes(u.protocol)) errors[field] = ["Must be a valid URL"];
  } catch {
    errors[field] = ["Invalid URL format"];
  }
}

export async function createCertificate(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const title = trim(formData.get("title"));
    const issuer = trim(formData.get("issuer"));
    const credentialId = trim(formData.get("credentialId"));
    const issueDate = trim(formData.get("issueDate"));
    const expiryDate = trim(formData.get("expiryDate"));
    const credentialUrl = trim(formData.get("credentialUrl"));
    const featured = formData.get("featured") === "on";
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = parseInt(sortOrderRaw || "0", 10);
    const imageFile = formData.get("image");

    if (!title || title.length < 2 || title.length > 200) {
      fieldErrors.title = ["Title must be 2–200 characters"];
    }
    if (!issuer || issuer.length < 2 || issuer.length > 150) {
      fieldErrors.issuer = ["Issuer must be 2–150 characters"];
    }
    if (credentialUrl) validateUrl(credentialUrl, "credentialUrl", fieldErrors);

    if (imageFile instanceof File && imageFile.size > 0) {
      const allowed = getAllowedMimeTypes().filter((m) => m !== "application/pdf");
      if (!allowed.includes(imageFile.type)) {
        fieldErrors.image = ["Only JPG, PNG, WebP images are allowed"];
      } else if (imageFile.size > 5 * 1024 * 1024) {
        fieldErrors.image = ["Image must be under 5 MB"];
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    let imagePath: string | null = null;
    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imagePath = await saveUpload(buffer, imageFile.type);
    }

    await prisma.certificate.create({
      data: {
        title,
        issuer,
        credentialId: nullify(credentialId),
        issueDate: nullify(issueDate),
        expiryDate: nullify(expiryDate),
        credentialUrl: nullify(credentialUrl),
        image: imagePath,
        featured,
        active: true,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/certificates");

    return { success: true, message: "Certificate added", fieldErrors: {} };
  } catch (error) {
    console.error("[certificates/actions] create:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function updateCertificate(
  id: number,
  oldImagePath: string | null,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const title = trim(formData.get("title"));
    const issuer = trim(formData.get("issuer"));
    const credentialId = trim(formData.get("credentialId"));
    const issueDate = trim(formData.get("issueDate"));
    const expiryDate = trim(formData.get("expiryDate"));
    const credentialUrl = trim(formData.get("credentialUrl"));
    const featured = formData.get("featured") === "on";
    const active = formData.get("active") === "on";
    const sortOrderRaw = trim(formData.get("sortOrder"));
    const sortOrder = parseInt(sortOrderRaw || "0", 10);
    const removeImage = formData.get("removeImage") === "on";
    const imageFile = formData.get("image");

    if (!title || title.length < 2 || title.length > 200) {
      fieldErrors.title = ["Title must be 2–200 characters"];
    }
    if (!issuer || issuer.length < 2 || issuer.length > 150) {
      fieldErrors.issuer = ["Issuer must be 2–150 characters"];
    }
    if (credentialUrl) validateUrl(credentialUrl, "credentialUrl", fieldErrors);

    if (imageFile instanceof File && imageFile.size > 0) {
      const allowed = getAllowedMimeTypes().filter((m) => m !== "application/pdf");
      if (!allowed.includes(imageFile.type)) {
        fieldErrors.image = ["Only JPG, PNG, WebP images are allowed"];
      } else if (imageFile.size > 5 * 1024 * 1024) {
        fieldErrors.image = ["Image must be under 5 MB"];
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

    await prisma.certificate.update({
      where: { id },
      data: {
        title,
        issuer,
        credentialId: nullify(credentialId),
        issueDate: nullify(issueDate),
        expiryDate: nullify(expiryDate),
        credentialUrl: nullify(credentialUrl),
        image: newImagePath,
        featured,
        active,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      },
    });

    if (oldImagePath && oldImagePath !== newImagePath) {
      await deleteUpload(oldImagePath).catch(() => {});
    }

    revalidatePath("/");
    revalidatePath("/admin/certificates");

    return { success: true, message: "Certificate updated", fieldErrors: {} };
  } catch (error) {
    console.error("[certificates/actions] update:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}

export async function deleteCertificate(id: number, imagePath: string | null): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.certificate.delete({ where: { id } });
    if (imagePath) await deleteUpload(imagePath).catch(() => {});
    revalidatePath("/");
    revalidatePath("/admin/certificates");
    return { success: true, message: "Certificate deleted", fieldErrors: {} };
  } catch (error) {
    console.error("[certificates/actions] delete:", error);
    return { success: false, message: "Failed to delete certificate", fieldErrors: {} };
  }
}
