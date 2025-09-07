import { NextApiRequest, NextApiResponse } from "next";
import { getTrendingBooks } from "@/lib/book.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "GET") {
    return getTrendingBooks(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    error: "Method not allowed" 
  });
}