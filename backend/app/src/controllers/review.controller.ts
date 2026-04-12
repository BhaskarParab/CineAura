import "dotenv/config";
import type { Response } from "express";
import { prisma } from "../db/db.config";
import { AuthRequest } from "../types";

// POST => It will create a new review for that movie

export const createReview = async (req: AuthRequest, res: Response) => {
  const { content, rating, tmdbId, mediaType } = req.body;

  if (!content || !rating || !tmdbId || !mediaType) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const userId = req.user!.id;

  try {
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        tmdbId,
        mediaType,
      },
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this movie",
      });
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating,
        userId,
        tmdbId,
        mediaType,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

//GET => It will get all the reviews from the for that movie which is in the form of tmdbId

export const getReviews = async (req: AuthRequest, res: Response) => {
  const tmdbId = Number(req.params.tmdbId);
  const mediaType = req.params.mediaType as "MOVIE" | "TV";

  if (isNaN(tmdbId) || !mediaType) {
    return res.status(400).json({
      message: "tmdbID is invalid",
    });
  }

  const reviews = await prisma.review.findMany({
    where: {
      tmdbId,
      mediaType,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
};

// PUT => It will update the review after checking the ownership of the review

export const updateReview = async (req: AuthRequest, res: Response) => {
  const reviewId = req.params.id as string;
  const { content, rating } = req.body;
  const userId = req.user!.id;

  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existing || existing.userId !== userId) {
    return res.status(403).json({
      message: "Not allowed",
    });
  }

  try {
    const review = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        content,
        rating,
      },
    });

    res.json(review);
  } catch {
    res.status(403).json({
      message: "Not allowed or review not found",
    });
  }
};

// DELETE => It will delete the review after checking the ownership of the review

export const deleteReview = async (req: AuthRequest, res: Response) => {
  const reviewId = req.params.id as string;
  const userId = req.user!.id;

  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existing || existing.userId !== userId) {
    return res.status(403).json({
      message: "Not allowed",
    });
  }

  try {
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    res.json({ message: "Review deleted" });
  } catch {
    res.status(403).json({
      message: "Not allowed or review not found",
    });
  }
};
