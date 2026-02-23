import { db } from "../db";
import {
  listings,
  listingImages,
  bookings,
  availability,
  reviews,
} from "@home-asphere/db/schema";
import { eq, and, gte, lte, sql, desc, inArray } from "drizzle-orm";
import { ApiError } from "@home-asphere/shared/types";
import { CreateListingRequest, SearchListingsRequest } from "@home-asphere/shared/types";

export class ListingService {
  static async createListing(hostId: string, data: CreateListingRequest) {
    const result = await db
      .insert(listings)
      .values({
        hostId,
        title: data.title,
        description: data.description,
        pricePerNight: data.pricePerNight.toString(),
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        city: data.city,
        state: data.state,
        address: data.address,
        zipCode: data.zipCode,
        lat: data.lat,
        lng: data.lng,
        amenities: data.amenities,
        rulesAndPolicies: data.rulesAndPolicies,
        cancellationPolicy: data.cancellationPolicy || "moderate",
        isActive: true,
      })
      .returning();

    return result[0];
  }

  static async getListingById(id: number) {
    const result = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id))
      .leftJoin(listingImages, eq(listings.id, listingImages.listingId))
      .leftJoin(reviews, eq(listings.id, reviews.listingId));

    if (!result.length) {
      throw new ApiError(404, "Listing not found", "LISTING_NOT_FOUND");
    }

    const listing = result[0].listings;
    const images = result.map((row) => row.listing_images).filter((img) => img !== null);
    const listingReviews = result.map((row) => row.reviews).filter((rev) => rev !== null);

    return {
      ...listing,
      images,
      reviews: listingReviews,
    };
  }

  static async searchListings(filters: SearchListingsRequest) {
    let query = db.select().from(listings);

    // Filter by city
    if (filters.city) {
      query = query.where(eq(listings.city, filters.city));
    }

    // Filter by price range
    if (filters.minPrice) {
      query = query.where(gte(listings.pricePerNight, filters.minPrice.toString()));
    }
    if (filters.maxPrice) {
      query = query.where(lte(listings.pricePerNight, filters.maxPrice.toString()));
    }

    // Filter by guests
    if (filters.guests) {
      query = query.where(gte(listings.maxGuests, filters.guests));
    }

    // Filter by rating
    if (filters.minRating) {
      query = query.where(gte(listings.averageRating, filters.minRating.toString()));
    }

    // Only show active listings
    query = query.where(eq(listings.isActive, true));

    // Sorting
    const sortBy = filters.sortBy || "newest";
    if (sortBy === "price_asc") {
      query = query.orderBy(listings.pricePerNight);
    } else if (sortBy === "price_desc") {
      query = query.orderBy(desc(listings.pricePerNight));
    } else if (sortBy === "rating_desc") {
      query = query.orderBy(desc(listings.averageRating));
    } else {
      query = query.orderBy(desc(listings.createdAt));
    }

    // Pagination
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;

    const data = await query.limit(limit).offset(offset);
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings);
    const total = countResult[0]?.count || 0;

    return {
      listings: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async updateListing(id: number, hostId: string, data: Partial<CreateListingRequest>) {
    // Verify ownership
    const listing = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    if (!listing[0] || listing[0].hostId !== hostId) {
      throw new ApiError(403, "Unauthorized to update this listing", "FORBIDDEN");
    }

    const result = await db
      .update(listings)
      .set({
        ...data,
        pricePerNight: data.pricePerNight?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(listings.id, id))
      .returning();

    return result[0];
  }

  static async deleteListing(id: number, hostId: string) {
    // Verify ownership
    const listing = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    if (!listing[0] || listing[0].hostId !== hostId) {
      throw new ApiError(403, "Unauthorized to delete this listing", "FORBIDDEN");
    }

    await db.delete(listings).where(eq(listings.id, id));
  }

  static async getHostListings(hostId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const data = await db
      .select()
      .from(listings)
      .where(eq(listings.hostId, hostId))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.hostId, hostId));

    const total = countResult[0]?.count || 0;

    return {
      listings: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
