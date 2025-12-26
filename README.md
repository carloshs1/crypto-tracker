# Crypto Market Analyzer 📈

A modern, responsive web application for tracking and analyzing cryptocurrency market data using Binance's public API. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Real-time Market Data**: Fetches live cryptocurrency prices and 24-hour statistics from Binance API with automatic 30-second refresh
- **Search & Filter**: Search cryptocurrencies by symbol with instant filtering and keyboard shortcuts (Cmd+K / Ctrl+K)
- **Infinite Scroll**: Progressive loading of cryptocurrency cards as you scroll for better performance
- **Detailed Views**: Click any cryptocurrency to view detailed statistics and 24-hour price history charts
- **Responsive Design**: Sidebar + main panel layout that adapts beautifully to all screen sizes
- **Dark Mode**: Toggle between light, dark, and system themes with persistent preference
- **Smooth Animations**: Framer Motion animations for polished interactions
- **Error Handling**: Comprehensive error boundaries and graceful error states
- **Loading States**: Skeleton loaders for better UX during data fetching
- **Market Statistics**: Real-time display of total markets and currently visible count

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **API**: Binance Market Data Only API (`data-api.binance.vision`)

## 📁 Project Structure

```
crypto-tracker/
├── app/
│   ├── layout.tsx          # Root layout with metadata and theme provider
│   ├── page.tsx            # Main dashboard page (Server Component)
│   ├── error.tsx           # Route-level error boundary
│   ├── global-error.tsx    # Global error boundary
│   ├── loading.tsx         # Loading UI for Suspense boundaries
│   └── globals.css         # Global styles and theme variables
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── skeleton.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── separator.tsx
│   │   └── dropdown-menu.tsx
│   ├── CryptoList.tsx      # Main crypto list component with infinite scroll
│   ├── CryptoListData.tsx  # Client component managing crypto data and state
│   ├── CryptoCard.tsx      # Individual crypto card with animations
│   ├── CryptoPageWrapper.tsx # Page wrapper with SearchProvider
│   ├── CryptoLayout.tsx    # Layout component (sidebar + main panel)
│   ├── CryptoDetails.tsx   # Details modal with price chart
│   ├── PriceChart.tsx      # Price history chart (Recharts)
│   ├── SearchBar.tsx       # Search/filter component with keyboard shortcuts
│   ├── LoadingState.tsx    # Loading skeleton component
│   └── ThemeToggle.tsx     # Dark mode toggle dropdown
├── providers/              # React Context providers and hooks
│   ├── SearchContext.tsx   # Search state context provider and useSearch hook
│   └── theme-provider.tsx  # Theme provider wrapper (next-themes)
├── lib/
│   ├── utils.ts           # Utility functions (cn helper, OS detection)
│   ├── binance.ts         # Binance API client (server & client functions)
│   ├── data.ts            # Data processing utilities
│   └── types.ts           # TypeScript interfaces
└── hooks/
    ├── useCryptoData.ts   # Custom hook for data fetching (legacy)
    └── useInfiniteScroll.ts # Infinite scroll hook using Intersection Observer
```

## 🏗️ Architecture & Tech Stack Decisions

### Why Next.js App Router?

I chose Next.js 16 with App Router for several reasons:

- **Server Components**: Enables efficient data fetching and caching at the server level
- **Built-in Optimizations**: Automatic code splitting, image optimization, and font optimization
- **API Route Integration**: Easy to add backend functionality if needed in the future
- **SEO Ready**: Server-side rendering capabilities for better SEO

### Why shadcn/ui?

shadcn/ui was selected because:

- **Copy-paste Philosophy**: Components are part of your codebase, not a dependency
- **Customizable**: Full control over component styling and behavior
- **Accessible**: Built on Radix UI primitives with excellent accessibility
- **TypeScript First**: Excellent TypeScript support out of the box
- **Tailwind Integration**: Seamless integration with Tailwind CSS

