import { Router } from "express";
import { ListingController } from "../controllers/listing.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/search", ListingController.searchListings);
router.get("/:id", ListingController.getListingById);

// Protected routes
router.post("/", authMiddleware, ListingController.createListing);
router.put("/:id", authMiddleware, ListingController.updateListing);
router.delete("/:id", authMiddleware, ListingController.deleteListing);
router.get("/host/listings", authMiddleware, ListingController.getHostListings);

export default router;
