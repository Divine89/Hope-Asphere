import { db } from "../db";
import { bookings, payments, listings } from "@home-asphere/db/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { ApiError } from "@home-asphere/shared/types";
import { CreateBookingRequest, calculateBookingSubtotal, calculateCommission } from "@home-asphere/shared/types";
import { calculateNights } from "@home-asphere/shared/utils";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export class BookingService {
  static async createBooking(guestId: string, data: CreateBookingRequest) {
    // Get listing
    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, data.listingId))
      .limit(1);

    if (!listing[0]) {
      throw new ApiError(404, "Listing not found", "LISTING_NOT_FOUND");
    }

    // Check double booking
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.listingId, data.listingId),
          gte(bookings.checkOut, data.checkIn),
          lte(bookings.checkIn, data.checkOut),
          eq(bookings.status, "confirmed")
        )
      )
      .limit(1);

    if (existingBooking.length > 0) {
      throw new ApiError(409, "Dates already booked", "DOUBLE_BOOKING");
    }

    // Calculate booking details
    const numberOfNights = calculateNights(data.checkIn, data.checkOut);
    const subtotal = calculateBookingSubtotal(parseFloat(listing[0].pricePerNight), numberOfNights);
    const platformFee = calculateCommission(subtotal);
    const totalPrice = subtotal + platformFee;

    // Create Razorpay order
    const orderId = `order_${Date.now()}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // Convert to paise
      currency: "INR",
      receipt: orderId,
      notes: {
        listingId: data.listingId,
        guestId,
        hostId: listing[0].hostId,
      },
    });

    // Create booking
    const result = await db
      .insert(bookings)
      .values({
        listingId: data.listingId,
        guestId,
        hostId: listing[0].hostId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: data.numberOfGuests,
        numberOfNights,
        pricePerNight: listing[0].pricePerNight,
        subtotal: subtotal.toString(),
        platformFee: platformFee.toString(),
        totalPrice: totalPrice.toString(),
        status: "pending",
        paymentStatus: "pending",
      })
      .returning();

    // Create payment record
    await db
      .insert(payments)
      .values({
        bookingId: result[0].id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalPrice.toString(),
        currency: "INR",
        status: "pending",
      })
      .returning();

    return {
      booking: result[0],
      razorpayOrder,
    };
  }

  static async getBookingById(id: number, userId: string) {
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);

    if (!result[0]) {
      throw new ApiError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    // Check authorization
    if (result[0].guestId !== userId && result[0].hostId !== userId) {
      throw new ApiError(403, "Unauthorized to view this booking", "FORBIDDEN");
    }

    return result[0];
  }

  static async getGuestBookings(guestId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const data = await db
      .select()
      .from(bookings)
      .where(eq(bookings.guestId, guestId))
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.guestId, guestId));

    const total = countResult[0]?.count || 0;

    return {
      bookings: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getHostBookings(hostId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const data = await db
      .select()
      .from(bookings)
      .where(eq(bookings.hostId, hostId))
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.hostId, hostId));

    const total = countResult[0]?.count || 0;

    return {
      bookings: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async cancelBooking(id: number, userId: string, reason?: string) {
    const booking = await this.getBookingById(id, userId);

    // Only guest can cancel
    if (booking.guestId !== userId) {
      throw new ApiError(403, "Only guest can cancel booking", "FORBIDDEN");
    }

    // Cannot cancel completed bookings
    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new ApiError(400, "Cannot cancel this booking", "INVALID_STATE");
    }

    const result = await db
      .update(bookings)
      .set({
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    return result[0];
  }
}
