import { NextApiRequest, NextApiResponse } from "next";
import { getAllUsers } from "@/lib/auth.controller";

export async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    if (isNaN(page) || isNaN(limit)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid pagination parameters" });
    }
    req.query.page = String(page);
    req.query.limit = String(limit);
    return await getAllUsers(req, res);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    return handleGET(req, res);
  }
}