import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const adminEmail = session.user.email;
  if (!adminEmail) {
    redirect("/admin/login");
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
    select: { id: true, name: true, email: true, isActive: true },
  });

  if (!admin || !admin.isActive) {
    redirect("/admin/login");
  }

  return {
    id: String(admin.id),
    name: admin.name,
    email: admin.email,
  };
}
