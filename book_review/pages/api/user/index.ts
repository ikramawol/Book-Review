import { NextApiRequest, NextApiResponse } from "next";
import { getAllUsers } from "@/lib/auth.controller";

export default async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
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
