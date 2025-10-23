"use client"

import type React from "react"

import { useState } from "react"
import {
  X,
  CheckCircle,
  Download,
  Edit,
  ChevronLeft,
  ChevronRight,
  ThumbsDown,
  Briefcase,
  ArrowRight,
  History,
  Archive,
  Phone,
  Mail,
  Send,
  UserCheck,
  Star,
} from "lucide-react"
import { CheckCircle2, Clock, Calendar, FileCheck, ThumbsUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Candidate, ProfileChange, ContactStatus } from "@/types/talent"

interface ProfileViewProps {
  candidate: Candidate
  onClose: () => void
  updateCandidate: (candidate: Candidate) => void
  isVisible: boolean
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
}

// Add a function to get the contact status display text and color
const getContactStatusDisplay = (status?: ContactStatus) => {
  switch (status) {
    case "called":
      return { text: "Called", color: "text-green-600 bg-green-100" }
    case "not_picked":
      return { text: "Not Picked", color: "text-amber-600 bg-amber-100" }
    case "contact_info_missing":
      return { text: "Contact Information Missing", color: "text-red-600 bg-red-100" }
    case "not_a_fit":
      return { text: "Not a Fit", color: "text-gray-600 bg-gray-100" }
    case "not_called":
    default:
      return { text: "Not Called", color: "text-blue-600 bg-blue-100" }
  }
}

