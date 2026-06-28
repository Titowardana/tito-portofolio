import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  results["BLOB_READ_WRITE_TOKEN"] = !!process.env.BLOB_READ_WRITE_TOKEN;
  results["VERCEL_BLOB_READ_WRITE_TOKEN"] = !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  results["resolvedToken"] = !!blobToken;

  if (blobToken) {
    try {
      const { put } = await import("@vercel/blob");
      const buf = Buffer.from("test");
      const blob = await put("test.txt", buf, {
        contentType: "text/plain",
        access: "public",
      });
      results["uploadSuccess"] = true;
      results["url"] = blob.url;
    } catch (e) {
      results["uploadSuccess"] = false;
      results["error"] = e instanceof Error ? e.message : String(e);
      results["errorName"] = e instanceof Error ? e.constructor.name : "unknown";
    }
  } else {
    results["note"] = "No blob token found, would fallback to filesystem";
  }

  return NextResponse.json(results);
}
