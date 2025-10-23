"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Star,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Calendar,
  Clock,
  UserCheck,
  Send,
  FileCheck,
  ThumbsUp,
  Eye,
  Edit,
  Briefcase,
  ArrowRight,
  LayoutGrid,
} from "lucide-react"
import { LeaderboardStats } from "./leaderboard-stats"
import { ProfileView } from "./profile-view"
// Import the ContactStatus type
import type { Candidate, CandidateState, ContactStatus } from "@/types/talent"
import { CheckCircle2 } from "lucide-react"

// Column definitions for reference
const columns = [
  { id: "sourced", title: "Sourced" },
  { id: "onboarded", title: "Onboarded" },
  { id: "preferenceMatched", title: "Preference Matched" },
  { id: "specMatched", title: "Spec Matched" },
  { id: "recommended", title: "Recommended" },
]

interface LeaderboardProps {
  candidates: Candidate[]
  updateCandidate: (updatedCandidate: Candidate) => void
  filter: string
  onFilterChange: (filter: string) => void
  selectedColumn?: string | null
  onReturnToBoardView?: () => void
}

export function Leaderboard({
  candidates,
  updateCandidate,
  filter,
  onFilterChange,
  selectedColumn,
  onReturnToBoardView,
}: LeaderboardProps) {
  // Update the sortOption type to include "stage"
  const [sortOption, setSortOption] = useState<"stage" | "matchScore" | "applyDate" | "name">("stage")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isProfileViewVisible, setIsProfileViewVisible] = useState(false)
  const [showPrincipals, setShowPrincipals] = useState(false)

  // Add a function to get stage priority for sorting
  const getStagePriority = (state: CandidateState): number => {
    switch (state) {
      case "recommended":
        return 5
      case "specMatched":
        return 4
      case "preferenceMatched":
        return 3
      case "onboarded":
        return 2
      case "sourced":
        return 1
      default:
        return 0
    }
  }

  // Update the sortedCandidates logic to include stage sorting
  const sortedCandidates = [...candidates].sort((a, b) => {
    switch (sortOption) {
      case "stage":
        return getStagePriority(b.state) - getStagePriority(a.state)
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

    // Filter by state
    return candidate.state === filter
  })

  const handleStateChange = (candidateId: string, newState: CandidateState) => {
    const updatedCandidate = candidates.find((c) => c.id === candidateId)
    if (updatedCandidate) {
      const now = new Date().toISOString()
      const candidate = { ...updatedCandidate, state: newState }

      // Update status fields based on the new state
      switch (newState) {
        case "sourced":
          candidate.sourcedDate = now
          break
        case "contact":
          candidate.contactedDate = now
          break
        case "onboarded":
          candidate.onboardedDate = now
          break
        case "preferenceMatched":
          candidate.preferencesMatchedDate = now
          break
        case "specMatched":
          candidate.specMatchedDate = now
          candidate.awaitingRecommendation = true
          break
        case "recommended":
          candidate.recommendedDate = now
          break
      }

      updateCandidate({
        ...candidate,
        lastAction: {
          action: `Moved to ${newState}`,
          by: "Current User",
          date: now,
        },
      })
    }
  }

  const togglePotentialPrincipal = (candidateId: string) => {
    const updatedCandidate = candidates.find((c) => c.id === candidateId)
    if (updatedCandidate) {
      updateCandidate({
        ...updatedCandidate,
        isPotentialPrincipal: !updatedCandidate.isPotentialPrincipal,
        lastAction: {
          action: updatedCandidate.isPotentialPrincipal
            ? "Removed from potential principals"
            : "Marked as potential principal",
          by: "Current User",
          date: new Date().toISOString(),
        },
      })
    }
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  // Add a function to get the contact status display text and color
  const getContactStatusDisplay = (status?: ContactStatus) => {
    switch (status) {
      case "called":
        return { text: "Called", color: "text-green-600" }
      case "not_picked":
        return { text: "Not Picked", color: "text-amber-600" }
      case "contact_info_missing":
        return { text: "Info Missing", color: "text-red-600" }
      case "not_a_fit":
        return { text: "Not a Fit", color: "text-gray-600" }
      case "not_called":
      default:
        return { text: "Not Called", color: "text-blue-600" }
    }
  }

  // Render status information based on candidate state
  const renderStatusInfo = (candidate: Candidate) => {
    switch (candidate.state) {
      case "sourced":
        const contactStatusDisplay = getContactStatusDisplay(candidate.contactStatus)
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Sourced: {formatDate(candidate.sourcedDate || candidate.applyDate)}</span>
              </div>

              {/* Display contact status */}
              <div className={`flex items-center gap-1 ${contactStatusDisplay.color} font-medium`}>
                <UserCheck className="h-4 w-4" />
                <span>Status: {contactStatusDisplay.text}</span>
              </div>

              {candidate.contactAttempted && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Contacted (not picked up): {formatDate(candidate.contactAttemptDate)}</span>
                </div>
              )}
            </div>

            {candidate.contactedDate && (
              <div className="flex items-center gap-1">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span>Successfully contacted: {formatDate(candidate.contactedDate)}</span>
              </div>
            )}

            {candidate.onboardingAttempted && (
              <div className="flex items-center gap-1">
                <Send className="h-4 w-4 text-blue-500" />
                <span>Onboarding attempted: {formatDate(candidate.onboardingAttemptDate)}</span>
              </div>
            )}

            {/* Source information */}
            {candidate.sourceInfo && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {candidate.sourceInfo.type === "new_candidate" && (
                    <>
                      <Star className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">New candidate</span>
                    </>
                  )}
                  {candidate.sourceInfo.type === "existing_candidate" && (
                    <>
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-600 font-medium">Existing candidate</span>
                    </>
                  )}
                  {candidate.sourceInfo.type === "sourced_from_job" && candidate.sourceInfo.jobName && (
                    <>
                      <Briefcase className="h-4 w-4 text-purple-500" />
                      <span className="text-purple-600 font-medium">Found in: {candidate.sourceInfo.jobName}</span>
                    </>
                  )}
                  {candidate.sourceInfo.type === "transferred_from_stage" &&
                    candidate.sourceInfo.stageName &&
                    candidate.sourceInfo.jobName && (
                      <>
                        <ArrowRight className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600 font-medium">
                          From {candidate.sourceInfo.stageName} in: {candidate.sourceInfo.jobName}
                        </span>
                      </>
                    )}
                </div>
              </div>
            )}
          </div>
        )

      // Remove the "contact" case and continue with the rest of the cases
      case "onboarded":
        return (
          <div className="space-y-3">
            {/* Standard status info based on state */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Onboarded: {formatDate(candidate.onboardedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                {candidate.preferencesCollected ? (
                  <>
                    <FileCheck className="h-4 w-4 text-green-500" />
                    <span>Preferences collected: {formatDate(candidate.preferencesCollectionDate)}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-amber-500" />
                    <span>Preferences collection sent: {formatDate(candidate.preferencesCollectionDate)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile changes info for onboarded and beyond */}
            {candidate.lastProfileChangeDate && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Edit className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">
                    Last profile change: {formatDate(candidate.lastProfileChangeDate)}
                  </span>
                </div>
                {candidate.profileChanges && candidate.profileChanges.length > 0 && (
                  <div className="mt-1 ml-5 text-sm">
                    <span className="text-gray-600">{candidate.profileChanges[0].type.replace(/_/g, " ")}: </span>
                    <span>{candidate.profileChanges[0].details}</span>

                    {candidate.profileChanges.length > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        + {candidate.profileChanges.length - 1} more changes
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "preferenceMatched":
        return (
          <div className="space-y-3">
            {/* Standard status info based on state */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span>Preferences matched: {formatDate(candidate.preferencesMatchedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                {candidate.specSent ? (
                  <>
                    <Send className="h-4 w-4 text-blue-500" />
                    <span>Spec sent: {formatDate(candidate.specSentDate)}</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Awaiting spec send</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile changes info for onboarded and beyond */}
            {candidate.lastProfileChangeDate && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Edit className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">
                    Last profile change: {formatDate(candidate.lastProfileChangeDate)}
                  </span>
                </div>
                {candidate.profileChanges && candidate.profileChanges.length > 0 && (
                  <div className="mt-1 ml-5 text-sm">
                    <span className="text-gray-600">{candidate.profileChanges[0].type.replace(/_/g, " ")}: </span>
                    <span>{candidate.profileChanges[0].details}</span>

                    {candidate.profileChanges.length > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        + {candidate.profileChanges.length - 1} more changes
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "specMatched":
        return (
          <div className="space-y-3">
            {/* Standard status info based on state */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Matched on: {formatDate(candidate.specMatchedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                {candidate.awaitingRecommendation ? (
                  <>
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Awaiting recommendation</span>
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Ready for recommendation</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile changes info for onboarded and beyond */}
            {candidate.lastProfileChangeDate && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Edit className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">
                    Last profile change: {formatDate(candidate.lastProfileChangeDate)}
                  </span>
                </div>
                {candidate.profileChanges && candidate.profileChanges.length > 0 && (
                  <div className="mt-1 ml-5 text-sm">
                    <span className="text-gray-600">{candidate.profileChanges[0].type.replace(/_/g, " ")}: </span>
                    <span>{candidate.profileChanges[0].details}</span>

                    {candidate.profileChanges.length > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        + {candidate.profileChanges.length - 1} more changes
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "recommended":
        return (
          <div className="space-y-3">
            {/* Standard status info based on state */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Recommended: {formatDate(candidate.recommendedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                {candidate.clientViewed ? (
                  <>
                    <Eye className="h-4 w-4 text-green-500" />
                    <span>Viewed by client: {formatDate(candidate.clientViewedDate)}</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Awaiting client view</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile changes info for onboarded and beyond */}
            {candidate.lastProfileChangeDate && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Edit className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">
                    Last profile change: {formatDate(candidate.lastProfileChangeDate)}
                  </span>
                </div>
                {candidate.profileChanges && candidate.profileChanges.length > 0 && (
                  <div className="mt-1 ml-5 text-sm">
                    <span className="text-gray-600">{candidate.profileChanges[0].type.replace(/_/g, " ")}: </span>
                    <span>{candidate.profileChanges[0].details}</span>

                    {candidate.profileChanges.length > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        + {candidate.profileChanges.length - 1} more changes
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Update the getActionRecommendation function to consider contact status
  const getActionRecommendation = (candidate: Candidate) => {
    switch (candidate.state) {
      case "sourced":
        if (candidate.contactStatus === "not_a_fit") {
          return { action: "Move to another stage or archive", color: "text-gray-600" }
        } else if (candidate.contactStatus === "contact_info_missing") {
          return { action: "Update contact information", color: "text-red-600" }
        } else if (candidate.contactStatus === "not_picked") {
          return { action: "Follow up on contact attempt", color: "text-amber-600" }
        } else if (candidate.contactStatus === "called") {
          return { action: "Proceed to onboarding", color: "text-green-600" }
        } else {
          return { action: "Contact candidate", color: "text-blue-600" }
        }
      case "contact":
        return {
          action: candidate.onboardingAttempted ? "Follow up on onboarding" : "Onboard candidate",
          color: "text-blue-600",
        }
      case "onboarded":
        if (!candidate.preferencesCollectionDate) {
          return { action: "Send preferences collection", color: "text-blue-600" }
        } else if (!candidate.preferencesCollected) {
          return { action: "Follow up on preferences", color: "text-amber-600" }
        } else {
          return { action: "Match preferences", color: "text-green-600" }
        }
      case "preferenceMatched":
        return {
          action: candidate.specSent ? "Check spec match" : "Send spec",
          color: "text-blue-600",
        }
      case "specMatched":
        return {
          action: candidate.awaitingRecommendation ? "Prepare recommendation" : "Recommend to client",
          color: "text-green-600",
        }
      case "recommended":
        return {
          action: candidate.clientViewed ? "Follow up with client" : "Notify client",
          color: "text-blue-600",
        }
      default:
        return { action: "Review manually", color: "text-gray-600" }
    }
  }

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsProfileViewVisible(true)
  }

  const handleCloseProfileView = () => {
    setIsProfileViewVisible(false)
    setTimeout(() => setSelectedCandidate(null), 300) // Wait for the animation to complete
  }

  return (
    <div className="space-y-6">
      <LeaderboardStats candidates={candidates} onFilterChange={onFilterChange} />

      {selectedColumn && onReturnToBoardView && (
        <div className="flex justify-between items-center mb-4">
          <Button onClick={onReturnToBoardView} variant="outline">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Return to Board View
          </Button>
          <h2 className="text-xl font-semibold">
            {columns.find((col) => col.id === selectedColumn)?.title ||
              selectedColumn.charAt(0).toUpperCase() + selectedColumn.slice(1)}{" "}
            Candidates
          </h2>
        </div>
      )}

      {filter !== "all" && !selectedColumn && (
        <div className="flex justify-end">
          <Button onClick={() => onFilterChange("all")}>View All</Button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {selectedColumn
            ? `${columns.find((col) => col.id === selectedColumn)?.title || selectedColumn.charAt(0).toUpperCase() + selectedColumn.slice(1)} Leaderboard`
            : filter !== "all"
              ? `Candidate Leaderboard - ${filter.charAt(0).toUpperCase() + filter.slice(1)}`
              : "Candidate Leaderboard"}
        </h2>
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
          {/* Update the Select component to include the stage option */}
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as typeof sortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stage">Stage Progression</SelectItem>
              <SelectItem value="matchScore">Match Score</SelectItem>
              <SelectItem value="applyDate">Apply Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCandidates.map((candidate) => {
          const { action, color } = getActionRecommendation(candidate)
          return (
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
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                          >
                            {skill} {candidate.skillExperience?.[skill] && `(${candidate.skillExperience[skill]})`}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="secondary">+{candidate.skills.length - 3}</Badge>
                        )}
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
                    <span className="font-semibold">Experience:</span> {candidate.yearsOfExperience} years
                  </div>
                  <div>
                    <span className="font-semibold">Applied:</span> {new Date(candidate.applyDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-semibold">Current Stage:</span> {candidate.state}
                  </div>
                  <div>
                    <span className="font-semibold">Last Action:</span> {candidate.lastAction.action}
                  </div>
                </div>

                {/* Status information based on candidate state */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">{renderStatusInfo(candidate)}</div>

                <div className="mt-4 flex items-center justify-between">
                  <Select
                    value={candidate.state}
                    onValueChange={(value) => handleStateChange(candidate.id, value as CandidateState)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Change state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sourced">Sourced</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="onboarded">Onboarded</SelectItem>
                      <SelectItem value="preferenceMatched">Preference Matched</SelectItem>
                      <SelectItem value="specMatched">Spec Matched</SelectItem>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="preferences unfit">Preferences Unfit</SelectItem>
                      <SelectItem value="skill unfit">Skill Unfit</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`potential-principal-${candidate.id}`}
                      checked={candidate.isPotentialPrincipal}
                      onCheckedChange={() => togglePotentialPrincipal(candidate.id)}
                    />
                    <label htmlFor={`potential-principal-${candidate.id}`} className="text-sm font-medium">
                      Potential Principal
                    </label>
                  </div>
                  <div className={`flex items-center ${color}`}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{action}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedCandidate && (
        <ProfileView
          candidate={selectedCandidate}
          onClose={handleCloseProfileView}
          updateCandidate={updateCandidate}
          isVisible={isProfileViewVisible}
          onNext={() => {}}
          onPrevious={() => {}}
          hasNext={false}
          hasPrevious={false}
        />
      )}
    </div>
  )
}
