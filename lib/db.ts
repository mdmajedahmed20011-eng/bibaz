/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * BIBAZ — Prisma Client Singleton
 */

import { PrismaClient } from "@prisma/client";

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

  return new PrismaClient({
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
