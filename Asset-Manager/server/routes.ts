import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Listing Routes
  app.get(api.listings.list.path, async (req, res) => {
    try {
      const filters = req.query ? {
        city: req.query.city as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      } : undefined;
      const listings = await storage.getListings(filters);
      res.json(listings);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.listings.get.path, async (req, res) => {
    const listing = await storage.getListing(Number(req.params.id));
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  });

  app.post(api.listings.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const body = { ...req.body, hostId: userId };
      const input = api.listings.create.input.parse(body);
      const listing = await storage.createListing(input);
      res.status(201).json(listing);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // 3. Booking Routes
  app.get(api.bookings.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const bookings = await storage.getBookingsByUser(userId);
    res.json(bookings);
  });

  app.post(api.bookings.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const body = { ...req.body, guestId: userId };
      
      const input = api.bookings.create.input.extend({
        checkIn: z.coerce.date(),
        checkOut: z.coerce.date()
      }).parse(body);
      
      const booking = await storage.createBooking(input);
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // 4. Review Routes
  app.get(api.reviews.listByListing.path, async (req, res) => {
    const reviews = await storage.getReviewsByListing(Number(req.params.listingId));
    res.json(reviews);
  });

  app.post(api.reviews.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listingId = Number(req.params.listingId);
      const body = { ...req.body, guestId: userId, listingId };
      const input = api.reviews.create.input.extend({
        listingId: z.number(),
        guestId: z.string(),
      }).parse(body);
      
      const review = await storage.createReview(input);
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // 5. Seed data
  async function seedDatabase() {
    const existingListings = await storage.getListings();
    if (existingListings.length === 0) {
      await storage.createListing({
        hostId: "system-seed",
        title: "Modern Loft in Downtown",
        description: "Experience the city from this beautiful, modern loft with high ceilings and huge windows.",
        pricePerNight: 150,
        maxGuests: 4,
        city: "New York",
        address: "123 Main St",
        lat: "40.7128",
        lng: "-74.0060",
        amenities: ["WiFi", "Kitchen", "AC", "TV"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1e5411030e?w=800&q=80"]
      });
      await storage.createListing({
        hostId: "system-seed",
        title: "Cozy Beachfront Cottage",
        description: "Steps away from the sand with amazing ocean views and a private deck.",
        pricePerNight: 200,
        maxGuests: 6,
        city: "Malibu",
        address: "456 Ocean Dr",
        lat: "34.0259",
        lng: "-118.7798",
        amenities: ["Beachfront", "WiFi", "Patio", "Grill"],
        images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"]
      });
      await storage.createListing({
        hostId: "system-seed",
        title: "Rustic Cabin in the Woods",
        description: "Get away from it all in this peaceful, secluded cabin surrounded by pine trees.",
        pricePerNight: 95,
        maxGuests: 2,
        city: "Lake Tahoe",
        address: "789 Pine Rd",
        lat: "39.0968",
        lng: "-120.0324",
        amenities: ["Fireplace", "Kitchen", "Pet Friendly"],
        images: ["https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80"]
      });
    }
  }

  seedDatabase().catch(console.error);

  return httpServer;
}
