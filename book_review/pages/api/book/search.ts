import { NextApiRequest, NextApiResponse } from "next";
import { searchBooks } from "@/lib/book.controller";
import { rateLimiter } from "@/middlewares/rateLimiter";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "GET") {
    return searchBooks(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    error: "Method not allowed" 
  });
};

export default rateLimiter({ windowMs: 60 * 1000, max: 20 }, "search")(handler);

