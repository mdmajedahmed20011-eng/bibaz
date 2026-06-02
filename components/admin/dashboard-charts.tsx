"use client";

/**
 * BIBAZ — Interactive SVG Analytics Dashboard Charts
 * Premium charting component using native SVG, hover interactions, and micro-animations.
 */

import { useState, useEffect, useRef } from "react";
import { getDashboardAnalytics } from "@/actions/order.actions";
import { TrendingUp, RefreshCw, DollarSign, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DataPoint {
  label: string;
  revenue: number;
  count: number;
}

export function DashboardCharts({ initialData }: { initialData: DataPoint[] }) {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartType, setChartType] = useState<"revenue" | "orders">("revenue");

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let active = true;

    async function loadData() {
      setLoading(true);
      const res = await getDashboardAnalytics(range);
      if (active && res.success && res.dataPoints) {
        setData(res.dataPoints as DataPoint[]);
      }
      if (active) setLoading(false);
    }

    loadData();
    return () => {
      active = false;
    };
  }, [range]);

  // Analytics Metrics
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.count, 0);
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100);
  const maxCount = Math.max(...data.map((d) => d.count), 5);

  // SVG Chart Config
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  // Chart Coordinate Generators
  const getX = (index: number) => {
    if (data.length <= 1) return paddingX;
    return paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
  };

  const getRevenueY = (value: number) => {
    return height - paddingY - (value / maxRevenue) * (height - 2 * paddingY);
  };

  const getOrdersY = (value: number) => {
    return height - paddingY - (value / maxCount) * (height - 2 * paddingY);
  };

  // SVG Path generation for line chart (revenue)
  const linePoints = data.map((d, i) => `${getX(i)},${getRevenueY(d.revenue)}`).join(" ");
  const areaPoints =
    data.length > 0
      ? `${getX(0)},${height - paddingY} ${linePoints} ${getX(data.length - 1)},${height - paddingY}`
      : "";

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm space-y-5">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
            Performance Insights
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Visualize store trends and order volume</p>
        </div>

        {/* Filters and Chart Type Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Metric Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-0.5 border border-gray-200 text-xs font-semibold">
            <button
              onClick={() => setChartType("revenue")}
              className={`px-3 py-1 rounded-md transition-all ${
                chartType === "revenue"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setChartType("orders")}
              className={`px-3 py-1 rounded-md transition-all ${
                chartType === "orders"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Orders
            </button>
          </div>

          {/* Timeframe Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-0.5 border border-gray-200 text-xs font-semibold">
            {[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "12m", label: "12 Months" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setRange(t.id)}
                className={`px-3 py-1 rounded-md transition-all ${
                  range === t.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview stats block */}
      <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              Range Revenue
            </p>
            <h4 className="text-base font-bold text-gray-900">
              ৳{totalRevenue.toLocaleString("en-BD")}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              Range Orders
            </p>
            <h4 className="text-base font-bold text-gray-900">{totalOrders} Orders</h4>
          </div>
        </div>
      </div>

      {/* SVG Responsive Container */}
      <div className="relative pt-4 overflow-hidden select-none">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              Recalculating...
            </div>
          </div>
        )}

        <div className="w-full overflow-x-auto custom-scrollbar">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[640px]"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingY + ratio * (height - 2 * paddingY);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  {/* Grid Labels (Y-Axis) */}
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] font-mono fill-gray-400"
                  >
                    {chartType === "revenue"
                      ? `৳${Math.round((maxRevenue * (1 - ratio)) / 100) * 100}`
                      : Math.round(maxCount * (1 - ratio))}
                  </text>
                </g>
              );
            })}

            {/* Render Revenue Line/Area Chart */}
            {chartType === "revenue" && data.length > 0 && (
              <>
                {/* Area under line */}
                <polygon
                  points={areaPoints}
                  fill="url(#revenue-grad)"
                  className="opacity-70 transition-all duration-300"
                />

                {/* Line path */}
                <polyline
                  fill="none"
                  stroke="url(#line-grad)"
                  strokeWidth={2.5}
                  points={linePoints}
                  className="stroke-linecap-round stroke-linejoin-round"
                />
              </>
            )}

            {/* Render Orders Bar Chart */}
            {chartType === "orders" &&
              data.map((d, i) => {
                const barWidth = Math.max(12, (width - 2 * paddingX) / data.length - 8);
                const x = getX(i) - barWidth / 2;
                const y = getOrdersY(d.count);
                const barHeight = height - paddingY - y;

                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={3}
                    className="fill-blue-500/80 hover:fill-blue-600 transition-colors duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                );
              })}

            {/* Hover Guides & Target Indicators */}
            {data.map((d, i) => {
              const x = getX(i);
              const y = chartType === "revenue" ? getRevenueY(d.revenue) : getOrdersY(d.count);

              return (
                <g key={i}>
                  {/* Vertical interactive guide bar */}
                  <rect
                    x={x - 20}
                    y={paddingY}
                    width={40}
                    height={height - 2 * paddingY}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />

                  {/* Draw points & highlighted vertical line on hover */}
                  {hoveredIndex === i && (
                    <>
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={height - paddingY}
                        stroke="#cbd5e1"
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                      {chartType === "revenue" && (
                        <circle
                          cx={x}
                          cy={y}
                          r={6}
                          className="fill-blue-600 stroke-white stroke-2 shadow-sm drop-shadow"
                        />
                      )}
                    </>
                  )}
                </g>
              );
            })}

            {/* X-Axis Labels */}
            {data.map((d, i) => {
              // Limit label frequency to avoid overlaps on 30d range
              const showLabel =
                range === "7d" ||
                (range === "30d" && i % 4 === 0) ||
                (range === "12m" && i % 1 === 0);

              if (!showLabel) return null;

              return (
                <text
                  key={i}
                  x={getX(i)}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[9px] fill-gray-400 font-medium"
                >
                  {d.label}
                </text>
              );
            })}

            {/* Definitions (Gradients) */}
            <defs>
              <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {hoveredIndex !== null && data[hoveredIndex] && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between bg-gray-900 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-lg"
          >
            <span>{data[hoveredIndex].label}</span>
            <div className="flex gap-4">
              <span className="text-emerald-400">
                Revenue: ৳{data[hoveredIndex].revenue.toLocaleString("en-BD")}
              </span>
              <span className="text-blue-400">Orders: {data[hoveredIndex].count}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
