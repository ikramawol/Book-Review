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
  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    return refresh(req, res);
  }
}