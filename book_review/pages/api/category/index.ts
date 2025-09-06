import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { authMiddleware, AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { Role } from ".prisma/client/default.js";

// type Authenticated = AuthenticatedRequest & { user: { role: Role } };
export async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
      const categories = await prisma.category.findMany({
        select: { id: true, name: true }
      });
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch categories" });
    }
  }
  
export async function handlePOST(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  // Only allow admins to create categories
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ success: false, error: "Forbidden: Admins only" });
    return;
  }

  const { name } = req.body;
  if (!name || typeof name !== "string") {
    res.status(400).json({ success: false, error: "Category name is required" });
    return;
  }
  try {
    const category = await prisma.category.create({
      data: { name }
    });
    res.status(201).json({ success: true, category });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create category" });
    return;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGET(req, res);
  }
  if (req.method === "POST") {
    return authMiddleware(handlePOST)(req as AuthenticatedRequest, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
