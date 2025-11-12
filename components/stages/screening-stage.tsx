"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  Archive,
  Check,
  X,
  DollarSign,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Calendar,
  Video,
  ExternalLink,
  Mail,
} from "lucide-react"
import { CandidateCard } from "../candidate-card"
import { CandidateInfoPanel } from "../candidate-info-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AgentSettings, AgentSettingsConfig } from "../agent-settings"

// Sample candidates data
const candidates = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    source: "linkedin",
    matchScore: 92,
    deployabilityScore: 90,
    confidence: 85,
    skills: ["React", "TypeScript", "Node.js"],
    experience: "5 years",
    location: "San Francisco, CA",
    lastActivity: "2023-05-15",
    status: "verified",
    verificationChecklist: {
      authenticity: true,
      platformUnderstanding: true,
      opportunityComprehension: true,
      experienceVerification: true,
      ndaSigned: false,
    },
    preferences: {
      openToContract: true,
      expectedSalary: "$120,000",
      offerSalary: "$115,000",
      customQuestionAnswer: true,
    },
    currentPosition: "Senior Developer",
    currentCompany: "TechCorp",
    qrusibleCall: {
      scheduled: true,
      dateTime: "2023-06-10T14:00:00",
      meetingLink: "https://meet.qrusible.com/abc123",
      inviteCode: "QRU-123-456",
    },
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 987-6543",
    source: "internal",
    matchScore: 87,
    deployabilityScore: 85,
    confidence: 78,
    skills: ["React", "JavaScript", "CSS"],
    experience: "4 years",
    location: "New York, NY",
    lastActivity: "2023-05-14",
    status: "in_progress",
    verificationChecklist: {
      authenticity: true,
      platformUnderstanding: true,
      opportunityComprehension: false,
      experienceVerification: false,
      ndaSigned: false,
    },
    preferences: {
      openToContract: false,
      expectedSalary: "$110,000",
      offerSalary: "$105,000",
      customQuestionAnswer: false,
    },
    currentPosition: "Frontend Developer",
    currentCompany: "WebSolutions Inc.",
    qrusibleCall: {
      scheduled: false,
      dateTime: null,
      meetingLink: null,
      inviteCode: null,
    },
  },
]

