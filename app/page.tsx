import { CryptoListData } from "@/components/CryptoListData";
import { CryptoPageWrapper } from "@/components/CryptoPageWrapper";
import { LoadingState } from "@/components/LoadingState";
import { getProcessedTickers } from "@/lib/data";
import { Suspense } from "react";

/**
 * Server Component that fetches initial data for the crypto list
 * Uses Next.js Data Cache and React cache for optimal performance
 */
async function CryptoListServer() {
  const tickers = await getProcessedTickers();
  return <CryptoListData initialTickers={tickers} />;
}

/**
 * Main page component - Server Component
 * Layout renders immediately, only the list is wrapped in Suspense
 */
export default function Home() {
  // Start fetching in parallel for stats display (don't await - renders immediately)
  const initialTickersPromise = getProcessedTickers();

  return (
    <CryptoPageWrapper initialTickersPromise={initialTickersPromise}>
      <Suspense fallback={<LoadingState />}>
        <CryptoListServer />
      </Suspense>
    </CryptoPageWrapper>
  );
}
