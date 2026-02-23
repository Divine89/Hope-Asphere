import { db } from "../db";
import { reviews, bookings } from "@home-asphere/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { ApiError } from "@home-asphere/shared/types";
import { CreateReviewRequest } from "@home-asphere/shared/types";

export class ReviewService {
  static async createReview(guestId: string, data: CreateReviewRequest) {
    // Check if booking exists and belongs to guest
    const booking = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, data.bookingId), eq(bookings.guestId, guestId)))
      .limit(1);

    if (!booking[0]) {
      throw new ApiError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    // Check if review already exists
    const existingReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookingId, data.bookingId))
      .limit(1);

    if (existingReview.length > 0) {
      throw new ApiError(409, "Review already exists for this booking", "REVIEW_EXISTS");
    }

    // Create review
    const result = await db
      .insert(reviews)
      .values({
        bookingId: data.bookingId,
        listingId: data.listingId,
        guestId,
        hostId: booking[0].hostId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        cleanliness: data.cleanliness,
        communication: data.communication,
        checkIn: data.checkIn,
        accuracy: data.accuracy,
        location: data.location,
        value: data.value,
      })
      .returning();

    return result[0];
  }

  static async getReviewsByListing(listingId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const data = await db
      .select()
      .from(reviews)
      .where(eq(reviews.listingId, listingId))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.listingId, listingId));

    const total = countResult[0]?.count || 0;

    return {
      reviews: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async addHostReply(reviewId: number, hostId: string, reply: string) {
    // Get review to check if host owns the listing
    const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);

    if (!review[0]) {
      throw new ApiError(404, "Review not found", "REVIEW_NOT_FOUND");
    }

    if (review[0].hostId !== hostId) {
      throw new ApiError(403, "Not authorized to reply to this review", "FORBIDDEN");
    }

    const result = await db
      .update(reviews)
      .set({
        hostReply: reply,
        hostRepliedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId))
      .returning();

    return result[0];
  }
}
