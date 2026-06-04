"use server";

/**
 * BIBAZ — Analytics Actions
 * Real visitor tracking via PageView model + order-based conversion metrics.
 */

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/permissions";

// ═══════════════════════════════════════════
// Visitor Stats (from PageView table)
// ═══════════════════════════════════════════

export async function getVisitorStats() {
  await requireAdmin();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const prevSevenStart = new Date(sevenDaysAgo);
  prevSevenStart.setDate(prevSevenStart.getDate() - 7);
  const prevThirtyStart = new Date(thirtyDaysAgo);
  prevThirtyStart.setDate(prevThirtyStart.getDate() - 30);

  try {
    const [
      todayViews, yesterdayViews, sevenDayViews, thirtyDayViews,
      todayUnique, yesterdayUnique, sevenDayUnique, thirtyDayUnique,
      prevSevenUnique, prevThirtyUnique,
    ] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.pageView.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
      prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.pageView.groupBy({ by: ["sessionId"], where: { createdAt: { gte: todayStart } } }).then((r) => r.length),
      prisma.pageView.groupBy({ by: ["sessionId"], where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }).then((r) => r.length),
      prisma.pageView.groupBy({ by: ["sessionId"], where: { createdAt: { gte: sevenDaysAgo } } }).then((r) => r.length),
      prisma.pageView.groupBy({ by: ["sessionId"], where: { createdAt: { gte: thirtyDaysAgo } } }).then((r) => r.length),
      prisma.pageView.groupBy({ by: ["sessionId"], where: { createdAt: { gte: prevSevenStart, lt: sevenDaysAgo } } }).then((r) => r.length),
      prisma.pageView.groupBy({ by: ["sessionId"], where: { createdAt: { gte: prevThirtyStart, lt: thirtyDaysAgo } } }).then((r) => r.length),
    ]);

    return {
      success: true as const,
      data: {
        today: { views: todayViews, visitors: todayUnique },
        yesterday: { views: yesterdayViews, visitors: yesterdayUnique },
        sevenDay: { views: sevenDayViews, visitors: sevenDayUnique, prevVisitors: prevSevenUnique },
        thirtyDay: { views: thirtyDayViews, visitors: thirtyDayUnique, prevVisitors: prevThirtyUnique },
      },
    };
  } catch (error) {
    console.error("[ANALYTICS] getVisitorStats failed:", error);
    return { success: false as const, data: null };
  }
}

// ═══════════════════════════════════════════
// Top Visited Pages
// ═══════════════════════════════════════════

export async function getTopPages(days: number = 7) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const pages = await prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    return {
      success: true as const,
      data: pages.map((p) => ({ path: p.path, views: p._count.path })),
    };
  } catch (error) {
    console.error("[ANALYTICS] getTopPages failed:", error);
    return { success: false as const, data: [] as { path: string; views: number }[] };
  }
}

// ═══════════════════════════════════════════
// Device Breakdown
// ═══════════════════════════════════════════

export async function getDeviceBreakdown(days: number = 30) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const devices = await prisma.pageView.groupBy({
      by: ["device"],
      where: { createdAt: { gte: since } },
      _count: { device: true },
    });

    const total = devices.reduce((sum, d) => sum + d._count.device, 0);
    return {
      success: true as const,
      data: devices.map((d) => ({
        device: d.device || "unknown",
        count: d._count.device,
        percentage: total > 0 ? Math.round((d._count.device / total) * 100) : 0,
      })),
    };
  } catch (error) {
    console.error("[ANALYTICS] getDeviceBreakdown failed:", error);
    return { success: false as const, data: [] as { device: string; count: number; percentage: number }[] };
  }
}

// ═══════════════════════════════════════════
// Daily Visitor Trend (for charts)
// ═══════════════════════════════════════════

export async function getDailyVisitorTrend(days: number = 30) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const result = await prisma.$queryRaw<Array<{ date: string; views: bigint; visitors: bigint }>>`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as visitors
      FROM page_views
      WHERE created_at >= ${since}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return {
      success: true as const,
      data: result.map((r) => ({
        date: String(r.date),
        views: Number(r.views),
        visitors: Number(r.visitors),
      })),
    };
  } catch (error) {
    console.error("[ANALYTICS] getDailyVisitorTrend failed:", error);
    return { success: false as const, data: [] as { date: string; views: number; visitors: number }[] };
  }
}

// ═══════════════════════════════════════════
// Conversion Stats (visitors → orders)
// ═══════════════════════════════════════════

export async function getConversionStats(days: number = 30) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const [totalVisitors, totalOrders] = await Promise.all([
      prisma.pageView
        .groupBy({ by: ["sessionId"], where: { createdAt: { gte: since } } })
        .then((r) => r.length),
      prisma.order.count({
        where: {
          createdAt: { gte: since },
          deletedAt: null,
          status: { not: "CANCELLED" },
        },
      }),
    ]);

    const conversionRate = totalVisitors > 0 ? parseFloat(((totalOrders / totalVisitors) * 100).toFixed(2)) : 0;

    return {
      success: true as const,
      data: { totalVisitors, totalOrders, conversionRate },
    };
  } catch (error) {
    console.error("[ANALYTICS] getConversionStats failed:", error);
    return { success: false as const, data: null };
  }
}

// ═══════════════════════════════════════════
// Track Page View (used by API route)
// ═══════════════════════════════════════════

export async function trackPageView(data: {
  path: string;
  sessionId: string;
  device?: string;
}) {
  try {
    await prisma.pageView.create({
      data: {
        path: data.path,
        sessionId: data.sessionId,
        device: data.device || "desktop",
      },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
