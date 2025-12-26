import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearchChange,
  placeholder = "Search cryptocurrencies...",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="pl-10"
        aria-label="Search cryptocurrencies"
        autoComplete="off"
      />
    </div>
  );
}
