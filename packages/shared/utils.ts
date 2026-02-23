import { PLATFORM_COMMISSION_PERCENTAGE } from "./constants";

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Calculate platform commission from subtotal
 */
export function calculateCommission(subtotal: number): number {
  return Math.round((subtotal * PLATFORM_COMMISSION_PERCENTAGE) / 100);
}

/**
 * Calculate total price including commission
 */
export function calculateTotalPrice(subtotal: number): number {
  const commission = calculateCommission(subtotal);
  return subtotal + commission;
}

/**
 * Calculate booking subtotal from price per night and number of nights
 */
export function calculateBookingSubtotal(pricePerNight: number, numberOfNights: number): number {
  return pricePerNight * numberOfNights;
}

/**
 * Format price to display format
 */
export function formatPrice(price: number | string, currency = "₹"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `${currency}${num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((checkOut.getTime() - checkIn.getTime()) / oneDay);
}

/**
 * Check if date is available (not in booked range)
 */
export function isDateAvailable(
  date: Date,
  bookedRanges: Array<{ checkIn: Date; checkOut: Date }>
): boolean {
  return !bookedRanges.some((range) => date >= range.checkIn && date < range.checkOut);
}

/**
 * Get all dates between check-in and check-out
 */
export function getDateRange(checkIn: Date, checkOut: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(checkIn);

  while (current < checkOut) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Format date for display
 */
export function formatDate(date: Date, format = "MMM d, yyyy"): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate string to length
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
}

/**
 * Validate latitude
 */
export function isValidLatitude(lat: number | string): boolean {
  const num = typeof lat === "string" ? parseFloat(lat) : lat;
  return !isNaN(num) && num >= -90 && num <= 90;
}

/**
 * Validate longitude
 */
export function isValidLongitude(lng: number | string): boolean {
  const num = typeof lng === "string" ? parseFloat(lng) : lng;
  return !isNaN(num) && num >= -180 && num <= 180;
}

/**
 * Check if dates overlap
 */
export function datesOverlap(
  a: { checkIn: Date; checkOut: Date },
  b: { checkIn: Date; checkOut: Date }
): boolean {
  return a.checkIn < b.checkOut && a.checkOut > b.checkIn;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Remove duplicates from array
 */
export function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Group array items by key
 */
export function groupBy<T, K extends keyof T>(arr: T[], key: K): Record<string | number, T[]> {
  return arr.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    },
    {} as Record<string | number, T[]>
  );
}

/**
 * Sort array by key
 */
export function sortBy<T, K extends keyof T>(arr: T[], key: K, order: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Remove undefined properties from object
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as Partial<T>;
}

/**
 * Pick specific keys from object
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

// ============================================================================
// LOCATION UTILITIES
// ============================================================================

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ============================================================================
// CRYPTO UTILITIES
// ============================================================================

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Generate random token
 */
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================================================
// TIME UTILITIES
// ============================================================================

/**
 * Check if timestamp is in the past
 */
export function isPast(timestamp: Date): boolean {
  return new Date(timestamp) < new Date();
}

/**
 * Check if timestamp is in the future
 */
export function isFuture(timestamp: Date): boolean {
  return new Date(timestamp) > new Date();
}

/**
 * Get time difference in readable format
 */
export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;

  return new Intl.DateTimeFormat("en-US").format(new Date(date));
}
