import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "@home-asphere/shared/types";

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "No token provided", "NO_TOKEN");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
      email: string;
      role: string;
    };
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch {
    throw new ApiError(401, "Invalid token", "INVALID_TOKEN");
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Admin access required", "FORBIDDEN");
  }
  next();
};

export const hostMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "host" && req.user?.role !== "admin") {
    throw new ApiError(403, "Host access required", "FORBIDDEN");
  }
  next();
};
