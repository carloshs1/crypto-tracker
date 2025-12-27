import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Kline, Ticker24hr } from "@/lib/types";
import { cn, formatCompactNumber } from "@/lib/utils";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { PriceChart } from "./PriceChart";

interface CryptoDetailsProps {
  ticker: Ticker24hr | null;
  klines: Kline[];
  isLoadingKlines: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function CryptoDetails({
  ticker,
  klines,
  isLoadingKlines,
  isOpen,
  onClose,
}: CryptoDetailsProps) {
  if (!ticker) return null;

  const priceChangePercent = parseFloat(ticker.priceChangePercent);
  const isPositive = priceChangePercent >= 0;

  // Helper function to format numbers with compact notation for large numbers (>= 1M)
  const formatNumber = (value: string, decimals: number = 2) => {
    const numValue = parseFloat(value);
    if (numValue >= 1_000_000) {
      return formatCompactNumber(numValue, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return numValue.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{ticker.symbol}</DialogTitle>
              <DialogDescription>
                24-hour trading statistics and price history
              </DialogDescription>
            </div>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className={cn(
                "flex items-center gap-1 text-lg px-3 py-1",
                isPositive ? "bg-green-500" : "bg-red-500"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(priceChangePercent).toFixed(2)}%
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* Price Overview */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Price</p>
              <p className="text-xl font-bold">
                ${formatNumber(ticker.lastPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Open Price</p>
              <p className="text-xl font-semibold">
                ${formatNumber(ticker.openPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">High Price</p>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                ${formatNumber(ticker.highPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Low Price</p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                ${formatNumber(ticker.lowPrice)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Trading Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trading Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Volume</p>
                <p className="font-medium">{formatNumber(ticker.volume)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Quote Volume
                </p>
                <p className="font-medium">
                  ${formatNumber(ticker.quoteVolume)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Weighted Avg Price
                </p>
                <p className="font-medium">
                  ${formatNumber(ticker.weightedAvgPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Price Change
                </p>
                <p
                  className={cn(
                    "font-medium",
                    isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {isPositive ? "+" : ""}${formatNumber(ticker.priceChange)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bid Price</p>
                <p className="font-medium">${formatNumber(ticker.bidPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ask Price</p>
                <p className="font-medium">${formatNumber(ticker.askPrice)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Price History (24h)</h3>
            <PriceChart
              klines={klines}
              isLoading={isLoadingKlines}
              isPositive={isPositive}
              openPrice={parseFloat(ticker.openPrice)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
