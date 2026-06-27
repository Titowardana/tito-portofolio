"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  saveUpload,
  deleteUpload,
  getAllowedMimeTypes,
} from "@/lib/storage/local-storage";

interface FieldErrors {
  [key: string]: string[];
}

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors: FieldErrors;
}

function trimVal(value: FormDataEntryValue | null): string {
  if (typeof value === "string") return value.trim();
  return "";
}

function nullify(val: string): string | null {
  return val.length === 0 ? null : val;
}

function validateUrl(value: string, field: string, fieldErrors: FieldErrors): void {
  if (value.length === 0) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      fieldErrors[field].push("Must be an HTTPS URL");
    }
  } catch {
    fieldErrors[field].push("Invalid URL format");
  }
}

export async function updateProfile(
  prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};

  try {
    await requireAdmin();

    const name = trimVal(formData.get("name"));
    const shortName = trimVal(formData.get("shortName"));
    const greeting = trimVal(formData.get("greeting"));
    const badge = trimVal(formData.get("badge"));
    const primaryRole = trimVal(formData.get("primaryRole"));
    const secondaryRole = trimVal(formData.get("secondaryRole"));
    const description = trimVal(formData.get("description"));
    const about = trimVal(formData.get("about"));
    const emailRaw = trimVal(formData.get("email"));
    const whatsapp = trimVal(formData.get("whatsapp"));
    const githubUrl = trimVal(formData.get("githubUrl"));
    const linkedinUrl = trimVal(formData.get("linkedinUrl"));
    const instagramUrl = trimVal(formData.get("instagramUrl"));
    const tiktokUrl = trimVal(formData.get("tiktokUrl"));
    const location = trimVal(formData.get("location"));
    const isAvailable = formData.get("isAvailable") === "on";

    const profilePhoto = formData.get("profilePhoto");
    const cvFile = formData.get("cvFile");
    const removeProfilePhoto = formData.get("removeProfilePhoto") === "on";
    const removeCv = formData.get("removeCv") === "on";

    if (name.length < 2 || name.length > 100) {
      fieldErrors.name = ["Name must be between 2 and 100 characters"];
    }

    if (shortName.length < 1 || shortName.length > 50) {
      fieldErrors.shortName = ["Short name must be between 1 and 50 characters"];
    }

    if (greeting.length < 1 || greeting.length > 100) {
      fieldErrors.greeting = ["Greeting must be between 1 and 100 characters"];
    }

    if (badge.length < 1 || badge.length > 150) {
      fieldErrors.badge = ["Badge must be between 1 and 150 characters"];
    }

    if (primaryRole.length < 1 || primaryRole.length > 150) {
      fieldErrors.primaryRole = ["Primary role must be between 1 and 150 characters"];
    }

    if (secondaryRole.length > 150) {
      fieldErrors.secondaryRole = ["Secondary role must be at most 150 characters"];
    }

    if (description.length < 20 || description.length > 1000) {
      fieldErrors.description = ["Description must be between 20 and 1000 characters"];
    }

    if (about.length > 5000) {
      fieldErrors.about = ["About must be at most 5000 characters"];
    }

    if (emailRaw.length > 0) {
      const email = emailRaw.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        fieldErrors.email = ["Invalid email format"];
      }
    }

    if (whatsapp.length > 0) {
      if (!/^\d{8,16}$/.test(whatsapp)) {
        fieldErrors.whatsapp = [
          "Must be 8–16 digits in international format without +, spaces, or dashes",
        ];
      }
    }

    if (githubUrl.length > 0) {
      validateUrl(githubUrl, "githubUrl", fieldErrors);
    }

    if (linkedinUrl.length > 0) {
      validateUrl(linkedinUrl, "linkedinUrl", fieldErrors);
    }

    if (instagramUrl.length > 0) {
      validateUrl(instagramUrl, "instagramUrl", fieldErrors);
    }

    if (tiktokUrl.length > 0) {
      validateUrl(tiktokUrl, "tiktokUrl", fieldErrors);
    }

    if (location.length > 150) {
      fieldErrors.location = ["Location must be at most 150 characters"];
    }

    if (profilePhoto instanceof File && profilePhoto.size > 0) {
      const allowedMime = getAllowedMimeTypes();
      if (!allowedMime.includes(profilePhoto.type)) {
        fieldErrors.profilePhoto = ["Only JPG, JPEG, PNG, and WebP images are allowed"];
      } else if (profilePhoto.size > 5 * 1024 * 1024) {
        fieldErrors.profilePhoto = ["Photo must be less than 5 MB"];
      }
    }

    if (cvFile instanceof File && cvFile.size > 0) {
      if (cvFile.type !== "application/pdf") {
        fieldErrors.cvFile = ["Only PDF files are allowed"];
      } else if (cvFile.size > 10 * 1024 * 1024) {
        fieldErrors.cvFile = ["CV must be less than 10 MB"];
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, message: "Please fix the errors below", fieldErrors };
    }

    const existing = await prisma.profile.findFirst();
    const oldProfileImage = existing?.profileImage ?? null;
    const oldCvUrl = existing?.cvUrl ?? null;

    let newProfileImage: string | null = oldProfileImage;
    let newCvUrl: string | null = oldCvUrl;
    const savedFiles: string[] = [];

    try {
      if (profilePhoto instanceof File && profilePhoto.size > 0) {
        const buffer = Buffer.from(await profilePhoto.arrayBuffer());
        const savedPath = await saveUpload(buffer, profilePhoto.type);
        savedFiles.push(savedPath);
        newProfileImage = savedPath;
      } else if (removeProfilePhoto) {
        newProfileImage = null;
      }

      if (cvFile instanceof File && cvFile.size > 0) {
        const buffer = Buffer.from(await cvFile.arrayBuffer());
        const savedPath = await saveUpload(buffer, cvFile.type);
        savedFiles.push(savedPath);
        newCvUrl = savedPath;
      } else if (removeCv) {
        newCvUrl = null;
      }
    } catch (uploadError) {
      for (const f of savedFiles) {
        await deleteUpload(f).catch(() => {});
      }
      console.error("[profile/actions] Upload failed:", uploadError);
      return {
        success: false,
        message: "Failed to save uploaded file",
        fieldErrors: {},
      };
    }

    // $executeRaw bypasses stale Prisma client so new columns are saved correctly
    const emailVal = emailRaw.length > 0 ? emailRaw.toLowerCase().trim() : null;
    const isAvailableInt = isAvailable ? 1 : 0;

    try {
      if (existing) {
        await prisma.$executeRaw`
          UPDATE \`Profile\` SET
            \`name\`          = ${name},
            \`shortName\`     = ${shortName},
            \`greeting\`      = ${greeting},
            \`badge\`         = ${badge},
            \`primaryRole\`   = ${primaryRole},
            \`secondaryRole\` = ${nullify(secondaryRole)},
            \`description\`   = ${description},
            \`about\`         = ${nullify(about)},
            \`email\`         = ${emailVal},
            \`whatsapp\`      = ${nullify(whatsapp)},
            \`githubUrl\`     = ${nullify(githubUrl)},
            \`linkedinUrl\`   = ${nullify(linkedinUrl)},
            \`instagramUrl\`  = ${nullify(instagramUrl)},
            \`tiktokUrl\`     = ${nullify(tiktokUrl)},
            \`location\`      = ${nullify(location)},
            \`profileImage\`  = ${newProfileImage},
            \`cvUrl\`         = ${newCvUrl},
            \`isAvailable\`   = ${isAvailableInt},
            \`updatedAt\`     = NOW()
          WHERE \`id\` = ${existing.id}
        `;
      } else {
        await prisma.profile.create({
          data: {
            name, shortName, greeting, badge, primaryRole,
            secondaryRole: nullify(secondaryRole),
            description, about: nullify(about),
            email: emailVal, whatsapp: nullify(whatsapp),
            githubUrl: nullify(githubUrl), linkedinUrl: nullify(linkedinUrl),
            location: nullify(location), profileImage: newProfileImage,
            cvUrl: newCvUrl, isAvailable,
          },
        });
      }
    } catch (dbError) {
      for (const f of savedFiles) {
        await deleteUpload(f).catch(() => {});
      }
      console.error("[profile/actions] DB update failed:", dbError);
      return {
        success: false,
        message: "Database update failed",
        fieldErrors: {},
      };
    }
    if (oldProfileImage && oldProfileImage !== newProfileImage) {
      await deleteUpload(oldProfileImage).catch(() => {});
    }
    if (oldCvUrl && oldCvUrl !== newCvUrl) {
      await deleteUpload(oldCvUrl).catch(() => {});
    }

    revalidatePath("/");
    revalidatePath("/admin/profile");

    return {
      success: true,
      message: "Profile updated successfully",
      fieldErrors: {},
    };
  } catch (error) {
    console.error("[profile/actions] Update failed:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      fieldErrors: {},
    };
  }
}