### State Management Approach

I used React Context API (`SearchContext`) combined with React hooks (`useState`, `useEffect`, `useMemo`) instead of external state management libraries because:

- **Simplicity**: The app's state needs are straightforward - search query and stats updates
- **Context for Shared State**: `SearchContext` provides search state across components without prop drilling
- **Performance**: `useMemo` handles expensive filtering operations efficiently
- **Next.js Integration**: Works seamlessly with Next.js App Router patterns
- **Future Scalability**: Easy to migrate to React Query or Zustand if needed

### Providers Architecture

The application uses a dedicated `providers/` folder to organize all React Context providers and their associated hooks. This separation provides several benefits:

- **Clear Separation of Concerns**: Providers are separated from UI components, making the codebase more maintainable
- **Scalability**: This structure makes it easy to add new providers as the application grows (e.g., `UserContext`, `SubscriptionContext`, `NotificationContext`, etc.)
- **Consistent Pattern**: All providers follow the same organizational pattern, making it easier for developers to find and understand context-related code
- **Reusability**: Providers can be easily imported and composed at different levels of the component tree

Current providers:

- **SearchContext**: Manages global search state and provides `useSearch()` hook for components that need access to search functionality
- **ThemeProvider**: Wraps `next-themes` to provide theme management (light/dark/system) across the application

Future providers can be added following the same pattern:

- `UserContext.tsx` - User authentication and profile state
- `SubscriptionContext.tsx` - Subscription and premium features state
- `NotificationContext.tsx` - Global notification system
- `PreferencesContext.tsx` - User preferences and settings

### Data Fetching Strategy

- **Initial Load**: Server Component (`page.tsx`) fetches ticker data using `getProcessedTickers()` with Next.js Data Cache
- **Suspense Boundaries**: Uses React Suspense for progressive loading - layout renders immediately, list loads asynchronously
- **Auto-refresh**: Client-side polling every 30 seconds to keep data current (in `CryptoListData`)
- **On-demand**: Fetches price history (klines) only when a crypto card is clicked using `getKlinesClient()`
- **Caching**: Uses Next.js `revalidate` for intelligent caching (30s for tickers, 60s for klines, 1h for exchange info)
- **Error Resilience**: Maintains existing data on refresh failures to avoid clearing the UI
- **React Cache**: Uses React `cache()` for request deduplication within a single render pass

### Component Architecture

- **Server Components**: `page.tsx` is a Server Component that fetches initial data and uses Suspense boundaries
- **Client Components**: All interactive components marked with `"use client"` directive
- **Component Hierarchy**:
  - `CryptoPageWrapper` → Provides `SearchContext` and manages stats
  - `CryptoLayout` → Handles responsive layout (sidebar + main panel)
  - `CryptoListData` → Manages crypto data, filtering, infinite scroll, and details modal
  - `CryptoList` → Renders the grid of crypto cards
- **Custom Hooks**:
  - `useInfiniteScroll` → Intersection Observer-based infinite scroll (starts with 30 items, loads 20 more on scroll)
  - `useSearch` → Context hook for accessing search state (from `providers/SearchContext`)
- **Composition**: Small, focused components that compose together (Card, List, Details, Layout)
- **Providers**: All React Context providers are organized in the `providers/` folder for better maintainability and scalability

### Infinite Scroll Implementation

The app uses a progressive loading strategy:

- **Initial Load**: Shows first 30 cryptocurrency cards
- **Scroll Detection**: Uses Intersection Observer API to detect when user approaches bottom
- **Progressive Loading**: Loads 20 more items each time user scrolls near the bottom
- **Reset on Search**: Resets visible count when search query changes
- **Performance**: Only renders visible items, but all filtered data is kept in memory for instant search

## 🤖 AI Usage (Transparency)

I leveraged AI tools throughout the development process:

### ChatGPT/Claude Usage:

