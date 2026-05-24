/**
 * BIBAZ — Prisma Client Singleton
 * SOP §৮.৫ — Single Prisma instance for the entire app
 * 
 * Prisma 7: Uses @prisma/adapter-mariadb (compatible with MySQL)
 * Connection limit: 10 (Hostinger buffer strategy)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    // Remove connection_limit from URL if present (not supported by adapter)
    let connectionString = process.env.DATABASE_URL || "mysql://root:@localhost:3306/bibaz";
    connectionString = connectionString.replace(/[?&]connection_limit=\d+/, "");

    const adapter = new PrismaMariaDb(connectionString);

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
