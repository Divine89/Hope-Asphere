import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import listingRoutes from "./routes/listing.routes";
import bookingRoutes from "./routes/booking.routes";
import reviewRoutes from "./routes/review.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";
import { ApiResponse } from "@home-asphere/shared/types";

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/reviews", reviewRoutes);

// ============================================================================
// PROTECTED ROUTES (require authentication)
// ============================================================================

app.use(authMiddleware);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  };
  res.status(404).json(response);
});

// ============================================================================
// ERROR HANDLER
// ============================================================================

app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     Home-Asphere API Server           ║
║     Running on Port ${PORT}             ║
║     Environment: ${process.env.NODE_ENV || "development"}       ║
╚═══════════════════════════════════════╝
  `);
});

export default app;
