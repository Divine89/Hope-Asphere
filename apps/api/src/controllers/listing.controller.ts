import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ListingService } from "../services/listing.service";
import { ApiResponse } from "@home-asphere/shared/types";

export class ListingController {
  static async createListing(req: AuthRequest, res: Response) {
    const hostId = req.userId!;
    const listing = await ListingService.createListing(hostId, req.body);

    const response: ApiResponse = {
      success: true,
      data: listing,
      message: "Listing created successfully",
    };

    res.status(201).json(response);
  }

  static async getListingById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const listing = await ListingService.getListingById(parseInt(id));

    const response: ApiResponse = {
      success: true,
      data: listing,
    };

    res.json(response);
  }

  static async searchListings(req: AuthRequest, res: Response) {
    const result = await ListingService.searchListings(req.query);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.json(response);
  }

  static async updateListing(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const hostId = req.userId!;
    const listing = await ListingService.updateListing(parseInt(id), hostId, req.body);

    const response: ApiResponse = {
      success: true,
      data: listing,
      message: "Listing updated successfully",
    };

    res.json(response);
  }

  static async deleteListing(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const hostId = req.userId!;
    await ListingService.deleteListing(parseInt(id), hostId);

    const response: ApiResponse = {
      success: true,
      message: "Listing deleted successfully",
    };

    res.json(response);
  }

  static async getHostListings(req: AuthRequest, res: Response) {
    const hostId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await ListingService.getHostListings(hostId, page, limit);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.json(response);
  }
}
