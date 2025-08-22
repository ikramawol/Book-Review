import { NextApiRequest, NextApiResponse } from "next";
import { getAllBooks } from "@/lib/book.controller";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "@/middlewares/auth.middleware";

const bookSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  author: z.string().min(1).optional(),
});

export async function handleGET(req: NextApiRequest, res: NextApiResponse) {
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
    return await getAllBooks(req, res);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

export async function handlePOST(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  // Validate input
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.issues });
  }

  const { title, description, author, image, category } = req.body;


  // Check if user is authenticated and is admin
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: "User authentication required to create a book",
    });
  }
  // You need to fetch the user role from DB or JWT payload
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Forbidden: Admins only" });
  }

  try {
    // Connect or create category
    let categoryId = undefined;
    if (category) {
      let cat = await prisma.category.findFirst({
        where: { name: category },
      });
      if (!cat) {
        cat = await prisma.category.create({
          data: { name: category },
        });
      }
      categoryId = cat.id;
    }
    // Connect or create tags

    const data: any = {
      title,
      description,
      author,
      image,
    };
    if (categoryId) {
      data.categoryId = categoryId;
    }
    const book = await prisma.book.create({
      data,
      include: { reviews: true },
    });
    return res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.error("Create book error:", error);

    // Provide clearer error messages
    if (error instanceof Error) {
      if (error.message.includes("authorId")) {
        return res.status(400).json({
          success: false,
          error: "User authentication failed. Please login again.",
        });
      }
      if (error.message.includes("categoryId")) {
        return res.status(400).json({
          success: false,
          error: "Invalid category provided.",
        });
      }
        return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create book. Please try again.",
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGET(req, res);
  }

  if (req.method === "POST") {
    return authMiddleware(handlePOST)(req as AuthenticatedRequest, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
