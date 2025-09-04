// middlewares/withAuth.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { verifyJwt, parseAuthCookie } from "@/utils/jwt";
import { Role } from ".prisma/client/default.js";

export interface AuthenticatedRequest extends NextApiRequest { 
  user?: { 
    id: string; 
    email: string; 
    role?: Role;
  }; 
  }

export function authMiddleware(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      let user: any = null;

      // Try NextAuth token first
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (nextAuthToken) {
        user = {
          id: nextAuthToken.sub as string,
          email: nextAuthToken.email as string,
          role: "USER",
          provider: "oauth",
        };
      }

      // If no NextAuth token, fall back to custom JWT
      if (!user) {
        let token: string | null = null;
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        } else {
          token = parseAuthCookie(req.headers.cookie);
        }

        if (token) {
          const payload = verifyJwt(token);
          if (payload) {
            user = {
              id: payload.id,
              email: payload.email,
              role: payload.role ?? "USER",
              provider: "custom",
            };
          }
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      req.user = user;

      return handler(req, res);
    } catch (e) {
      console.error("Auth error:", e);
      return res.status(500).json({ success: false, error: "Authentication failed" });
    }
  };
}

export const jwtOptions = {
  encryption: false,
  secret: process.env.NEXTAUTH_SECRET,
};
