"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { Kline } from "@/lib/types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PriceChartProps {
  klines: Kline[];
  isLoading: boolean;
}

export function PriceChart({ klines, isLoading }: PriceChartProps) {
  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (klines.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No chart data available
      </div>
    );
  }

  // Transform klines data for the chart
  const chartData = klines.map((kline) => ({
    time: new Date(kline.openTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: parseFloat(kline.close),
    high: parseFloat(kline.high),
    low: parseFloat(kline.low),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="time"
          className="text-xs"
          tick={{ fill: "currentColor" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "currentColor" }}
          domain={["dataMin", "dataMax"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
