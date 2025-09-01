import { NextApiRequest, NextApiResponse } from "next";
import { searchBooks } from "@/lib/book.controller";
import { rateLimiter } from "@/middlewares/rateLimiter";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    return searchBooks(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    error: "Method not allowed" 
  });
};

export default rateLimiter({ windowMs: 60 * 1000, max: 20 }, "search")(handler);

