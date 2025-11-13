"use client"

import { Mail, Phone, Building, Briefcase, TrendingUp } from "lucide-react"
import { AgentJobResults } from "./agent-job-results"

interface CandidateInfoPanelProps {
  candidate: any
}

export function CandidateInfoPanel({ candidate }: CandidateInfoPanelProps) {
  return (
    <div className="border rounded-md mb-4">
      {/* Deployability Score - At the top */}
      <div className="p-4 border-b bg-muted/20">
        <div className="border rounded-md p-3 bg-background">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <span className="text-xl font-bold text-green-600">
                {candidate.deployabilityScore ?? candidate.matchScore ?? 0}
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
