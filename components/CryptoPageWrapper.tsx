"use client";

import { CryptoLayout } from "@/components/CryptoLayout";
import { SearchProvider, useSearch } from "@/providers/SearchContext";
import type { Ticker24hr } from "@/lib/types";
import { ReactNode, useEffect, useState } from "react";

interface CryptoPageWrapperProps {
  initialTickersPromise?: Promise<Ticker24hr[]>;
  children: ReactNode;
}

function CryptoLayoutWrapper({
  children,
  totalMarkets,
  showingCount,
}: {
  children: ReactNode;
  totalMarkets?: number;
  showingCount?: number;
}) {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <CryptoLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      totalMarkets={totalMarkets}
      showingCount={showingCount}
    >
      {children}
    </CryptoLayout>
  );
}

export function CryptoPageWrapper({
  initialTickersPromise,
  children,
}: CryptoPageWrapperProps) {
  const [totalMarkets, setTotalMarkets] = useState<number | undefined>(
    undefined
  );
  const [showingCount, setShowingCount] = useState<number | undefined>(
    undefined
  );

  // Load initial tickers asynchronously without blocking render
  useEffect(() => {
    if (initialTickersPromise) {
      initialTickersPromise.then((tickers) => {
        setTotalMarkets(tickers.length);
      });
    }
  }, [initialTickersPromise]);

  const handleStatsUpdate = (total: number, showing: number) => {
    setTotalMarkets(total);
    setShowingCount(showing);
  };

  return (
    <SearchProvider onStatsUpdate={handleStatsUpdate}>
      <CryptoLayoutWrapper
        totalMarkets={totalMarkets}
        showingCount={showingCount}
      >
        {children}
      </CryptoLayoutWrapper>
    </SearchProvider>
  );
}
