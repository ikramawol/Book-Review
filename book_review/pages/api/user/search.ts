import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export async function search(req: NextApiRequest, res: NextApiResponse) {
  const { q, suspended, page = "1", limit = "12" } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  let where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q as string, mode: "insensitive" } },
      { email: { contains: q as string, mode: "insensitive" } }
    ];
  }


  if (typeof suspended !== "undefined") {
    where.suspended = suspended === "true";
  }

  try {
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.user.count({ where });

    return res.status(200).json({
      success: true,
      data: users,
      total,
      page: pageNum,
      limit: limitNum
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to search/filter users" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "GET") {
    return search(req, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}