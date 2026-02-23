import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models from the Replit Auth integration
export * from "./models/auth";
import { users } from "./models/auth";

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  hostId: text("host_id").notNull(), // Links to users.id
  title: text("title").notNull(),
  description: text("description").notNull(),
  pricePerNight: integer("price_per_night").notNull(), // In cents/smallest currency unit
  maxGuests: integer("max_guests").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  lat: numeric("lat"),
  lng: numeric("lng"),
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  guestId: text("guest_id").notNull(), // Links to users.id
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull(), // "pending", "confirmed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  guestId: text("guest_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod insert schemas (omitting auto-generated fields)
export const insertListingSchema = createInsertSchema(listings).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

// Types
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
