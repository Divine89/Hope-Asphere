import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });

// All routes require authentication
router.use(authMiddleware);

// User profile endpoints would go here
// router.get("/profile", UserController.getProfile);
// router.put("/profile", UserController.updateProfile);
// router.get("/bookings", UserController.getBookings);
// router.get("/earnings", UserController.getEarnings);

export default router;
