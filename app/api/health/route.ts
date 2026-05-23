/**
 * BIBAZ — Health Check Endpoint
 * Used by Better Uptime monitoring
 * GET /api/health
 */

import { NextResponse } from "next/server";

export async function GET() {
    const healthCheck = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
        version: process.env.npm_package_version || "0.1.0",
    };

    return NextResponse.json(healthCheck, { status: 200 });
}
