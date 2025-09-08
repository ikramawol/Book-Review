import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Group reviews by week
    const reviews = await prisma.review.findMany({
      select: { createdAt: true }
    });

    // Group by week
    const weekCounts: { [week: string]: number } = {};
    reviews.forEach(r => {
      const date = new Date(r.createdAt);
      const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
      weekCounts[week] = (weekCounts[week] || 0) + 1;
    });

    // Format for chart
    const timeline = Object.entries(weekCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, count]) => ({
        week,
        count
      }));

    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch review timeline" });
  }
}