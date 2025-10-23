"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Candidate } from "@/types/talent"

interface LeaderboardStatsProps {
  candidates: Candidate[]
  onFilterChange: (filter: string) => void
}

// Update the LeaderboardStats component to remove the "contact" filter
export function LeaderboardStats({ candidates, onFilterChange }: LeaderboardStatsProps) {
  const totalCandidates = candidates.length

  // Updated filters to match the new stages
  const sourced = candidates.filter((c) => c.state === "sourced").length
  const onboarded = candidates.filter((c) => c.state === "onboarded").length
  const preferenceMatched = candidates.filter((c) => c.state === "preferenceMatched").length
  const specMatched = candidates.filter((c) => c.state === "specMatched").length
  const recommended = candidates.filter((c) => c.state === "recommended").length

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      <div onClick={() => onFilterChange("sourced")} className="cursor-pointer">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sourced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourced}</div>
            <Progress value={(sourced / totalCandidates) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Initial candidates</p>
          </CardContent>
        </Card>
      </div>

      <div onClick={() => onFilterChange("onboarded")} className="cursor-pointer">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboarded}</div>
            <Progress value={(onboarded / totalCandidates) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Onboarded candidates</p>
          </CardContent>
        </Card>
      </div>

      <div onClick={() => onFilterChange("preferenceMatched")} className="cursor-pointer">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preference Matched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preferenceMatched}</div>
            <Progress value={(preferenceMatched / totalCandidates) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Preferences aligned</p>
          </CardContent>
        </Card>
      </div>

      <div onClick={() => onFilterChange("specMatched")} className="cursor-pointer">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spec Matched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{specMatched}</div>
            <Progress value={(specMatched / totalCandidates) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Matched to spec</p>
          </CardContent>
        </Card>
      </div>

      <div onClick={() => onFilterChange("recommended")} className="cursor-pointer">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommended}</div>
            <Progress value={(recommended / totalCandidates) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Ready for client</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
