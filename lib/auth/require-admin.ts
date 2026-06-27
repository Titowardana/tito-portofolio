import { getSession, type SessionPayload } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export type AdminSession = SessionPayload;

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return session;
}
