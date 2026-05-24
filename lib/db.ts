/**
 * BIBAZ — Prisma Client Singleton
 * SOP §৮.৫ — Single Prisma instance for the entire app
 * 
 * Prisma 7: Uses @prisma/adapter-mariadb (compatible with MySQL)
 * Hostinger: Uses separate DB env vars to avoid URL parsing issues
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function buildConnectionString(): string {
    // ALWAYS fallback to DATABASE_URL to guarantee it uses the .env configuration
    // This prevents accidental connection to local databases via system environment variables.
    return process.env.DATABASE_URL?.replace('mysql://', 'mariadb://') || "mariadb://root:@localhost:3306/bibaz";
}

function createPrismaClient() {
    const connectionString = buildConnectionString();
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
