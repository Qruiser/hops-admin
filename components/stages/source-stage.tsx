"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  RefreshCw,
  UserPlus,
  ArrowRight,
  Archive,
  MapPin,
  Briefcase,
  Filter,
  Linkedin,
  Globe,
  Database,
  List,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CandidateCard } from "../candidate-card"
import { CandidateScoringPanel } from "../candidate-scoring-panel"
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
    deployabilityScore: 92,
    confidence: 88,
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    matchedSkills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    experience: "5 years",
    location: "San Francisco, CA",
    lastActivity: "2023-05-15",
    status: "new",
    skillsMatch: 95,
    experienceMatch: 90,
    locationMatch: 85,
    potential: "high",
    currentPosition: "Senior Developer",
    currentCompany: "TechCorp",
    // Agent job results
    agentJobResults: [
      {
        id: "job-source-1",
        name: "Check Matching Skills",
        score: 92,
        threshold: 70,
        completed: true,
        passed: true,
        evidence: {
          type: "skills",
          source: "Resume & LinkedIn Profile",
          matching: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
          nonMatching: ["Vue.js", "Angular"],
        },
      },
      {
        id: "job-source-2",
        name: "Check Matching Frameworks",
        score: 88,
        threshold: 70,
        completed: true,
        passed: true,
        evidence: {
          type: "frameworks",
          source: "Resume & Portfolio Projects",
          matching: ["React", "Next.js", "Express", "Apollo GraphQL"],
          nonMatching: ["Vue.js", "Nuxt.js"],
        },
      },
      {
        id: "job-source-3",
        name: "Check Job Consistency",
        score: 75,
        threshold: 60,
        completed: true,
        passed: true,
        evidence: {
          type: "consistency",
          source: "Employment History Analysis",
          matching: [{ label: "Employment Pattern", value: "Stable - 5+ years with 2 companies" }],
          nonMatching: [{ label: "Gap Concern", value: "3-month gap in 2020" }],
        },
      },
      {
        id: "job-source-4",
        name: "Match Salary Range",
        score: 85,
        threshold: 80,
        completed: true,
        passed: true,
        evidence: {
          type: "salary",
          source: "Candidate Preferences & Job Spec",
          matching: [
            { label: "Expected", value: "$120,000" },
            { label: "Offered", value: "$115,000" },
            { label: "Range", value: "$110,000 - $130,000" },
          ],
        },
      },
      {
        id: "job-source-5",
        name: "Check Contract Openness",
        score: 90,
        threshold: 0,
        completed: true,
        passed: true,
        evidence: {
          type: "preferences",
          source: "Screening Questionnaire",
          matching: [
            { label: "Open to Contract", value: "Yes" },
            { label: "Preferred Duration", value: "6-12 months" },
          ],
          nonMatching: [
            { label: "Work Location", value: "Prefers remote (job requires hybrid)" },
          ],
        },
      },
    ],
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 987-6543",
    source: "internal",
    matchScore: 87,
    deployabilityScore: 87,
    confidence: 82,
    skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
    matchedSkills: ["React", "JavaScript", "CSS"],
    experience: "4 years",
    location: "New York, NY",
    lastActivity: "2023-05-14",
    status: "contacted",
    skillsMatch: 88,
    experienceMatch: 85,
    locationMatch: 90,
    potential: "medium",
    currentPosition: "Frontend Developer",
    currentCompany: "WebSolutions Inc.",
    // Agent job results
    agentJobResults: [
      {
        id: "job-source-6",
        name: "Check Matching Skills",
        score: 85,
        threshold: 70,
        completed: true,
        passed: true,
        evidence: {
          type: "skills",
          source: "Resume & LinkedIn Profile",
          matching: ["React", "JavaScript", "CSS"],
          nonMatching: ["TypeScript", "GraphQL", "Node.js"],
        },
      },
      {
        id: "job-source-7",
        name: "Check Matching Frameworks",
        score: 65,
        threshold: 70,
        completed: true,
        passed: false,
        evidence: {
          type: "frameworks",
          source: "Resume & Portfolio Projects",
          matching: ["React", "Redux"],
          nonMatching: ["Next.js", "GraphQL", "Express"],
        },
      },
      {
        id: "job-source-8",
        name: "Check Job Consistency",
        score: 0,
        threshold: 60,
        completed: false,
        passed: false,
      },
      {
        id: "job-source-9",
        name: "Match Salary Range",
        score: 82,
        threshold: 80,
        completed: true,
        passed: true,
        evidence: {
          type: "salary",
          source: "Candidate Preferences & Job Spec",
          matching: [
            { label: "Expected", value: "$110,000" },
            { label: "Offered", value: "$105,000" },
            { label: "Range", value: "$100,000 - $120,000" },
          ],
        },
      },
      {
        id: "job-source-10",
        name: "Check Contract Openness",
        score: 0,
        threshold: 0,
        completed: false,
        passed: false,
      },
    ],
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 456-7890",
    source: "website",
    matchScore: 78,
    deployabilityScore: 78,
    confidence: 72,
    skills: ["Angular", "TypeScript", "HTML", "CSS", "JavaScript"],
    matchedSkills: ["TypeScript", "HTML", "CSS"],
    experience: "3 years",
    location: "Chicago, IL",
    lastActivity: "2023-05-13",
    status: "new",
    skillsMatch: 75,
    experienceMatch: 80,
    locationMatch: 70,
    potential: "medium",
    currentPosition: "UI Developer",
    currentCompany: "Digital Agency",
  },
  {
    id: "4",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    phone: "+1 (555) 789-0123",
    source: "linkedin",
    matchScore: 95,
    deployabilityScore: 95,
    confidence: 92,
    skills: ["React", "Redux", "GraphQL", "Node.js", "Express"],
    matchedSkills: ["React", "Redux", "GraphQL", "Node.js", "Express"],
    experience: "6 years",
    location: "Austin, TX",
    lastActivity: "2023-05-12",
    status: "contacted",
    skillsMatch: 98,
    experienceMatch: 95,
    locationMatch: 92,
    potential: "high",
    currentPosition: "Lead Developer",
    currentCompany: "Tech Innovators",
  },
]

