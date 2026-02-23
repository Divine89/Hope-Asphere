import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@home-asphere/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;

// Test the connection
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool.query("SELECT NOW()").then(() => {
  console.log("✓ Database connected successfully");
});
