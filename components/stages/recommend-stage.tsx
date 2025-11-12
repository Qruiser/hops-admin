"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Archive, CheckCircle2, Clock, Calendar, Video, Star, XCircle, MessageSquare } from "lucide-react"
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
    deployabilityScore: 93,
    confidence: 90,
    skills: ["React", "TypeScript", "Node.js"],
    experience: "5 years",
    location: "San Francisco, CA",
    lastActivity: "2023-05-15",
    status: "recommended",
    currentPosition: "Senior Developer",
    currentCompany: "TechCorp",
    timeline: {
      recommended: {
        date: "2023-05-16",
        completed: true,
      },
      clientViewed: {
        date: "2023-05-17",
        completed: true,
      },
      interviewSetup: {
        date: "2023-05-18",
        completed: true,
        time: "10:00 AM",
        location: "Zoom",
        rescheduled: true,
        originalDate: "2023-05-17",
      },
      interviewCompleted: {
        date: "2023-05-19",
        completed: true,
        notes: "Candidate performed well in technical assessment",
      },
      finalDecision: {
        date: "2023-05-20",
        completed: true,
        status: "shortlisted",
        feedback: "Strong technical skills and good cultural fit",
      },
    },
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 987-6543",
    source: "internal",
    matchScore: 87,
    deployabilityScore: 88,
    confidence: 83,
    skills: ["React", "JavaScript", "CSS"],
    experience: "4 years",
    location: "New York, NY",
    lastActivity: "2023-05-14",
    status: "recommended",
    currentPosition: "Frontend Developer",
    currentCompany: "WebSolutions Inc.",
    timeline: {
      recommended: {
        date: "2023-05-15",
        completed: true,
      },
      clientViewed: {
        date: "2023-05-16",
        completed: true,
      },
      interviewSetup: {
        date: "2023-05-17",
        completed: true,
        time: "2:00 PM",
        location: "Google Meet",
        rescheduled: false,
      },
      interviewCompleted: {
        date: "2023-05-18",
        completed: true,
        notes: "Candidate showed good knowledge of frontend technologies",
      },
      finalDecision: {
        date: "2023-05-19",
        completed: true,
        status: "rejected",
        feedback: "Good candidate but missing experience with our specific tech stack",
      },
    },
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 456-7890",
    source: "website",
    matchScore: 78,
    deployabilityScore: 79,
    confidence: 75,
    skills: ["Angular", "TypeScript", "HTML"],
    experience: "3 years",
    location: "Chicago, IL",
    lastActivity: "2023-05-13",
    status: "recommended",
    currentPosition: "UI Developer",
    currentCompany: "Digital Agency",
    timeline: {
      recommended: {
        date: "2023-05-14",
        completed: true,
      },
      clientViewed: {
        date: "2023-05-15",
        completed: true,
      },
      interviewSetup: {
        date: "2023-05-20",
        completed: false,
        time: "11:30 AM",
        location: "Microsoft Teams",
        rescheduled: false,
      },
      interviewCompleted: {
        completed: false,
      },
      finalDecision: {
        completed: false,
      },
    },
  },
]

