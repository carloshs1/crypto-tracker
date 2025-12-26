"use client";

import { CryptoDetails } from "@/components/CryptoDetails";
import { CryptoList } from "@/components/CryptoList";
import { useSearch } from "@/components/SearchContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getKlinesClient } from "@/lib/binance";
import type { Kline, Ticker24hr } from "@/lib/types";
import { useCallback, useEffect, useMemo, useState } from "react";

const INITIAL_VISIBLE_COUNT = 30;
const LOAD_MORE_COUNT = 20;
const REFRESH_INTERVAL = 30000; // 30 seconds

interface CryptoListDataProps {
  initialTickers: Ticker24hr[];
}

export function CryptoListData({ initialTickers }: CryptoListDataProps) {
  const { searchQuery, onStatsUpdate } = useSearch();
  const [tickers, setTickers] = useState<Ticker24hr[]>(initialTickers);
  const [selectedTicker, setSelectedTicker] = useState<Ticker24hr | null>(null);
  const [klines, setKlines] = useState<Kline[]>([]);
  const [isLoadingKlines, setIsLoadingKlines] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Poll for updates in the background
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        // Fetch directly from API for client-side updates
        const response = await fetch(
          "https://data-api.binance.vision/api/v3/ticker/24hr"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch updates");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        // Process and filter tickers (same logic as server)
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
      } catch (error) {
        console.error("Failed to fetch updates:", error);
        // Silently fail - keep existing data
      }
    };

    const interval = setInterval(fetchUpdates, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Filter tickers based on search query
  const filteredTickers = useMemo(() => {
    if (!searchQuery.trim()) {
      return tickers;
    }

    const query = searchQuery.toLowerCase().trim();
    return tickers.filter(
      (ticker) =>
        ticker.symbol.toLowerCase().includes(query) ||
        ticker.symbol.toLowerCase().startsWith(query)
    );
  }, [tickers, searchQuery]);

  // Reset visible count when search query changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [searchQuery]);

  // Update stats callback
  useEffect(() => {
    if (onStatsUpdate) {
      onStatsUpdate(tickers.length, Math.min(visibleCount, filteredTickers.length));
    }
  }, [tickers.length, visibleCount, filteredTickers.length, onStatsUpdate]);

  // Handle loading more items
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  }, []);

  // Use infinite scroll hook
  const sentinelRef = useInfiniteScroll({
    onIntersect: handleLoadMore,
    enabled: filteredTickers.length > visibleCount,
  });

  const handleCryptoClick = async (ticker: Ticker24hr) => {
    setSelectedTicker(ticker);
    setIsDetailsOpen(true);
    setIsLoadingKlines(true);

    try {
      // Fetch klines client-side for real-time data
      const klinesData = await getKlinesClient(ticker.symbol, "1h", 24);
      setKlines(klinesData);
    } catch (err) {
      console.error("Failed to fetch klines:", err);
      setKlines([]);
    } finally {
      setIsLoadingKlines(false);
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTicker(null);
    setKlines([]);
  };

  return (
    <>
      <CryptoList
        tickers={filteredTickers}
        isLoading={false}
        error={null}
        onCryptoClick={handleCryptoClick}
        visibleCount={visibleCount}
        hasMore={filteredTickers.length > visibleCount}
        sentinelRef={sentinelRef}
      />

      {/* Details Modal */}
      <CryptoDetails
        ticker={selectedTicker}
        klines={klines}
        isLoadingKlines={isLoadingKlines}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </>
  );
}

