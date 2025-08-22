import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { authMiddleware, AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { z } from 'zod';

const updateReviewSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  rating: z.number().min(1).max(5),
});

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
const { id } = req.query;
const reviewId = Array.isArray(id) ? id[0] : id;

//   if (isNaN(Number(reviewId))) {
//     return res.status(400).json({
//       success: false,
//       error: 'Invalid review Id'
//     });
//   }

try {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      book: { select: { id: true, title: true } }
    }
  });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "reviw not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch review'
    });
  }
}

async function handlePUT(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;
  const reviewId = Array.isArray(id) ? id[0] : id;

  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ 
      success: false, 
      error: 'User authentication required to update a reviw' 
    });
  }

  const parsed = updateReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.issues });
  }

  const { content } = parsed.data;

  try {
    // Check ownership
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ success: false, error: 'review not found' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You can only update your own reviews' });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { content },
      include: {
        user: { select: { id: true, name: true, email: true } },
        book: { select: { id: true, title: true } }
      }
    });
    
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update reviw error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update reviw' });
  }
}

async function handleDELETE(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;
const reviewId = Array.isArray(id) ? id[0] : id;


  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ 
      success: false, 
      error: 'User authentication required to delete a reviw' 
    });
  }
  
  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ success: false, error: 'review not found' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You can only delete your own reviews' });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    return res.status(200).json({ success: true, message: 'review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGET(req, res);
  }
  
  if (req.method === 'PUT') {
    return authMiddleware(handlePUT)(req as AuthenticatedRequest, res);
  }
  
  if (req.method === 'DELETE') {
    return authMiddleware(handleDELETE)(req as AuthenticatedRequest, res);
  }
  
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}