import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt, parseAuthCookie } from '@/utils/jwt';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export type AuthMiddleware = (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => void;

export function authMiddleware(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Check for token in Authorization header
      const authHeader = req.headers.authorization;
      let token: string | null = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // Fallback to cookie if no Authorization header
        const cookieHeader = req.headers.cookie;
        token = parseAuthCookie(cookieHeader);
      }

      if (!token) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      // Verify the token
      const payload = verifyJwt(token);
      if (!payload) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid or expired token' 
        });
      }

      // Attach user to request
      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role ?? 'USER'
      };

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Authentication failed' 
      });
    }
  };
}

