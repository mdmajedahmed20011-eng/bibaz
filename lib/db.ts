/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * BIBAZ — Prisma Client Singleton
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  let host = process.env.DB_HOST || "127.0.0.1";
  let port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
  let user = process.env.DB_USER || "root";
  let password = process.env.DB_PASSWORD || "";
  let database = process.env.DB_NAME || "bibaz";

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      host = url.hostname;
      port = url.port ? parseInt(url.port) : 3306;
      user = url.username;
      password = url.password;
      database = url.pathname.replace("/", "");
    } catch {
      console.error("Failed to parse DATABASE_URL");
    }
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 2,
    connectTimeout: 30000,
    acquireTimeout: 30000,
  } as any);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always store prisma in globalThis in all environments to prevent connection leaks in Next.js Server Actions
globalForPrisma.prisma = prisma;

/**
 * Recursively converts Prisma Decimal values to standard JavaScript numbers.
 * This is crucial for Next.js Server Actions which crash with 500 error when returning non-serializable Decimal types.
 */
export function serializeDecimals<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "object") {
    // Check if it's a Prisma Decimal (Prisma's Decimal implements decimal.js with a toNumber method)
    if (
      (obj as any).constructor &&
      (obj as any).constructor.name === "Decimal" &&
      typeof (obj as any).toNumber === "function"
    ) {
      return (obj as any).toNumber() as unknown as T;
    }
    if (obj instanceof Date) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => serializeDecimals(item)) as unknown as T;
    }
    const serialized: any = {};
    for (const key of Object.keys(obj)) {
      serialized[key] = serializeDecimals((obj as any)[key]);
    }
    return serialized as T;
  }

  return obj;
}
