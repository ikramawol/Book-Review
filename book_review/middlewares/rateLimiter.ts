// lib/rateLimiter.ts
import { NextApiRequest, NextApiResponse } from "next";

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const requests: Record<
  string,
  Record<string, { count: number; lastRequest: number }>
> = {};

// Factory function
export function rateLimiter(options: RateLimitOptions, key: string) {
  return function (
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
  ) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const ip =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        "unknown";
      const now = Date.now();

      if (!requests[key]) requests[key] = {};
      if (!requests[key][ip]) {
        requests[key][ip] = { count: 1, lastRequest: now };
      } else {
        const diff = now - requests[key][ip].lastRequest;

        if (diff < options.windowMs) {
          requests[key][ip].count++;
        } else {
          requests[key][ip] = { count: 1, lastRequest: now };
        }

        if (requests[key][ip].count > options.max) {
          return res
            .status(429)
            .json({ success: false, error: "Too many requests. Try again later." });
        }
      }

      return handler(req, res);
    };
  };
}
