"use client";

import { useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

/**
 * Custom hook that uses Intersection Observer API to detect when
 * a sentinel element comes into view, triggering infinite scroll.
 * Uses callback ref pattern to avoid useEffect.
 */
export function useInfiniteScroll({
  onIntersect,
  enabled = true,
  rootMargin = "100px",
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onIntersectRef = useRef(onIntersect);
  const enabledRef = useRef(enabled);
  const rootMarginRef = useRef(rootMargin);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Update refs with latest values when callback is invoked
      onIntersectRef.current = onIntersect;
      enabledRef.current = enabled;
      rootMarginRef.current = rootMargin;

      if (!enabledRef.current) {
        // Disconnect observer if disabled
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        return;
      }

      // Disconnect existing observer if any
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer with stable callback
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && enabledRef.current) {
            onIntersectRef.current();
          }
        },
        {
          rootMargin: rootMarginRef.current,
          threshold: 0.1,
        }
      );

      // Observe the node if it exists
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [onIntersect, enabled, rootMargin]
  );

  return sentinelRef;
}
