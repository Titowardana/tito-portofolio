import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "(not set)",
    ADMIN_NAME: process.env.ADMIN_NAME || "(not set)",
    ADMIN_PASSWORD_LENGTH: (process.env.ADMIN_PASSWORD || "").length,
    NODE_ENV: process.env.NODE_ENV,
  });
}
