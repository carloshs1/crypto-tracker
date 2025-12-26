import { cache } from "react";
import type { ExchangeInfo, Kline, SymbolInfo, Ticker24hr } from "./types";

const BINANCE_API_BASE = "https://data-api.binance.vision/api/v3";

/**
 * Fetches 24hr ticker statistics for all symbols
 * Uses React cache for request deduplication within a single render pass
 * Uses Next.js Data Cache with revalidation for cross-request caching
 */
export const get24hrTicker = cache(async (): Promise<Ticker24hr[]> => {
  try {
    const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr`, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ticker data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from API");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch ticker data");
  }
});

/**
 * Fetches klines (candlestick data) for a symbol
 * Uses React cache for request deduplication within a single render pass
 * Uses Next.js Data Cache with revalidation for cross-request caching
 */
export const getKlines = cache(
  async (
    symbol: string,
    interval: string = "1h",
    limit: number = 24
  ): Promise<Kline[]> => {
    try {
      if (!symbol || typeof symbol !== "string") {
        throw new Error("Invalid symbol parameter");
      }

      const params = new URLSearchParams({
        symbol,
        interval,
        limit: limit.toString(),
      });

      const response = await fetch(`${BINANCE_API_BASE}/klines?${params}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(`Invalid symbol: ${symbol}`);
        }
        throw new Error(
          `Failed to fetch klines: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from API");
      }

      // Transform the array response into Kline objects
      return data.map((kline: (string | number)[]) => {
        if (!Array.isArray(kline) || kline.length < 12) {
          throw new Error("Invalid kline data format");
        }
        return {
          openTime: kline[0] as number,
          open: kline[1] as string,
          high: kline[2] as string,
          low: kline[3] as string,
          close: kline[4] as string,
          volume: kline[5] as string,
          closeTime: kline[6] as number,
          quoteAssetVolume: kline[7] as string,
          numberOfTrades: kline[8] as number,
          takerBuyBaseAssetVolume: kline[9] as string,
          takerBuyQuoteAssetVolume: kline[10] as string,
          ignore: kline[11] as string,
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch klines");
    }
  }
);

/**
 * Fetches exchange information including symbol metadata
 * Uses React cache for request deduplication within a single render pass
 * Uses Next.js Data Cache with revalidation for cross-request caching
 */
export const getExchangeInfo = cache(async (): Promise<ExchangeInfo> => {
  const response = await fetch(`${BINANCE_API_BASE}/exchangeInfo`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange info: ${response.statusText}`);
  }

  return response.json();
});

/**
 * Gets symbol information for a specific symbol
 * Uses React cache for request deduplication
 */
export const getSymbolInfo = cache(
  async (symbol: string): Promise<SymbolInfo | undefined> => {
    const exchangeInfo = await getExchangeInfo();
    return exchangeInfo.symbols.find((s) => s.symbol === symbol);
  }
);

/**
 * Client-side version of getKlines
 * Use this function in Client Components (doesn't use React cache)
 */
export async function getKlinesClient(
  symbol: string,
  interval: string = "1h",
  limit: number = 24
): Promise<Kline[]> {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Invalid symbol parameter");
    }

    const params = new URLSearchParams({
      symbol,
      interval,
      limit: limit.toString(),
    });

    const response = await fetch(`${BINANCE_API_BASE}/klines?${params}`);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(`Invalid symbol: ${symbol}`);
      }
      throw new Error(
        `Failed to fetch klines: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from API");
    }

    // Transform the array response into Kline objects
    return data.map((kline: (string | number)[]) => {
      if (!Array.isArray(kline) || kline.length < 12) {
        throw new Error("Invalid kline data format");
      }
      return {
        openTime: kline[0] as number,
        open: kline[1] as string,
        high: kline[2] as string,
        low: kline[3] as string,
        close: kline[4] as string,
        volume: kline[5] as string,
        closeTime: kline[6] as number,
        quoteAssetVolume: kline[7] as string,
        numberOfTrades: kline[8] as number,
        takerBuyBaseAssetVolume: kline[9] as string,
        takerBuyQuoteAssetVolume: kline[10] as string,
        ignore: kline[11] as string,
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch klines");
  }
}
