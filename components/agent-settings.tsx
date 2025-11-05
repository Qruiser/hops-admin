"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, CheckCircle2, Plus, Trash2, Layers, Users, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Agent type definitions
export type AgentType = "stage-level" | "candidate-level"

// Stage-level agent configuration
export interface StageLevelAgent {
  id: string
  name: string
  enabled: boolean
  type: "stage-level"
  config?: Record<string, any>
}

// Candidate-level agent configuration
export interface CandidateLevelAgent {
  id: string
  name: string
  enabled: boolean
  type: "candidate-level"
  config?: Record<string, any>
}

export type Agent = StageLevelAgent | CandidateLevelAgent

// New agent settings configuration
export interface AgentSettingsConfig {
  stage: string
  enabled: boolean
  stageLevelAgents: StageLevelAgent[]
  candidateLevelAgents: CandidateLevelAgent[]
}

// Available agent templates by stage
export interface AgentTemplate {
  id: string
  name: string
  description: string
  type: AgentType
  defaultConfig?: Record<string, any>
}

// Predefined agent templates for each stage
const getAgentTemplates = (stage: string): AgentTemplate[] => {
  const stageLower = stage.toLowerCase()
  
  if (stageLower === "sourcing") {
    return [
      {
        id: "fetch-linkedin",
        name: "Fetch from LinkedIn",
        description: "Retrieve candidates from LinkedIn based on job requirements",
        type: "stage-level",
      },
      {
        id: "fetch-internal-db",
        name: "Fetch from Internal Database",
        description: "Collect potential candidates from internal database",
        type: "stage-level",
      },
      {
        id: "fetch-website",
        name: "Fetch from Website",
        description: "Gather candidates who applied through company website",
        type: "stage-level",
      },
      {
        id: "check-matching-skills",
        name: "Check Matching Skills",
        description: "Verify candidate skills align with job requirements",
        type: "candidate-level",
      },
      {
        id: "check-matching-frameworks",
        name: "Check Matching Frameworks",
        description: "Ensure candidate experience with required frameworks",
        type: "candidate-level",
      },
      {
        id: "check-job-consistency",
        name: "Check Job Consistency",
        description: "Analyze long-term vs short-term employment patterns",
        type: "candidate-level",
      },
      {
        id: "match-salary-range",
        name: "Match Salary Range",
        description: "Verify candidate expectations within budget",
        type: "candidate-level",
      },
      {
        id: "check-contract-openness",
        name: "Check Contract Openness",
        description: "Confirm willingness for contract/freelance work",
        type: "candidate-level",
      },
      {
        id: "location-based-experience",
        name: "Location-Based Experience",
        description: "Adjust experience requirements based on location",
        type: "candidate-level",
      },
    ]
  } else if (stageLower === "match" || stageLower === "matching") {
    return [
      {
        id: "candidate-interest",
        name: "Check Candidate Interest",
        description: "Is candidate interested in the job and company?",
        type: "candidate-level",
      },
      {
        id: "preferences-match",
        name: "Check Preferences Match",
        description: "Candidate preferences align with client requirements",
        type: "candidate-level",
      },
      {
        id: "within-budget",
        name: "Check Within Budget",
        description: "Candidate asking range is within company's budget",
        type: "candidate-level",
      },
      {
        id: "value-for-money",
        name: "Check Value for Money",
        description: "Is the asking rate value for money?",
        type: "candidate-level",
      },
      {
        id: "skill-level-match",
        name: "Check Skill Level Match",
        description: "Base check - is there a skill level match with the opportunity",
        type: "candidate-level",
      },
      {
        id: "relevant-cv-info",
        name: "Check Relevant CV Information",
        description: "Is there relevant information in the CV that matches with the opportunity",
        type: "candidate-level",
      },
      {
        id: "available-immediately",
        name: "Check Available Immediately",
        description: "Readiness - Is candidate available to start immediately?",
        type: "candidate-level",
      },
    ]
  } else if (stageLower === "screening" || stageLower === "deployability") {
    return [
      {
        id: "job-consistency",
        name: "Check Job Consistency",
        description: "Check for consistency in terms of long-term/short-term employment",
        type: "candidate-level",
      },
      {
        id: "salary-match",
        name: "Check Salary Match",
        description: "Verify candidate expectations are within budget",
        type: "candidate-level",
      },
      {
        id: "contract-openness",
        name: "Check Contract Openness",
        description: "Confirm willingness for contract work",
        type: "candidate-level",
      },
    ]
  }
  
  return []
}

