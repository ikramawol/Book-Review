import { NextApiRequest, NextApiResponse } from "next";
import { getBookCategories } from "@/lib/book.controller";
import prisma from "@/lib/prisma";
import { authMiddleware, AuthenticatedRequest } from "@/middlewares/auth.middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return getBookCategories(req, res); 
  }

  if (req.method === "POST") {
    return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Forbidden: Admins only" });
      }
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ success: false, error: "Category name is required" });
      }
      try {
        const category = await prisma.category.create({
          data: { name },
        });
        return res.status(201).json({ success: true, category });
      } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to create category"});
      }
    })(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
