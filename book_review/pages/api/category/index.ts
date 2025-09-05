import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        select: { id: true, name: true }
      });
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch categories" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}