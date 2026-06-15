/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * BIBAZ — Prisma Client Singleton
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createDummyPrisma() {
  const dummy: any = new Proxy({} as any, {
    get(target, prop) {
      if (typeof prop === "symbol") return undefined;

      // Prisma special methods
      if (
        prop === "$connect" ||
        prop === "$disconnect" ||
        prop === "$use" ||
        prop === "$transaction"
      ) {
        return async (args?: any) => {
          if (typeof args === "function") {
            return await args(dummy);
          }
          return args;
        };
      }
      if (prop === "$on") {
        return () => {};
      }
      if (prop.startsWith("$")) {
        return async () => null;
      }

      // Return a nested proxy for model operations (e.g. prisma.user.findMany)
      return new Proxy({} as any, {
        get(modelTarget, modelProp) {
          if (typeof modelProp === "symbol") return undefined;

          // Return an async function for any model method (findMany, findUnique, findFirst, create, etc.)
          return async (...args: any[]) => {
            // Log access during build to see what is queried
            console.log(`[PRISMA MOCK] Called: ${String(prop)}.${String(modelProp)}`);

            // Return appropriate empty types based on the method name
            if (modelProp === "findMany") {
              return [];
            }
            if (modelProp === "count") {
              return 0;
            }

            // For settings, return a default favicon if requested during build
            if (prop === "siteSetting" && modelProp === "findUnique") {
              const whereKey = args[0]?.where?.key;
              if (whereKey === "favicon_url") {
                return { key: "favicon_url", value: "/favicon.ico" };
              }
            }

            return null;
          };
        },
      });
    },
  });
  return dummy;
}

function createPrismaClient(): PrismaClient {
  // If we are in the Next.js build phase, return a dummy mock proxy to prevent database connection attempts
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("[PRISMA] Next.js build phase detected. Bypassing database connection.");
    return createDummyPrisma() as unknown as PrismaClient;
  }

  let host = process.env.DB_HOST || "127.0.0.1";
  let port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
  let user = process.env.DB_USER || "root";
  let password = process.env.DB_PASSWORD || "";
  let database = process.env.DB_NAME || "bibaz";
  let connectionLimit = 10; // Default connection pool limit (SOP buffer strategy)

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      host = url.hostname;

      // PRODUCTION HOSTINGER OVERRIDE:
      // If running in production on the server, force localhost/127.0.0.1 to avoid
      // external networking latency & Hostinger WAF (ModSecurity / BitNinja) from blocking
      // concurrent DB queries (which throws 403 Forbidden and crashes the process).
      // PRODUCTION HOSTINGER OVERRIDE:
      // If running in production on the server, force localhost/127.0.0.1 to avoid
      // external networking latency & Hostinger WAF (ModSecurity / BitNinja) from blocking
      // concurrent DB queries (which throws 403 Forbidden and crashes the process).
      // Bypass this override if deploying on Vercel (process.env.VERCEL is defined).
      if (
        process.env.NODE_ENV === "production" &&
        !process.env.VERCEL &&
        host !== "127.0.0.1" &&
        host !== "localhost"
      ) {
        console.log(
          `[PRISMA] Production server detected. Overriding host ${host} with 127.0.0.1 for high-performance local loopback.`
        );
        host = "127.0.0.1";
      }

      port = url.port ? parseInt(url.port) : 3306;
      user = url.username;
      password = url.password;
      database = url.pathname.replace("/", "");

      // Dynamically extract connection limit from connection_limit search param
      const limitParam = url.searchParams.get("connection_limit");
      if (limitParam) {
        connectionLimit = parseInt(limitParam, 10);
      }
    } catch {
      console.error("Failed to parse DATABASE_URL");
    }
  }

  // Handle local environment production host override if DATABASE_URL was not used
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL &&
    host !== "127.0.0.1" &&
    host !== "localhost"
  ) {
    host = "127.0.0.1";
  }

  // PRODUCTION HOSTINGER CONNECTION POOL OPTIMIZATION:
  // Since Hostinger shared hosting has a strict limit of 30 max concurrent connections
  // across the whole account, and Phusion Passenger can spawn multiple Node.js worker processes,
  // we must cap each process connection limit to 3. This ensures that even under high load,
  // the database connections will never be exhausted.
  if (process.env.NODE_ENV === "production") {
    connectionLimit = Math.min(connectionLimit, 3);
    console.log(
      `[PRISMA] Production environment detected: Capped connectionLimit per process to ${connectionLimit} to prevent Hostinger database connection exhaustion.`
    );
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit,
    connectTimeout: 15000,
    acquireTimeout: 15000,
    // CRITICAL FIX: Close idle connections after 10 seconds of inactivity
    // This prevents "sleeping" connections from accumulating in the pool when Passenger recycles processes,
    // eliminating 500 / Too Many Connections errors permanently.
    idleTimeout: 10000,
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
    if (
      obj !== null &&
      typeof obj === "object" &&
      "toNumber" in obj &&
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
