import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authMiddleware, AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { z } from 'zod';

// Zod schema for review validation (removed bookId since it comes from query)
const reviewSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters').max(1000, 'Content must be less than 1000 characters'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { bookId, page = "1", limit = "12" } = req.query;

  if (!bookId) {
    return res.status(400).json({ 
      success: false, 
      error: 'bookId is required to fetch reviews' 
    });
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId as string }
    });

    if (!book) {
      return res.status(404).json({ 
        success: false, 
        error: 'Book not found' 
      });
    }

    const reviews = await prisma.review.findMany({
      where: { bookId: bookId as string },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true, author: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    // Get total count for pagination
    const total = await prisma.review.count({
      where: { bookId: bookId as string }
    });

    // Get average rating
    const averageRating = await prisma.review.aggregate({
      where: { bookId: bookId as string },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return res.status(200).json({ 
      success: true, 
      data: reviews,
      total,
      page: pageNum,
      limit: limitNum,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        totalReviews: total,
        averageRating: averageRating._avg.rating || 0,
        ratingCount: averageRating._count.rating,
      }
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    });
  }
}

async function handlePOST(req: AuthenticatedRequest, res: NextApiResponse) {
  // Create a new review
  try {
    const { bookId } = req.query;

    // Validate bookId from query parameters
    if (!bookId) {
      return res.status(400).json({ 
        success: false, 
        error: 'bookId is required in query parameters' 
      });
    }

    // Validate request body
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        success: false, 
        error: parsed.error.issues 
      });
    }
    
    const { content, rating } = parsed.data;
    
    // Verify the book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId as string }
    });

    if (!book) {
      return res.status(404).json({ 
        success: false, 
        error: 'Book not found' 
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        error: 'User authentication required to create a review' 
      });
    }

    // Check if user already reviewed this book
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        bookId: bookId as string,
      },
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        error: 'You have already reviewed this book' 
      });
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating,
        bookId: bookId as string,
        userId: req.user.id,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true, author: true } }
      }
    });
    
    return res.status(201).json({ 
      success: true, 
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create review' 
    });
  }
}

// Default export function that handles all HTTP methods
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGET(req, res);
  }
  
  if (req.method === 'POST') {
    return authMiddleware(handlePOST)(req as AuthenticatedRequest, res);
  }
  
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

