import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "@/middlewares/auth.middleware";

async function logout(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { hashedRt: null },
    });

    res.setHeader("Set-Cookie", "refreshToken=; HttpOnly; Path=/; Max-Age=0");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return authMiddleware(logout)(req as AuthenticatedRequest, res);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
