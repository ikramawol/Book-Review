import { NextApiRequest, NextApiResponse } from "next";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "@/middlewares/auth.middleware";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updatebookSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  author: z.string().min(1).optional(),
});


async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const bookId = id as string;

  if (!bookId) {
    return res.status(400).json({ success: false, error: "Invalid book id" });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        categories: true,
      },
    });

    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch book" });
  }
}

async function handlePUT(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;
  const bookId = id as string;

  const parsed = updatebookSchema
    .extend({
      categories: z.array(z.string()).optional(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.issues });
  }

  const { title, description, image, author, categories } = parsed.data;

  try {
    // Check ownership
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.id !== req.user!.id) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    // Handle categories
    let categoryConnect = undefined;
    if (categories && categories.length > 0) {
      categoryConnect = {
        connectOrCreate: categories.map((cat: string) => ({
          where: { name: cat },
          create: { name: cat },
        })),
      };
    }

    const data: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(image && { image }),
      ...(author && { author }),
      ...(categoryConnect && { categories: categoryConnect }),
    };

    const updated = await prisma.book.update({
      where: { id: bookId },
      data,
      include: { categories: true, reviews: true },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to update book" });
  }
}

async function handleDELETE(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;
  const bookId = id as string;

  if (!bookId) {
    return res.status(400).json({ success: false, error: "Invalid book id" });
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.id !== req.user!.id) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    await prisma.book.delete({ where: { id: bookId } });
    return res.status(200).json({ success: true, message: "Book deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete book" });
  }
}
// Default export function that handles all HTTP methods
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGET(req, res);
  }

  if (req.method === "PUT") {
    return authMiddleware(handlePUT)(req as AuthenticatedRequest, res);
  }

  if (req.method === "DELETE") {
    return authMiddleware(handleDELETE)(req as AuthenticatedRequest, res);
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