export function RecommendStage() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0])
  const [agentConfig, setAgentConfig] = useState<AgentSettingsConfig>({
    stage: "Recommend",
    enabled: false,
    stageLevelAgents: [],
    candidateLevelAgents: [],
  })

  const handleSelectCandidate = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  const handleAgentUpdate = (config: AgentSettingsConfig) => {
    setAgentConfig(config)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
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
          {candidates.map((candidate) => (
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
          <CardContent className="space-y-4">
            {/* Compact Candidate Info Panel */}
            <CandidateInfoPanel candidate={selectedCandidate} />

            {/* Client Interaction Timeline */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium mb-3">Client Interaction Timeline</h3>

              <div className="relative pl-6 border-l border-gray-200 space-y-4">
                {/* Recommended */}
                <div className="relative">
                  <div
                    className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                      selectedCandidate.timeline.recommended.completed ? "bg-green-500" : "bg-gray-300"
                    } flex items-center justify-center`}
                  >
                    {selectedCandidate.timeline.recommended.completed && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Recommended</h4>
                    {selectedCandidate.timeline.recommended.completed && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
                        {formatDate(selectedCandidate.timeline.recommended.date)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Client Viewed */}
                <div className="relative">
                  <div
                    className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                      selectedCandidate.timeline.clientViewed.completed ? "bg-green-500" : "bg-gray-300"
                    } flex items-center justify-center`}
                  >
                    {selectedCandidate.timeline.clientViewed.completed && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Client Viewed</h4>
                    {selectedCandidate.timeline.clientViewed.completed && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
                        {formatDate(selectedCandidate.timeline.clientViewed.date)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Interview Setup */}
                <div className="relative">
                  <div
                    className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                      selectedCandidate.timeline.interviewSetup.completed
                        ? "bg-green-500"
                        : selectedCandidate.timeline.interviewSetup.date
                          ? "bg-blue-500"
                          : "bg-gray-300"
                    } flex items-center justify-center`}
                  >
                    {selectedCandidate.timeline.interviewSetup.completed ? (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    ) : selectedCandidate.timeline.interviewSetup.date ? (
                      <Calendar className="h-3 w-3 text-white" />
                    ) : null}
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Interview Setup</h4>
                      {selectedCandidate.timeline.interviewSetup.date && (
                        <Badge
                          variant="outline"
                          className={`${
                            selectedCandidate.timeline.interviewSetup.completed
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                          } text-xs`}
                        >
                          {formatDate(selectedCandidate.timeline.interviewSetup.date)}
                        </Badge>
                      )}
                    </div>

                    {selectedCandidate.timeline.interviewSetup.date && (
                      <div className="mt-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{selectedCandidate.timeline.interviewSetup.time}</span>
                          <span className="mx-1">•</span>
                          <Video className="h-3 w-3" />
                          <span>{selectedCandidate.timeline.interviewSetup.location}</span>
                        </div>

                        {selectedCandidate.timeline.interviewSetup.rescheduled &&
                          selectedCandidate.timeline.interviewSetup.originalDate && (
                            <div className="mt-1 text-amber-600 italic">
                              Rescheduled from {formatDate(selectedCandidate.timeline.interviewSetup.originalDate)}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Interview Completed */}
                <div className="relative">
                  <div
                    className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                      selectedCandidate.timeline.interviewCompleted.completed ? "bg-green-500" : "bg-gray-300"
                    } flex items-center justify-center`}
                  >
                    {selectedCandidate.timeline.interviewCompleted.completed && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Interview Completed</h4>
                    {selectedCandidate.timeline.interviewCompleted.completed &&
                      selectedCandidate.timeline.interviewCompleted.date && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
                          {formatDate(selectedCandidate.timeline.interviewCompleted.date)}
                        </Badge>
                      )}
                  </div>

                  {selectedCandidate.timeline.interviewCompleted.completed &&
                    selectedCandidate.timeline.interviewCompleted.notes && (
                      <div className="mt-1 text-xs text-gray-500">
                        {selectedCandidate.timeline.interviewCompleted.notes}
                      </div>
                    )}
                </div>

                {/* Final Decision */}
                <div className="relative">
                  <div
                    className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                      !selectedCandidate.timeline.finalDecision.completed
                        ? "bg-gray-300"
                        : selectedCandidate.timeline.finalDecision.status === "shortlisted"
                          ? "bg-green-500"
                          : "bg-red-500"
                    } flex items-center justify-center`}
                  >
                    {selectedCandidate.timeline.finalDecision.completed &&
                      (selectedCandidate.timeline.finalDecision.status === "shortlisted" ? (
                        <Star className="h-3 w-3 text-white" />
                      ) : (
                        <XCircle className="h-3 w-3 text-white" />
                      ))}
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">
                        {selectedCandidate.timeline.finalDecision.completed
                          ? selectedCandidate.timeline.finalDecision.status === "shortlisted"
                            ? "Shortlisted"
                            : "Rejected"
                          : "Awaiting Decision"}
                      </h4>
                      {selectedCandidate.timeline.finalDecision.completed &&
                        selectedCandidate.timeline.finalDecision.date && (
                          <Badge
                            variant="outline"
                            className={`${
                              selectedCandidate.timeline.finalDecision.status === "shortlisted"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            } text-xs`}
                          >
                            {formatDate(selectedCandidate.timeline.finalDecision.date)}
                          </Badge>
                        )}
                    </div>

                    {selectedCandidate.timeline.finalDecision.completed &&
                      selectedCandidate.timeline.finalDecision.feedback && (
                        <div className="mt-1 text-xs text-gray-500">
                          <span className="font-medium">Feedback:</span>{" "}
                          {selectedCandidate.timeline.finalDecision.feedback}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Follow-up with the client
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

              {selectedCandidate.timeline.finalDecision.completed &&
                selectedCandidate.timeline.finalDecision.status === "shortlisted" && (
                  <Button className="w-full gap-2 mt-2">
                    <ArrowRight className="h-4 w-4" />
                    Move to Deploy
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
