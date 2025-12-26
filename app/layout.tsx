import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Crypto Market Analyzer",
    template: "%s | Crypto Market Analyzer",
  },
  description:
    "Real-time cryptocurrency market data tracker using Binance API. Track prices, volumes, and market trends for thousands of cryptocurrencies.",
  keywords: [
    "cryptocurrency",
    "crypto",
    "bitcoin",
    "ethereum",
    "market tracker",
    "binance",
    "trading",
    "crypto prices",
  ],
  authors: [{ name: "Carlos HS" }],
  creator: "Crypto Tracker by Carlos HS",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Crypto Market Analyzer",
    description:
      "Real-time cryptocurrency market data tracker using Binance API",
    siteName: "Crypto Market Analyzer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Market Analyzer",
    description:
      "Real-time cryptocurrency market data tracker using Binance API",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    preconnect: "https://data-api.binance.vision",
    "dns-prefetch": "https://data-api.binance.vision",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
