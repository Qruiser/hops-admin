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
  onEvidenceClick?: (evidence: any) => void
}

export function AgentJobResults({ candidate, onEvidenceClick }: AgentJobResultsProps) {
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

  const completedCount = jobResults.filter(j => j.completed).length
  const totalCount = jobResults.length
  const passedCount = jobResults.filter(j => j.completed && j.passed).length
  
  return (
    <div className="space-y-4">
      {/* Header - Common Region Principle */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-200 rounded-lg">
            <h4 className="text-sm font-bold text-slate-800">Agent Job Results</h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white rounded-md border-2 border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700">
              {completedCount}/{totalCount} Completed
            </span>
          </div>
          {passedCount > 0 && (
            <div className="px-3 py-1.5 bg-emerald-100 rounded-md border-2 border-emerald-300 shadow-sm">
              <span className="text-xs font-bold text-emerald-700">
                {passedCount} Passed
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Job Items - Proximity & Similarity Principles */}
      <div className="space-y-3">
        {jobResults.map((job) => (
          <JobResultItem key={job.id} job={job} candidate={candidate} onEvidenceClick={onEvidenceClick} />
        ))}
      </div>
    </div>
  )
}

function JobResultItem({ job, candidate, onEvidenceClick }: { job: AgentJobResult; candidate: any; onEvidenceClick?: (evidence: any) => void }) {
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded
  const hasEvidence = job.evidence && job.completed
  const hasSource = job.evidence?.source && job.evidence.source.trim().length > 0

  // Color psychology: Green = success, Red = failure, Amber = pending
  const getJobTheme = () => {
    if (!job.completed) {
      return {
        border: "border-2 border-amber-300",
        bg: "bg-gradient-to-br from-amber-50 to-orange-50",
        headerBg: "bg-amber-100/60",
        iconBg: "bg-amber-200",
        iconColor: "text-amber-700",
        scoreBg: "bg-amber-100",
        scoreText: "text-amber-800",
        badgeBg: "bg-amber-200",
        badgeText: "text-amber-800",
        badgeBorder: "border-amber-300"
      }
    }
    if (job.passed) {
      return {
        border: "border-2 border-emerald-300",
        bg: "bg-gradient-to-br from-emerald-50 to-green-50",
        headerBg: "bg-emerald-100/60",
        iconBg: "bg-emerald-200",
        iconColor: "text-emerald-700",
        scoreBg: "bg-emerald-100",
        scoreText: "text-emerald-800",
        badgeBg: "bg-emerald-200",
        badgeText: "text-emerald-800",
        badgeBorder: "border-emerald-300"
      }
    }
    return {
      border: "border-2 border-red-300",
      bg: "bg-gradient-to-br from-red-50 to-rose-50",
      headerBg: "bg-red-100/60",
      iconBg: "bg-red-200",
      iconColor: "text-red-700",
      scoreBg: "bg-red-100",
      scoreText: "text-red-800",
      badgeBg: "bg-red-200",
      badgeText: "text-red-800",
      badgeBorder: "border-red-300"
    }
  }

  const theme = getJobTheme()

  return (
    <div className={`${theme.border} ${theme.bg} rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg`}>
      {/* Header Section - Figure/Ground Principle */}
      <div
        className={`flex items-center justify-between gap-3 py-3.5 px-4 ${theme.headerBg} border-b-2 ${theme.border} ${
          hasEvidence ? "cursor-pointer hover:opacity-90 transition-all" : ""
        }`}
        onClick={() => hasEvidence && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Status Icon - Figure/Ground */}
          {job.completed ? (
            job.passed ? (
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center shadow-sm ring-2 ring-white`}>
                <CheckCircle2 className={`h-5 w-5 ${theme.iconColor}`} />
              </div>
            ) : (
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center shadow-sm ring-2 ring-white`}>
                <XCircle className={`h-5 w-5 ${theme.iconColor}`} />
              </div>
            )
          ) : (
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center shadow-sm ring-2 ring-white`}>
              <AlertCircle className={`h-5 w-5 ${theme.iconColor}`} />
            </div>
          )}
          <span className="text-sm font-bold text-slate-800">{job.name}</span>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          {job.completed ? (
            <div className={`flex items-baseline gap-2 px-3 py-1.5 rounded-lg ${theme.scoreBg} border-2 ${theme.badgeBorder} shadow-sm`}>
              <span className={`text-sm font-black ${theme.scoreText}`}>
                {job.score}%
              </span>
              {job.threshold > 0 && (
                <>
                  <span className={`text-xs ${theme.scoreText} font-semibold opacity-60`}>/</span>
                  <span className={`text-xs ${theme.scoreText} font-semibold opacity-60`}>{job.threshold}%</span>
                </>
              )}
            </div>
          ) : (
            <div className={`px-3 py-1.5 rounded-lg ${theme.badgeBg} border-2 ${theme.badgeBorder} shadow-sm`}>
              <span className={`text-xs font-bold ${theme.badgeText} uppercase tracking-wide`}>
                Pending
              </span>
            </div>
          )}
          {hasEvidence && (
            <div className={`p-1.5 rounded-md ${theme.iconBg}`}>
              {isExpanded ? (
                <ChevronUp className={`h-4 w-4 ${theme.iconColor}`} />
              ) : (
                <ChevronDown className={`h-4 w-4 ${theme.iconColor}`} />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Evidence Section - Common Region & Closure Principles */}
      {isExpanded && job.evidence && (
        <div className="px-4 pb-4 pt-3 bg-white">
          {/* Source - Figure/Ground Principle */}
          {job.evidence.source && (
            <div 
              className={`mb-4 pb-3 border-b-2 border-slate-200 ${hasSource ? "cursor-pointer hover:bg-blue-50/60 transition-all rounded-lg px-3 py-2.5 -mx-3" : ""}`}
              onClick={() => hasSource && onEvidenceClick && onEvidenceClick(job.evidence)}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Source</span>
                </div>
                <span className={`text-sm font-semibold text-slate-800 flex-1 ${hasSource ? "underline decoration-2 decoration-blue-400 decoration-dotted" : ""}`}>
                  {job.evidence.source}
                </span>
                {hasSource && (
                  <span className="text-xs text-blue-600 font-bold ml-auto flex items-center gap-1">
                    View <span className="text-blue-500">→</span>
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Matching Evidence - Green Psychology (Success) */}
            {job.evidence.matching && Array.isArray(job.evidence.matching) && job.evidence.matching.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Matching Evidence</span>
                </div>
                <div className="pl-2">
                  {(job.evidence.type === "skills" || job.evidence.type === "frameworks") && typeof job.evidence.matching[0] === "string" && (
                    <div className="flex flex-wrap gap-2">
                      {(job.evidence.matching as string[]).map((item, idx) => (
                        <Badge key={idx} className="text-xs bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-bold px-3 py-1 shadow-sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {typeof job.evidence.matching[0] === "object" && (
                    <div className="space-y-2.5">
                      {(job.evidence.matching as { label: string; value: string }[]).map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4 p-2.5 bg-white/60 rounded-md border border-emerald-200">
                          <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                          <span className="font-bold text-emerald-800 text-right max-w-[60%] text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Non-Matching Evidence - Red Psychology (Warning) */}
            {job.evidence.nonMatching && Array.isArray(job.evidence.nonMatching) && job.evidence.nonMatching.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                  </div>
                  <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Non-Matching Evidence</span>
                </div>
                <div className="pl-2">
                  {(job.evidence.type === "skills" || job.evidence.type === "frameworks") && typeof job.evidence.nonMatching[0] === "string" && (
                    <div className="flex flex-wrap gap-2">
                      {(job.evidence.nonMatching as string[]).map((item, idx) => (
                        <Badge key={idx} className="text-xs bg-red-100 text-red-800 border-2 border-red-300 font-bold px-3 py-1 shadow-sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {typeof job.evidence.nonMatching[0] === "object" && (
                    <div className="space-y-2.5">
                      {(job.evidence.nonMatching as { label: string; value: string }[]).map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4 p-2.5 bg-white/60 rounded-md border border-red-200">
                          <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                          <span className="font-bold text-red-800 text-right max-w-[60%] text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fallback to old data format for backward compatibility */}
            {!job.evidence.matching && !job.evidence.nonMatching && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Evidence</div>
                {job.evidence.type === "skills" && Array.isArray(job.evidence.data) && (
                  <div className="flex flex-wrap gap-2">
                    {(job.evidence.data as string[]).map((skill, idx) => (
                      <Badge key={idx} className="text-xs bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-bold px-3 py-1 shadow-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                {job.evidence.type === "frameworks" && Array.isArray(job.evidence.data) && (
                  <div className="flex flex-wrap gap-2">
                    {(job.evidence.data as string[]).map((framework, idx) => (
                      <Badge key={idx} className="text-xs bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold px-3 py-1 shadow-sm">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                )}
                {job.evidence.type === "salary" && Array.isArray(job.evidence.data) && (
                  <div className="space-y-2">
                    {(job.evidence.data as { label: string; value: string }[]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-md border border-slate-200">
                        <span className="text-xs font-semibold text-slate-700">{item.label}:</span>
                        <span className="font-bold text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {job.evidence.type === "consistency" && typeof job.evidence.data === "string" && (
                  <p className="text-sm text-slate-700 leading-relaxed p-3 bg-white rounded-md border border-slate-200">{job.evidence.data}</p>
                )}
                {job.evidence.type === "preferences" && Array.isArray(job.evidence.data) && (
                  <div className="space-y-2">
                    {(job.evidence.data as { label: string; value: string }[]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-md border border-slate-200">
                        <span className="text-xs font-semibold text-slate-700">{item.label}:</span>
                        <span className="font-bold text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {job.evidence.type === "text" && typeof job.evidence.data === "string" && (
                  <p className="text-sm text-slate-700 leading-relaxed p-3 bg-white rounded-md border border-slate-200">{job.evidence.data}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