// Legacy interfaces for backward compatibility (if needed)
export interface BaseAgentSettingsConfig {
  stage: string
  enabled: boolean
}

export interface SourcingCriteria {
  gatherFromExistingDB: boolean
  checkMatchingSkills: boolean
  checkMatchingFrameworks: boolean
  checkJobConsistency: boolean
  matchSalaryRange: boolean
  checkContractOpenness: boolean
  locationBasedExperience: boolean
}

export interface MatchCriteria {
  candidateInterested: boolean
  preferencesMatch: boolean
  withinBudget: boolean
  valueForMoney: boolean
  skillLevelMatch: boolean
  relevantCVInfo: boolean
  availableImmediately: boolean
}

export interface ScreeningCriteria {
  jobConsistency: boolean
  salaryMatch: boolean
  contractOpenness: boolean
}

interface AgentSettingsProps {
  config: AgentSettingsConfig
  onUpdate: (config: AgentSettingsConfig) => void
}

export function AgentSettings({ config, onUpdate }: AgentSettingsProps) {
  const [open, setOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState(config)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

  const handleEnableToggle = () => {
    const updatedConfig = { ...localConfig, enabled: !localConfig.enabled }
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
  }

  const handleAgentToggle = (agentId: string, type: AgentType) => {
    const updatedConfig = { ...localConfig }
    
    if (type === "stage-level") {
      updatedConfig.stageLevelAgents = updatedConfig.stageLevelAgents.map(agent =>
        agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
      )
    } else {
      updatedConfig.candidateLevelAgents = updatedConfig.candidateLevelAgents.map(agent =>
        agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
      )
    }
    
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
  }

  const handleAddAgent = () => {
    if (!selectedTemplateId) return
    
    const templates = getAgentTemplates(localConfig.stage)
    const template = templates.find(t => t.id === selectedTemplateId)
    if (!template) return

    const newAgent: Agent = {
      id: `${template.id}-${Date.now()}`,
      name: template.name,
      enabled: true,
      type: template.type,
      config: template.defaultConfig || {},
    }

    const updatedConfig = { ...localConfig }
    if (template.type === "stage-level") {
      updatedConfig.stageLevelAgents = [...updatedConfig.stageLevelAgents, newAgent as StageLevelAgent]
    } else {
      updatedConfig.candidateLevelAgents = [...updatedConfig.candidateLevelAgents, newAgent as CandidateLevelAgent]
    }
    
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
    setSelectedTemplateId("")
  }

  const handleRemoveAgent = (agentId: string, type: AgentType) => {
    const updatedConfig = { ...localConfig }
    
    if (type === "stage-level") {
      updatedConfig.stageLevelAgents = updatedConfig.stageLevelAgents.filter(agent => agent.id !== agentId)
    } else {
      updatedConfig.candidateLevelAgents = updatedConfig.candidateLevelAgents.filter(agent => agent.id !== agentId)
    }
    
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
  }

  const activeStageAgents = localConfig.stageLevelAgents.filter(a => a.enabled).length
  const activeCandidateAgents = localConfig.candidateLevelAgents.filter(a => a.enabled).length
  const totalActiveAgents = activeStageAgents + activeCandidateAgents

  const templates = getAgentTemplates(localConfig.stage)
  const availableTemplates = templates.filter(template => {
    const existingIds = [
      ...localConfig.stageLevelAgents.map(a => {
        // Extract base template ID (remove timestamp suffix)
        const parts = a.id.split('-')
        return parts.slice(0, -1).join('-')
      }),
      ...localConfig.candidateLevelAgents.map(a => {
        // Extract base template ID (remove timestamp suffix)
        const parts = a.id.split('-')
        return parts.slice(0, -1).join('-')
      })
    ]
    return !existingIds.includes(template.id)
  })

  const renderAgentList = (agents: Agent[], type: AgentType) => {
    if (agents.length === 0) {
      return (
        <div className="p-4 border rounded-lg text-center text-muted-foreground">
          <p className="text-sm">No {type === "stage-level" ? "stage-level" : "candidate-level"} agents configured.</p>
          <p className="text-xs mt-1">Add agents using the dropdown above.</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {agents.map((agent) => {
          // Find template by matching base ID
          const agentBaseId = agent.id.split('-').slice(0, -1).join('-')
          const template = templates.find(t => t.id === agentBaseId)
          return (
            <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{agent.name}</Label>
                  {agent.enabled && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                {template && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={agent.enabled} 
                  onCheckedChange={() => handleAgentToggle(agent.id, type)} 
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleRemoveAgent(agent.id, type)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Agent Settings
          {localConfig.enabled && totalActiveAgents > 0 && (
            <Badge variant="secondary" className="ml-1">
              {totalActiveAgents} active
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Agent Settings - {localConfig.stage}
          </DialogTitle>
          <DialogDescription>
            Configure automated agents for the {localConfig.stage} stage. Stage-level agents manage the entire workflow, while candidate-level agents run for each candidate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-agent" className="text-base font-medium">
                Enable Agent System
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Turn on automated agents for this stage
              </p>
            </div>
            <Switch id="enable-agent" checked={localConfig.enabled} onCheckedChange={handleEnableToggle} />
          </div>

          {localConfig.enabled && (
            <>
              {/* Add Agent Section */}
              {availableTemplates.length > 0 && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <Label className="text-sm font-semibold mb-3 block">Add New Agent</Label>
                  <div className="flex gap-2">
                    <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select an agent template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              {template.type === "stage-level" ? (
                                <Layers className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Users className="h-4 w-4 text-green-600" />
                              )}
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground">{template.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAddAgent} 
                      disabled={!selectedTemplateId}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {/* Stage-Level Agents Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-base font-semibold">Stage-Level Agents</h3>
                    <p className="text-xs text-muted-foreground">
                      Agents that manage the entire stage workflow (e.g., fetching candidates from sources)
                    </p>
                  </div>
                  {activeStageAgents > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {activeStageAgents} active
                    </Badge>
                  )}
                </div>
                {renderAgentList(localConfig.stageLevelAgents, "stage-level")}
              </div>

              <Separator />

              {/* Candidate-Level Agents Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="text-base font-semibold">Candidate-Level Agents</h3>
                    <p className="text-xs text-muted-foreground">
                      Agents that run for each candidate (e.g., matching skills, checking salary range)
                    </p>
                  </div>
                  {activeCandidateAgents > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {activeCandidateAgents} active
                    </Badge>
                  )}
                </div>
                {renderAgentList(localConfig.candidateLevelAgents, "candidate-level")}
              </div>

              {/* Summary */}
              {totalActiveAgents > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-sm font-medium">Active Agents Summary</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {localConfig.stageLevelAgents
                      .filter(a => a.enabled)
                      .map((agent) => (
                        <Badge key={agent.id} variant="secondary" className="gap-1">
                          <Layers className="h-3 w-3" />
                          {agent.name}
                        </Badge>
                      ))}
                    {localConfig.candidateLevelAgents
                      .filter(a => a.enabled)
                      .map((agent) => (
                        <Badge key={agent.id} variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {agent.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {totalActiveAgents === 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No agents are currently active. Add and enable agents above to start automating this stage.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