export function ScreeningStage() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0])
  const [showCandidateDetails, setShowCandidateDetails] = useState(true)
  const [candidatesData, setCandidatesData] = useState(candidates)
  const [agentConfig, setAgentConfig] = useState<AgentSettingsConfig>({
    stage: "Screening",
    enabled: true,
    stageLevelAgents: [],
    candidateLevelAgents: [
      {
        id: "job-consistency-1",
        name: "Check Job Consistency",
        enabled: true,
        type: "candidate-level",
        config: { threshold: 60 },
      },
      {
        id: "salary-match-1",
        name: "Check Salary Match",
        enabled: true,
        type: "candidate-level",
        config: { threshold: 80 },
      },
      {
        id: "contract-openness-1",
        name: "Check Contract Openness",
        enabled: true,
        type: "candidate-level",
      },
    ],
  })

  const handleSelectCandidate = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  const handleAgentUpdate = (config: AgentSettingsConfig) => {
    setAgentConfig(config)
  }

  const handleSetupCall = () => {
    // In a real application, this would open a modal or form to schedule a call
    const updatedCandidate = {
      ...selectedCandidate,
      qrusibleCall: {
        scheduled: !selectedCandidate.qrusibleCall.scheduled,
        dateTime: selectedCandidate.qrusibleCall.scheduled ? null : new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        meetingLink: selectedCandidate.qrusibleCall.scheduled ? null : "https://meet.qrusible.com/abc123",
        inviteCode: selectedCandidate.qrusibleCall.scheduled
          ? null
          : "QRU-" + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 900 + 100),
      },
    }

    // Update the selected candidate
    setSelectedCandidate(updatedCandidate)

    // Also update the candidate in the candidates array
    const updatedCandidates = candidatesData.map((c) => (c.id === selectedCandidate.id ? updatedCandidate : c))
    setCandidatesData(updatedCandidates)
  }

  // Calculate verification progress
  const getVerificationProgress = (checklist: any) => {
    const total = Object.keys(checklist).length
    const completed = Object.values(checklist).filter((value) => value === true).length
    return (completed / total) * 100
  }

  // Check if verification is complete
  const isVerificationComplete = (checklist: any) => {
    return Object.values(checklist).every((value) => value === true)
  }

  // Format date for display
  const formatDateTime = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Handle follow up for incomplete verification
  const handleFollowUp = () => {
    // In a real application, this would trigger an email or notification
    alert(`Follow-up email sent to ${selectedCandidate.name} at ${selectedCandidate.email}`)
  }

  return (
    <div className="space-y-6">
      {/* Agent Settings */}
      <div className="flex justify-end">
        <AgentSettings config={agentConfig} onUpdate={handleAgentUpdate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidatesData.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => handleSelectCandidate(candidate)}
              className={`cursor-pointer ${selectedCandidate.id === candidate.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
            >
              <CandidateCard candidate={candidate} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Deployability Check (Can this candidate do the job?)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Candidate Details (Collapsible) */}
            <div className="border rounded-md">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setShowCandidateDetails(!showCandidateDetails)}
              >
                <h4 className="text-sm font-medium">Candidate Details</h4>
                {showCandidateDetails ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {showCandidateDetails && (
                <div className="p-3 pt-0 border-t">
                  <CandidateInfoPanel candidate={selectedCandidate} />
                </div>
              )}
            </div>

            {/* Preference Matching */}
            <div className="space-y-2 border rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Preference Matching</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Open to Contract</Label>
                  </div>
                  <Badge
                    variant={selectedCandidate.preferences.openToContract ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {selectedCandidate.preferences.openToContract ? (
                      <>
                        <Check className="h-3 w-3" /> Yes
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" /> No
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm">Salary Expectations</Label>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{selectedCandidate.preferences.expectedSalary}</div>
                    <div className="text-xs text-muted-foreground">
                      Offer: {selectedCandidate.preferences.offerSalary}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm">Custom Question</Label>
                  </div>
                  <Badge
                    variant={selectedCandidate.preferences.customQuestionAnswer ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {selectedCandidate.preferences.customQuestionAnswer ? (
                      <>
                        <Check className="h-3 w-3" /> Yes
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" /> No
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Verification Progress */}
            <div className="border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Verification Progress</h4>
                <span className="text-sm font-medium">
                  {getVerificationProgress(selectedCandidate.verificationChecklist).toFixed(0)}%
                </span>
              </div>
              <Progress value={getVerificationProgress(selectedCandidate.verificationChecklist)} className="h-2" />
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2 border rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Verification Checklist</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="authenticity" checked={selectedCandidate.verificationChecklist.authenticity} />
                  <Label htmlFor="authenticity" className="text-sm">
                    Candidate Authenticity
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="platformUnderstanding"
                    checked={selectedCandidate.verificationChecklist.platformUnderstanding}
                  />
                  <Label htmlFor="platformUnderstanding" className="text-sm">
                    Platform Understanding
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="opportunityComprehension"
                    checked={selectedCandidate.verificationChecklist.opportunityComprehension}
                  />
                  <Label htmlFor="opportunityComprehension" className="text-sm">
                    Opportunity Comprehension
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="experienceVerification"
                    checked={selectedCandidate.verificationChecklist.experienceVerification}
                  />
                  <Label htmlFor="experienceVerification" className="text-sm">
                    Experience Verification
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="ndaSigned" checked={selectedCandidate.verificationChecklist.ndaSigned} />
                  <Label htmlFor="ndaSigned" className="text-sm">
                    NDA Signed
                  </Label>
                </div>
              </div>

              {/* Follow Up Button - Only shown for incomplete verification */}
              {!isVerificationComplete(selectedCandidate.verificationChecklist) && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-amber-600">Verification incomplete</span>
                    <span className="text-xs text-muted-foreground">
                      Last reminder: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleFollowUp}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Send Follow-up Reminder</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Qrusible Call Section */}
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Qrusible Call</h4>

              {selectedCandidate.qrusibleCall && selectedCandidate.qrusibleCall.scheduled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDateTime(selectedCandidate.qrusibleCall.dateTime)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                      Invite Code: {selectedCandidate.qrusibleCall.inviteCode}
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => window.open(selectedCandidate.qrusibleCall.meetingLink, "_blank")}
                  >
                    <Video className="h-4 w-4" />
                    <span>Join Meeting</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={handleSetupCall}
                  >
                    Cancel Call
                  </Button>
                </div>
              ) : (
                <Button className="w-full flex items-center justify-center gap-2" onClick={handleSetupCall}>
                  <Calendar className="h-4 w-4" />
                  Setup Call with Qrusible
                </Button>
              )}
            </div>

            <div className="flex gap-2 pt-2">
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
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
