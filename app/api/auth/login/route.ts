import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const emailRaw = formData.get("email") as string | null;
    const passwordRaw = formData.get("password") as string | null;

    if (!emailRaw || !passwordRaw) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const email = emailRaw.toLowerCase().trim();

    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await compare(passwordRaw, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await setSession({
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[login] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
