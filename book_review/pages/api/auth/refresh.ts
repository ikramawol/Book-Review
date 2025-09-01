import { NextApiRequest, NextApiResponse } from "next";
import { refreshToken } from "@/lib/auth.controller";

export async function refresh(req: NextApiRequest, res: NextApiResponse) {

  const { refreshToken: token } = req.body;
  const result = await refreshToken(token);

  if (result.error) return res.status(result.status).json({ error: result.error });
  return res.json({ 
    accessToken: result.accessToken, 
    refreshToken: result.newRefreshToken 
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return refresh(req, res);
  }
}