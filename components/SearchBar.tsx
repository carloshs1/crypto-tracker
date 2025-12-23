"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"

interface SearchBarProps {
  onSearchChange: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearchChange, placeholder = "Search cryptocurrencies..." }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange(value)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  )
}

