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
    // If individual DB vars are set, build URL from them (avoids special char issues)
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME;
    const port = process.env.DB_PORT || "3306";

    if (host && user && password && database) {
        return `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
    }

    // Fallback to DATABASE_URL
    return process.env.DATABASE_URL || "mysql://root:@localhost:3306/bibaz";
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