export function SourceStage() {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string>("all")
  
  // Agent settings configuration
  const [agentConfig, setAgentConfig] = useState<AgentSettingsConfig>({
    stage: "Sourcing",
    enabled: true,
    stageLevelAgents: [
      {
        id: "fetch-internal-db-1",
        name: "Fetch from Internal Database",
        enabled: true,
        type: "stage-level",
      },
    ],
    candidateLevelAgents: [
      {
        id: "check-matching-skills-1",
        name: "Check Matching Skills",
        enabled: true,
        type: "candidate-level",
        config: { threshold: 70 },
      },
      {
        id: "match-salary-range-1",
        name: "Match Salary Range",
        enabled: true,
        type: "candidate-level",
        config: { threshold: 80 },
      },
    ],
  })

  // Filter candidates based on selected source
  const filteredCandidates = useMemo(() => {
    if (selectedSource === "all") {
      return candidates
    }
    return candidates.filter((candidate) => {
      const sourceMap: Record<string, string> = {
        linkedin: "linkedin",
        "internal-db": "internal",
        website: "website",
      }
      return candidate.source === sourceMap[selectedSource]
    })
  }, [selectedSource])



  const handleSelectCandidate = (candidate: any) => {
    setSelectedCandidate(candidate)
    setIsPanelOpen(true)
  }

  const closePanel = () => {
    setIsPanelOpen(false)
  }

  const handleAgentUpdate = (config: AgentSettingsConfig) => {
    setAgentConfig(config)
  }

  const totalCandidates = filteredCandidates.length

  return (
    <div className="space-y-6">
      {/* Filters, Agent Settings, Total Candidates, and Sync */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4 text-muted-foreground" />
                  <span>All Sources</span>
                </div>
              </SelectItem>
              <SelectItem value="linkedin">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  <span>LinkedIn</span>
                </div>
              </SelectItem>
              <SelectItem value="internal-db">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-600" />
                  <span>Internal DB</span>
                </div>
              </SelectItem>
              <SelectItem value="website">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-orange-600" />
                  <span>Website</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{totalCandidates}</span> total candidates
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <RefreshCw className="h-3 w-3" />
            Sync
          </Button>
          <AgentSettings config={agentConfig} onUpdate={handleAgentUpdate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} onClick={() => handleSelectCandidate(candidate)} className="cursor-pointer">
            <CandidateCard candidate={candidate} />
          </div>
        ))}
      </div>

      {/* Sliding Panel */}
      <CandidateScoringPanel
        candidate={selectedCandidate}
        title="Candidate Scoring"
        isOpen={isPanelOpen}
        onClose={closePanel}
      >
        {/* Stage-specific content */}
      </CandidateScoringPanel>
    </div>
  )
}
