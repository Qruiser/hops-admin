"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Star,
  Calendar,
  Linkedin,
  Globe,
  Database,
  Clock,
  CheckSquare,
  Video,
  XCircle,
  FileCheck,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Circle,
} from "lucide-react"

interface CandidateCardProps {
  candidate: any
  isSelected?: boolean
}

export function CandidateCard({ candidate, isSelected }: CandidateCardProps) {
  // Function to get source icon
  const getSourceIcon = () => {
    switch (candidate.source) {
      case "linkedin":
        return <Linkedin className="h-3 w-3 mr-1" />
      case "website":
        return <Globe className="h-3 w-3 mr-1" />
      case "internal":
        return <Database className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  // Calculate deployment progress if in deploy stage
  const getDeploymentProgress = () => {
    if (candidate.deploymentChecklist) {
      const total = Object.keys(candidate.deploymentChecklist).length
      const completed = Object.values(candidate.deploymentChecklist).filter((value) => value === true).length
      return (completed / total) * 100
    }
    return null
  }

  // Function to get status badge
  const getStatusBadge = () => {
    // For candidates in the deploy stage
    if (candidate.status === "deploy") {
      const progress = getDeploymentProgress()

      if (progress === 100) {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Deployed
          </Badge>
        )
      } else if (progress === 0) {
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        )
      } else {
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <FileCheck className="h-3 w-3 mr-1" />
            Deployment: {progress?.toFixed(0)}%
          </Badge>
        )
      }
    }

    // For candidates in the recommend stage with timeline data
    if (candidate.timeline) {
      // If final decision is completed
      if (candidate.timeline.finalDecision && candidate.timeline.finalDecision.completed) {
        if (candidate.timeline.finalDecision.status === "shortlisted") {
          return (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <Star className="h-3 w-3 mr-1" />
              Shortlisted
            </Badge>
          )
        } else if (candidate.timeline.finalDecision.status === "rejected") {
          return (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              <XCircle className="h-3 w-3 mr-1" />
              Rejected
            </Badge>
          )
        }
      }

      // If interview is completed but no final decision
      if (candidate.timeline.interviewCompleted && candidate.timeline.interviewCompleted.completed) {
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Interview Completed
          </Badge>
        )
      }

      // If interview is scheduled but not completed
      if (
        candidate.timeline.interviewSetup &&
        candidate.timeline.interviewSetup.date &&
        !candidate.timeline.interviewCompleted.completed
      ) {
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            <Calendar className="h-3 w-3 mr-1" />
            Interview Scheduled
          </Badge>
        )
      }

      // If client has viewed but no interview scheduled
      if (
        candidate.timeline.clientViewed &&
        candidate.timeline.clientViewed.completed &&
        (!candidate.timeline.interviewSetup.date || !candidate.timeline.interviewSetup.completed)
      ) {
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Client Reviewing
          </Badge>
        )
      }

      // Default for recommended candidates with timeline
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
          <Star className="h-3 w-3 mr-1" />
          Recommended
        </Badge>
      )
    }

    // For candidates without timeline data, use the original logic
    switch (candidate.status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            New
          </Badge>
        )
      case "contacted":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            <CheckSquare className="h-3 w-3 mr-1" />
            Contacted
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "matched":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Matched
          </Badge>
        )
      case "recommended":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <Star className="h-3 w-3 mr-1" />
            Recommended
          </Badge>
        )
      default:
        return null
    }
  }

  // Get deployability score and confidence, fallback to matchScore if not available
  const deployabilityScore = candidate.deployabilityScore ?? candidate.matchScore
  const confidence = candidate.confidence ?? 85 // Default confidence if not provided

  // Determine confidence color based on level
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "text-green-600"
    if (conf >= 60) return "text-amber-600"
    return "text-red-600"
  }

  // Function to get agent job status based on candidate stage
  const getAgentJobStatus = () => {
    // Map candidate status to stage name
    const stageMap: Record<string, string> = {
      new: "Sourcing",
      contacted: "Sourcing",
      verified: "Screening",
      in_progress: "Screening",
      matched: "Match",
      recommended: "Recommend",
      deploy: "Deploy",
    }

    const stage = stageMap[candidate.status] || "Sourcing"

    // Define agents for each stage (candidate-level agents only)
    const stageAgents: Record<string, string[]> = {
      Sourcing: [
        "Check Matching Skills",
        "Check Matching Frameworks",
        "Check Job Consistency",
        "Match Salary Range",
        "Check Contract Openness",
      ],
      Screening: [
        "Check Job Consistency",
        "Check Salary Match",
        "Check Contract Openness",
      ],
      Match: [
        "Check Candidate Interest",
        "Check Preferences Match",
        "Check Within Budget",
        "Check Skill Level Match",
      ],
      Recommend: [],
      Deploy: [],
    }

    const agents = stageAgents[stage] || []

    if (agents.length === 0) {
      return {
        completed: 0,
        pending: 0,
        total: 0,
      }
    }

    // For demo purposes, simulate completion status
    // In a real app, this would come from the candidate's agent job status data
    const completedJobs = candidate.agentJobsCompleted !== undefined 
      ? candidate.agentJobsCompleted 
      : Math.max(0, Math.floor(agents.length * 0.6)) // Default to 60% completed
    const pendingJobs = Math.max(0, agents.length - completedJobs)

    return {
      completed: Math.min(completedJobs, agents.length),
      pending: pendingJobs,
      total: agents.length,
    }
  }

  const agentStatus = getAgentJobStatus()

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold">{candidate.name}</h3>
            <p className="text-xs text-muted-foreground">{candidate.email}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">{deployabilityScore}<span className="text-sm font-normal text-muted-foreground">/100</span></div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className={`h-3 w-3 ${getConfidenceColor(confidence)}`} />
              <span className={getConfidenceColor(confidence)}>{confidence}% confidence</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {candidate.skills.slice(0, 3).map((skill: string) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{candidate.skills.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Last activity: {new Date(candidate.lastActivity).toLocaleDateString()}</span>
          </div>

          <Badge variant="outline" className="text-xs">
            {getSourceIcon()}
            {candidate.source}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {candidate.experience}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {candidate.location}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {/* Call scheduled indicator */}
            {candidate.qrusibleCall && candidate.qrusibleCall.scheduled && (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1 text-xs"
              >
                <Video className="h-3 w-3" />
                Call Scheduled
              </Badge>
            )}
            {getStatusBadge()}
          </div>
        </div>

        {/* Agent Job Status Row */}
        {agentStatus.total > 0 && (
          <div className="flex items-center justify-between pt-2 mt-2 border-t text-xs">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-medium">Agent Jobs:</span>
              {agentStatus.completed > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span className="font-medium">{agentStatus.completed} completed</span>
                </div>
              )}
              {agentStatus.pending > 0 && (
                <div className="flex items-center gap-1 text-amber-600">
                  <Circle className="h-3 w-3" />
                  <span className="font-medium">{agentStatus.pending} pending</span>
                </div>
              )}
            </div>
            {agentStatus.total > 0 && (
              <div className="text-muted-foreground">
                {agentStatus.completed}/{agentStatus.total}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
