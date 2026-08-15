import { NextRequest, NextResponse } from "next/server";
import { detectText } from "@/lib/ml-client";
import { checkRateLimit } from "@/lib/rate-limit";
import type { DetectTextRequest } from "@content-lens/shared-types";

export const runtime = "nodejs";

/**
 * Helper to extract client IP across local dev, Vercel, and proxies.
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * POST /api/detect/text
 * Web API handler for text AI detection.
 * Validates text input, applies 10/day IP rate limit, and forwards to ML inference service.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as DetectTextRequest | null;

    if (!body || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Invalid request. 'text' field is required." },
        { status: 400 }
      );
    }

    const trimmedText = body.text.trim();

    if (trimmedText.length < 10) {
      return NextResponse.json(
        { error: "Text is too short. Please provide at least 10 characters for reliable analysis." },
        { status: 400 }
      );
    }

    if (trimmedText.length > 25000) {
      return NextResponse.json(
        { error: "Text is too long. Please limit your input to 25,000 characters." },
        { status: 400 }
      );
    }

    // IP-based rate limiting (10 scans / 24h per IP)
    const clientIp = getClientIp(req);
    const rateLimit = await checkRateLimit(clientIp, 10);

    const rateLimitHeaders = {
      "X-RateLimit-Limit": rateLimit.limit.toString(),
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      "X-RateLimit-Reset": rateLimit.resetAt.toISOString(),
    };

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Daily rate limit reached. You have used all 10 free scans for today.",
          resetAt: rateLimit.resetAt.toISOString(),
          remaining: 0,
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    // Call ML service
    const detectionResult = await detectText({ text: trimmedText });

    return NextResponse.json(
      {
        ...detectionResult,
        rateLimit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit,
          resetAt: rateLimit.resetAt.toISOString(),
        },
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );
  } catch (error: unknown) {
    console.error("[API /detect/text] Error processing request:", error);
    return NextResponse.json(
      { error: "Unable to complete analysis. Please check your connection and try again." },
      { status: 500 }
    );
  }
}
