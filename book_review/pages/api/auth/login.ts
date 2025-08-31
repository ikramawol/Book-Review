import { NextApiRequest, NextApiResponse } from 'next'
import { comparePassword, hashPassword } from '@/utils/jwt'
import { generateJwt } from '@/utils/jwt'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { rateLimiter } from "@/middlewares/rateLimiter";

// 10 attempts per 15 minutes
export const login = rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }, "login")(
  async function login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { email, hash } = req.body;

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !hash) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, hash: true , role: true }
      });

      if (!user) {
        return res.status(404).json({ success: false, error: 'User does not exist' });
      }

      // Verify password
      const isPasswordValid = await comparePassword(hash, user.hash);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Incorrect password' });
      }

      // Generate tokens
      const accessToken = generateJwt({ id: user.id, email: user.email, role: user.role });

      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
      );

      const rfhashed = await hashPassword(refreshToken);

      await prisma.user.update({
        where: { id: user.id },
        data: { hashedRt: rfhashed }
      });

      return res.status(200).json({
        success: true,
        data: {
          user: { id: user.id, email: user.email, name: user.name },
          accessToken,
          refreshToken
        },
        message: 'Login successful'
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return login(req, res);
  }
  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}
