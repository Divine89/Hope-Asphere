import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { BookingService } from "../services/booking.service";
import { ApiResponse } from "@home-asphere/shared/types";

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response) {
    const guestId = req.userId!;
    const result = await BookingService.createBooking(guestId, req.body);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: "Booking created successfully",
    };

    res.status(201).json(response);
  }

  static async getBookingById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;
    const booking = await BookingService.getBookingById(parseInt(id), userId);

    const response: ApiResponse = {
      success: true,
      data: booking,
    };

    res.json(response);
  }

  static async getGuestBookings(req: AuthRequest, res: Response) {
    const guestId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await BookingService.getGuestBookings(guestId, page, limit);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.json(response);
  }

  static async getHostBookings(req: AuthRequest, res: Response) {
    const hostId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await BookingService.getHostBookings(hostId, page, limit);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.json(response);
  }

  static async cancelBooking(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;
    const { reason } = req.body;

    const booking = await BookingService.cancelBooking(parseInt(id), userId, reason);

    const response: ApiResponse = {
      success: true,
      data: booking,
      message: "Booking cancelled successfully",
    };

    res.json(response);
  }
}