export function ProfileView({
  candidate,
  onClose,
  updateCandidate,
  isVisible,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: ProfileViewProps) {
  const [notes, setNotes] = useState(candidate.notes)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreferencesUnfitDialogOpen, setIsPreferencesUnfitDialogOpen] = useState(false)
  const [unfitReason, setUnfitReason] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [timelineFilter, setTimelineFilter] = useState<"all" | "status" | "source" | "profile" | "action">("all")

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value)
  }

  const handleSaveNotes = () => {
    updateCandidate({ ...candidate, notes })
  }

  const togglePrincipal = () => {
    updateCandidate({ ...candidate, isPotentialPrincipal: !candidate.isPotentialPrincipal })
  }

  const openEditDialog = () => {
    setEditingCandidate({ ...candidate })
    setIsEditDialogOpen(true)
  }

  const saveEditedCandidate = () => {
    if (editingCandidate) {
      updateCandidate(editingCandidate)
      setIsEditDialogOpen(false)
    }
  }

  const openPreferencesUnfitDialog = () => {
    setUnfitReason("")
    setIsPreferencesUnfitDialogOpen(true)
  }

  const markAsPreferencesUnfit = () => {
    updateCandidate({
      ...candidate,
      state: "preferences unfit",
      notes: candidate.notes
        ? `${candidate.notes}\n\nPreferences Unfit Reason: ${unfitReason}`
        : `Preferences Unfit Reason: ${unfitReason}`,
      lastAction: {
        action: "Marked as preferences unfit",
        by: "Current User",
        date: new Date().toISOString(),
      },
    })
    setIsPreferencesUnfitDialogOpen(false)
    onClose()
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  // Render source information
  const renderSourceInfo = () => {
    if (!candidate.sourceInfo) return null

    return (
      <div className="space-y-2 border p-3 rounded-md bg-gray-50 mb-4">
        <h4 className="font-medium">Source Information</h4>
        <div className="flex items-center gap-2">
          {candidate.sourceInfo.type === "new_candidate" && (
            <>
              <Star className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">New candidate</span>
              <span className="text-sm text-gray-500">Added on {formatDate(candidate.sourceInfo.date)}</span>
            </>
          )}
          {candidate.sourceInfo.type === "existing_candidate" && (
            <>
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600 font-medium">Existing candidate</span>
              <span className="text-sm text-gray-500">
                Added to this opportunity on {formatDate(candidate.sourceInfo.date)}
              </span>
            </>
          )}
          {candidate.sourceInfo.type === "sourced_from_job" && candidate.sourceInfo.jobName && (
            <>
              <Briefcase className="h-4 w-4 text-purple-500" />
              <span className="text-purple-600 font-medium">Found in: {candidate.sourceInfo.jobName}</span>
              <span className="text-sm text-gray-500">Added on {formatDate(candidate.sourceInfo.date)}</span>
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
                <span className="text-sm text-gray-500">Transferred on {formatDate(candidate.sourceInfo.date)}</span>
              </>
            )}
        </div>
      </div>
    )
  }

  // Update the renderStatusInfo function to include contact status dropdown
  const renderStatusInfo = () => {
    switch (candidate.state) {
      case "sourced":
        const contactStatusDisplay = getContactStatusDisplay(candidate.contactStatus)
        return (
          <div className="space-y-2 border p-3 rounded-md bg-gray-50">
            <h4 className="font-medium">Status Information</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>Sourced: {formatDate(candidate.sourcedDate || candidate.applyDate)}</span>
              </div>

              {/* Contact Status Dropdown */}
              <div className="col-span-2 mt-2">
                <Label htmlFor="contact-status" className="text-sm font-medium mb-1 block">
                  Contact Status
                </Label>
                <Select
                  value={candidate.contactStatus || "not_called"}
                  onValueChange={(value) => {
                    const now = new Date().toISOString()
                    updateCandidate({
                      ...candidate,
                      contactStatus: value as ContactStatus,
                      lastAction: {
                        action: `Contact status updated to ${getContactStatusDisplay(value as ContactStatus).text}`,
                        by: "Current User",
                        date: now,
                      },
                    })
                  }}
                >
                  <SelectTrigger id="contact-status" className="w-full">
                    <SelectValue placeholder="Select contact status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_called">Not Called</SelectItem>
                    <SelectItem value="called">Called</SelectItem>
                    <SelectItem value="not_picked">Not Picked</SelectItem>
                    <SelectItem value="contact_info_missing">Contact Information Missing</SelectItem>
                    <SelectItem value="not_a_fit">Not a Fit</SelectItem>
                  </SelectContent>
                </Select>

                <div
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold mt-2 ${contactStatusDisplay.color}`}
                >
                  Current: {contactStatusDisplay.text}
                </div>
              </div>

              <div className="flex items-center gap-1 col-span-2 mt-2">
                {candidate.contactAttempted ? (
                  <>
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Contacted (not picked up): {formatDate(candidate.contactAttemptDate)}</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Awaiting contact</span>
                  </>
                )}
              </div>

              {candidate.contactedDate && (
                <div className="flex items-center gap-1 col-span-2">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span>Successfully contacted: {formatDate(candidate.contactedDate)}</span>
                </div>
              )}

              {candidate.onboardingAttempted && (
                <div className="flex items-center gap-1 col-span-2">
                  <Send className="h-4 w-4 text-blue-500" />
                  <span>Onboarding attempted: {formatDate(candidate.onboardingAttemptDate)}</span>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString()
                  updateCandidate({
                    ...candidate,
                    contactAttempted: true,
                    contactAttemptDate: now,
                    contactStatus: "not_picked",
                    lastAction: {
                      action: "Contact attempted",
                      by: "Current User",
                      date: now,
                    },
                  })
                }}
                disabled={candidate.contactAttempted}
              >
                Mark Contact Attempted
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString()
                  updateCandidate({
                    ...candidate,
                    contactedDate: now,
                    contactStatus: "called",
                    lastAction: {
                      action: "Successfully contacted",
                      by: "Current User",
                      date: now,
                    },
                  })
                }}
                disabled={candidate.contactedDate !== undefined}
              >
                Mark Successfully Contacted
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString()
                  updateCandidate({
                    ...candidate,
                    onboardingAttempted: true,
                    onboardingAttemptDate: now,
                    lastAction: {
                      action: "Onboarding attempted",
                      by: "Current User",
                      date: now,
                    },
                  })
                }}
                disabled={candidate.onboardingAttempted}
              >
                Mark Onboarding Attempted
              </Button>
            </div>
          </div>
        )

      // Remove the "contact" case and continue with the rest of the cases
      case "onboarded":
        return (
          <div className="space-y-2 border p-3 rounded-md bg-gray-50">
            <h4 className="font-medium">Status Information</h4>
            <div className="grid grid-cols-2 gap-2">
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
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString()
                  updateCandidate({
                    ...candidate,
                    preferencesCollectionDate: now,
                    lastAction: {
                      action: "Preferences collection sent",
                      by: "Current User",
                      date: now,
                    },
                  })
                }}
                disabled={candidate.preferencesCollectionDate !== undefined}
              >
                Mark Preferences Sent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString()
                  updateCandidate({
                    ...candidate,
                    preferencesCollected: true,
                    lastAction: {
                      action: "Preferences collected",
                      by: "Current User",
                      date: now,
                    },
                  })
                }}
                disabled={candidate.preferencesCollected || !candidate.preferencesCollectionDate}
              >
                Mark Preferences Collected
              </Button>
            </div>
          </div>
        )

      case "preferenceMatched":
        return (
          <div className="space-y-2 border p-3 rounded-md bg-gray-50">
            <h4 className="font-medium">Status Information</h4>
            <div className="grid grid-cols-2 gap-2">
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
            <div className="mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString()
                  updateCandidate({
                    ...candidate,
                    specSent: true,
                    specSentDate: now,
                    lastAction: {
                      action: "Spec sent",
                      by: "Current User",
                      date: now,
                    },
                  })
                }}
                disabled={candidate.specSent}
              >
                Mark Spec Sent
              </Button>
            </div>
          </div>
        )

      case "specMatched":
        return (
          <div className="space-y-2 border p-3 rounded-md bg-gray-50">
            <h4 className="font-medium">Status Information</h4>
            <div className="grid grid-cols-2 gap-2">
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
            <div className="mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  updateCandidate({
                    ...candidate,
                    awaitingRecommendation: !candidate.awaitingRecommendation,
                    lastAction: {
                      action: candidate.awaitingRecommendation
                        ? "Marked as ready for recommendation"
                        : "Marked as awaiting recommendation",
                      by: "Current User",
                      date: new Date().toISOString(),
                    },
                  })
                }}
              >
                {candidate.awaitingRecommendation ? "Mark Ready for Recommendation" : "Mark Awaiting Recommendation"}
              </Button>
            </div>
          </div>
        )

      case "recommended":
        return (
          <div className="space-y-2 border p-3 rounded-md bg-gray-50">
            <h4 className="font-medium">Status Information</h4>
            <div className="grid grid-cols-2 gap-2">
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
            <div className="mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const now = new Date().toISOString()
                  updateCandidate({
                    ...candidate,
                    clientViewed: true,
                    clientViewedDate: now,
                    lastAction: {
                      action: "Viewed by client",
                      by: "Current User",
                      date: now,
                    },
                  })
                }}
                disabled={candidate.clientViewed}
              >
                Mark as Viewed by Client
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Update the getStatusTimeline function to include contact status changes
  const getStatusTimeline = () => {
    const timeline: {
      date: string
      title: string
      description: string
      icon: React.ReactNode
      type: string
      actionBy?: string
      category: "source" | "status" | "profile" | "action"
    }[] = []

    // Add source information
    if (candidate.sourceInfo) {
      let sourceTitle = ""
      let sourceDescription = ""
      let sourceIcon = <Star className="h-4 w-4 text-green-500" />

      switch (candidate.sourceInfo.type) {
        case "new_candidate":
          sourceTitle = "New Candidate"
          sourceDescription = "Added to the system"
          sourceIcon = <Star className="h-4 w-4 text-green-500" />
          break
        case "existing_candidate":
          sourceTitle = "Existing Candidate"
          sourceDescription = "Added to this opportunity"
          sourceIcon = <CheckCircle className="h-4 w-4 text-blue-500" />
          break
        case "sourced_from_job":
          sourceTitle = `Sourced from ${candidate.sourceInfo.jobName}`
          sourceDescription = "Transferred from another job"
          sourceIcon = <Briefcase className="h-4 w-4 text-purple-500" />
          break
        case "transferred_from_stage":
          sourceTitle = `Transferred from ${candidate.sourceInfo.stageName} in ${candidate.sourceInfo.jobName}`
          sourceDescription = "Moved from another stage"
          sourceIcon = <ArrowRight className="h-4 w-4 text-orange-500" />
          break
      }

      timeline.push({
        date: candidate.sourceInfo.date,
        title: sourceTitle,
        description: sourceDescription,
        icon: sourceIcon,
        type: "source",
        category: "source",
      })
    }

    // Add sourced date
    if (candidate.sourcedDate || candidate.applyDate) {
      timeline.push({
        date: candidate.sourcedDate || candidate.applyDate,
        title: "Sourced",
        description: "Candidate added to sourced stage",
        icon: <Calendar className="h-4 w-4 text-blue-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add contact attempt
    if (candidate.contactAttemptDate) {
      timeline.push({
        date: candidate.contactAttemptDate,
        title: "Contact Attempted",
        description: "Attempted to contact candidate",
        icon: <Clock className="h-4 w-4 text-amber-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add contacted date
    if (candidate.contactedDate) {
      timeline.push({
        date: candidate.contactedDate,
        title: "Successfully Contacted",
        description: "Successfully contacted candidate",
        icon: <UserCheck className="h-4 w-4 text-green-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add onboarding attempt
    if (candidate.onboardingAttemptDate) {
      timeline.push({
        date: candidate.onboardingAttemptDate,
        title: "Onboarding Attempted",
        description: "Attempted to onboard candidate",
        icon: <Send className="h-4 w-4 text-blue-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add onboarded date
    if (candidate.onboardedDate) {
      timeline.push({
        date: candidate.onboardedDate,
        title: "Onboarded",
        description: "Candidate successfully onboarded",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add preferences collection
    if (candidate.preferencesCollectionDate) {
      timeline.push({
        date: candidate.preferencesCollectionDate,
        title: "Preferences Collection Sent",
        description: "Sent preferences collection to candidate",
        icon: <Send className="h-4 w-4 text-amber-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add preferences collected
    if (candidate.preferencesCollected && candidate.preferencesCollectionDate) {
      timeline.push({
        date: candidate.preferencesCollectionDate,
        title: "Preferences Collected",
        description: "Collected preferences from candidate",
        icon: <FileCheck className="h-4 w-4 text-green-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add preferences matched
    if (candidate.preferencesMatchedDate) {
      timeline.push({
        date: candidate.preferencesMatchedDate,
        title: "Preferences Matched",
        description: "Candidate preferences matched with job",
        icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add spec sent
    if (candidate.specSentDate) {
      timeline.push({
        date: candidate.specSentDate,
        title: "Spec Sent",
        description: "Sent job spec to candidate",
        icon: <Send className="h-4 w-4 text-blue-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add spec matched
    if (candidate.specMatchedDate) {
      timeline.push({
        date: candidate.specMatchedDate,
        title: "Spec Matched",
        description: "Candidate matched with job spec",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add recommended
    if (candidate.recommendedDate) {
      timeline.push({
        date: candidate.recommendedDate,
        title: "Recommended",
        description: "Candidate recommended to client",
        icon: <Star className="h-4 w-4 text-yellow-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add client viewed
    if (candidate.clientViewedDate) {
      timeline.push({
        date: candidate.clientViewedDate,
        title: "Client Viewed",
        description: "Client viewed candidate profile",
        icon: <Eye className="h-4 w-4 text-green-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add last action
    if (candidate.lastAction) {
      timeline.push({
        date: candidate.lastAction.date,
        title: "Action Taken",
        description: candidate.lastAction.action,
        icon: <History className="h-4 w-4 text-indigo-500" />,
        type: "action",
        actionBy: candidate.lastAction.by,
        category: "action",
      })
    }

    // Add contact status to timeline if it exists and is not the default
    if (candidate.contactStatus && candidate.contactStatus !== "not_called") {
      const statusDisplay = getContactStatusDisplay(candidate.contactStatus)
      timeline.push({
        date: candidate.lastAction?.date || new Date().toISOString(), // Use last action date or current date
        title: "Contact Status Updated",
        description: `Status set to: ${statusDisplay.text}`,
        icon: <UserCheck className="h-4 w-4 text-blue-500" />,
        type: "status",
        category: "status",
      })
    }

    // Add profile changes
    if (candidate.profileChanges && candidate.profileChanges.length > 0) {
      candidate.profileChanges.forEach((change: ProfileChange) => {
        timeline.push({
          date: change.date,
          title: change.type.replace(/_/g, " "),
          description: change.details,
          icon: <Edit className="h-4 w-4 text-purple-500" />,
          type: "profile",
          category: "profile",
        })
      })
    }

    // Sort by date (newest first)
    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Render stage-specific action buttons
  const renderStageActions = () => {
    switch (candidate.state) {
      case "sourced":
        return (
          <div className="flex flex-col gap-2 mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Stage Actions</h4>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Phone className="h-4 w-4" />
                Call Candidate
              </Button>
              <Button className="flex-1 gap-2">
                <Mail className="h-4 w-4" />
                Email Candidate
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <ArrowRight className="h-4 w-4" />
                Move to Screening
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Salary not match</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want contract</DropdownMenuItem>
                  <DropdownMenuItem>Skills not matched</DropdownMenuItem>
                  <DropdownMenuItem>No contact information</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want to complete profile</DropdownMenuItem>
                  <DropdownMenuItem>Traits not matched</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )

      case "onboarded":
        return (
          <div className="flex flex-col gap-2 mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Stage Actions</h4>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Send Preferences Form
              </Button>
              <Button className="flex-1 gap-2">
                <Mail className="h-4 w-4" />
                Email Candidate
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <ArrowRight className="h-4 w-4" />
                Move to Match Stage
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Salary not match</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want contract</DropdownMenuItem>
                  <DropdownMenuItem>Skills not matched</DropdownMenuItem>
                  <DropdownMenuItem>No contact information</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want to complete profile</DropdownMenuItem>
                  <DropdownMenuItem>Traits not matched</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )

      case "preferenceMatched":
      case "specMatched":
        return (
          <div className="flex flex-col gap-2 mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Stage Actions</h4>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Send Job Spec
              </Button>
              <Button className="flex-1 gap-2">
                <Mail className="h-4 w-4" />
                Email Candidate
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <ArrowRight className="h-4 w-4" />
                Move to Recommend
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Salary not match</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want contract</DropdownMenuItem>
                  <DropdownMenuItem>Skills not matched</DropdownMenuItem>
                  <DropdownMenuItem>No contact information</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want to complete profile</DropdownMenuItem>
                  <DropdownMenuItem>Traits not matched</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )

      case "recommended":
        return (
          <div className="flex flex-col gap-2 mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Stage Actions</h4>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Send Follow-up
              </Button>
              <Button className="flex-1 gap-2">
                <Mail className="h-4 w-4" />
                Email Client
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <ArrowRight className="h-4 w-4" />
                Move to Deploy
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Salary not match</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want contract</DropdownMenuItem>
                  <DropdownMenuItem>Skills not matched</DropdownMenuItem>
                  <DropdownMenuItem>No contact information</DropdownMenuItem>
                  <DropdownMenuItem>Doesn't want to complete profile</DropdownMenuItem>
                  <DropdownMenuItem>Traits not matched</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
    }
  }

  const statusTimeline = getStatusTimeline()

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed inset-y-0 right-0 w-2/5 bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Button onClick={onPrevious} disabled={!hasPrevious} variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
              <Button onClick={onNext} disabled={!hasNext} variant="outline" size="sm">
                <ChevronRight className="ml-2 h-4 w-4" />
                Next
              </Button>
            </div>
            <h2 className="text-2xl font-bold">{candidate.name}</h2>

            {/* Contact Information Card */}
            <div className="mt-3 p-3 border rounded-md bg-gray-50">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${candidate.email}`} className="text-sm hover:underline">
                    {candidate.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${candidate.phone}`} className="text-sm hover:underline">
                    {candidate.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Applied: {new Date(candidate.applyDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Source information */}
              {renderSourceInfo()}

              {/* Status information based on candidate state */}
              {renderStatusInfo()}

              {/* Stage-specific actions */}
              {renderStageActions()}

              <div>
                <h3 className="text-lg font-semibold mb-2">Score</h3>
                <div className="text-3xl font-bold text-green-600">{candidate.matchScore}%</div>
                <p className="text-sm text-gray-600 mt-1">{candidate.scoreReason}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Matched Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.matchedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Matched Results</h3>
                <ul className="list-disc list-inside">
                  {candidate.matchedResults.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <p>{candidate.experience}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Preferences</h3>
                <ul className="list-disc list-inside">
                  {candidate.preferences.map((preference, index) => (
                    <li key={index}>{preference}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <Textarea value={notes} onChange={handleNotesChange} className="w-full min-h-[100px]" />
                <Button onClick={handleSaveNotes} className="mt-2">
                  Save Notes
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="potential-principal"
                  checked={candidate.isPotentialPrincipal}
                  onCheckedChange={togglePrincipal}
                />
                <label htmlFor="potential-principal" className="text-sm font-medium">
                  Potential Principal
                </label>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {candidate.verified && (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    Verified
                  </div>
                )}
                <div>{candidate.yearsOfExperience} years of experience</div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Current Stage</h3>
                <div>{candidate.state}</div>
                {candidate.state === "onboarded" && (
                  <div>
                    <span className="font-semibold">Round 1 Status:</span>{" "}
                    {candidate.completedRound1 ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={openEditDialog} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>

                <Button variant="destructive" onClick={openPreferencesUnfitDialog} className="flex-1">
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Mark Preferences Unfit
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Candidate Timeline</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setActiveTab("overview")}>
                      Back to Overview
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setTimelineFilter("all")}
                  >
                    All
                  </Badge>
                  <Badge
                    variant={timelineFilter === "status" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTimelineFilter("status")}
                  >
                    Status Updates
                  </Badge>
                  <Badge
                    variant={timelineFilter === "source" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTimelineFilter("source")}
                  >
                    Source
                  </Badge>
                  <Badge
                    variant={timelineFilter === "profile" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTimelineFilter("profile")}
                  >
                    Profile Changes
                  </Badge>
                  <Badge
                    variant={timelineFilter === "action" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTimelineFilter("action")}
                  >
                    Actions
                  </Badge>
                </div>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {statusTimeline
                      .filter((item) => timelineFilter === "all" || item.category === timelineFilter)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`relative pl-6 pb-4 border-l-2 ${
                            item.category === "source"
                              ? "border-blue-300"
                              : item.category === "status"
                                ? "border-green-300"
                                : item.category === "profile"
                                  ? "border-purple-300"
                                  : "border-indigo-300"
                          }`}
                        >
                          <div className="absolute -left-3 top-0">
                            <div
                              className={`p-1.5 rounded-full ${
                                item.category === "source"
                                  ? "bg-blue-100 text-blue-600"
                                  : item.category === "status"
                                    ? "bg-green-100 text-green-600"
                                    : item.category === "profile"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-indigo-100 text-indigo-600"
                              }`}
                            >
                              {item.icon}
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                              {item.category === "status" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  Status
                                </Badge>
                              )}
                              {item.category === "source" && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  Source
                                </Badge>
                              )}
                              {item.category === "profile" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  Profile
                                </Badge>
                              )}
                              {item.category === "action" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                                >
                                  Action
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            {item.actionBy && <p className="text-xs text-gray-500 mt-1">By: {item.actionBy}</p>}
                          </div>
                        </div>
                      ))}

                    {statusTimeline.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No timeline events available</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resume</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    {candidate.resumeUrl ? (
                      <>
                        <div className="mb-2 flex items-center text-sm text-muted-foreground">
                          <FileCheck className="mr-2 h-4 w-4" />
                          Resume available - {candidate.resumeUrl.split("/").pop()}
                        </div>
                        <div className="relative w-full h-96 bg-white">
                          {/* Embed PDF with object tag as primary method */}
                          <object
                            data={candidate.resumeUrl}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            className="border-0"
                          >
                            {/* Fallback to iframe if object tag isn't supported */}
                            <iframe
                              src={candidate.resumeUrl}
                              className="absolute inset-0 w-full h-full border-0"
                              title={`${candidate.name}'s Resume`}
                            >
                              {/* Final fallback message */}
                              <p className="p-4">Unable to display resume. Please use the download button below.</p>
                            </iframe>
                          </object>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96 bg-white">
                        <FileCheck className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No resume available for this candidate</p>
                      </div>
                    )}
                  </div>
                  {candidate.resumeUrl && (
                    <div className="flex gap-2 mt-2">
                      <Button className="flex-1" onClick={() => window.open(candidate.resumeUrl, "_blank")}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = candidate.resumeUrl
                          link.download = `${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Save to Computer
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills & Experience</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {candidate.skills.map((skill) => (
                      <div key={skill} className="flex items-center justify-between border p-2 rounded">
                        <span>{skill}</span>
                        <span className="text-sm text-gray-500">
                          {candidate.skillExperience?.[skill] || "No experience data"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {candidate.profileChanges && candidate.profileChanges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Profile Changes</h3>
                    <div className="space-y-2">
                      {candidate.profileChanges.map((change, index) => (
                        <div key={index} className="border p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <Edit className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">{change.type.replace(/_/g, " ")}</span>
                            <span className="text-sm text-gray-500">{formatDate(change.date)}</span>
                          </div>
                          <p className="mt-1 text-sm">{change.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stage-specific actions */}
                {renderStageActions()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Candidate Details</DialogTitle>
          </DialogHeader>
          {editingCandidate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={editingCandidate.name}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  value={editingCandidate.email}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={editingCandidate.phone}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="completedRound1" className="text-right">
                  Completed Round 1
                </label>
                <Checkbox
                  id="completedRound1"
                  checked={editingCandidate.completedRound1}
                  onCheckedChange={(checked) =>
                    setEditingCandidate({ ...editingCandidate, completedRound1: checked as boolean })
                  }
                  className="col-span-3"
                />
              </div>
              <Button onClick={saveEditedCandidate}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPreferencesUnfitDialogOpen} onOpenChange={setIsPreferencesUnfitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Preferences Unfit</DialogTitle>
            <DialogDescription>
              Please provide a reason why this candidate's preferences don't match the job requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="unfit-reason">Reason</Label>
            <Textarea
              id="unfit-reason"
              value={unfitReason}
              onChange={(e) => setUnfitReason(e.target.value)}
              placeholder="e.g., Candidate requires remote work but position is on-site only"
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreferencesUnfitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={markAsPreferencesUnfit} disabled={!unfitReason.trim()} variant="destructive">
              Mark as Preferences Unfit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
