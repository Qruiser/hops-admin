"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TalentSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TalentSearch({
  value,
  onChange,
  placeholder = "Search by name, skills, capabilities, traits, location...",
}: TalentSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
