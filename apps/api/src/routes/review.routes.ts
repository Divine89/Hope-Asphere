import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public route
router.get("/listing/:listingId", ReviewController.getReviewsByListing);

// Protected routes
router.post("/", authMiddleware, ReviewController.createReview);
router.post("/:reviewId/reply", authMiddleware, ReviewController.addHostReply);

export default router;
