import { CryptoListData } from "@/components/CryptoListData";
import { CryptoPageWrapper } from "@/components/CryptoPageWrapper";
import { LoadingState } from "@/components/LoadingState";
import { getProcessedTickers } from "@/lib/data";
import { Suspense } from "react";

async function CryptoListServer() {
  const tickers = await getProcessedTickers();
  return <CryptoListData initialTickers={tickers} />;
}

export default function Home() {
  const initialTickersPromise = getProcessedTickers();

  return (
    <CryptoPageWrapper initialTickersPromise={initialTickersPromise}>
      <Suspense fallback={<LoadingState />}>
        <CryptoListServer />
      </Suspense>
    </CryptoPageWrapper>
  );
}
