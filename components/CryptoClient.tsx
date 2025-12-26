"use client";

import { CryptoDetails } from "@/components/CryptoDetails";
import { CryptoList } from "@/components/CryptoList";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getKlinesClient } from "@/lib/binance";
import type { Kline, Ticker24hr } from "@/lib/types";
import { useCallback, useEffect, useMemo, useState } from "react";

const INITIAL_VISIBLE_COUNT = 30;
const LOAD_MORE_COUNT = 20;
const REFRESH_INTERVAL = 30000; // 30 seconds

interface CryptoClientProps {
  initialTickers: Ticker24hr[];
}

export function CryptoClient({ initialTickers }: CryptoClientProps) {
  const [tickers, setTickers] = useState<Ticker24hr[]>(initialTickers);
  const [searchQuery, setSearchQuery] = useState("");
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
          "https://data-api.binance.vision/api/v3/ticker/24hr",
          { next: { revalidate: 30 } }
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div>
              <h1 className="text-xl font-bold">Crypto Analyzer</h1>
              <p className="text-xs text-muted-foreground">
                Market Data Tracker
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold mb-3">Search & Filter</h2>
                <SearchBar onSearchChange={setSearchQuery} />
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Statistics</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Markets</span>
                    <span className="font-medium">{tickers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Showing</span>
                    <span className="font-medium">
                      {Math.min(visibleCount, filteredTickers.length)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-80">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4">
            <div>
              <h1 className="text-xl font-bold">Crypto Analyzer</h1>
              <p className="text-xs text-muted-foreground">
                Market Data Tracker
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Panel */}
        <main className="container mx-auto px-4 py-6 lg:py-8">
          {/* Mobile Search */}
          <div className="lg:hidden mb-6">
            <SearchBar onSearchChange={setSearchQuery} />
            <p className="mt-2 text-sm text-muted-foreground">
              Showing {Math.min(visibleCount, filteredTickers.length)} of{" "}
              {filteredTickers.length} cryptocurrencies
            </p>
          </div>

          {/* Desktop Stats */}
          <div className="hidden lg:block mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(visibleCount, filteredTickers.length)} of{" "}
              {filteredTickers.length} cryptocurrencies
            </p>
          </div>

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
        </main>
      </div>
    </div>
  );
}
