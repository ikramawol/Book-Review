import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";

//CreateBook
export async function createBook(
  title: string,
  image: string,
  author: string,
  description: string
) {
  try {
    const book = await prisma.book.create({
      data: {
        title,
        image,
        author,
        description,
      },
    });
    return {
      success: true,
      data: book,
    };
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//GetAll

export async function getAllBooks(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const books = await prisma.book.findMany({
      skip,
      take: limit,
    });
    return res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

//GetById
export async function getbookById(bookId: string) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        reviews: true,
      },
    });
    return {
      success: true,
      data: book,
    };
  } catch (error) {
    console.error("Error fetching book:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//Updatebook
export async function updatebook(
  id: string,
  data: {
    title: string;
    image: string;
    author: string;
    description: string;
  }
) {
  try {
    const book = await prisma.book.update({
      where: { id },
      data,
    });
    return { success: true, book };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//Deletebook
export async function deletebook(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    return res.status(200).json({ message: "book deleted succesfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
