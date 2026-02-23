// Constants for the application

// API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Pagination
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

// Commission
export const PLATFORM_COMMISSION_PERCENTAGE = 12;

// Amenities
export const AMENITIES_MAP: Record<string, { label: string; icon: string; category: string }> = {
  wifi: { label: "WiFi", icon: "wifi", category: "essentials" },
  kitchen: { label: "Kitchen", icon: "utensils", category: "essentials" },
  heating: { label: "Heating", icon: "fire", category: "essentials" },
  ac: { label: "Air Conditioning", icon: "snowflake", category: "essentials" },
  washer: { label: "Washer", icon: "shoe-prints", category: "essentials" },
  dryer: { label: "Dryer", icon: "wind", category: "essentials" },
  parking: { label: "Parking", icon: "car", category: "features" },
  gym: { label: "Gym", icon: "dumbbell", category: "features" },
  pool: { label: "Pool", icon: "waves", category: "features" },
  hot_tub: { label: "Hot Tub", icon: "droplet", category: "features" },
  garden: { label: "Garden", icon: "leaf", category: "features" },
  smoking: { label: "Smoking Allowed", icon: "cigarette", category: "rules" },
  pets: { label: "Pets Allowed", icon: "paw-print", category: "rules" },
  events: { label: "Events Allowed", icon: "music", category: "rules" },
  smoke_detector: { label: "Smoke Detector", icon: "alert-circle", category: "safety" },
  fire_extinguisher: { label: "Fire Extinguisher", icon: "flame", category: "safety" },
  first_aid: { label: "First Aid Kit", icon: "heart", category: "safety" },
  cctv: { label: "CCTV", icon: "camera", category: "safety" },
};

// Booking statuses
export const BOOKING_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  COMPLETED: "completed",
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// Cancellation policies
export const CANCELLATION_POLICIES = {
  FLEXIBLE: "flexible",
  MODERATE: "moderate",
  STRICT: "strict",
} as const;

// User roles
export const USER_ROLES = {
  GUEST: "guest",
  HOST: "host",
  ADMIN: "admin",
} as const;

// Error codes
export const ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  LISTING_NOT_FOUND: "LISTING_NOT_FOUND",
  BOOKING_NOT_FOUND: "BOOKING_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DOUBLE_BOOKING: "DOUBLE_BOOKING",
  PAYMENT_FAILED: "PAYMENT_FAILED",
} as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Invalid email address",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  PASSWORDS_NOT_MATCH: "Passwords do not match",
  PRICE_INVALID: "Price must be greater than 0",
  GUESTS_INVALID: "Number of guests must be at least 1",
};

// Sort options
export const SORT_OPTIONS = {
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  RATING_DESC: "rating_desc",
  NEWEST: "newest",
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM d, yyyy",
  ISO: "yyyy-MM-dd",
  FULL: "EEEE, MMMM d, yyyy",
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
};
