"use client"

import { useState } from "react"
import { Mail, Phone, Building, Briefcase, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AgentJobResults } from "./agent-job-results"
import { InlineEvidenceViewer } from "./inline-evidence-viewer"

interface CandidateInfoPanelProps {
  candidate: any
}

export function CandidateInfoPanel({ candidate }: CandidateInfoPanelProps) {
  const [openEvidenceViewer, setOpenEvidenceViewer] = useState<{
    evidence: any
    type: 'suitability' | 'readiness' | 'agent-job'
  } | null>(null)

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
    <div className={`border-2 border-slate-200 rounded-xl mb-4 bg-white flex transition-all duration-300 shadow-lg ${openEvidenceViewer ? 'flex-row' : 'flex-col'}`}>
      <div className={`flex flex-col flex-1 ${openEvidenceViewer ? 'flex-shrink-0 min-w-[400px]' : ''}`}>
        {/* Candidate Profile Section - Top Position (Blue = Trust, Professional) */}
        <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40">
          {/* Header with Avatar and Name - Figure/Ground Principle */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b-2 border-slate-200">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg ring-4 ring-blue-100/50">
              <span className="text-2xl font-black text-white">{candidate.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-slate-900 mb-1">{candidate.name}</h3>
              <p className="text-sm font-semibold text-slate-600">{candidate.currentPosition || candidate.experience}</p>
            </div>
          </div>
          
          {/* Information Cards Grid - Common Region & Similarity Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email Card */}
            <div className="group bg-white border-2 border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 text-blue-700 flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Email</div>
                  <div className="text-sm font-semibold text-slate-800 truncate">{candidate.email}</div>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group bg-white border-2 border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5 text-blue-700 flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Phone</div>
                  <div className="text-sm font-semibold text-slate-800">{candidate.phone}</div>
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className="group bg-white border-2 border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Briefcase className="h-5 w-5 text-indigo-700 flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Experience</div>
                  <div className="text-sm font-semibold text-slate-800">{candidate.experience} of experience</div>
                </div>
              </div>
            </div>

            {/* Company Card */}
            {candidate.currentCompany && (
              <div className="group bg-white border-2 border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Building className="h-5 w-5 text-indigo-700 flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Current Role</div>
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {candidate.currentPosition} at {candidate.currentCompany}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Deployability Score Section - Prominent Card (Green = Success, Positive) */}
        <div className="p-6 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 border-b-2 border-slate-100">
          <div className="bg-white rounded-xl border-2 border-emerald-100 shadow-md p-5">
            {/* Main Score Display - Figure/Ground Principle */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full shadow-lg ring-4 ${
                deployabilityScore >= 80 ? "bg-gradient-to-br from-emerald-400 to-green-500 ring-emerald-100" :
                deployabilityScore >= 60 ? "bg-gradient-to-br from-amber-400 to-orange-500 ring-amber-100" :
                "bg-gradient-to-br from-red-400 to-rose-500 ring-red-100"
              }`}>
                <span className={`text-3xl font-black ${
                  deployabilityScore >= 80 ? "text-white" :
                  deployabilityScore >= 60 ? "text-white" : "text-white"
                }`}>
                  {deployabilityScore}
                  <span className="text-lg font-semibold opacity-90">/100</span>
                </span>
              </div>
              <p className="mt-4 text-base font-bold text-slate-800">Deployability Score</p>
              {candidate.confidence && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className={`p-1.5 rounded-md ${
                    candidate.confidence >= 80 ? "bg-emerald-100" :
                    candidate.confidence >= 60 ? "bg-amber-100" : "bg-red-100"
                  }`}>
                    <TrendingUp className={`h-4 w-4 ${
                      candidate.confidence >= 80 ? "text-emerald-700" :
                      candidate.confidence >= 60 ? "text-amber-700" : "text-red-700"
                    }`} />
                  </div>
                  <span className={`text-sm font-bold ${
                    candidate.confidence >= 80 ? "text-emerald-700" :
                    candidate.confidence >= 60 ? "text-amber-700" : "text-red-700"
                  }`}>
                    {candidate.confidence}% confidence
                  </span>
                </div>
              )}
            </div>

            {/* Suitability and Readiness Breakdown - Continuity Principle */}
            <div className="space-y-5 pt-5 border-t-2 border-slate-200">
              <DeployabilityFactor
                label="Suitability"
                score={suitabilityScore}
                evidence={suitabilityEvidence}
                candidate={candidate}
                onEvidenceClick={(evidence) => setOpenEvidenceViewer({ evidence, type: 'suitability' })}
              />

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

              <DeployabilityFactor
                label="Readiness"
                score={readinessScore}
                evidence={readinessEvidence}
                candidate={candidate}
                onEvidenceClick={(evidence) => setOpenEvidenceViewer({ evidence, type: 'readiness' })}
              />
            </div>
          </div>
        </div>

        {/* Agent Job Results Section - Common Region Principle */}
        <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border-t-2 border-slate-200">
          <AgentJobResults candidate={candidate} onEvidenceClick={(evidence) => setOpenEvidenceViewer({ evidence, type: 'agent-job' })} />
        </div>
      </div>
      
      {/* Inline Evidence Viewer - Sticky */}
      {openEvidenceViewer && (
        <div className="w-[600px] flex-shrink-0 sticky top-0 self-start h-[calc(100vh-8rem)]">
          <InlineEvidenceViewer
            evidence={openEvidenceViewer.evidence}
            candidate={candidate}
            onClose={() => setOpenEvidenceViewer(null)}
          />
        </div>
      )}
    </div>
  )
}

// Component for displaying a deployability factor (Suitability or Readiness)
function DeployabilityFactor({ 
  label, 
  score, 
  evidence,
  candidate,
  onEvidenceClick
}: { 
  label: string
  score: number
  evidence?: {
    source?: string
    matching?: string[]
    nonMatching?: string[]
  }
  candidate: any
  onEvidenceClick?: (evidence: any) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded
  const hasEvidence = evidence && (evidence.matching || evidence.nonMatching)
  const hasSource = evidence?.source && evidence.source.trim().length > 0

  // Color psychology: Green = success, Amber = caution, Red = warning
  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        progress: "[&>div>div]:bg-emerald-500"
      }
    }
    if (score >= 60) {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        progress: "[&>div>div]:bg-amber-500"
      }
    }
    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      progress: "[&>div>div]:bg-red-500"
    }
  }

  const theme = getScoreTheme(score)

  return (
    <div className="space-y-4">
      {/* Score Header - Proximity & Similarity Principles */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
        <span className="text-sm font-bold text-slate-800">{label}</span>
        <div className={`px-3 py-1 rounded-md ${theme.bg} ${theme.border} border-2`}>
          <span className={`text-sm font-black ${theme.text}`}>
            {score}/100
          </span>
        </div>
      </div>
      
      {/* Progress Bar - Continuity Principle */}
      <div className={theme.progress}>
        <Progress value={score} className="h-3 rounded-full" />
      </div>
      
      {/* Evidence Section - Common Region & Closure Principles */}
      {hasEvidence && (
        <div className={`mt-4 border-2 ${theme.border} rounded-xl overflow-hidden bg-white shadow-sm`}>
          <div
            className={`flex items-center justify-between px-4 py-3 cursor-pointer ${theme.bg} hover:opacity-90 transition-all border-b-2 ${theme.border}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-md ${theme.iconBg}`}>
                <CheckCircle2 className={`h-4 w-4 ${theme.iconColor}`} />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Evidence</span>
            </div>
            {isExpanded ? (
              <ChevronUp className={`h-4 w-4 ${theme.text}`} />
            ) : (
              <ChevronDown className={`h-4 w-4 ${theme.text}`} />
            )}
          </div>
          
          {isExpanded && evidence && (
            <div className="p-4 bg-white space-y-5">
              {/* Source - Figure/Ground Principle */}
              {evidence.source && (
                <div 
                  className={`pb-4 border-b-2 border-slate-200 ${hasSource ? "cursor-pointer hover:bg-blue-50/50 transition-all rounded-lg px-3 py-3 -mx-3" : ""}`}
                  onClick={() => hasSource && onEvidenceClick && onEvidenceClick(evidence)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-md">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Source</span>
                    </div>
                    <span className={`text-sm font-semibold text-slate-800 flex-1 ${hasSource ? "underline decoration-2 decoration-blue-400 decoration-dotted" : ""}`}>
                      {evidence.source}
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
                {evidence.matching && Array.isArray(evidence.matching) && evidence.matching.length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                      </div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Matching Evidence</span>
                    </div>
                    <ul className="space-y-2 pl-2">
                      {evidence.matching.map((item, idx) => (
                        <li key={idx} className="text-sm text-emerald-900 flex items-start gap-3 font-medium">
                          <span className="text-emerald-600 mt-1 font-black text-lg leading-none">✓</span>
                          <span className="leading-relaxed flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Non-Matching Evidence - Red Psychology (Warning) */}
                {evidence.nonMatching && Array.isArray(evidence.nonMatching) && evidence.nonMatching.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <XCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                      </div>
                      <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Non-Matching Evidence</span>
                    </div>
                    <ul className="space-y-2 pl-2">
                      {evidence.nonMatching.map((item, idx) => (
                        <li key={idx} className="text-sm text-red-900 flex items-start gap-3 font-medium">
                          <span className="text-red-600 mt-1 font-black text-lg leading-none">✗</span>
                          <span className="leading-relaxed flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
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
