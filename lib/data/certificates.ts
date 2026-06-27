import { prisma } from "@/lib/prisma";
import type { Certificate } from "@/data/certificates";
import { certificates as fallbackCertificates } from "@/data/certificates";
import { mapCertificate } from "./mappers";

export async function getPublicCertificates(): Promise<Certificate[]> {
  try {
    const db = await prisma.certificate.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return db.map(mapCertificate);
  } catch (error) {
    console.warn("[data/certificates] Database unavailable, using fallback:", error);
    return fallbackCertificates
      .filter((c) => c.active)
      .sort((a, b) => a.order - b.order);
  }
}
