import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/utils/jwt";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "@/middlewares/auth.middleware";
import type { JwtPayload } from "jsonwebtoken";
import { rateLimiter } from "@/middlewares/rateLimiter";

type ReportStatus = "APPROVED" | "REMOVED" | "REJECTED";

const limitedReportReview = rateLimiter(
  { windowMs: 24 * 60 * 60 * 1000, max: 5 }, 
  "report"
)(async function handleReportReview(
  req: AuthenticatedRequest,
  res: NextApiResponse,
) {
  const { reason } = req.body;
  const reviewId = req.query.id as string;

  if (!reason || !reviewId) {
    return res.status(400).json({ message: "Reason and reviewId required" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }
  try {
    const report = await prisma.report.create({
      data: {
        reason,
        user: { connect: { id: req.user.id } },
        review: { connect: { id: reviewId } },
      },
    });
    return res.status(201).json({ success: true, data: report });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, error: errorMessage });
  }
}); // Pass 'true' or a third argument to indicate the handler expects 3 arguments

// Handle admin action on a report
async function handleAdminAction(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  const reportId = req.query.id as string;
  const { action } = req.body;
  
  if (!reportId) {
    return res.status(400).json({ message: "Report ID is required" });
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) return res.status(404).json({ message: "Report not found" });

  let status: ReportStatus = "APPROVED";
  let actionTaken = "";

  switch (action) {
    case "APPROVE":
      status = "APPROVED";
      actionTaken = "Report approved, no further action.";
      break;
    case "SUSPEND":
      status = "APPROVED";
      actionTaken = "User suspended.";
      await prisma.user.update({
        where: { id: report.userId },
        data: { suspended: true },
      });
      break;
    case "REMOVE_SUSPENSION":
      status = "APPROVED";
      actionTaken = "User suspension removed.";
      await prisma.user.update({
        where: { id: report.userId },
        data: { suspended: false },
      });
      break;
    case "REMOVE":
      status = "REMOVED";
      actionTaken = "Review removed.";
      try {
        // First, delete all reports referencing this review
        await prisma.report.deleteMany({ where: { reviewId: report.reviewId } });
        // Then, delete the review itself
        await prisma.review.delete({ where: { id: report.reviewId } });
        return res.status(200).json({ success: true, status, actionTaken });
        
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return res.status(500).json({ success: false, error: errorMessage });
      }
      break;
    case "REJECT":
      status = "REJECTED";
      actionTaken = "Report rejected, no action taken.";
      break;
    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
  }

  await prisma.report.update({
    where: { id: reportId },
    data: { status, actionTaken },
  });

  return res.status(200).json({ success: true, status, actionTaken });
}

// Get a single report by reportId (admin or reporter only)
async function handleGetReportById(
  req: AuthenticatedRequest,
  res: NextApiResponse,
) {
  const reportId = req.query.id as string; 
  if (!reportId) {
    return res.status(400).json({ message: "reportId is required" });
  }

  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { user: true, review: true },
    });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Allow access if admin or the reporter
    if (
      req.user?.role === "ADMIN" ||
      (req.user?.role === "USER" && req.user?.id === report.userId)
    ) {
      return res.status(200).json({ success: true, data: report });
    } else {
      return res.status(403).json({ message: "Forbidden: Not allowed to view this report" });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, error: errorMessage });
  }
}

// Update a report by reportId (reporter only)
async function handleUpdateReportById(
  req: AuthenticatedRequest,
  res: NextApiResponse,
) {
  const reportId = req.query.id as string;
  const { reason } = req.body;

  if (!reportId || !reason) {
    return res.status(400).json({ message: "reportId and reason are required" });
  }

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  // Only the reporter can update their report
  if (req.user?.id !== report.userId) {
    return res.status(403).json({ message: "Forbidden: Not allowed to update this report" });
  }

  const updated = await prisma.report.update({
    where: { id: reportId },
    data: { reason },
  });

  return res.status(200).json({ success: true, data: updated });
}

// Delete a report by reportId (reporter only)
async function handleDeleteReportById(
  req: AuthenticatedRequest,
  res: NextApiResponse,
) {
  const reportId = req.query.id as string;

  if (!reportId) {
    return res.status(400).json({ message: "reportId is required" });
  }

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  // Only the reporter can delete their report
  if (req.user?.id !== report.userId) {
    return res.status(403).json({ message: "Forbidden: Not allowed to delete this report" });
  }

  await prisma.report.delete({ where: { id: reportId } });

  return res.status(200).json({ success: true, message: "Report deleted" });
}

// Main route handler for POST requests
export const report = authMiddleware(async function (
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];
  const user = token
    ? (verifyJwt(token) as JwtPayload & { role?: string })
    : null;

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  // If there's an action in the body, it's an admin action
  if (req.body.action) {
    return handleAdminAction(req, res);
  } else {
    // Otherwise, it's a new report submission
    return limitedReportReview(req, res);
  }
});



// Update main route handler to support GET
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://book-review-cyan.vercel.app'); // or '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  if (req.method === "POST" || req.method === "PUT") {
    return report(req, res);
    
  } else if (req.method === "GET") {
    return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      return handleGetReportById(req, res);
    })(req as AuthenticatedRequest, res);

  } else if (req.method === "PATCH") {
    return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      return handleUpdateReportById(req, res);
    })(req as AuthenticatedRequest, res);

  } else if (req.method === "DELETE") {
    return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      return handleDeleteReportById(req, res);
    })(req as AuthenticatedRequest, res);

  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default handler;
