"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onStatsUpdate?: (total: number, showing: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({
  children,
  onStatsUpdate,
}: {
  children: ReactNode;
  onStatsUpdate?: (total: number, showing: number) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, onStatsUpdate }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

