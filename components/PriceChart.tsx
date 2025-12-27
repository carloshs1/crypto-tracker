import { Skeleton } from "@/components/ui/skeleton";
import type { Kline } from "@/lib/types";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PriceChartProps {
  klines: Kline[];
  isLoading: boolean;
  isPositive?: boolean;
  openPrice?: number;
}

export function PriceChart({
  klines,
  isLoading,
  isPositive = true,
  openPrice,
}: PriceChartProps) {
  const { resolvedTheme } = useTheme();
  const colors = {
    foreground: resolvedTheme === "dark" ? "#ffffff" : "#000000",
    border: resolvedTheme === "dark" ? "#1a1a1a" : "#e5e5e5",
    card: resolvedTheme === "dark" ? "#1a1a1a" : "#ffffff",
    cardForeground: resolvedTheme === "dark" ? "#ffffff" : "#000000",
    primary: resolvedTheme === "dark" ? "#ffffff" : "#000000",
    areaFill: isPositive
      ? resolvedTheme === "dark"
        ? "#22c55e"
        : "#22c55e"
      : resolvedTheme === "dark"
      ? "#ef4444"
      : "#ef4444",
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (klines.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
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
      <AreaChart data={chartData}>
        <defs>
          <linearGradient
            id={`colorArea-${isPositive ? "green" : "red"}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={colors.areaFill} stopOpacity={0.3} />
            <stop
              offset="100%"
              stopColor={colors.areaFill}
              stopOpacity={0.05}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={colors.border}
          opacity={0.5}
        />
        <XAxis
          dataKey="time"
          tick={{
            fill: colors.foreground,
            fontSize: 12,
          }}
          stroke={colors.border}
        />
        <YAxis
          tick={{
            fill: colors.foreground,
            fontSize: 12,
          }}
          stroke={colors.border}
          domain={["dataMin", "dataMax"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "0.5rem",
            color: colors.cardForeground,
          }}
          labelStyle={{
            color: colors.cardForeground,
            fontWeight: 600,
          }}
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        {openPrice && (
          <ReferenceLine
            y={openPrice}
            stroke={colors.foreground}
            strokeDasharray="5 5"
            strokeOpacity={0.5}
            label={{
              value: "Open",
              position: "right",
              fill: colors.foreground,
              fontSize: 11,
              opacity: 0.7,
            }}
          />
        )}
        <Area
          type="monotone"
          dataKey="price"
          stroke={colors.areaFill}
          strokeWidth={2.5}
          fill={`url(#colorArea-${isPositive ? "green" : "red"})`}
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
