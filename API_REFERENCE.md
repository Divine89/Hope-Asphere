# API Documentation - Home-Asphere

Complete API endpoint reference with examples.

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Error description"
}
```

## Auth Endpoints

### Register User
```
POST /auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "guest"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "guest",
      "profileImage": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

---

### Login
```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "guest",
      "profileImage": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Logged in successfully"
}
```

---

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_1234567890_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "guest",
    "profileImage": null
  }
}
```

---

## Listing Endpoints

### Search Listings
```
GET /listings/search?city=NewYork&minPrice=100&maxPrice=500&sortBy=price_asc&page=1&limit=20
```

**Query Parameters:**
- `city` (optional): Filter by city
- `minPrice` (optional): Minimum price per night
- `maxPrice` (optional): Maximum price per night
- `guests` (optional): Number of guests
- `amenities` (optional): Comma-separated amenity IDs
- `sortBy` (optional): `price_asc`, `price_desc`, `rating_desc`, `newest`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": 1,
        "title": "Cozy Apartment in NYC",
        "city": "New York",
        "pricePerNight": "12500",
        "averageRating": "4.8",
        "reviewCount": 24,
        "maxGuests": 4,
        "lat": "40.7128",
        "lng": "-74.0060"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### Get Listing Details
```
GET /listings/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "hostId": "user_1234567890_abc123",
    "title": "Cozy Apartment in NYC",
    "description": "Beautiful apartment with city views...",
    "pricePerNight": "12500",
    "maxGuests": 4,
    "bedrooms": 2,
    "bathrooms": 1,
    "city": "New York",
    "address": "123 Main St, NYC",
    "amenities": ["wifi", "kitchen", "heating", "ac"],
    "images": [
      {
        "id": 1,
        "imageUrl": "https://s3.amazonaws.com/...",
        "isPrimary": true
      }
    ],
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Amazing place!",
        "guestId": "user_xxx"
      }
    ],
    "averageRating": "4.8",
    "reviewCount": 24,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:45:00Z"
  }
}
```

---

### Create Listing
```
POST /listings
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Cozy Apartment in NYC",
  "description": "Beautiful apartment with city views...",
  "pricePerNight": 12500,
  "maxGuests": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "city": "New York",
  "address": "123 Main St, NYC",
  "zipCode": "10001",
  "lat": "40.7128",
  "lng": "-74.0060",
  "amenities": ["wifi", "kitchen", "heating"],
  "cancellationPolicy": "moderate"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "hostId": "user_1234567890_abc123",
    "title": "Cozy Apartment in NYC",
    ...
  },
  "message": "Listing created successfully"
}
```

---

### Update Listing
```
PUT /listings/:id
Authorization: Bearer <token>
```

**Request:** (Same fields as create)

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Listing updated successfully"
}
```

---

### Delete Listing
```
DELETE /listings/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

---

### Get Host's Listings
```
GET /listings/host/listings?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "listings": [ ... ],
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

## Booking Endpoints

### Create Booking
```
POST /bookings
Authorization: Bearer <token>
```

**Request:**
```json
{
  "listingId": 1,
  "checkIn": "2024-02-01T00:00:00Z",
  "checkOut": "2024-02-05T00:00:00Z",
  "numberOfGuests": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1,
      "listingId": 1,
      "guestId": "user_xxx",
      "checkIn": "2024-02-01T00:00:00Z",
      "checkOut": "2024-02-05T00:00:00Z",
      "numberOfNights": 4,
      "pricePerNight": "12500",
      "subtotal": "50000",
      "platformFee": "6000",
      "totalPrice": "56000",
      "status": "pending",
      "paymentStatus": "pending"
    },
    "razorpayOrder": {
      "id": "order_ABC123XYZ",
      "amount": 5600000,
      "currency": "INR"
    }
  },
  "message": "Booking created successfully"
}
```

---

### Get Booking Details
```
GET /bookings/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "listingId": 1,
    "guestId": "user_xxx",
    "hostId": "user_yyy",
    "checkIn": "2024-02-01T00:00:00Z",
    "checkOut": "2024-02-05T00:00:00Z",
    "numberOfGuests": 2,
    "numberOfNights": 4,
    "pricePerNight": "12500",
    "subtotal": "50000",
    "platformFee": "6000",
    "totalPrice": "56000",
    "status": "confirmed",
    "paymentStatus": "paid",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Guest's Bookings
```
GET /bookings/guest/bookings?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [ ... ],
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### Get Host's Bookings
```
GET /bookings/host/bookings?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):** (Same format as guest bookings)

---

### Cancel Booking
```
POST /bookings/:id/cancel
Authorization: Bearer <token>
```

**Request:**
```json
{
  "reason": "Personal emergency"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "cancelled",
    "cancelledAt": "2024-01-20T14:25:00Z",
    "cancellationReason": "Personal emergency"
  },
  "message": "Booking cancelled successfully"
}
```

---

## Review Endpoints

### Create Review
```
POST /reviews
Authorization: Bearer <token>
```

**Request:**
```json
{
  "bookingId": 1,
  "listingId": 1,
  "rating": 5,
  "title": "Excellent stay!",
  "comment": "The apartment was clean and comfortable...",
  "cleanliness": 5,
  "communication": 5,
  "checkIn": 5,
  "accuracy": 5,
  "location": 5,
  "value": 4
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookingId": 1,
    "listingId": 1,
    "guestId": "user_xxx",
    "rating": 5,
    "comment": "The apartment was clean and comfortable...",
    "createdAt": "2024-01-20T15:00:00Z"
  },
  "message": "Review created successfully"
}
```

---

### Get Listing Reviews
```
GET /reviews/listing/:listingId?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Excellent stay!",
        "comment": "The apartment was clean...",
        "createdAt": "2024-01-20T15:00:00Z",
        "hostReply": "Thank you for staying!",
        "hostRepliedAt": "2024-01-21T10:00:00Z"
      }
    ],
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### Add Host Reply
```
POST /reviews/:reviewId/reply
Authorization: Bearer <token>
```

**Request:**
```json
{
  "reply": "Thank you for your wonderful review!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "hostReply": "Thank you for your wonderful review!",
    "hostRepliedAt": "2024-01-21T10:00:00Z"
  },
  "message": "Host reply added successfully"
}
```

---

## Health Check Endpoint

### Check API Status
```
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-20T15:30:00Z"
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_CREDENTIALS | 401 | Email or password is incorrect |
| NO_TOKEN | 401 | Missing authorization token |
| INVALID_TOKEN | 401 | Token is invalid or expired |
| USER_NOT_FOUND | 404 | User does not exist |
| USER_ALREADY_EXISTS | 409 | Email is already registered |
| LISTING_NOT_FOUND | 404 | Listing does not exist |
| BOOKING_NOT_FOUND | 404 | Booking does not exist |
| DOUBLE_BOOKING | 409 | Dates are already booked |
| FORBIDDEN | 403 | User doesn't have permission |
| UNAUTHORIZED | 401 | Authentication required |
| VALIDATION_ERROR | 400 | Invalid input data |
| INTERNAL_ERROR | 500 | Server error |
| PAYMENT_FAILED | 402 | Payment processing failed |

---

## Rate Limiting

- **Login attempts**: 5 per 15 minutes
- **API calls**: 100 per 15 minutes
- **Upload**: 10 per hour

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User",
    "role": "guest"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Search Listings
```bash
curl -X GET "http://localhost:3001/api/listings/search?city=NewYork&minPrice=100&maxPrice=500"
```

---

For more details, see [DEVELOPMENT.md](DEVELOPMENT.md) and [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md).
