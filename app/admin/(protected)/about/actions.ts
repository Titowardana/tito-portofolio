"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { saveUpload, deleteUpload } from "@/lib/storage/local-storage";

interface FieldErrors { [key: string]: string[] }
interface ActionResult { success: boolean; message: string; fieldErrors: FieldErrors; }

function trim(v: FormDataEntryValue | null): string { return typeof v === "string" ? v.trim() : ""; }
function nullify(v: string): string | null { return v.length === 0 ? null : v; }

async function handleImageUpload(
  file: FormDataEntryValue | null,
  remove: boolean,
  current: string | null,
): Promise<string | null> {
  if (file instanceof File && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return saveUpload(buffer, file.type);
  }
  if (remove) return null;
  return current;
}

export async function updateAbout(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const about = trim(formData.get("about"));
    const cvFile = formData.get("cvUrl");
    const removeCv = formData.get("removeCv") === "on";
    const lanyardImageFile = formData.get("lanyardImage");
    const removeLanyardImage = formData.get("removeLanyardImage") === "on";
    const educationLogoFile = formData.get("educationLogo");
    const removeEducationLogo = formData.get("removeEducationLogo") === "on";

    // About is optional — only validate length if provided
    if (about.length > 0 && about.length < 10) {
      fieldErrors.about = ["About section should be at least 10 characters"];
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (cvFile instanceof File && cvFile.size > 0) {
      if (cvFile.type !== "application/pdf") fieldErrors.cvUrl = ["CV must be a PDF file"];
      else if (cvFile.size > 10 * 1024 * 1024) fieldErrors.cvUrl = ["CV must be under 10 MB"];
    }

    if (lanyardImageFile instanceof File && lanyardImageFile.size > 0) {
      if (!allowedImageTypes.includes(lanyardImageFile.type)) fieldErrors.lanyardImage = ["Only JPG, PNG, or WebP images are allowed"];
      else if (lanyardImageFile.size > 5 * 1024 * 1024) fieldErrors.lanyardImage = ["Image must be under 5 MB"];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    const profile = await prisma.profile.findFirst();
    if (!profile) {
      return { success: false, message: "Profile not found", fieldErrors: {} };
    }

    // Read new fields safely via raw cast (Prisma client may be stale)
    const raw = profile as unknown as Record<string, string | null>;
    const currentLanyardImage = raw.lanyardImage ?? null;
    const currentEducationLogo = raw.educationLogo ?? null;

    const newCvUrl = await handleImageUpload(cvFile, removeCv, profile.cvUrl);
    const newLanyardImage = await handleImageUpload(lanyardImageFile, removeLanyardImage, currentLanyardImage);
    const newEducationLogo = await handleImageUpload(educationLogoFile, removeEducationLogo, currentEducationLogo);

    // $executeRaw so we don't depend on the stale Prisma client knowing new columns
    await prisma.$executeRaw`
      UPDATE \`Profile\`
      SET
        \`about\`         = ${nullify(about)},
        \`cvUrl\`         = ${newCvUrl},
        \`lanyardImage\`  = ${newLanyardImage},
        \`educationLogo\` = ${newEducationLogo},
        \`updatedAt\`     = NOW()
      WHERE \`id\` = ${profile.id}
    `;

    // Clean up replaced files
    if (profile.cvUrl && profile.cvUrl !== newCvUrl) await deleteUpload(profile.cvUrl).catch(() => {});
    if (currentLanyardImage && currentLanyardImage !== newLanyardImage) await deleteUpload(currentLanyardImage).catch(() => {});
    if (currentEducationLogo && currentEducationLogo !== newEducationLogo) await deleteUpload(currentEducationLogo).catch(() => {});

    revalidatePath("/");
    revalidatePath("/admin/about");
    revalidatePath("/admin/profile");

    return { success: true, message: "About section updated successfully", fieldErrors: {} };
  } catch (error) {
    console.error("[about/actions] update:", error);
    return { success: false, message: "An unexpected error occurred", fieldErrors: {} };
  }
}
