import { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword, generateJwt } from '@/utils/jwt'
import { createUser, getUserByEmail } from '@/lib/auth.controller'
import prisma from '@/lib/prisma'
import { rateLimiter } from "@/middlewares/rateLimiter";

export const signup = rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }, "signup")(async function signup(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, hash, name } = req.body
    if (!email || !hash) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' })
    }

    // Password validation: at least 8 chars, one special char, one uppercase, one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(hash)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character'
      });
    }

    if (name.length < 3) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long' })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser.success && existingUser.data) {
      return res.status(409).json({ success: false, error: 'User with this email already exists' })
    }

    const hashedPassword = await hashPassword(hash)
    const result = await createUser(email, name, hashedPassword)

    if (result.success && result.data) {
      const accessToken = generateJwt({
        id: result.data.id,
        email: result.data.email
      })

      const refreshToken = generateJwt({
        id: result.data.id,
        email: result.data.email
      });
      const hashedRt = await hashPassword(refreshToken);
      // Update the user with the refresh token
      await prisma.user.update({
        where: { id: result.data.id },
        data: { hashedRt }
      });

      res.setHeader("Set-Cookie", `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.data.id,
            email: result.data.email,
            name: result.data.name,
          },
          accessToken,
        },
        message: 'User registered successfully'
      })
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return signup(req, res);
  }
}
