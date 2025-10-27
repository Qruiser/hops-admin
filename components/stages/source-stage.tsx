"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Linkedin,
  Globe,
  Database,
  RefreshCw,
  UserPlus,
  ArrowRight,
  Archive,
  MapPin,
  Briefcase,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CandidateCard } from "../candidate-card"
import { CandidateScoringPanel } from "../candidate-scoring-panel"

// Sample candidates data
const candidates = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    source: "linkedin",
    matchScore: 92,
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
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 987-6543",
    source: "internal",
    matchScore: 87,
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
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 456-7890",
    source: "website",
    matchScore: 78,
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

  const handleSelectCandidate = (candidate: any) => {
    setSelectedCandidate(candidate)
    setIsPanelOpen(true)
  }

  const closePanel = () => {
    setIsPanelOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Compact, full-width candidate aggregation snippet */}
      <Card className="w-full">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">LinkedIn</p>
                  <p className="text-xs text-muted-foreground">12 candidates</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-xs text-muted-foreground">5 candidates</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Database className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Internal DB</p>
                  <p className="text-xs text-muted-foreground">7 candidates</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">24</span> total candidates
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <RefreshCw className="h-3 w-3" />
                Sync
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
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
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
            <span className="text-3xl font-bold text-green-600">{selectedCandidate?.matchScore}%</span>
          </div>
          <p className="mt-2 font-medium">AI Match Score</p>
        </div>

        {/* Matched Skills Section */}
        {selectedCandidate?.matchedSkills && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Matched Skills</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCandidate.matchedSkills.slice(0, 5).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Match breakdown */}
        {selectedCandidate?.skillsMatch !== undefined && (
          <div className="space-y-3">
            {selectedCandidate.skillsMatch && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Skills Match</span>
                  <span className="text-sm font-medium">{selectedCandidate.skillsMatch}%</span>
                </div>
                <Progress value={selectedCandidate.skillsMatch} className="h-2" />
              </div>
            )}

            {selectedCandidate.experienceMatch && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">Experience Match</span>
                  </div>
                  <span className="text-sm font-medium">{selectedCandidate.experienceMatch}%</span>
                </div>
                <Progress value={selectedCandidate.experienceMatch} className="h-2" />
                {selectedCandidate.currentPosition && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedCandidate.experience} as {selectedCandidate.currentPosition} at{" "}
                    {selectedCandidate.currentCompany}
                  </p>
                )}
              </div>
            )}

            {selectedCandidate.locationMatch && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">Location Match</span>
                  </div>
                  <span className="text-sm font-medium">{selectedCandidate.locationMatch}%</span>
                </div>
                <Progress value={selectedCandidate.locationMatch} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{selectedCandidate.location}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <Button className="w-full gap-2">
            <UserPlus className="h-4 w-4" />
            Review Profile
          </Button>

          <div className="flex gap-2">
            <Button className="flex-1 gap-2">
              <ArrowRight className="h-4 w-4" />
              Move to Screening
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
        </div>
      </CandidateScoringPanel>
    </div>
  )
}