- **TypeScript Interfaces**: Generated initial type definitions for Binance API responses based on API documentation
- **Component Structure**: Brainstormed component architecture and folder organization
- **Error Handling Patterns**: Discussed best practices for error boundaries and error states

### GitHub Copilot/Cursor:

- **Code Completion**: Used for faster typing of repetitive patterns (component props, type definitions)
- **Import Suggestions**: Helped with correct import paths and package names
- **Code Refactoring**: Suggested improvements for code organization and readability

### AI-Assisted Debugging:

- **API Response Parsing**: Helped debug klines data transformation when initial implementation had type issues
- **Tailwind Class Suggestions**: Assisted with responsive design classes and dark mode variants

### Prompt Engineering:

- **Specific Prompts**: Asked for "TypeScript interfaces for Binance 24hr ticker API" rather than generic requests
- **Context-Aware**: Provided existing code context when asking for modifications
- **Review & Refine**: Always reviewed AI-generated code for correctness and adapted to project needs

## 🎨 Design Decisions

### Layout: Sidebar + Main Panel

I chose a sidebar + main panel layout because:

- **Information Hierarchy**: Sidebar provides persistent search/filters while main area focuses on data
- **Desktop Optimization**: Makes excellent use of wide screens
- **Mobile Adaptation**: Sidebar collapses on mobile, search moves to header
- **Familiar Pattern**: Common pattern in dashboard applications, intuitive for users

### Visual Design Principles

1. **Visual Hierarchy**:

   - Large, bold prices draw attention to key information
   - Color-coded badges (green/red) for quick price change recognition
   - Clear typography scale (h1, h2, body, caption)

2. **Spacing & Whitespace**:

   - Generous padding in cards for readability
   - Consistent gap spacing in grids (gap-4)
   - Breathing room around interactive elements

3. **Typography**:

   - Geist Sans for clean, modern look
   - Font size hierarchy: 2xl for prices, lg for headings, sm for metadata
   - Proper line heights for readability

4. **Color System**:
   - Semantic colors: green for gains, red for losses
   - Muted colors for secondary information
   - Dark mode support with proper contrast ratios

### Details Modal UX

The details modal design focuses on:

- **Progressive Disclosure**: Shows summary stats first, then detailed breakdown
- **Visual Data**: Price chart provides immediate visual context
- **Scannable Layout**: Grid layout for statistics makes comparison easy
- **Non-blocking**: Modal doesn't prevent viewing other cryptos (can close and open another)

### Keyboard Shortcuts

The app includes keyboard shortcuts for improved productivity:

- **Cmd+K / Ctrl+K**: Focus the search input (Mac uses Cmd, Windows/Linux use Ctrl)
- **OS Detection**: Automatically detects the operating system to show the correct shortcut hint
- **Accessibility**: Keyboard shortcuts are displayed in the search bar for discoverability

### Responsive Breakpoints

- **Mobile (< 640px)**: Single column, sidebar hidden, search in header
- **Tablet (640px - 1024px)**: 2-3 column grid, sidebar still hidden
- **Desktop (> 1024px)**: 4-column grid, sidebar visible, full layout

## 🚧 Challenges & Trade-offs

### Challenge 1: API Rate Limiting & Caching

**Problem**: Binance API has rate limits, and we're fetching all tickers on every refresh.

**Solution**:

- Implemented Next.js caching with `revalidate` (30s for tickers, 60s for klines)
- Used polling interval of 30 seconds (reasonable balance between freshness and API calls)
- Added request timeouts to prevent hanging requests

**Trade-off**: Data might be slightly stale (up to 30s), but this prevents rate limiting issues.

### Challenge 2: Large Dataset Performance

**Problem**: Binance returns hundreds of cryptocurrencies. Rendering all at once could be slow.

**Solution**:

