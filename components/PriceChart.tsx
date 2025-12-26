import { Skeleton } from "@/components/ui/skeleton";
import type { Kline } from "@/lib/types";
import { useTheme } from "next-themes";
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
  const { resolvedTheme } = useTheme();
  const colors = {
    foreground: resolvedTheme === "dark" ? "#ffffff" : "#000000",
    border: resolvedTheme === "dark" ? "#1a1a1a" : "#e5e5e5",
    card: resolvedTheme === "dark" ? "#1a1a1a" : "#ffffff",
    cardForeground: resolvedTheme === "dark" ? "#ffffff" : "#000000",
    primary: resolvedTheme === "dark" ? "#ffffff" : "#000000",
  };

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
        <Line
          type="monotone"
          dataKey="price"
          stroke={colors.primary}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: colors.primary }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
