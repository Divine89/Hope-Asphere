import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ReviewService } from "../services/review.service";
import { ApiResponse } from "@home-asphere/shared/types";

export class ReviewController {
  static async createReview(req: AuthRequest, res: Response) {
    const guestId = req.userId!;
    const review = await ReviewService.createReview(guestId, req.body);

    const response: ApiResponse = {
      success: true,
      data: review,
      message: "Review created successfully",
    };

    res.status(201).json(response);
  }

  static async getReviewsByListing(req: AuthRequest, res: Response) {
    const { listingId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await ReviewService.getReviewsByListing(parseInt(listingId), page, limit);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.json(response);
  }

  static async addHostReply(req: AuthRequest, res: Response) {
    const { reviewId } = req.params;
    const hostId = req.userId!;
    const { reply } = req.body;

    const review = await ReviewService.addHostReply(parseInt(reviewId), hostId, reply);

    const response: ApiResponse = {
      success: true,
      data: review,
      message: "Host reply added successfully",
    };

    res.json(response);
  }
}
