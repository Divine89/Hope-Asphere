import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "@home-asphere/db/schema";
import { eq } from "drizzle-orm";
import { ApiError } from "@home-asphere/shared/types";

export class AuthService {
  static generateToken(userId: string, email: string, role: string) {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
  }

  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async register(email: string, password: string, firstName: string, lastName: string, role: string) {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      throw new ApiError(409, "Email already registered", "USER_ALREADY_EXISTS");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user ID (in real app, use UUID)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert user
    const result = await db
      .insert(users)
      .values({
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        isVerified: false,
      })
      .returning();

    if (!result[0]) {
      throw new ApiError(500, "Failed to create user", "INTERNAL_ERROR");
    }

    return {
      id: result[0].id,
      email: result[0].email,
      firstName: result[0].firstName,
      lastName: result[0].lastName,
      role: result[0].role,
    };
  }

  static async login(email: string, password: string) {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userResult.length === 0) {
      throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const user = userResult[0];

    // Check password
    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    // Check if suspended
    if (user.isSuspended) {
      throw new ApiError(403, "Account is suspended", "ACCOUNT_SUSPENDED");
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
      },
    };
  }

  static async verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (error) {
      throw new ApiError(401, "Invalid token", "INVALID_TOKEN");
    }
  }
}
