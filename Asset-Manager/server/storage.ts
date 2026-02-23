import { db } from "./db";
import { listings, bookings, reviews, type InsertListing, type InsertBooking, type InsertReview, type Listing, type Booking, type Review } from "@shared/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { users } from "@shared/models/auth";

export interface IStorage {
  getListings(filters?: { city?: string; minPrice?: number; maxPrice?: number }): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  
  getBookingsByUser(userId: string): Promise<(Booking & { listing: Listing })[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  getReviewsByListing(listingId: number): Promise<(Review & { user: { firstName: string | null; lastName: string | null } })[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  async getListings(filters?: { city?: string; minPrice?: number; maxPrice?: number }): Promise<Listing[]> {
    let query = db.select().from(listings);
    const conditions = [];
    
    if (filters?.city) {
      conditions.push(eq(listings.city, filters.city));
    }
    if (filters?.minPrice) {
      conditions.push(gte(listings.pricePerNight, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(listings.pricePerNight, filters.maxPrice));
    }
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }
    return await query;
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const [created] = await db.insert(listings).values(listing).returning();
    return created;
  }

  async getBookingsByUser(userId: string): Promise<(Booking & { listing: Listing })[]> {
    const results = await db.select({
      booking: bookings,
      listing: listings
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(eq(bookings.guestId, userId))
    .orderBy(desc(bookings.createdAt));
    
    return results.map(r => ({
      ...r.booking,
      listing: r.listing
    }));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values(booking).returning();
    return created;
  }

  async getReviewsByListing(listingId: number): Promise<(Review & { user: { firstName: string | null; lastName: string | null } })[]> {
    const results = await db.select({
      review: reviews,
      user: {
        firstName: users.firstName,
        lastName: users.lastName
      }
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.guestId, users.id))
    .where(eq(reviews.listingId, listingId))
    .orderBy(desc(reviews.createdAt));
    
    return results;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
