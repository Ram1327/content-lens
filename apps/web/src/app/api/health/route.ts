import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Lightweight uptime check — used by Vercel and for local sanity.
 */
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
