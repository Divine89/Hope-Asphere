// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "guest" | "host" | "admin";
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "guest" | "host" | "admin";
  profileImage: string | null;
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

// Listing types
export interface ListingFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  checkIn?: Date;
  checkOut?: Date;
  amenities?: string[];
  minRating?: number;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  state?: string;
  address: string;
  zipCode?: string;
  lat?: string;
  lng?: string;
  amenities: string[];
  rulesAndPolicies?: string;
  cancellationPolicy?: "flexible" | "moderate" | "strict";
}

// Booking types
export interface CreateBookingRequest {
  listingId: number;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
}

export interface BookingDetails {
  id: number;
  listingId: number;
  guestId: string;
  hostId: string;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  numberOfNights: number;
  pricePerNight: number;
  subtotal: number;
  platformFee: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// Review types
export interface CreateReviewRequest {
  bookingId: number;
  listingId: number;
  rating: number;
  title?: string;
  comment: string;
  cleanliness?: number;
  communication?: number;
  checkIn?: number;
  accuracy?: number;
  location?: number;
  value?: number;
}

// Search types
export interface SearchListingsRequest {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  sortBy?: "price_asc" | "price_desc" | "rating_desc" | "newest";
  page?: number;
  limit?: number;
}

export interface SearchListingsResponse {
  listings: Array<{
    id: number;
    title: string;
    city: string;
    pricePerNight: number;
    averageRating: number;
    reviewCount: number;
    maxGuests: number;
    primaryImage?: string;
    lat?: string;
    lng?: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Razorpay types
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  customer_notify: number;
  notes: Record<string, unknown>;
}

export interface RazorpayWebhookPayload {
  event: string;
  created_at: number;
  payload: {
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        [key: string]: unknown;
      };
    };
    order?: {
      entity: {
        id: string;
        [key: string]: unknown;
      };
    };
  };
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Host earnings
export interface HostEarnings {
  totalBookings: number;
  totalRevenue: number;
  platformFee: number;
  netEarnings: number;
  pendingEarnings: number;
  completedBookings: number;
  cancelledBookings: number;
}

// Admin dashboard
export interface AdminDashboardStats {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  platformCommission: number;
  activeListings: number;
  suspendedUsers: number;
  conversions: {
    searchToBooking: number;
    bookingToPayment: number;
  };
}
