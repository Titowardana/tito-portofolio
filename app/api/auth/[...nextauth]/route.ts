import { getSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  return NextResponse.json(session ? { user: session } : { user: null });
}

export async function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
