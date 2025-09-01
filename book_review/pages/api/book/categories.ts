import { NextApiRequest, NextApiResponse } from "next";
import { getBookCategories } from "@/lib/book.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return getBookCategories(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    error: "Method not allowed" 
  });
}
