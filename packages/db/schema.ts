import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
  varchar,
  decimal,
  index,
  foreignKey,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// USERS TABLE
// ============================================================================
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // UUID or custom ID
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    profileImage: text("profile_image"),
    bio: text("bio"),
    phone: text("phone"),
    role: text("role").notNull(), // "guest", "host", "admin"
    isVerified: boolean("is_verified").default(false),
    isSuspended: boolean("is_suspended").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_user_email").on(table.email), index("idx_user_role").on(table.role)]
);

// ============================================================================
// LISTINGS TABLE
// ============================================================================
export const listings = pgTable(
  "listings",
  {
    id: serial("id").primaryKey(),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
    maxGuests: integer("max_guests").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    city: text("city").notNull(),
    state: text("state"),
    address: text("address").notNull(),
    zipCode: text("zip_code"),
    lat: numeric("lat"),
    lng: numeric("lng"),
    amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
    rulesAndPolicies: text("rules_and_policies"),
    cancellationPolicy: text("cancellation_policy"), // "flexible", "moderate", "strict"
    averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0"),
    reviewCount: integer("review_count").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_listing_host").on(table.hostId),
    index("idx_listing_city").on(table.city),
    index("idx_listing_active").on(table.isActive),
  ]
);

// ============================================================================
// LISTING IMAGES TABLE
// ============================================================================
export const listingImages = pgTable(
  "listing_images",
  {
    id: serial("id").primaryKey(),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    s3Key: text("s3_key"),
    isPrimary: boolean("is_primary").default(false),
    order: integer("order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_image_listing").on(table.listingId)]
);

// ============================================================================
// AMENITIES TABLE
// ============================================================================
export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  category: text("category"), // "essentials", "features", "safety", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// AVAILABILITY CALENDAR TABLE
// ============================================================================
export const availability = pgTable(
  "availability",
  {
    id: serial("id").primaryKey(),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    isAvailable: boolean("is_available").default(true),
    blockReason: text("block_reason"), // "host_blocked", "booked", etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_availability_listing_date").on(table.listingId, table.date),
    unique("unique_listing_date").on(table.listingId, table.date),
  ]
);

// ============================================================================
// BOOKINGS TABLE
// ============================================================================
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    checkIn: timestamp("check_in").notNull(),
    checkOut: timestamp("check_out").notNull(),
    numberOfGuests: integer("number_of_guests").notNull(),
    numberOfNights: integer("number_of_nights").notNull(),
    pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
    platformFee: decimal("platform_fee", { precision: 12, scale: 2 }).notNull(), // 12% commission
    totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
    status: text("status").notNull(), // "pending", "confirmed", "cancelled", "refunded", "completed"
    paymentStatus: text("payment_status").notNull(), // "pending", "paid", "failed", "refunded"
    cancellationReason: text("cancellation_reason"),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_booking_listing").on(table.listingId),
    index("idx_booking_guest").on(table.guestId),
    index("idx_booking_host").on(table.hostId),
    index("idx_booking_status").on(table.status),
  ]
);

// ============================================================================
// PAYMENTS TABLE
// ============================================================================
export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id").unique(),
    razorpayPaymentId: text("razorpay_payment_id").unique(),
    razorpaySignature: text("razorpay_signature"),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("INR"),
    status: text("status").notNull(), // "pending", "authorized", "captured", "failed", "refunded"
    method: text("method"), // "card", "upi", "wallet", etc.
    failureReason: text("failure_reason"),
    refundAmount: decimal("refund_amount", { precision: 12, scale: 2 }).default("0"),
    refundedAt: timestamp("refunded_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_payment_booking").on(table.bookingId),
    index("idx_payment_razorpay_order").on(table.razorpayOrderId),
  ]
);

// ============================================================================
// REVIEWS TABLE
// ============================================================================
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(), // 1-5
    title: text("title"),
    comment: text("comment").notNull(),
    cleanliness: integer("cleanliness"), // 1-5
    communication: integer("communication"), // 1-5
    checkIn: integer("check_in"), // 1-5
    accuracy: integer("accuracy"), // 1-5
    location: integer("location"), // 1-5
    value: integer("value"), // 1-5
    hostReply: text("host_reply"),
    hostRepliedAt: timestamp("host_replied_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_review_listing").on(table.listingId),
    index("idx_review_guest").on(table.guestId),
    index("idx_review_host").on(table.hostId),
  ]
);

// ============================================================================
// WISHLIST TABLE
// ============================================================================
export const wishlist = pgTable(
  "wishlist",
  {
    id: serial("id").primaryKey(),
    guestId: text("guest_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_wishlist_guest").on(table.guestId),
    unique("unique_wishlist").on(table.guestId, table.listingId),
  ]
);

// ============================================================================
// ADMIN LOGS TABLE
// ============================================================================
export const adminLogs = pgTable(
  "admin_logs",
  {
    id: serial("id").primaryKey(),
    adminId: text("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    entityType: text("entity_type"), // "user", "listing", "booking", etc.
    entityId: text("entity_id"),
    details: jsonb("details").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_admin_log_admin").on(table.adminId),
    index("idx_admin_log_timestamp").on(table.createdAt),
  ]
);

// ============================================================================
// NOTIFICATIONS TABLE
// ============================================================================
export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // "booking", "review", "message", etc.
    title: text("title").notNull(),
    message: text("message").notNull(),
    relatedId: integer("related_id"), // booking_id, listing_id, etc.
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_notification_user").on(table.userId),
    index("idx_notification_read").on(table.isRead),
  ]
);

// ============================================================================
// SESSIONS TABLE (for auth)
// ============================================================================
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_session_user").on(table.userId)]
);

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectUserSchema = createSelectSchema(users);

// Listing schemas
export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectListingSchema = createSelectSchema(listings);

// Booking schemas
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectBookingSchema = createSelectSchema(bookings);

// Review schemas
export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectReviewSchema = createSelectSchema(reviews);

// Payment schemas
export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectPaymentSchema = createSelectSchema(payments);

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type ListingImage = typeof listingImages.$inferSelect;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Availability = typeof availability.$inferSelect;

export type Wishlist = typeof wishlist.$inferSelect;

export type AdminLog = typeof adminLogs.$inferSelect;

export type Notification = typeof notifications.$inferSelect;

export type Session = typeof sessions.$inferSelect;
