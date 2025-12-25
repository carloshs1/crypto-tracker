"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Ticker24hr } from "@/lib/types";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { CryptoCard } from "./CryptoCard";
import { LoadingState } from "./LoadingState";

interface CryptoListProps {
  tickers: Ticker24hr[];
  isLoading: boolean;
  error: Error | null;
  onCryptoClick: (ticker: Ticker24hr) => void;
  visibleCount: number;
  hasMore: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
}

export function CryptoList({
  tickers,
  isLoading,
  error,
  onCryptoClick,
  visibleCount,
  hasMore,
  sentinelRef,
}: CryptoListProps) {
  // Slice tickers to only show visible count (must be before early returns)
  const visibleTickers = useMemo(
    () => tickers.slice(0, visibleCount),
    [tickers, visibleCount]
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {error.message ||
              "An error occurred while fetching cryptocurrency data. Please try again later."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (tickers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">
            No cryptocurrencies found
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search criteria
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleTickers.map((ticker, index) => (
          <CryptoCard
            key={ticker.symbol}
            ticker={ticker}
            onClick={() => onCryptoClick(ticker)}
            index={index}
          />
        ))}
      </div>
      {/* Sentinel element for infinite scroll */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-8"
        >
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </>
  );
}
