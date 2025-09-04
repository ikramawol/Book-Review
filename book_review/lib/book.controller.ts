import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";

export async function createBook(
  title: string,
  image: string,
  author: string,
  description: string,
  publishedDate?: Date
) {
  try {
    const book = await prisma.book.create({
      data: {
        title,
        image,
        author,
        description,
        publishedDate: publishedDate || new Date(),
      },
    });
    return { success: true, data: book };
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAllBooks(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search as string;
  const category = req.query.category as string;
  const author = req.query.author as string;
  const sortBy = req.query.sortBy as string || "publishedDate";
  const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

  const publishedFrom = req.query.publishedFrom
    ? new Date(req.query.publishedFrom as string)
    : null;
  const publishedTo = req.query.publishedTo
    ? new Date(req.query.publishedTo as string)
    : null;

  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categories = {
        some: { name: { equals: category, mode: "insensitive" } },
      };
    }

    if (author) {
      where.author = { contains: author, mode: "insensitive" };
    }

    if (publishedFrom || publishedTo) {
      where.publishedDate = {};
      if (publishedFrom) where.publishedDate.gte = publishedFrom;
      if (publishedTo) where.publishedDate.lte = publishedTo;
    }

    const orderBy: any = {};
    if (["views", "title", "author", "publishedDate"].includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.publishedDate = "desc";
    }

    const [books, totalBooks] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          categories: true,
          reviews: true,
          _count: { select: { reviews: true } },
        },
      }),
      prisma.book.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
        hasNextPage: page * limit < totalBooks,
        hasPrevPage: page > 1,
      },
      filters: { search, category, author, publishedFrom, publishedTo },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function searchBooks(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const query = req.query.q as string;
  const category = req.query.category as string;
  const author = req.query.author as string;
  const minRating = parseFloat(req.query.minRating as string);
  const maxRating = parseFloat(req.query.maxRating as string);
  const sortBy = req.query.sortBy as string || "relevance";

  // Published date filters
  const publishedFrom = req.query.publishedFrom
    ? new Date(req.query.publishedFrom as string)
    : null;
  const publishedTo = req.query.publishedTo
    ? new Date(req.query.publishedTo as string)
    : null;

  if (!query) {
    return res.status(400).json({ success: false, error: "Search query is required" });
  }

  try {
    const where: any = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
      ],
    };

    if (category) {
      where.categories = {
        some: { name: { equals: category, mode: "insensitive" } },
      };
    }

    if (author) {
      where.author = { contains: author, mode: "insensitive" };
    }

    if (minRating || maxRating) {
      where.reviews = {
        some: {
          rating: {
            ...(minRating && { gte: minRating }),
            ...(maxRating && { lte: maxRating }),
          },
        },
      };
    }

    if (publishedFrom || publishedTo) {
      where.publishedDate = {};
      if (publishedFrom) where.publishedDate.gte = publishedFrom;
      if (publishedTo) where.publishedDate.lte = publishedTo;
    }

    const orderBy: any = {};
    if (sortBy === "rating") {
      orderBy.reviews = { _avg: { rating: "desc" } };
    } else if (sortBy === "views") {
      orderBy.views = "desc";
    } else if (sortBy === "title") {
      orderBy.title = "asc";
    } else if (sortBy === "author") {
      orderBy.author = "asc";
    } else {
      orderBy.views = "desc"; 
    }

    const [books, totalBooks] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          categories: true,
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.book.count({ where }),
    ]);

    const booksWithAvgRating = books.map((book) => {
      const avgRating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
          : 0;

      return {
        ...book,
        averageRating: Math.round(avgRating * 10) / 10,
        reviews: undefined,
      };
    });

    return res.status(200).json({
      success: true,
      data: booksWithAvgRating,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
        hasNextPage: page * limit < totalBooks,
        hasPrevPage: page > 1,
      },
      searchInfo: { query, category, author, minRating, maxRating, publishedFrom, publishedTo, sortBy },
    });
  } catch (error) {
    console.error("Error searching books:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTrendingBooks(req: NextApiRequest, res: NextApiResponse) {
  const limit = parseInt(req.query.limit as string) || 12;
  const period = req.query.period as string || "week";

  try {
    let dateFilter: any = {};

    if (period === "week") {
      dateFilter.gte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      dateFilter.gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const books = await prisma.book.findMany({
      take: limit,
      orderBy: [{ views: "desc" }, { publishedDate: "desc" }],
      where: period !== "all" ? { publishedDate: dateFilter } : {},
      include: {
        categories: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
    });

    const booksWithTrendingData = books.map((book, index) => {
      const avgRating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
          : 0;

      const trendingScore = book.views + book._count.reviews * 10;

      return {
        ...book,
        averageRating: Math.round(avgRating * 10) / 10,
        trendingScore,
        trendingRank: index + 1,
        reviews: undefined,
      };
    });

    return res.status(200).json({ success: true, data: booksWithTrendingData, period, limit });
  } catch (error) {
    console.error("Error fetching trending books:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getBookCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getbookById(bookId: string) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { reviews: true, categories: true },
    });
    return { success: true, data: book };
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updatebook(
  id: string,
  data: { title: string; image: string; author: string; description: string }
) {
  try {
    const book = await prisma.book.update({ where: { id }, data });
    return { success: true, book };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deletebook(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    await prisma.book.delete({ where: { id: String(id) } });
    return res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
