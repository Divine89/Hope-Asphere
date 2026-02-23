import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });

// All routes require authentication
router.use(authMiddleware);

router.post("/", BookingController.createBooking);
router.get("/:id", BookingController.getBookingById);
router.get("/guest/bookings", BookingController.getGuestBookings);
router.get("/host/bookings", BookingController.getHostBookings);
router.post("/:id/cancel", BookingController.cancelBooking);

export default router;
