import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with abbreviations for large values
 * Numbers >= 1,000,000 are formatted as "X.XX M"
 * Numbers >= 1,000 are formatted as "X.XX K"
 * Otherwise returns the number as-is
 */
export function formatCompactNumber(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options || {};
  
  if (Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions.toFixed(maximumFractionDigits).replace(/\.?0+$/, "")} M`;
  }
  
  if (Math.abs(value) >= 1_000) {
    const thousands = value / 1_000;
    return `${thousands.toFixed(maximumFractionDigits).replace(/\.?0+$/, "")} K`;
  }
  
  return value.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

/**
 * Detects the user's operating system
 * Returns 'mac' for macOS, 'windows' for Windows, or 'linux' for Linux/other
 */
export function detectOS(): 'mac' | 'windows' | 'linux' {
  if (typeof window === 'undefined') {
    return 'linux'; // Default for SSR
  }
  
  const platform = window.navigator.platform.toLowerCase();
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac';
  }
  
  if (platform.includes('win') || userAgent.includes('windows')) {
    return 'windows';
  }
  
  return 'linux';
}
