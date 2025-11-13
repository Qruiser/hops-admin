"use client"

import { useState } from "react"
import { Mail, Phone, Building, Briefcase, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AgentJobResults } from "./agent-job-results"

interface CandidateInfoPanelProps {
  candidate: any
}

export function CandidateInfoPanel({ candidate }: CandidateInfoPanelProps) {
  // Get deployability breakdown data
  const deployabilityScore = candidate.deployabilityScore ?? candidate.matchScore ?? 0
  const suitabilityScore = candidate.suitabilityScore ?? Math.round(deployabilityScore * 0.97) // Default calculation
  const readinessScore = candidate.readinessScore ?? Math.round(deployabilityScore * 1.03) // Default calculation
  
  // Get evidence data
  const suitabilityEvidence = candidate.suitabilityEvidence || {
    source: "Resume, LinkedIn Profile & Agent Job Results",
    matching: [
      "92% skills match - Strong alignment with required skills",
      "5+ years experience in React/TypeScript",
      "Expert knowledge in Next.js, Express.js",
    ],
    nonMatching: [
      "Vue.js not found in profile",
    ],
  }
  
  const readinessEvidence = candidate.readinessEvidence || {
    source: "Deployment Checklist & Communication History",
    matching: [
      "Contract signed and verified",
      "All required documents submitted",
      "Start date confirmed for June 1, 2023",
      "Compensation agreed and finalized",
    ],
    nonMatching: [
      "Relieving letter pending from current employer",
    ],
  }

  return (
    <div className="border rounded-md mb-4">
      {/* Deployability Score - At the top */}
      <div className="p-4 border-b bg-muted/20">
        <div className="border rounded-md p-3 bg-background">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <span className="text-xl font-bold text-green-600">
                {deployabilityScore}
                <span className="text-base font-normal text-muted-foreground">/100</span>
              </span>
            </div>
            <p className="mt-2 text-sm font-medium">Deployability Score</p>
            {candidate.confidence && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className={`h-3 w-3 ${
                  candidate.confidence >= 80 ? "text-green-600" :
                  candidate.confidence >= 60 ? "text-amber-600" : "text-red-600"
                }`} />
                <span className={`text-xs ${
                  candidate.confidence >= 80 ? "text-green-600" :
                  candidate.confidence >= 60 ? "text-amber-600" : "text-red-600"
                }`}>
                  {candidate.confidence}% confidence
                </span>
              </div>
            )}
          </div>

          {/* Suitability and Readiness Breakdown */}
          <div className="space-y-4 mt-4 pt-4 border-t">
            {/* Suitability */}
            <DeployabilityFactor
              label="Suitability"
              score={suitabilityScore}
              evidence={suitabilityEvidence}
            />

            {/* Readiness */}
            <DeployabilityFactor
              label="Readiness"
              score={readinessScore}
              evidence={readinessEvidence}
            />
          </div>
        </div>
      </div>

      {/* Header with Name, Designation, and Candidate Information */}
      <div className="p-3 border-b">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {candidate.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <p className="font-medium">{candidate.name}</p>
              <p className="text-xs text-muted-foreground">{candidate.currentPosition || candidate.experience}</p>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs truncate">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs">{candidate.phone}</span>
              </div>
            </div>

            {/* Candidate Metadata */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs">{candidate.experience} of experience</span>
              </div>
              {candidate.currentCompany && (
                <div className="flex items-center gap-2">
                  <Building className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs truncate">
                    {candidate.currentPosition} at {candidate.currentCompany}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3 bg-muted/20">
        {/* Agent Job Results */}
        <AgentJobResults candidate={candidate} />
      </div>
    </div>
  )
}

// Component for displaying a deployability factor (Suitability or Readiness)
function DeployabilityFactor({ 
  label, 
  score, 
  evidence 
}: { 
  label: string
  score: number
  evidence?: {
    source?: string
    matching?: string[]
    nonMatching?: string[]
  }
}) {
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded
  const hasEvidence = evidence && (evidence.matching || evidence.nonMatching)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getProgressColorClass = (score: number) => {
    if (score >= 80) return "[&>div>div]:bg-green-500"
    if (score >= 60) return "[&>div>div]:bg-amber-500"
    return "[&>div>div]:bg-red-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}:</span>
        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
          {score}/100
        </span>
      </div>
      <div className={getProgressColorClass(score)}>
        <Progress value={score} className="h-2" />
      </div>
      
      {/* Evidence Section */}
      {hasEvidence && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div
            className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="text-xs font-medium text-muted-foreground">Evidence</span>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          
          {isExpanded && evidence && (
            <div className="px-2 pb-2 pt-1 border-t bg-background/50">
              {/* Source */}
              {evidence.source && (
                <div className="mb-3 pb-2 border-b">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-medium text-muted-foreground">Source:</span>
                    <span className="text-muted-foreground">{evidence.source}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Matching Evidence */}
                {evidence.matching && Array.isArray(evidence.matching) && evidence.matching.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-xs font-semibold text-green-700">Matching Evidence</span>
                    </div>
                    <div className="pl-5">
                      <ul className="space-y-1.5">
                        {evidence.matching.map((item, idx) => (
                          <li key={idx} className="text-xs text-green-700 flex items-start gap-1.5">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Non-Matching Evidence */}
                {evidence.nonMatching && Array.isArray(evidence.nonMatching) && evidence.nonMatching.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <XCircle className="h-3.5 w-3.5 text-red-600" />
                      <span className="text-xs font-semibold text-red-700">Non-Matching Evidence</span>
                    </div>
                    <div className="pl-5">
                      <ul className="space-y-1.5">
                        {evidence.nonMatching.map((item, idx) => (
                          <li key={idx} className="text-xs text-red-700 flex items-start gap-1.5">
                            <span className="text-red-600 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
