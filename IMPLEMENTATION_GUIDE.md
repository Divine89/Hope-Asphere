# Advanced Implementation Guides

## Razorpay Payment Integration

### Webhook Handler

```typescript
// apps/api/src/routes/webhook.routes.ts
import { Router, Request, Response } from "express";
import crypto from "crypto";
import { PaymentService } from "../services/payment.service";

const router = Router();

router.post("/razorpay", async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Verify signature
  const hash = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (hash !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Process payment
  const payment = await PaymentService.handlePaymentSuccess(
    razorpay_order_id,
    razorpay_payment_id
  );

  res.json({ success: true, payment });
});

export default router;
```

### Payment Service

```typescript
// apps/api/src/services/payment.service.ts
export class PaymentService {
  static async handlePaymentSuccess(orderId: string, paymentId: string) {
    // Update payment record
    const payment = await db
      .update(payments)
      .set({
        razorpayPaymentId: paymentId,
        status: "captured",
        updatedAt: new Date(),
      })
      .where(eq(payments.razorpayOrderId, orderId))
      .returning();

    // Update booking status
    const booking = await db
      .update(bookings)
      .set({
        status: "confirmed",
        paymentStatus: "paid",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, payment[0].bookingId))
      .returning();

    // Send confirmation email
    await EmailService.sendBookingConfirmation(booking[0]);

    // Create notification
    await NotificationService.notifyHost(booking[0]);

    return payment[0];
  }

  static async refundPayment(paymentId: string, amount: number) {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const refund = await razorpay.payments.refund(paymentId, {
      amount: Math.round(amount * 100), // Convert to paise
    });

    // Update payment record
    await db
      .update(payments)
      .set({
        status: "refunded",
        refundAmount: amount.toString(),
        refundedAt: new Date(),
      })
      .where(eq(payments.razorpayPaymentId, paymentId))
      .returning();

    return refund;
  }
}
```

## S3 Image Upload

### Upload Service

```typescript
// apps/api/src/services/upload.service.ts
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export class UploadService {
  static async getPresignedUrl(fileName: string) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET || "mybucket",
      Key: `listings/${Date.now()}-${fileName}`,
      Expires: 3600, // 1 hour
      ContentType: "image/jpeg",
    };

    return s3.getSignedUrl("putObject", params);
  }

  static async uploadListingImages(listingId: number, imageUrls: string[]) {
    const images = imageUrls.map((url, index) => ({
      listingId,
      imageUrl: url,
      isPrimary: index === 0,
      order: index,
    }));

    return db.insert(listingImages).values(images).returning();
  }
}
```

### Frontend Upload Handler

```typescript
// apps/web/src/hooks/use-upload.ts
export function useUpload() {
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Get presigned URL
      const res = await fetch(`${API_BASE_URL}/upload/presigned-url`, {
        method: "POST",
        body: JSON.stringify({ fileName: file.name }),
        headers: { "Content-Type": "application/json" },
      });

      const { presignedUrl } = await res.json();

      // Upload to S3
      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      return presignedUrl;
    },
  });

  return uploadMutation;
}
```

## Email Notifications

### Email Service

```typescript
// apps/api/src/services/email.service.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export class EmailService {
  static async sendBookingConfirmation(booking: Booking) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.guestEmail,
      subject: `Booking Confirmed - Order #${booking.id}`,
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Your booking has been confirmed.</p>
        <p><strong>Order ID:</strong> ${booking.id}</p>
        <p><strong>Check-in:</strong> ${booking.checkIn}</p>
        <p><strong>Check-out:</strong> ${booking.checkOut}</p>
        <p><strong>Total Amount:</strong> ₹${booking.totalPrice}</p>
      `,
    };

    return transporter.sendMail(mailOptions);
  }

  static async sendReviewNotification(review: Review) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: review.hostEmail,
      subject: `New Review on Your Listing`,
      html: `
        <h1>You've received a new review!</h1>
        <p><strong>Rating:</strong> ${review.rating}/5</p>
        <p><strong>Comment:</strong> ${review.comment}</p>
      `,
    };

    return transporter.sendMail(mailOptions);
  }
}
```

## Rate Limiting

```typescript
// apps/api/src/middleware/rateLimit.ts
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, try again later",
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
});

// Usage in routes
router.post("/login", authLimiter, LoginController.login);
app.use("/api/", apiLimiter);
```

## Caching Strategy

```typescript
// apps/api/src/services/cache.service.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set<T>(key: string, value: T, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  static async invalidate(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

// Usage
static async getListingById(id: number) {
  const cached = await CacheService.get(`listing:${id}`);
  if (cached) return cached;

  const listing = await db.select().from(listings)
    .where(eq(listings.id, id)).limit(1);

  if (listing[0]) {
    await CacheService.set(`listing:${id}`, listing[0], 3600);
  }

  return listing[0];
}
```

## Admin Dashboard Metrics

```typescript
// apps/api/src/services/analytics.service.ts
export class AnalyticsService {
  static async getDashboardMetrics() {
    const [
      totalUsers,
      totalListings,
      totalBookings,
      totalRevenue,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(listings),
      db.select({ count: sql<number>`count(*)` }).from(bookings),
      db.select({ total: sql<number>`sum(total_price)` }).from(bookings),
    ]);

    const platformCommission =
      totalRevenue[0]?.total * 0.12 || 0;

    return {
      totalUsers: totalUsers[0].count,
      totalListings: totalListings[0].count,
      totalBookings: totalBookings[0].count,
      totalRevenue: totalRevenue[0]?.total || 0,
      platformCommission,
      activeListings: await this.getActiveListings(),
      suspendedUsers: await this.getSuspendedUsers(),
    };
  }

  private static async getActiveListings() {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(eq(listings.isActive, true));

    return result[0].count;
  }

  private static async getSuspendedUsers() {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isSuspended, true));

    return result[0].count;
  }
}
```

## Search with Filters

```typescript
// apps/api/src/services/search.service.ts
export class SearchService {
  static async advancedSearch(filters: SearchFilters) {
    let query = db.select().from(listings);

    // City filter
    if (filters.city) {
      query = query.where(eq(listings.city, filters.city));
    }

    // Price range
    if (filters.minPrice) {
      query = query.where(gte(listings.pricePerNight, filters.minPrice.toString()));
    }
    if (filters.maxPrice) {
      query = query.where(lte(listings.pricePerNight, filters.maxPrice.toString()));
    }

    // Amenities filter
    if (filters.amenities?.length > 0) {
      query = query.where(
        sql`${listings.amenities}::jsonb @> ${JSON.stringify(filters.amenities)}::jsonb`
      );
    }

    // Date availability
    if (filters.checkIn && filters.checkOut) {
      const booked = db
        .select({ listingId: bookings.listingId })
        .from(bookings)
        .where(
          and(
            gte(bookings.checkOut, filters.checkIn),
            lte(bookings.checkIn, filters.checkOut),
            eq(bookings.status, "confirmed")
          )
        );

      query = query.where(notInSubQuery(listings.id, booked));
    }

    return query;
  }
}
```

These implementations provide a solid foundation for building the complete marketplace application.
