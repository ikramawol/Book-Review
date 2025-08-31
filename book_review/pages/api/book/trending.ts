import { NextApiRequest, NextApiResponse } from "next";
import { getTrendingBooks } from "@/lib/book.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return getTrendingBooks(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    error: "Method not allowed" 
  });
}