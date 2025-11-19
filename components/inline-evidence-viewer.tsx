"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Linkedin, Briefcase, FileCheck, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InlineEvidenceViewerProps {
  evidence: {
    source?: string
    matching?: string[] | { label: string; value: string }[]
    nonMatching?: string[] | { label: string; value: string }[]
  }
  candidate: any
  onClose: () => void
}

// Function to parse source string into individual sources
function parseSources(sourceString: string): string[] {
  if (!sourceString) return []
  
  const sources = sourceString
    .split(/[&,]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  
  const expandedSources: string[] = []
  sources.forEach(source => {
    if (source.toLowerCase().includes(" and ")) {
      expandedSources.push(...source.split(/ and /i).map(s => s.trim()).filter(s => s.length > 0))
    } else {
      expandedSources.push(source)
    }
  })
  
  return expandedSources
}

function normalizeSourceName(source: string): string {
  return source.toLowerCase().trim()
}

// Resume Viewer Component
function ResumeViewer({ candidate }: { candidate: any }) {
  const resumeUrl = candidate.resumeUrl || candidate.documents?.resume
  
  const renderSampleResume = () => (
    <div className="h-full overflow-auto bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{candidate.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {candidate.email && <span>📧 {candidate.email}</span>}
            {candidate.phone && <span>📱 {candidate.phone}</span>}
            {candidate.location && <span>📍 {candidate.location}</span>}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {candidate.experience && `${candidate.experience} of experience`} 
            {candidate.skills && candidate.skills.length > 0 && ` in ${candidate.skills.slice(0, 3).join(", ")}`}.
            {candidate.currentCompany && ` Currently working as ${candidate.currentPosition || "Developer"} at ${candidate.currentCompany}.`}
            {" Experienced in building scalable web applications and working with modern technologies."}
          </p>
        </div>
        
        {candidate.currentCompany && candidate.currentPosition && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Experience</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{candidate.currentPosition}</h3>
                    <p className="text-sm text-gray-700">{candidate.currentCompany}</p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {candidate.experience || "Present"}
                  </span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 ml-4 space-y-1">
                  <li>Developed and maintained web applications using modern frameworks</li>
                  <li>Collaborated with cross-functional teams to deliver high-quality software</li>
                  <li>Implemented best practices for code quality and performance optimization</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Technical Skills</h2>
            <div className="grid grid-cols-2 gap-2">
              {candidate.skills.map((skill: string, idx: number) => (
                <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Resume</h3>
        </div>
        {resumeUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(resumeUrl, "_blank")}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open PDF
          </Button>
        )}
      </div>
      <div className="flex-1 border rounded-lg overflow-hidden bg-white">
        {renderSampleResume()}
      </div>
    </div>
  )
}

// LinkedIn Profile Viewer Component
function LinkedInViewer({ candidate }: { candidate: any }) {
  const linkedInUrl = candidate.linkedInUrl || candidate.linkedinUrl || `https://www.linkedin.com/in/${candidate.name.toLowerCase().replace(/\s+/g, "-")}`
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-[#0077b5]" />
          <h3 className="font-semibold">LinkedIn Profile</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(linkedInUrl, "_blank")}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View on LinkedIn
        </Button>
      </div>
      <div className="flex-1 border rounded-lg overflow-auto bg-white">
        <div className="h-full">
          <div className="h-24 bg-gradient-to-r from-[#0077b5] to-[#00a0dc] relative">
            <div className="absolute bottom-0 left-4 transform translate-y-1/2">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {candidate.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 px-4 pb-4 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
              <p className="text-base text-gray-700 mt-1">
                {candidate.currentPosition || "Software Developer"}
                {candidate.currentCompany && ` at ${candidate.currentCompany}`}
              </p>
              {candidate.location && (
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <span>📍</span>
                  {candidate.location}
                </p>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {candidate.experience && `${candidate.experience} of experience`} 
                {candidate.skills && candidate.skills.length > 0 && ` in ${candidate.skills.slice(0, 3).join(", ")}`}.
                {candidate.currentCompany && ` Currently working at ${candidate.currentCompany} as a ${candidate.currentPosition || "developer"}.`}
                {" Passionate about building scalable applications and solving complex problems."}
              </p>
            </div>
            
            {candidate.currentCompany && candidate.currentPosition && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{candidate.currentPosition}</h4>
                        <p className="text-sm text-gray-700">{candidate.currentCompany}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {candidate.experience && `${candidate.experience} • `}Full-time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-[#0077b5] rounded-full text-sm font-medium border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Portfolio Projects Viewer Component
function PortfolioViewer({ candidate }: { candidate: any }) {
  const portfolioUrl = candidate.portfolioUrl || candidate.portfolio || `https://${candidate.name.toLowerCase().replace(/\s+/g, "")}.portfolio.com`
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Portfolio Projects</h3>
        </div>
        {portfolioUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(portfolioUrl, "_blank")}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Portfolio
          </Button>
        )}
      </div>
      <div className="flex-1 border rounded-lg overflow-hidden bg-white p-4">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Portfolio projects showcase the candidate's work and technical capabilities.
          </p>
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Employment History Viewer Component
function EmploymentHistoryViewer({ candidate }: { candidate: any }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Employment History</h3>
      </div>
      <div className="flex-1 border rounded-lg overflow-auto bg-white p-4">
        <div className="space-y-4">
          {candidate.currentCompany && candidate.currentPosition && (
            <div className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{candidate.currentPosition}</h4>
                  <p className="text-muted-foreground">{candidate.currentCompany}</p>
                </div>
                <span className="text-sm text-muted-foreground">Current</span>
              </div>
            </div>
          )}
          
          {candidate.experience && (
            <div>
              <h4 className="font-semibold mb-2">Total Experience</h4>
              <p className="text-muted-foreground">{candidate.experience}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Generic Source Viewer Component
function GenericSourceViewer({ source, candidate, evidence }: { source: string; candidate: any; evidence: any }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">{source}</h3>
      </div>
      <div className="flex-1 border rounded-lg overflow-auto bg-white p-4">
        <div className="space-y-4">
          {evidence.matching && Array.isArray(evidence.matching) && evidence.matching.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Matching Evidence</h4>
              <ul className="space-y-2">
                {evidence.matching.map((item: any, idx: number) => (
                  <li key={idx} className="text-sm">
                    {typeof item === "string" ? (
                      <span className="text-green-700">• {item}</span>
                    ) : (
                      <div className="flex items-start justify-between">
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="text-green-700 font-medium">{item.value}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {evidence.nonMatching && Array.isArray(evidence.nonMatching) && evidence.nonMatching.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-700 mb-2">Non-Matching Evidence</h4>
              <ul className="space-y-2">
                {evidence.nonMatching.map((item: any, idx: number) => (
                  <li key={idx} className="text-sm">
                    {typeof item === "string" ? (
                      <span className="text-red-700">• {item}</span>
                    ) : (
                      <div className="flex items-start justify-between">
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="text-red-700 font-medium">{item.value}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function InlineEvidenceViewer({ evidence, candidate, onClose }: InlineEvidenceViewerProps) {
  const sources = parseSources(evidence.source || "")
  
  if (sources.length === 0) {
    return null
  }

  return (
    <div className="h-full flex flex-col border-l bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0 bg-background">
        <h3 className="font-semibold">Evidence Sources</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
        <Tabs defaultValue={sources[0]} className="h-full flex flex-col">
          <TabsList className={`grid w-full mb-4 flex-shrink-0 ${sources.length > 3 ? "grid-cols-2" : ""}`} style={sources.length <= 3 ? { gridTemplateColumns: `repeat(${sources.length}, minmax(0, 1fr))` } : undefined}>
            {sources.map((source) => (
              <TabsTrigger key={source} value={source} className="text-xs truncate">
                {source.length > 15 ? `${source.substring(0, 15)}...` : source}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex-1 overflow-hidden min-h-0">
            {sources.map((source) => {
              const normalizedSource = normalizeSourceName(source)
              
              return (
                <TabsContent key={source} value={source} className="h-full mt-0 overflow-hidden m-0">
                  {normalizedSource.includes("resume") ? (
                    <ResumeViewer candidate={candidate} />
                  ) : normalizedSource.includes("linkedin") ? (
                    <LinkedInViewer candidate={candidate} />
                  ) : normalizedSource.includes("portfolio") ? (
                    <PortfolioViewer candidate={candidate} />
                  ) : normalizedSource.includes("employment") || normalizedSource.includes("history") ? (
                    <EmploymentHistoryViewer candidate={candidate} />
                  ) : (
                    <GenericSourceViewer source={source} candidate={candidate} evidence={evidence} />
                  )}
                </TabsContent>
              )
            })}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

