import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {

  const { userId } = req.body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { hashedRt: null },
    });

    // Optionally clear the cookie
    res.setHeader("Set-Cookie", "refreshToken=; HttpOnly; Path=/; Max-Age=0");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}