import { Input } from "@/components/ui/input";
import { detectOS } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearchChange,
  placeholder = "Search cryptos...",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientState, setClientState] = useState<{
    mounted: boolean;
    os: "mac" | "windows" | "linux";
  }>({
    mounted: false,
    os: "linux",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only trigger search if query has at least 2 characters
    if (value.length >= 2) {
      // Set new timeout to debounce the search
      debounceTimeoutRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 200);
    } else {
      // If less than 2 characters, clear the search immediately
      onSearchChange("");
    }
  };

  // Combined initialization effect: OS detection, keyboard shortcut, and cleanup
  useEffect(() => {
    // Detect OS and mark as mounted after hydration
    // This is necessary to avoid hydration mismatches between server and client
    const updateClientState = () => {
      setClientState({
        mounted: true,
        os: detectOS(),
      });
    };
    updateClientState();

    // Set up keyboard shortcut listener (Cmd+K / Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      // Cleanup debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      // Remove keyboard shortcut listener
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getShortcutLabel = () => {
    if (clientState.os === "mac") {
      return "⌘ K";
    }
    return "Ctrl K";
  };

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="pl-10 pr-20"
        aria-label="Search cryptos"
        autoComplete="off"
      />
      {clientState.mounted && (
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">{getShortcutLabel()}</span>
        </kbd>
      )}
    </div>
  );
}
