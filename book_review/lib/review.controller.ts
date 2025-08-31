import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";

// Create Review with enhanced validation
export async function createReview(
  content: string,
  rating: number,
  userId: string,
  bookId: string,
) {
  try {
    // Enhanced validation
    if (!content || !rating || !userId || !bookId) {
      throw new Error("All fields are required");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (content.length < 10) {
      throw new Error("Review content must be at least 10 characters long");
    }

    if (content.length > 1000) {
      throw new Error("Review content must be less than 1000 characters");
    }

    // Check if user already reviewed this book
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        bookId,
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this book");
    }

    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new Error("Book not found");
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating,
        user: { connect: { id: userId } },
        book: { connect: { id: bookId } }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });

    return {
      success: true,
      data: review,
    };
  } catch (error) {
    console.error("Error creating Review", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get All Reviews with pagination and filtering
export async function getAllReviews(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  // Filter parameters
  const bookId = req.query.bookId as string;
  const userId = req.query.userId as string;
  const rating = req.query.rating ? parseInt(req.query.rating as string) : null;
  const sortBy = req.query.sortBy as string || 'createdAt';
  const sortOrder = req.query.sortOrder as string || 'desc';

  try {
    // Build where clause
    const where: any = {};
    
    if (bookId) {
      where.bookId = bookId;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (rating) {
      where.rating = rating;
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else if (sortBy === 'content') {
      orderBy.content = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(totalReviews / limit);

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Get Reviews by Book ID with enhanced features
export async function getReviewsByBookId(req: NextApiRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const rating = req.query.rating ? parseInt(req.query.rating as string) : null;
  const sortBy = req.query.sortBy as string || 'createdAt';
  const sortOrder = req.query.sortOrder as string || 'desc';

  if (!bookId) {
    return res.status(400).json({
      success: false,
      error: "Book ID is required",
    });
  }

  try {
    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId as string },
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    // Build where clause
    const where: any = { bookId: bookId as string };
    if (rating) {
      where.rating = rating;
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder;
    } else if (sortBy === 'content') {
      orderBy.content = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [reviews, totalReviews, averageRating] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { bookId: bookId as string },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    const totalPages = Math.ceil(totalReviews / limit);

    return res.status(200).json({
      success: true,
      data: reviews,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        totalReviews: book._count.reviews,
        averageRating: averageRating._avg.rating || 0,
        ratingCount: averageRating._count.rating,
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews by book:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Get Review by ID
export async function getReviewById(reviewId: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });

    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    return {
      success: true,
      data: review,
    };
  } catch (error) {
    console.error("Error fetching Review", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update Review with enhanced validation
export async function updateReview(
  id: string,
  data: {
    content: string;
    rating: number;
  },
  userId: string
) {
  try {
    // Enhanced validation
    if (!data.content || !data.rating) {
      throw new Error("Content and rating are required");
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (data.content.length < 10) {
      throw new Error("Review content must be at least 10 characters long");
    }

    if (data.content.length > 1000) {
      throw new Error("Review content must be less than 1000 characters");
    }

    // Check if review exists and user owns it
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingReview) {
      throw new Error("Review not found");
    }

    if (existingReview.userId !== userId) {
      throw new Error("You can only update your own reviews");
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        content: data.content,
        rating: data.rating,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
    });

    return { 
      success: true, 
      data: review 
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete Review with authorization
export async function deleteReview(
  reviewId: string,
    userId: string,
  isAdmin: boolean = false
) {
  try {
    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { user: true },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    // Check if user can delete the review (owner or admin)
    if (!isAdmin && review.userId !== userId) {
      throw new Error("You can only delete your own reviews");
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return { 
      success: true, 
      message: "Review deleted successfully!" 
     };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get user's reviews
export async function getUserReviews(userId: string, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              image: true,
            },
          },
        },
      }),
      prisma.review.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(totalReviews / limit);

    return {
      success: true,
      data: reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get review statistics for a book
export async function getBookReviewStats(bookId: string) {
  try {
    const stats = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
      _count: { rating: true },
      _min: { rating: true },
      _max: { rating: true },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { bookId },
      _count: { rating: true },
    });

    return {
      success: true,
      data: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating,
        minRating: stats._min.rating || 0,
        maxRating: stats._max.rating || 0,
        ratingDistribution: ratingDistribution.reduce((acc, item) => {
          acc[item.rating] = item._count.rating;
          return acc;
        }, {} as Record<number, number>),
      },
    };
  } catch (error) {
    console.error("Error fetching book review stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
