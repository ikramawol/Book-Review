import { NextApiRequest, NextApiResponse } from "next";

export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };
}