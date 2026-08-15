import { prisma } from "@/lib/prisma";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
}

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Checks and increments the daily scan count for a given IP address.
 * Enforces a rolling 24-hour rate limit stored in the Supabase RateLimit table.
 *
 * @param ip - Client IP address
 * @param limit - Maximum allowed requests per window (default 10)
 * @param windowMs - Duration of the rate limit window in milliseconds (default 24h)
 */
export async function checkRateLimit(
  ip: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS
): Promise<RateLimitResult> {
  const normalizedIp = ip.trim() || "127.0.0.1";
  const now = new Date();

  try {
    const existing = await prisma.rateLimit.findUnique({
      where: { ip: normalizedIp },
    });

    if (!existing) {
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.create({
        data: {
          ip: normalizedIp,
          count: 1,
          resetAt,
        },
      });

      return {
        success: true,
        remaining: limit - 1,
        limit,
        resetAt,
      };
    }

    // If the window has expired, reset counter and window timestamp
    if (now > existing.resetAt) {
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.update({
        where: { ip: normalizedIp },
        data: {
          count: 1,
          resetAt,
        },
      });

      return {
        success: true,
        remaining: limit - 1,
        limit,
        resetAt,
      };
    }

    // If already at or over limit
    if (existing.count >= limit) {
      return {
        success: false,
        remaining: 0,
        limit,
        resetAt: existing.resetAt,
      };
    }

    // Increment count
    const updated = await prisma.rateLimit.update({
      where: { ip: normalizedIp },
      data: {
        count: { increment: 1 },
      },
    });

    return {
      success: true,
      remaining: Math.max(0, limit - updated.count),
      limit,
      resetAt: existing.resetAt,
    };
  } catch (error) {
    // Fail open with a warning so database downtime doesn't completely block the user
    console.error("[RateLimit] Error checking rate limit in DB:", error);
    return {
      success: true,
      remaining: limit - 1,
      limit,
      resetAt: new Date(now.getTime() + windowMs),
    };
  }
}
