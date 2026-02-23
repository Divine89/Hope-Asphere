import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "@home-asphere/shared/types";

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    const { email, password, firstName, lastName, role } = req.body;

    const user = await AuthService.register(email, password, firstName, lastName, role);
    const token = AuthService.generateToken(user.id, user.email, user.role);

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        token,
      },
      message: "User registered successfully",
    };

    res.status(201).json(response);
  }

  static async login(req: AuthRequest, res: Response) {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: "Logged in successfully",
    };

    res.json(response);
  }

  static async getCurrentUser(req: AuthRequest, res: Response) {
    const response: ApiResponse = {
      success: true,
      data: req.user,
    };

    res.json(response);
  }
}
