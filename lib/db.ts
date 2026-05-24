/**
 * BIBAZ — Prisma Client Singleton
 * Uses @prisma/adapter-mariadb with explicit pool config
 * for Hostinger MySQL compatibility
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    const host = process.env.DB_HOST || "127.0.0.1";
    const port = parseInt(process.env.DB_PORT || "3306");
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
    const database = process.env.DB_NAME || "bibaz";

    // Pass config object directly (runtime works, TS types are incomplete)
    const adapter = new PrismaMariaDb({
        host,
        port,
        user,
        password,
        database,
        connectionLimit: 5,
        connectTimeout: 30000,
        acquireTimeout: 30000,
    } as unknown as string);

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
