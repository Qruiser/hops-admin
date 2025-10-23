"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"

interface ColumnProps {
  column: {
    id: string
    title: string
  }
  children: ReactNode
}

export function Column({ column, children }: ColumnProps) {
  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">{column.title}</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={`View ${column.title} as leaderboard`}>
          <List className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  )
}
