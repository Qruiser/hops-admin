"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, CheckCircle, ChevronRight } from "lucide-react"
import { CandidateProfile } from "./candidate-profile"

interface CandidateLeaderboardProps {
  candidates: any[]
  updateCandidate: (candidate: any) => void
  filter: string
  onFilterChange: (filter: string) => void
}

export function CandidateLeaderboard({
  candidates,
  updateCandidate,
  filter,
  onFilterChange,
}: CandidateLeaderboardProps) {
  const [sortOption, setSortOption] = useState<"matchScore" | "applyDate" | "name">("matchScore")
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null)
  const [isProfileViewVisible, setIsProfileViewVisible] = useState(false)
  const [showPrincipals, setShowPrincipals] = useState(false)

  const sortedCandidates = [...candidates].sort((a, b) => {
    switch (sortOption) {
      case "matchScore":
        return b.matchScore - a.matchScore
      case "applyDate":
        return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const filteredCandidates = sortedCandidates.filter((candidate) => {
    if (showPrincipals) {
      return candidate.isPotentialPrincipal
    }

    if (filter === "all") {
      return true
    }

    return candidate.stage === filter
  })

  const handleStageChange = (candidateId: string, newStage: string) => {
    const updatedCandidate = candidates.find((c) => c.id === candidateId)
    if (updatedCandidate) {
      updateCandidate({
        ...updatedCandidate,
        stage: newStage,
      })
    }
  }

  const togglePotentialPrincipal = (candidateId: string) => {
    const updatedCandidate = candidates.find((c) => c.id === candidateId)
    if (updatedCandidate) {
      updateCandidate({
        ...updatedCandidate,
        isPotentialPrincipal: !updatedCandidate.isPotentialPrincipal,
      })
    }
  }

  const handleCandidateClick = (candidate: any) => {
    setSelectedCandidate(candidate)
    setIsProfileViewVisible(true)
  }

  const handleCloseProfileView = () => {
    setIsProfileViewVisible(false)
    setTimeout(() => setSelectedCandidate(null), 300) // Wait for the animation to complete
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Candidate Leaderboard</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrincipals(!showPrincipals)}
            className={showPrincipals ? "bg-primary text-primary-foreground" : ""}
          >
            <Star className="h-4 w-4 mr-2" />
            {showPrincipals ? "Show All" : "Show Principals"}
          </Button>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matchScore">Match Score</SelectItem>
              <SelectItem value="applyDate">Apply Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCandidateClick(candidate)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-grow">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      {candidate.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {candidate.name}
                      {candidate.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {candidate.isPotentialPrincipal && <Star className="h-4 w-4 text-yellow-500" />}
                    </h3>
                    <p className="text-sm text-gray-500">{candidate.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && <Badge variant="secondary">+{candidate.skills.length - 3}</Badge>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-green-600">{candidate.matchScore}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6" />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="font-semibold">Experience:</span> {candidate.yearsExperience} years
                </div>
                <div>
                  <span className="font-semibold">Applied:</span> {new Date(candidate.applyDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Current Stage:</span> {candidate.stage}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`potential-principal-${candidate.id}`}
                    checked={candidate.isPotentialPrincipal}
                    onCheckedChange={() => togglePotentialPrincipal(candidate.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`potential-principal-${candidate.id}`}
                    className="text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Potential Principal
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <Select
                  value={candidate.stage}
                  onValueChange={(value) => handleStageChange(candidate.id, value)}
                  onOpenChange={(open) => {
                    if (open) {
                      // Prevent opening the candidate profile when clicking on the select
                      event?.stopPropagation()
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Change stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sourced">Sourced</SelectItem>
                    <SelectItem value="screened">Screened</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="recommended">Recommended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCandidate && (
        <CandidateProfile
          candidate={selectedCandidate}
          onClose={handleCloseProfileView}
          updateCandidate={updateCandidate}
          isVisible={isProfileViewVisible}
        />
      )}
    </div>
  )
}
