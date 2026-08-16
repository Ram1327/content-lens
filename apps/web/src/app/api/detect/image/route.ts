import { NextRequest, NextResponse } from "next/server";
import { detectImage } from "@/lib/ml-client";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
 * POST /api/detect/image
 * Web API handler for Image AI detection.
 * Validates multipart image upload, enforces 10/day IP rate limit,
 * and forwards to ML inference service / fallback.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);

    if (!formData) {
      return NextResponse.json(
        { error: "Invalid multipart form data." },
        { status: 400 }
      );
    }

    const file = (formData.get("image") || formData.get("file")) as File | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No image file provided. An 'image' form field is required." },
        { status: 400 }
      );
    }

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported image format (${file.type || "unknown"}). Supported formats are JPEG, PNG, and WebP.`,
        },
        { status: 400 }
      );
    }

    // File size validation (10MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Image file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10MB.`,
        },
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

    // Forward image to ML inference service
    const forwardData = new FormData();
    forwardData.append("image", file, file.name || "upload.jpg");

    const detectionResult = await detectImage(forwardData, {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });

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
    const errorMsg =
      error instanceof Error ? error.message : "Unable to complete image analysis. Please try again.";
    console.error("[API /detect/image] Error processing request:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
