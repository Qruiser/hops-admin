"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, ArrowRight, Check, X, Info } from "lucide-react"
import { CandidateCard } from "../candidate-card"
import { CandidateInfoPanel } from "../candidate-info-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Archive } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AgentSettings, AgentSettingsConfig } from "../agent-settings"

// Sample candidates data with expanded information
const candidates = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    source: "linkedin",
    matchScore: 92,
    skills: ["React", "TypeScript", "Node.js"],
    experience: "5 years",
    location: "San Francisco, CA",
    lastActivity: "2023-05-15",
    status: "matched",
    skillMatch: 95,
    experienceMatch: 90,
    traitMatch: 85,
    capabilityMatch: 88,
    technicalSkills: 95,
    softSkills: 88,
    culturalFit: 90,
    potential: "high",
    currentPosition: "Senior Developer",
    currentCompany: "TechCorp",
    // Candidate-specific job requirements
    requirements: [
      { category: "Skills", items: ["React", "TypeScript", "Node.js", "GraphQL", "REST API"] },
      { category: "Experience", items: ["5+ years in frontend development", "Team leadership", "Agile methodologies"] },
      { category: "Traits", items: ["Problem solver", "Team player", "Self-motivated", "Detail-oriented"] },
      {
        category: "Capabilities",
        items: ["Building scalable applications", "Code reviews", "Technical documentation"],
      },
    ],
    // Candidate-specific matches
    matches: {
      skills: [
        {
          name: "React",
          match: true,
          details:
            "5+ years of experience with React, including hooks, context API, and Redux. Has built multiple production applications with React.",
        },
        {
          name: "TypeScript",
          match: true,
          details: "3 years of experience with TypeScript. Familiar with advanced types, generics, and type inference.",
        },
        {
          name: "Node.js",
          match: true,
          details: "4 years of experience building backend services with Node.js, Express, and MongoDB.",
        },
        {
          name: "GraphQL",
          match: false,
          details: "Limited experience with GraphQL. Has used it in small projects but not in production environments.",
        },
        {
          name: "REST API",
          match: true,
          details: "Extensive experience designing and implementing RESTful APIs following best practices.",
        },
      ],
      experience: [
        { name: "5+ years in frontend development", match: true },
        { name: "Team leadership", match: false },
        { name: "Agile methodologies", match: true },
      ],
      traits: [
        {
          name: "Strong attention to detail to ensure accurate and meaningful data visualization.",
          match: true,
          details:
            "Demonstrated attention to detail in previous projects, particularly in data visualization work. Consistently catches edge cases and ensures pixel-perfect implementations.",
        },
        {
          name: "Excellent communication skills for collaborating with cross-functional teams.",
          match: true,
          details:
            "Strong communicator who can explain technical concepts to non-technical stakeholders. Has experience working with designers, product managers, and business analysts.",
        },
        {
          name: "Proactive problem-solving approach to technical challenges.",
          match: false,
          details:
            "Sometimes waits for direction rather than taking initiative to solve problems. Could improve in proactively identifying and addressing issues before they become critical.",
        },
      ],
      capabilities: [
        {
          name: "Can design and implement APIs to fetch and display metrics, integrating data from various sources.",
          match: true,
          details:
            "Has designed and implemented multiple APIs that integrate data from various sources, including third-party APIs, databases, and real-time data streams.",
        },
        {
          name: "Can optimize API performance to ensure real-time updates for statistics and growth trends.",
          match: true,
          details:
            "Experienced in optimizing API performance through caching, pagination, and efficient database queries. Has implemented real-time updates using WebSockets.",
        },
        {
          name: "Can develop scalable data processing pipelines for large datasets.",
          match: false,
          details:
            "Limited experience with large-scale data processing. Has worked with small to medium datasets but not with big data technologies like Hadoop or Spark.",
        },
        {
          name: "Can design modular systems to track performance across multiple projects simultaneously.",
          match: true,
          details:
            "Has designed and implemented modular systems that can track performance metrics across multiple projects. Familiar with microservices architecture and event-driven design.",
        },
      ],
    },
    // Preferences from screening stage
    preferences: {
      openToContract: true,
      expectedSalary: "$120,000",
      offerSalary: "$115,000",
      customQuestionAnswer: true,
    },
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 987-6543",
    source: "internal",
    matchScore: 87,
    skills: ["React", "JavaScript", "CSS"],
    experience: "4 years",
    location: "New York, NY",
    lastActivity: "2023-05-14",
    status: "in_progress",
    skillMatch: 85,
    experienceMatch: 80,
    traitMatch: 90,
    capabilityMatch: 82,
    technicalSkills: 85,
    softSkills: 92,
    culturalFit: 88,
    potential: "medium",
    currentPosition: "Frontend Developer",
    currentCompany: "WebSolutions Inc.",
    // Candidate-specific job requirements
    requirements: [
      { category: "Skills", items: ["React", "JavaScript", "CSS", "HTML5", "UI/UX"] },
      {
        category: "Experience",
        items: ["3+ years in frontend development", "Responsive design", "Performance optimization"],
      },
      { category: "Traits", items: ["Creative", "Detail-oriented", "Fast learner", "Collaborative"] },
      {
        category: "Capabilities",
        items: ["Building responsive interfaces", "Cross-browser compatibility", "Animation"],
      },
    ],
    // Candidate-specific matches
    matches: {
      skills: [
        {
          name: "React",
          match: true,
          details:
            "4 years of experience with React, including functional components and hooks. Has built several production-ready applications.",
        },
        {
          name: "JavaScript",
          match: true,
          details:
            "Strong JavaScript skills with knowledge of ES6+ features. Comfortable with asynchronous programming and promises.",
        },
        {
          name: "CSS",
          match: true,
          details:
            "Expert in CSS with experience in Sass, CSS-in-JS, and CSS modules. Strong understanding of responsive design principles.",
        },
        {
          name: "HTML5",
          match: true,
          details:
            "Proficient in semantic HTML5 and accessibility best practices. Ensures all websites meet WCAG standards.",
        },
        {
          name: "UI/UX",
          match: false,
          details:
            "Basic understanding of UI/UX principles but lacks formal training or significant experience in design.",
        },
      ],
      experience: [
        { name: "3+ years in frontend development", match: true },
        { name: "Responsive design", match: true },
        { name: "Performance optimization", match: false },
      ],
      traits: [
        {
          name: "Creative approach to solving UI/UX challenges.",
          match: true,
          details:
            "Consistently demonstrates creativity in solving complex UI challenges. Has received praise from design teams for innovative solutions.",
        },
        {
          name: "Strong attention to detail in implementing pixel-perfect designs.",
          match: true,
          details:
            "Meticulous attention to detail when implementing designs. Designers appreciate not having to request adjustments to match mockups.",
        },
        {
          name: "Collaborative mindset for working with designers and product teams.",
          match: false,
          details:
            "Sometimes struggles with collaboration, particularly when receiving feedback that requires significant changes to implemented work.",
        },
      ],
      capabilities: [
        {
          name: "Can build responsive interfaces that work across all device sizes.",
          match: true,
          details:
            "Expert in building responsive interfaces using modern CSS techniques like Flexbox and Grid. All projects are thoroughly tested across multiple device sizes.",
        },
        {
          name: "Can implement complex animations and transitions for enhanced user experience.",
          match: false,
          details:
            "Basic animation skills but struggles with more complex animations and transitions. Limited experience with libraries like GSAP or Framer Motion.",
        },
        {
          name: "Can optimize frontend performance for faster page loads.",
          match: true,
          details:
            "Knowledgeable about frontend performance optimization techniques including code splitting, lazy loading, and image optimization.",
        },
        {
          name: "Can ensure cross-browser compatibility for web applications.",
          match: true,
          details:
            "Thorough testing process ensures applications work consistently across all major browsers. Familiar with using polyfills and feature detection when necessary.",
        },
      ],
    },
    // Preferences from screening stage
    preferences: {
      openToContract: false,
      expectedSalary: "$110,000",
      offerSalary: "$105,000",
      customQuestionAnswer: false,
    },
  },
]

