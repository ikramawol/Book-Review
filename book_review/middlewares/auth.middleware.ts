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

      // Check if request has Authorization header (custom JWT)
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
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

      // If no custom JWT token, check for OAuth session
      if (!user) {
        const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (nextAuthToken) {
          user = {
            id: nextAuthToken.sub as string,
            email: nextAuthToken.email as string,
            role: "USER", // OAuth users are always USER role
            provider: "oauth",
          };
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
