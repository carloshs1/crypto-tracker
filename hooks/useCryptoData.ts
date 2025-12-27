"use client";

import { get24hrTicker } from "@/lib/binance";
import type { Ticker24hr } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

interface UseCryptoDataReturn {
  tickers: Ticker24hr[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const REFRESH_INTERVAL = 30000; // 30 seconds

export function useCryptoData(): UseCryptoDataReturn {
  const [tickers, setTickers] = useState<Ticker24hr[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await get24hrTicker();

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from API");
      }

      // Filter out invalid symbols and sort by volume (descending)
      const validTickers = data
        .filter((ticker) => {
          if (!ticker || !ticker.symbol || !ticker.lastPrice) {
            return false;
          }
          const price = parseFloat(ticker.lastPrice);
          const volume = parseFloat(ticker.volume || "0");
          return !isNaN(price) && price > 0 && !isNaN(volume) && volume >= 0;
        })
        .sort((a, b) => {
          const volumeA = parseFloat(a.quoteVolume || "0");
          const volumeB = parseFloat(b.quoteVolume || "0");
          return volumeB - volumeA;
        });

      setTickers(validTickers);
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch cryptocurrency data";
      setError(new Error(errorMessage));
      setIsLoading(false);
      // Keep existing tickers on error to avoid clearing the UI
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling
    const interval = setInterval(() => {
      fetchData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    tickers,
    isLoading,
    error,
    refetch: fetchData,
  };
}
