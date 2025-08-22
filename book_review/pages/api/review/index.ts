import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authMiddleware, AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { z } from 'zod';

// Zod schema for review validation
const reviewSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  rating: z.int(),
  bookId: z.string(),
});

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  
  // Require bookId to get reviews for a specific book
  if (!bookId) {
    return res.status(400).json({ 
      success: false, 
      error: 'bookId is required to fetch reviews' 
    });
  }

  const bookIdNum = parseInt(bookId as string, 10);
  if (isNaN(bookIdNum)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid bookId' 
    });
  }

  try {
    // Verify the book exists
    const book = await prisma.book.findUnique({
      where: { id: bookIdNum.toString() }
    });

    if (!book) {
      return res.status(404).json({ 
        success: false, 
        error: 'book not found' 
      });
    }

    // Get reviews for the specific book
    const reviews = await prisma.review.findMany({
      where: { bookId: bookIdNum.toString() },
      include: { 
        book: { select: { id: true, title: true , author: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ 
      success: true, 
      data: reviews,
      book: {
        id: book.id,
        title: book.title
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    });
  }
}

async function handlePOST(req: AuthenticatedRequest, res: NextApiResponse) {
  // Create a new review
  try {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues });
    }
    
    const { content, bookId } = parsed.data;
    
    // Verify the book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({ 
        success: false, 
        error: 'book not found' 
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        error: 'User authentication required to create a review' 
      });
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating: parsed.data.rating,
        bookId,
        userId: req.user.id,
      },
      include: {
        book: true
      }
    });
    
    return res.status(201).json({ success: true, data: review });
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

  