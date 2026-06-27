import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth/session";
import { NextResponse } from "next/server";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24;

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

    const token = await signToken({
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
