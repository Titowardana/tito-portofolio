import { compare } from "bcryptjs";
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

    const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const envHash = process.env.ADMIN_PASSWORD_HASH;

    if (email !== envEmail || !envHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await compare(passwordRaw, envHash);

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      id: "1",
      name: process.env.ADMIN_NAME || "Admin",
      email,
      role: "admin",
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
