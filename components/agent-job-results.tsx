"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AgentJobResult {
  id: string
  name: string
  score: number
  threshold: number
  completed: boolean
  passed?: boolean
  evidence?: {
    type: "skills" | "frameworks" | "salary" | "consistency" | "preferences" | "text"
    data?: string[] | { label: string; value: string }[] | string
    source?: string
    matching?: string[] | { label: string; value: string }[]
    nonMatching?: string[] | { label: string; value: string }[]
  }
}

interface AgentJobResultsProps {
  candidate: any
}

export function AgentJobResults({ candidate }: AgentJobResultsProps) {
  // Function to get agent job status based on candidate stage
  const getAgentJobResults = (): AgentJobResult[] => {
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

    // Define agents for each stage with default thresholds
    const stageAgentsConfig: Record<string, Array<{ name: string; threshold: number }>> = {
      Sourcing: [
        { name: "Check Matching Skills", threshold: 70 },
        { name: "Check Matching Frameworks", threshold: 70 },
        { name: "Check Job Consistency", threshold: 60 },
        { name: "Match Salary Range", threshold: 80 },
        { name: "Check Contract Openness", threshold: 0 }, // Binary check
      ],
      Screening: [
        { name: "Check Job Consistency", threshold: 60 },
        { name: "Check Salary Match", threshold: 80 },
        { name: "Check Contract Openness", threshold: 0 }, // Binary check
      ],
      Match: [
        { name: "Check Candidate Interest", threshold: 70 },
        { name: "Check Preferences Match", threshold: 75 },
        { name: "Check Within Budget", threshold: 80 },
        { name: "Check Skill Level Match", threshold: 75 },
      ],
      Recommend: [],
      Deploy: [],
    }

    const agentsConfig = stageAgentsConfig[stage] || []

    // If candidate has agent job results, use them; otherwise generate defaults
    if (candidate.agentJobResults && Array.isArray(candidate.agentJobResults)) {
      return candidate.agentJobResults.map((result: any) => ({
        id: result.id || `job-${result.name}`,
        name: result.name,
        score: result.score ?? 0,
        threshold: result.threshold ?? 70,
        completed: result.completed ?? false,
        passed: result.passed ?? (result.score >= (result.threshold ?? 70)),
        evidence: result.evidence,
      }))
    }

    // Generate default results for demo purposes
    return agentsConfig.map((agent, index) => {
      // Simulate scores - some pass, some fail
      const baseScore = 65 + Math.random() * 30 // Random score between 65-95
      const score = Math.round(baseScore)
      const threshold = agent.threshold
      const passed = threshold === 0 ? score > 50 : score >= threshold
      
      return {
        id: `job-${stage}-${index}`,
        name: agent.name,
        score,
        threshold,
        completed: true,
        passed,
      }
    })
  }

  const jobResults = getAgentJobResults()

  if (jobResults.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 border-t pt-4 mt-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-foreground">Agent Job Results</h4>
        <Badge variant="outline" className="text-xs">
          {jobResults.filter(j => j.completed).length}/{jobResults.length}
        </Badge>
      </div>
      <div className="space-y-2.5">
        {jobResults.map((job) => (
          <JobResultItem key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function JobResultItem({ job }: { job: AgentJobResult }) {
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded
  const hasEvidence = job.evidence && job.completed

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${
      job.completed 
        ? job.passed 
          ? "border-green-200 bg-green-50/30" 
          : "border-red-200 bg-red-50/30"
        : "border-amber-200 bg-amber-50/30"
    }`}>
      {/* Header Section */}
      <div
        className={`flex items-center justify-between gap-3 py-2.5 px-3 ${
          hasEvidence ? "cursor-pointer hover:bg-black/5 transition-colors" : ""
        }`}
        onClick={() => hasEvidence && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {job.completed ? (
            job.passed ? (
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-3.5 w-3.5 text-red-600" />
              </div>
            )
          ) : (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            </div>
          )}
          <span className="text-sm font-medium text-foreground">{job.name}</span>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          {job.completed ? (
            <div className={`flex items-baseline gap-1.5 px-2 py-1 rounded-md ${
              job.passed 
                ? "bg-green-100/50" 
                : "bg-red-100/50"
            }`}>
              <span className={`text-sm font-semibold ${
                job.passed ? "text-green-700" : "text-red-700"
              }`}>
                {job.score}%
              </span>
              {job.threshold > 0 && (
                <>
                  <span className="text-xs text-muted-foreground font-normal">/</span>
                  <span className="text-xs text-muted-foreground font-normal">{job.threshold}%</span>
                </>
              )}
            </div>
          ) : (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              Pending
            </Badge>
          )}
          {hasEvidence && (
            <div className="text-muted-foreground">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Evidence Section */}
      {isExpanded && job.evidence && (
        <div className="px-3 pb-3 pt-2 border-t bg-background/50">
          {/* Source */}
          {job.evidence.source && (
            <div className="mb-3 pb-2 border-b">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-muted-foreground">Source:</span>
                <span className="text-muted-foreground">{job.evidence.source}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {/* Matching Evidence */}
            {job.evidence.matching && Array.isArray(job.evidence.matching) && job.evidence.matching.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Matching Evidence</span>
                </div>
                <div className="pl-5">
                  {(job.evidence.type === "skills" || job.evidence.type === "frameworks") && typeof job.evidence.matching[0] === "string" && (
                    <div className="flex flex-wrap gap-1.5">
                      {(job.evidence.matching as string[]).map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200 font-medium">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {typeof job.evidence.matching[0] === "object" && (
                    <div className="space-y-1.5">
                      {(job.evidence.matching as { label: string; value: string }[]).map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                          <span className="text-muted-foreground font-medium">{item.label}</span>
                          <span className="font-semibold text-green-700 text-right max-w-[60%]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Non-Matching Evidence */}
            {job.evidence.nonMatching && Array.isArray(job.evidence.nonMatching) && job.evidence.nonMatching.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <XCircle className="h-3.5 w-3.5 text-red-600" />
                  <span className="text-xs font-semibold text-red-700">Non-Matching Evidence</span>
                </div>
                <div className="pl-5">
                  {(job.evidence.type === "skills" || job.evidence.type === "frameworks") && typeof job.evidence.nonMatching[0] === "string" && (
                    <div className="flex flex-wrap gap-1.5">
                      {(job.evidence.nonMatching as string[]).map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200 font-medium">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {typeof job.evidence.nonMatching[0] === "object" && (
                    <div className="space-y-1.5">
                      {(job.evidence.nonMatching as { label: string; value: string }[]).map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                          <span className="text-muted-foreground font-medium">{item.label}</span>
                          <span className="font-semibold text-red-700 text-right max-w-[60%]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fallback to old data format for backward compatibility */}
            {!job.evidence.matching && !job.evidence.nonMatching && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Evidence</div>
                {job.evidence.type === "skills" && Array.isArray(job.evidence.data) && (
                  <div className="flex flex-wrap gap-1.5">
                    {(job.evidence.data as string[]).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                {job.evidence.type === "frameworks" && Array.isArray(job.evidence.data) && (
                  <div className="flex flex-wrap gap-1.5">
                    {(job.evidence.data as string[]).map((framework, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                )}
                {job.evidence.type === "salary" && Array.isArray(job.evidence.data) && (
                  <div className="space-y-1.5">
                    {(job.evidence.data as { label: string; value: string }[]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {job.evidence.type === "consistency" && typeof job.evidence.data === "string" && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{job.evidence.data}</p>
                )}
                {job.evidence.type === "preferences" && Array.isArray(job.evidence.data) && (
                  <div className="space-y-1.5">
                    {(job.evidence.data as { label: string; value: string }[]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {job.evidence.type === "text" && typeof job.evidence.data === "string" && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{job.evidence.data}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