// Component for skill details dialog
function SkillDetailsDialog({ skill }: { skill: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
          <Info className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {skill.match ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {skill.name}
          </DialogTitle>
          <DialogDescription>Skill Details</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Assessment</h4>
          <p className="text-sm">{skill.details}</p>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Match Status</h4>
            <Badge
              variant="outline"
              className={
                skill.match ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {skill.match ? "Matched" : "Not Matched"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Component for trait details dialog
function TraitDetailsDialog({ trait }: { trait: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 absolute right-2 top-2">
          <Info className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {trait.match ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
            Trait Assessment
          </DialogTitle>
          <DialogDescription>Detailed trait evaluation</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Trait</h4>
          <p className="text-sm font-medium">{trait.name}</p>

          <h4 className="text-sm font-medium mt-4 mb-2">Assessment</h4>
          <p className="text-sm">{trait.details}</p>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Match Status</h4>
            <Badge
              variant="outline"
              className={
                trait.match ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {trait.match ? "Matched" : "Not Matched"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Component for capability details dialog
function CapabilityDetailsDialog({ capability }: { capability: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 absolute right-2 top-2">
          <Info className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {capability.match ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
            Capability Assessment
          </DialogTitle>
          <DialogDescription>Detailed capability evaluation</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Capability</h4>
          <p className="text-sm font-medium">{capability.name}</p>

          <h4 className="text-sm font-medium mt-4 mb-2">Assessment</h4>
          <p className="text-sm">{capability.details}</p>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Match Status</h4>
            <Badge
              variant="outline"
              className={
                capability.match
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {capability.match ? "Matched" : "Not Matched"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MatchStage() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0])
  const [agentConfig, setAgentConfig] = useState<AgentSettingsConfig>({
    stage: "Match",
    enabled: true,
    stageLevelAgents: [],
    candidateLevelAgents: [
      {
        id: "candidate-interest-1",
        name: "Check Candidate Interest",
        enabled: true,
        type: "candidate-level",
      },
      {
        id: "preferences-match-1",
        name: "Check Preferences Match",
        enabled: true,
        type: "candidate-level",
      },
      {
        id: "within-budget-1",
        name: "Check Within Budget",
        enabled: true,
        type: "candidate-level",
      },
      {
        id: "skill-level-match-1",
        name: "Check Skill Level Match",
        enabled: true,
        type: "candidate-level",
      },
    ],
  })

  const handleSelectCandidate = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  const handleAgentUpdate = (config: AgentSettingsConfig) => {
    setAgentConfig(config)
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

            {/* Stage-specific content - now more prominent */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">{selectedCandidate.matchScore}%</span>
                </div>
                <p className="mt-2 text-sm font-medium">Overall Match</p>
              </div>

              <div className="border-t pt-4">
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Requirements Match</h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Overall Match</span>
                      <span className="text-sm font-medium">{selectedCandidate.matchScore}%</span>
                    </div>
                    <Progress value={selectedCandidate.matchScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Skill</span>
                      <span className="text-sm font-medium">{selectedCandidate.skillMatch}%</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Experience</span>
                      <span className="text-sm font-medium">{selectedCandidate.experienceMatch}%</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Trait</span>
                      <span className="text-sm font-medium">{selectedCandidate.traitMatch}%</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Capability</span>
                      <span className="text-sm font-medium">{selectedCandidate.capabilityMatch}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Q-Factor Details Section */}
              <div className="border-t pt-4">
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Q-Factor Details</h5>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {/* Skills Section */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCandidate.matches.skills.map((skill) => (
                          <div key={skill.name} className="flex items-center">
                            <Badge
                              variant="outline"
                              className={
                                skill.match
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {skill.match ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {skill.name}
                            </Badge>
                            <SkillDetailsDialog skill={skill} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience Section */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Experience</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCandidate.matches.experience.map((exp) => (
                          <Badge
                            key={exp.name}
                            variant="outline"
                            className={
                              exp.match
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {exp.match ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {exp.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Traits Section */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Traits</h4>
                      <div className="space-y-2">
                        {selectedCandidate.matches.traits.map((trait) => (
                          <div
                            key={trait.name}
                            className={`text-sm p-2 rounded-md relative ${
                              trait.match
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            <div className="flex items-start gap-2 pr-6">
                              {trait.match ? (
                                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              )}
                              <span>{trait.name}</span>
                            </div>
                            <TraitDetailsDialog trait={trait} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Capabilities Section */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Capabilities</h4>
                      <div className="space-y-2">
                        {selectedCandidate.matches.capabilities.map((capability) => (
                          <div
                            key={capability.name}
                            className={`text-sm p-2 rounded-md relative ${
                              capability.match
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            <div className="flex items-start gap-2 pr-6">
                              {capability.match ? (
                                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              )}
                              <span>{capability.name}</span>
                            </div>
                            <CapabilityDetailsDialog capability={capability} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preferences Section */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Preferences</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <span>Open to Contract:</span>
                          <Badge variant={selectedCandidate.preferences.openToContract ? "success" : "destructive"}>
                            {selectedCandidate.preferences.openToContract ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <span>Expected Salary:</span>
                          <span className="font-medium">{selectedCandidate.preferences.expectedSalary}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <span>Offer Salary:</span>
                          <span className="font-medium">{selectedCandidate.preferences.offerSalary}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <span>Custom Question:</span>
                          <Badge
                            variant={selectedCandidate.preferences.customQuestionAnswer ? "success" : "destructive"}
                          >
                            {selectedCandidate.preferences.customQuestionAnswer ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Current Position */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Current Position</h4>
                      <p className="text-sm">
                        {selectedCandidate.currentPosition} at {selectedCandidate.currentCompany}
                      </p>
                    </div>

                    {/* Potential */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Potential</h4>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {selectedCandidate.potential === "high"
                          ? "High Potential"
                          : selectedCandidate.potential === "medium"
                            ? "Medium Potential"
                            : "Low Potential"}
                      </Badge>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex gap-2 border-t pt-4">
              <Button className="flex-1 gap-2">
                <ArrowRight className="h-4 w-4" />
                Move to Recommend
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
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
