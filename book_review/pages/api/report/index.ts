import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware} from '@/middlewares/auth.middleware';
import { JwtPayload, verifyJwt } from "@/utils/jwt";
import prisma from "@/lib/prisma";


const handleGetReports = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const user = req.user as JwtPayload;
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: true,
        review: true,
      },
      orderBy: { createdAt: "desc" }
    });
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, error: errorMessage });
  }
};


// Update main route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-six-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  const token = req.headers.authorization?.split(" ")[1];
  const user = token
    ? (verifyJwt(token) as JwtPayload & { role?: string })
    : null;

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    return authMiddleware(handleGetReports)(req as AuthenticatedRequest, res);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  }