- **Infinite Scroll**: Progressive loading starting with 30 items, loading 20 more as user scrolls
- Client-side filtering with `useMemo` for efficient re-renders
- Sorted by volume (most traded first) so users see important cryptos first
- Filtered out invalid/incomplete data entries
- Used Framer Motion with staggered animations (not blocking, but adds polish)
- Intersection Observer API for efficient scroll detection

**Trade-off**: Initial render is fast, but all data is still loaded in memory. Could add virtual scrolling if dataset grows significantly.

### Challenge 3: TypeScript Strict Mode

**Problem**: Binance API responses are loosely typed, requiring careful type definitions.

**Solution**:

- Created comprehensive TypeScript interfaces in `lib/types.ts`
- Added runtime validation in API client functions
- Used type guards and proper error handling
- Handled edge cases (missing fields, invalid data)

**Trade-off**: More verbose code, but catches errors at compile time and improves developer experience.

### Challenge 4: Error Handling Without Breaking UX

**Problem**: Network errors shouldn't clear the entire UI or leave users confused.

**Solution**:

- Implemented Next.js error boundaries (error.tsx and global-error.tsx) following Next.js best practices
- API errors show user-friendly messages with retry options
- Maintains existing data on refresh failures
- Loading states prevent flash of empty content

**Trade-off**: More error handling code, but significantly better user experience.

### Challenge 5: Dark Mode Implementation

**Problem**: Ensuring proper contrast and readability in both themes.

**Solution**:

- Used Tailwind's dark mode with CSS variables
- Tested color combinations for accessibility
- Theme preference persisted in localStorage
- Respects system preference on first load

**Trade-off**: More CSS variables to manage, but provides excellent UX.

## 🔮 Future Improvements

If I had more time, I would:

1. **Virtual Scrolling**: Implement `react-window` or `react-virtuoso` for handling thousands of items efficiently (currently using infinite scroll)
2. **WebSocket Integration**: Replace polling with WebSocket for real-time price updates
3. **Advanced Filtering**: Add filters by price range, volume, market cap
4. **Favorites/Watchlist**: Allow users to save favorite cryptocurrencies with localStorage persistence
5. **Price Alerts**: Set up price alerts for specific cryptocurrencies
6. **Historical Analysis**: Add more chart intervals (1d, 1w, 1m) and technical indicators
7. **Performance Monitoring**: Add analytics to track API response times and error rates
8. **Testing**: Add unit tests for hooks and components, integration tests for API calls
9. **Accessibility**: Enhanced keyboard navigation and screen reader support (partially implemented)
10. **Internationalization**: Support for multiple languages and currencies
11. **Search Enhancements**: Add search history, recent searches, and search suggestions
12. **Sorting Options**: Allow users to sort by price, volume, change percentage, etc.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crypto-tracker
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📦 Dependencies

### Core Dependencies

- `next`: 16.1.1 - React framework
- `react`: 19.2.3 - UI library
- `typescript`: ^5 - Type safety
- `tailwindcss`: ^4 - Styling

### UI & Components

- `@radix-ui/react-dialog`: Dialog component
- `@radix-ui/react-dropdown-menu`: Dropdown menu component (theme toggle)
- `@radix-ui/react-slot`: Slot component
- `@radix-ui/react-separator`: Separator component
- `lucide-react`: Icon library
- `class-variance-authority`: Component variants
- `clsx` & `tailwind-merge`: Class name utilities
- `next-themes`: Theme management (light/dark/system)

### Features

- `framer-motion`: Animations
- `recharts`: Chart library for price history visualization

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

The app will be live at `https://your-project.vercel.app`

### Environment Variables

No environment variables required - the app uses Binance's public Market Data Only API which doesn't require authentication.

**Optional**: If deploying to production, you can set `NEXT_PUBLIC_BASE_URL` to your production URL for proper OpenGraph metadata.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Binance](https://www.binance.com/) for providing the free Market Data API
- [shadcn](https://ui.shadcn.com/) for the excellent component library
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment platform

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
