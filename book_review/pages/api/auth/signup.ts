import { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword, generateJwt } from '@/utils/jwt'
import { createUser, getUserByEmail } from '@/lib/auth.controller'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, hash, name } = req.body
    if (!email || !hash) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser.data?.isDeleted) {
        const result = await createUser(email, name, hash)
        if (result.success && result.data) {
          const accessToken = generateJwt({
            id: result.data.id,
            email: result.data.email
          })
          return res.status(201).json({
            success: true,
            data: {
              user: {
                id: result.data.id,
                email: result.data.email,
                name: result.data.name,
                hash: hashPassword(result.data.hash)
              },
              accessToken
            },
            message: 'User registered successfully'
          })
        } else {
          return res.status(500).json({ success: false, error: result.error })
        }
    }
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
      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.data.id,
            email: result.data.email,
            name: result.data.name,
            hash: hashPassword(result.data.hash)
          },
          accessToken
        },
        message: 'User registered successfully'
      })
    } else {
      return res.status(500).json({ success: false, error: result.error })
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}