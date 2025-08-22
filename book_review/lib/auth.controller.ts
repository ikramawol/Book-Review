import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "@/utils/jwt";
// import { Role } from "@prisma/client";

//CreateUser
export async function createUser(
  email: string,
  name: string,
  hash: string,
) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hash,
      },
    });
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//GetAll

export async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await prisma.user.findMany({
      skip,
      take: limit,
    });
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

//GetById
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviews: true,
      },
    });
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//UpdateUser
export async function updateUser(
  id: string,
  data: { email: string; password: string; name?: string }
) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}


//GetByEmail
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        reviews: true,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

//DeleteUser
export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const user = await prisma.user.update({
      where: { id: typeof id === "string" ? id : Array.isArray(id) ? id[0] : "" },
      data: { isDeleted: true },
    });

    return res.status(200).json({ message: "User deleted succesfully!", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export async function refreshToken(refreshToken: string) {
  if (!refreshToken) return { error: "No refresh token provided", status: 401 };

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return { error: "Invalid refresh token", status: 403 };
    }

    const isValid = await comparePassword(refreshToken, user.hashedRt || "");
    if (!isValid) {
      return { error: "Invalid refresh token", status: 403 };
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
    const newRefreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    const hashedRfToken = await hashPassword(newRefreshToken)
    await prisma.user.update({ where: { id: user.id }, data: { hashedRt: hashedRfToken } });

    return { accessToken, newRefreshToken, status: 200 };
  } catch {
    return { error: "Invalid or expired refresh token", status: 403 };
  }
}

// export async function changeRole(userId: string, newRole: Role) {
//   try {

//     const user = await prisma.user.update({
//       where: { id: userId },
//       data: { role: newRole },
//     });
//     return {
//       success: true,
//       data: user,
//     };
//   } catch (error) {
//     console.error("Error changing user role:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }