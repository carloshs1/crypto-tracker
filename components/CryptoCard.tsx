import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Ticker24hr } from "@/lib/types";
import { cn, formatCompactNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { memo } from "react";

interface CryptoCardProps {
  ticker: Ticker24hr;
  onClick: () => void;
  index?: number;
}

export const CryptoCard = memo(function CryptoCard({
  ticker,
  onClick,
  index = 0,
}: CryptoCardProps) {
  const priceChangePercent = parseFloat(ticker.priceChangePercent);
  const isPositive = priceChangePercent >= 0;
  const lastPrice = parseFloat(ticker.lastPrice);

  // Helper function to format prices with compact notation for large numbers (>= 1M)
  const formatPrice = (price: number, allowHighPrecision: boolean = false) => {
    if (price >= 1_000_000) {
      return formatCompactNumber(price, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: allowHighPrecision ? 8 : 2,
    });
  };

  const formattedPrice = formatPrice(lastPrice, true); // Main price allows high precision
  const formattedAvgPrice = formatPrice(parseFloat(ticker.weightedAvgPrice));
  const formattedHighPrice = formatPrice(parseFloat(ticker.highPrice));
  const formattedLowPrice = formatPrice(parseFloat(ticker.lowPrice));

  const formattedVolume = parseFloat(ticker.volume).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.3) }}
      layout
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300 relative overflow-hidden",
          "hover:shadow-lg hover:scale-[1.02]",
          "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100",
          isPositive
            ? "hover:border-green-500/30 before:bg-linear-to-br before:from-green-500/5 before:via-green-500/10 before:to-transparent"
            : "hover:border-red-500/30 before:bg-linear-to-br before:from-red-500/5 before:via-red-500/10 before:to-transparent"
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${
          ticker.symbol
        }, price $${formattedPrice}, ${
          priceChangePercent >= 0 ? "up" : "down"
        } ${Math.abs(priceChangePercent).toFixed(2)}%`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{ticker.symbol}</h3>
              <p className="text-sm text-muted-foreground">24h Volume</p>
            </div>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className={cn(
                "flex items-center gap-1",
                isPositive ? "bg-green-500" : "bg-red-500"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(priceChangePercent).toFixed(2)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 relative z-10">
          <div>
            <p className="text-2xl font-bold">${formattedPrice}</p>
            <p className="text-xs text-muted-foreground">
              ${formattedAvgPrice} avg
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground">High</p>
              <p className="font-medium text-green-600 dark:text-green-400">
                ${formattedHighPrice}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Low</p>
              <p className="font-medium text-red-600 dark:text-red-400">
                ${formattedLowPrice}
              </p>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="text-sm font-medium">{formattedVolume}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
