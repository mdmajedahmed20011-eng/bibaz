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
    connectionLimit: 5,
    connectTimeout: 30000,
    acquireTimeout: 30000,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
