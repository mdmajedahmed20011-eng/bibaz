"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Smartphone, Tablet, Monitor } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

// ═══════════════════════════════════════════
// Animation Variants
// ═══════════════════════════════════════════
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// ═══════════════════════════════════════════
// StatCard
// ═══════════════════════════════════════════
export function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color,
  href,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  color: "blue" | "emerald" | "amber" | "rose";
  href?: string;
}) {
  const colorMap = {
    blue: {
      bg: "bg-blue-50/50",
      text: "text-blue-600",
      icon: "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/20",
    },
    emerald: {
      bg: "bg-emerald-50/50",
      text: "text-emerald-600",
      icon: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/20",
    },
    amber: {
      bg: "bg-amber-50/50",
      text: "text-amber-600",
      icon: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/20",
    },
    rose: {
      bg: "bg-rose-50/50",
      text: "text-rose-600",
      icon: "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/20",
    },
  };

  const trendColors = {
    up: "text-emerald-500 bg-emerald-50 border-emerald-100",
    down: "text-rose-500 bg-rose-50 border-rose-100",
    neutral: "text-gray-500 bg-gray-50 border-gray-100",
  };

  const content = (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/60 bg-white/40 p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] hover:border-gray-300/80 sm:p-5">
      {/* Subtle gradient blob on hover */}
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${colorMap[color].bg}`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg sm:h-12 sm:w-12 ${colorMap[color].icon}`}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${trendColors[trend]}`}
        >
          {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
          {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
          <span className="hidden sm:inline">{trendValue}</span>
        </div>
      </div>
      <div className="relative mt-4">
        <p className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">{value}</p>
        <p className="mt-1 text-xs font-semibold text-gray-500 sm:text-sm">{title}</p>
      </div>
    </div>
  );

  return (
    <motion.div variants={itemVariants} className="h-full">
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// QuickStatCard
// ═══════════════════════════════════════════
export function QuickStatCard({
  label,
  value,
  icon,
  href,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
  color: "purple" | "indigo" | "teal" | "amber";
}) {
  const colorMap = {
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
  };

  const content = (
    <div className="group flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/40 p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] backdrop-blur-xl transition-all hover:bg-white/80 hover:shadow-md">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-110 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold tracking-tight text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );

  return (
    <motion.div variants={itemVariants}>
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// VisitorStatCard
// ═══════════════════════════════════════════
export function VisitorStatCard({
  label,
  visitors,
  views,
  prevVisitors,
}: {
  label: string;
  visitors: number;
  views: number;
  prevVisitors?: number;
}) {
  let trend: "up" | "down" | "neutral" = "neutral";
  let trendPercent = 0;

  if (prevVisitors !== undefined && prevVisitors > 0) {
    const change = ((visitors - prevVisitors) / prevVisitors) * 100;
    trendPercent = Math.abs(Math.round(change));
    trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
  }

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-gray-200/50 bg-gradient-to-b from-white/60 to-white/30 p-3 shadow-sm backdrop-blur-md"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-xl font-black tracking-tight text-gray-900 mt-1">
        {visitors.toLocaleString()}
      </p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[10px] font-medium text-gray-400">{views.toLocaleString()} views</p>
        {prevVisitors !== undefined && trend !== "neutral" && (
          <span
            className={`text-[10px] font-bold ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}
          >
            {trend === "up" ? "↑" : "↓"} {trendPercent}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-xl">
        <span className="capitalize">{payload[0].name}</span>: {payload[0].value}%
      </div>
    );
  }
  return null;
};

// ═══════════════════════════════════════════
// Device Breakdown Chart (Donut)
// ═══════════════════════════════════════════
export function DeviceBreakdownChart({
  devices,
}: {
  devices: { device: string; percentage: number }[];
}) {
  if (!devices || devices.length === 0) {
    return <p className="text-xs text-gray-400">No data yet</p>;
  }

  return (
    <motion.div variants={itemVariants} className="flex h-full items-center gap-4">
      <div className="h-32 w-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={devices}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="percentage"
              nameKey="device"
              stroke="none"
            >
              {devices.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 space-y-3">
        {devices.map((d, i) => {
          const DeviceIcon =
            d.device === "mobile" ? Smartphone : d.device === "tablet" ? Tablet : Monitor;
          return (
            <div key={d.device} className="flex items-center gap-2">
              <div
                className="p-1.5 rounded-md"
                style={{
                  backgroundColor: `${COLORS[i % COLORS.length]}20`,
                  color: COLORS[i % COLORS.length],
                }}
              >
                <DeviceIcon className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium text-gray-700 capitalize flex-1">
                {d.device}
              </span>
              <span className="text-xs font-bold text-gray-900">{d.percentage}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Top Pages Progress Bars
// ═══════════════════════════════════════════
export function TopPagesList({ topPages }: { topPages: { path: string; views: number }[] }) {
  if (!topPages || topPages.length === 0) return null;

  const maxViews = Math.max(...topPages.map((p) => p.views));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-3 mt-4"
    >
      {topPages.map((page, i) => {
        const percentage = Math.max((page.views / maxViews) * 100, 2); // At least 2% to show the bar
        return (
          <motion.div variants={itemVariants} key={page.path} className="group relative">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-gray-400 w-4">{i + 1}.</span>
                <span className="font-medium text-gray-700 truncate">{page.path}</span>
              </div>
              <span className="font-bold text-gray-900 shrink-0">
                {page.views.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Wrapper for generic staggered grids
// ═══════════════════════════════════════════
export function StaggeredGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}
