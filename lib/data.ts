import { get24hrTicker } from "./binance";
import type { Ticker24hr } from "./types";

/**
 * Processes and filters ticker data
 * Validates data structure and sorts by volume (descending)
 */
export async function getProcessedTickers(): Promise<Ticker24hr[]> {
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

  return validTickers;
}

