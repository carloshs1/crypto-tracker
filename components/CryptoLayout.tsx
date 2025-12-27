"use client";

import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReactNode } from "react";

interface CryptoLayoutProps {
  children: ReactNode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalMarkets?: number;
  showingCount?: number;
}

export function CryptoLayout({
  children,
  onSearchChange,
  totalMarkets,
  showingCount,
}: CryptoLayoutProps) {
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
                <SearchBar onSearchChange={onSearchChange} />
              </div>

              {totalMarkets !== undefined && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold">Statistics</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Markets
                      </span>
                      <span className="font-medium">{totalMarkets}</span>
                    </div>
                    {showingCount !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Showing</span>
                        <span className="font-medium">{showingCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
            <SearchBar onSearchChange={onSearchChange} />
            {showingCount !== undefined && totalMarkets !== undefined && (
              <p className="mt-2 text-sm text-muted-foreground">
                Showing {showingCount} of {totalMarkets} cryptocurrencies
              </p>
            )}
          </div>

          {/* Desktop Stats */}
          {showingCount !== undefined && totalMarkets !== undefined && (
            <div className="hidden lg:block mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {showingCount} of {totalMarkets} cryptocurrencies
              </p>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
