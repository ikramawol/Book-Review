import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "GET") {
    try {
      const totalReviews = await prisma.review.count();
      console.log("Total reviews count:", totalReviews);
      return res.status(200).json({ success: true, totalReviews });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch review count" });
    }
  }
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}