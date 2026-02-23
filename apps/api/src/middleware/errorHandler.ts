import { Request, Response, NextFunction } from "express";
import { ApiResponse, ApiError } from "@home-asphere/shared/types";

export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  let statusCode = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || "API_ERROR";
  } else if (err.message) {
    message = err.message;
  }

  const response: ApiResponse = {
    success: false,
    error: code,
    message,
  };

  res.status(statusCode).json(response);
};
