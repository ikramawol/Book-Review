import { NextApiRequest, NextApiResponse } from "next";
import { refreshToken } from "../../../lib/auth.controller";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const rfToken = req.cookies.refreshToken;
  const result = await refreshToken(rfToken ? rfToken : "");

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  res.setHeader("Set-Cookie", 
    `refreshToken=${result.newRefreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
  return res.status(result.status).json({ accessToken: result.accessToken });
}