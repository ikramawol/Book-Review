import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";

//CreateReview

export async function createReview
(
  content: string,
  rating: number,
  userId: string,
  bookId: string,
) {
  try {

    if (!content || !rating || !userId || !bookId) {
      throw new Error("All fields are required");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const Review
     = await prisma.review
    .create({
      data: {
        content,
        rating,
        user: { connect: { id: userId } },
        book: { connect: { id: bookId } }
      },
    });
    return {
      success: true,
      data: Review
      ,
    };
  } catch (error) {
    console.error("Error creating Review", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//GetAll

export async function getAllReviews() {
  try {
    const Reviews = await prisma.review
    .findMany();
    return {
      success: true,
      data: Reviews,
    };
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//GetById
export async function getReviewById(
    reviewId: string) {
  try {
    const review = await prisma.review
    .findUnique({
      where: { id: reviewId },
      include: {
        book: true
      },
    });
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

//UpdateReview

export async function updateReview
(
  id: string,
  data: {
    content: string,
    rating: number,
    userId: string,
    bookId: string,
  }
) {
  try {
    const Review = await prisma.review.update({
      where: { id },
      data,
    });
    return { success: true, Review

     };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

//DeleteReview

export async function deleteReview
(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    return res.status(200).json({ message: "Review deleted succesfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
