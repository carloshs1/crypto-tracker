import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Ticker24hr } from "@/lib/types";
import { cn } from "@/lib/utils";
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
  const formattedPrice = parseFloat(ticker.lastPrice).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }
  );
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
        className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${ticker.symbol}, price $${formattedPrice}, ${priceChangePercent >= 0 ? 'up' : 'down'} ${Math.abs(priceChangePercent).toFixed(2)}%`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <CardHeader className="pb-3">
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
        <CardContent className="space-y-2">
          <div>
            <p className="text-2xl font-bold">${formattedPrice}</p>
            <p className="text-xs text-muted-foreground">
              ${parseFloat(ticker.weightedAvgPrice).toFixed(2)} avg
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground">High</p>
              <p className="font-medium text-green-600 dark:text-green-400">
                ${parseFloat(ticker.highPrice).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Low</p>
              <p className="font-medium text-red-600 dark:text-red-400">
                ${parseFloat(ticker.lowPrice).toFixed(2)}
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
