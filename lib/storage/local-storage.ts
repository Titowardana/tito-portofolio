import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_UPLOAD_DIRS = ["/uploads/profile", "/uploads/documents"] as const;

type UploadDir = (typeof ALLOWED_UPLOAD_DIRS)[number];

const MIME_CONFIG: Record<string, { dir: UploadDir; ext: string }> = {
  "image/jpeg": { dir: "/uploads/profile", ext: ".jpg" },
  "image/png": { dir: "/uploads/profile", ext: ".png" },
  "image/webp": { dir: "/uploads/profile", ext: ".webp" },
  "application/pdf": { dir: "/uploads/documents", ext: ".pdf" },
};

export function getAllowedMimeTypes(): string[] {
  return Object.keys(MIME_CONFIG);
}

export function getMimeConfig(mime: string) {
  return MIME_CONFIG[mime] ?? null;
}

export function generateFileName(): string {
  return crypto.randomUUID();
}

export async function saveUpload(
  buffer: Buffer,
  mime: string,
): Promise<string> {
  const config = MIME_CONFIG[mime];
  if (!config) {
    throw new Error(`Unsupported MIME type: ${mime}`);
  }

  const fileName = generateFileName() + config.ext;

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(fileName, buffer, {
      contentType: mime,
      access: "public",
      token: blobToken,
    });
    return blob.url;
  }

  const publicDirPath = path.join(process.cwd(), "public");
  const uploadDir = path.join(publicDirPath, config.dir.slice(1));

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `${config.dir}/${fileName}`;
}

export async function deleteUpload(publicPath: string): Promise<void> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (blobToken && publicPath.startsWith("http")) {
    try {
      const { del } = await import("@vercel/blob");
      await del(publicPath);
    } catch {
      // ignore delete errors
    }
    return;
  }

  if (!publicPath.startsWith("/uploads/")) return;

  const allowed = ALLOWED_UPLOAD_DIRS.some((dir) =>
    publicPath.startsWith(dir),
  );
  if (!allowed) return;

  const absolutePath = path.join(
    process.cwd(),
    "public",
    publicPath.slice(1),
  );
  if (existsSync(absolutePath)) {
    await unlink(absolutePath);
  }
}
