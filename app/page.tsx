"use client";

import { CryptoDetails } from "@/components/CryptoDetails";
import { CryptoList } from "@/components/CryptoList";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCryptoData } from "@/hooks/useCryptoData";
import { getKlines } from "@/lib/binance";
import type { Kline, Ticker24hr } from "@/lib/types";
import { useMemo, useState } from "react";

export default function Home() {
  const { tickers, isLoading, error } = useCryptoData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicker, setSelectedTicker] = useState<Ticker24hr | null>(null);
  const [klines, setKlines] = useState<Kline[]>([]);
  const [isLoadingKlines, setIsLoadingKlines] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  const handleCryptoClick = async (ticker: Ticker24hr) => {
    setSelectedTicker(ticker);
    setIsDetailsOpen(true);
    setIsLoadingKlines(true);

    try {
      const klinesData = await getKlines(ticker.symbol, "1h", 24);
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
    <ErrorBoundary>
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
                  <h2 className="text-sm font-semibold mb-3">
                    Search & Filter
                  </h2>
                  <SearchBar onSearchChange={setSearchQuery} />
                </div>

                {!isLoading && !error && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold">Statistics</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Markets
                        </span>
                        <span className="font-medium">{tickers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Showing</span>
                        <span className="font-medium">
                          {filteredTickers.length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive font-medium">
                      Error
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {error.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-80">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              {!isLoading && !error && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Showing {filteredTickers.length} of {tickers.length}{" "}
                  cryptocurrencies
                </p>
              )}
            </div>

            {/* Desktop Stats */}
            {!isLoading && !error && (
              <div className="hidden lg:block mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredTickers.length} of {tickers.length}{" "}
                  cryptocurrencies
                </p>
              </div>
            )}

            <CryptoList
              tickers={filteredTickers}
              isLoading={isLoading}
              error={error}
              onCryptoClick={handleCryptoClick}
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
    </ErrorBoundary>
  );
}
