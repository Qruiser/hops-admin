"use client"

import React, { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { History, Edit2, Save, X, Copy, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

// Agent type definitions
export type AgentType = "stage-level" | "candidate-level"

// Prompt version history
export interface PromptVersion {
  id: string
  version: number
  prompt: string
  createdAt: string
  createdBy?: string
  notes?: string
}

// Full agent configuration version history
export interface AgentConfigVersion {
  id: string
  version: number
  name: string
  description?: string
  prompt?: string
  threshold?: number
  enabled: boolean
  createdAt: string
  createdBy?: string
  notes?: string
}

// Stage-level agent configuration
export interface StageLevelAgent {
  id: string
  name: string
  enabled: boolean
  type: "stage-level"
  description?: string
  prompt?: string
  promptVersions?: PromptVersion[]
  configVersions?: AgentConfigVersion[]
  isCustom?: boolean
  config?: Record<string, any>
}

// Candidate-level agent configuration
export interface CandidateLevelAgent {
  id: string
  name: string
  enabled: boolean
  type: "candidate-level"
  description?: string
  prompt?: string
  promptVersions?: PromptVersion[]
  configVersions?: AgentConfigVersion[]
  isCustom?: boolean
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

// Helper function to determine if an agent should have a threshold setting
// Most candidate-level agents need thresholds, except stage-level agents
const agentNeedsThreshold = (agentId: string, agentType: AgentType): boolean => {
  if (agentType === "stage-level") {
    return false
  }
  
  // List of candidate-level agents that don't need thresholds (binary checks)
  const noThresholdAgents = [
    "available-immediately",
    "check-contract-openness",
    "contract-openness",
  ]
  
  const agentBaseId = agentId.split('-').slice(0, -1).join('-')
  return !noThresholdAgents.includes(agentBaseId)
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
        defaultConfig: { threshold: 70 },
      },
      {
        id: "check-matching-frameworks",
        name: "Check Matching Frameworks",
        description: "Ensure candidate experience with required frameworks",
        type: "candidate-level",
        defaultConfig: { threshold: 70 },
      },
      {
        id: "check-job-consistency",
        name: "Check Job Consistency",
        description: "Analyze long-term vs short-term employment patterns",
        type: "candidate-level",
        defaultConfig: { threshold: 60 },
      },
      {
        id: "match-salary-range",
        name: "Match Salary Range",
        description: "Verify candidate expectations within budget",
        type: "candidate-level",
        defaultConfig: { threshold: 80 },
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
        defaultConfig: { threshold: 65 },
      },
    ]
  } else if (stageLower === "match" || stageLower === "matching") {
    return [
      {
        id: "candidate-interest",
        name: "Check Candidate Interest",
        description: "Is candidate interested in the job and company?",
        type: "candidate-level",
        defaultConfig: { threshold: 70 },
      },
      {
        id: "preferences-match",
        name: "Check Preferences Match",
        description: "Candidate preferences align with client requirements",
        type: "candidate-level",
        defaultConfig: { threshold: 75 },
      },
      {
        id: "within-budget",
        name: "Check Within Budget",
        description: "Candidate asking range is within company's budget",
        type: "candidate-level",
        defaultConfig: { threshold: 80 },
      },
      {
        id: "value-for-money",
        name: "Check Value for Money",
        description: "Is the asking rate value for money?",
        type: "candidate-level",
        defaultConfig: { threshold: 70 },
      },
      {
        id: "skill-level-match",
        name: "Check Skill Level Match",
        description: "Base check - is there a skill level match with the opportunity",
        type: "candidate-level",
        defaultConfig: { threshold: 75 },
      },
      {
        id: "relevant-cv-info",
        name: "Check Relevant CV Information",
        description: "Is there relevant information in the CV that matches with the opportunity",
        type: "candidate-level",
        defaultConfig: { threshold: 70 },
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
        defaultConfig: { threshold: 60 },
      },
      {
        id: "salary-match",
        name: "Check Salary Match",
        description: "Verify candidate expectations are within budget",
        type: "candidate-level",
        defaultConfig: { threshold: 80 },
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

// Custom Agent Creation Dialog
interface CreateCustomAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stage: string
  onAgentCreated: (agent: Agent) => void
}

function CreateCustomAgentDialog({ open, onOpenChange, stage, onAgentCreated }: CreateCustomAgentDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<AgentType>("candidate-level")
  const [prompt, setPrompt] = useState("")
  const [threshold, setThreshold] = useState<number>(70)

  const handleCreate = () => {
    if (!name.trim()) return

    const newAgent: Agent = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      enabled: true,
      type,
      prompt: prompt.trim() || undefined,
      isCustom: true,
      promptVersions: prompt.trim() ? [{
        id: `version-${Date.now()}`,
        version: 1,
        prompt: prompt.trim(),
        createdAt: new Date().toISOString(),
      }] : undefined,
      config: type === "candidate-level" && agentNeedsThreshold(`custom-${Date.now()}`, type) 
        ? { threshold } 
        : {},
    }

    onAgentCreated(newAgent)
    setName("")
    setDescription("")
    setPrompt("")
    setThreshold(70)
    setType("candidate-level")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Agent</DialogTitle>
          <DialogDescription>
            Create a new custom agent for the {stage} stage. Define the agent's behavior through prompts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name *</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Check Remote Work Experience"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-description">Description</Label>
            <Input
              id="agent-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this agent does"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-type">Agent Type *</Label>
            <Select value={type} onValueChange={(value) => setType(value as AgentType)}>
              <SelectTrigger id="agent-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candidate-level">Candidate-Level</SelectItem>
                <SelectItem value="stage-level">Stage-Level</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {type === "candidate-level" 
                ? "Runs for each candidate individually" 
                : "Manages the entire stage workflow"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-prompt">Prompt / Instructions</Label>
            <Textarea
              id="agent-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the prompt or instructions for this agent. This will be used to guide the agent's behavior."
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Define how the agent should evaluate candidates or perform its task. This can be evolved through versioning.
            </p>
          </div>

          {type === "candidate-level" && agentNeedsThreshold(`temp-${Date.now()}`, type) && (
            <div className="space-y-2">
              <Label htmlFor="agent-threshold">Threshold (%)</Label>
              <Input
                id="agent-threshold"
                type="number"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10)
                  if (!isNaN(value) && value >= 0 && value <= 100) {
                    setThreshold(value)
                  }
                }}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim()}>
              Create Agent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Agent Edit Dialog with Prompt Versioning
interface EditAgentDialogProps {
  agent: Agent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedAgent: Agent) => void
  templates: AgentTemplate[]
}

function EditAgentDialog({ agent, open, onOpenChange, onSave, templates }: EditAgentDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [prompt, setPrompt] = useState("")
  const [threshold, setThreshold] = useState<number>(70)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showConfigVersionHistory, setShowConfigVersionHistory] = useState(false)
  const [selectedConfigVersion, setSelectedConfigVersion] = useState<AgentConfigVersion | null>(null)
  const [selectedPromptVersion, setSelectedPromptVersion] = useState<PromptVersion | null>(null)
  const [versionNotes, setVersionNotes] = useState("")

  // Find template if agent is template-based
  const agentBaseId = agent?.id.split('-').slice(0, -1).join('-')
  const template = agent ? templates.find(t => t.id === agentBaseId) : null

  // Update form when agent prop changes
  useEffect(() => {
    if (agent) {
      setName(agent.name)
      setDescription(agent.description || "")
      setPrompt(agent.prompt || "")
      setThreshold(agent.config?.threshold ?? (template?.defaultConfig?.threshold ?? 70))
      setVersionNotes("")
      setSelectedConfigVersion(null)
      setSelectedPromptVersion(null)
      setShowVersionHistory(false)
      setShowConfigVersionHistory(false)
    }
  }, [agent, template])

  const handleSave = () => {
    if (!agent) return

    const currentPrompt = prompt.trim()
    const hasPromptChanged = currentPrompt && currentPrompt !== (agent.prompt || "")
    const hasNameChanged = name.trim() !== agent.name
    const hasDescriptionChanged = description.trim() !== (agent.description || "")
    const hasThresholdChanged = agent.type === "candidate-level" && agentNeedsThreshold(agent.id, agent.type) 
      ? threshold !== (agent.config?.threshold ?? (template?.defaultConfig?.threshold ?? 70))
      : false

    // Create new prompt version if prompt changed
    let newPromptVersions: PromptVersion[] = agent.promptVersions || []
    if (hasPromptChanged) {
      if (newPromptVersions.length > 0) {
        const currentVersion = newPromptVersions[newPromptVersions.length - 1]?.version || 0
        newPromptVersions = [...newPromptVersions, {
          id: `version-${Date.now()}`,
          version: currentVersion + 1,
          prompt: currentPrompt,
          createdAt: new Date().toISOString(),
          notes: versionNotes.trim() || undefined,
        }]
      } else {
        newPromptVersions = [{
          id: `version-${Date.now()}`,
          version: 1,
          prompt: currentPrompt,
          createdAt: new Date().toISOString(),
          notes: versionNotes.trim() || undefined,
        }]
      }
    }

    // Create new config version if any configuration changed
    let newConfigVersions: AgentConfigVersion[] = agent.configVersions || []
    if (hasNameChanged || hasDescriptionChanged || hasPromptChanged || hasThresholdChanged) {
      const currentConfigVersion = newConfigVersions.length > 0 
        ? newConfigVersions[newConfigVersions.length - 1]?.version || 0 
        : 0
      
      newConfigVersions = [...newConfigVersions, {
        id: `config-version-${Date.now()}`,
        version: currentConfigVersion + 1,
        name: agent.name,
        description: agent.description,
        prompt: agent.prompt,
        threshold: agent.config?.threshold,
        enabled: agent.enabled,
        createdAt: new Date().toISOString(),
        notes: versionNotes.trim() || undefined,
      }]
    }

    const updatedAgent: Agent = {
      ...agent,
      name: name.trim(),
      description: description.trim() || undefined,
      prompt: currentPrompt || undefined,
      promptVersions: newPromptVersions.length > 0 ? newPromptVersions : agent.promptVersions,
      configVersions: newConfigVersions.length > 0 ? newConfigVersions : agent.configVersions,
      config: {
        ...agent.config,
        ...(agent.type === "candidate-level" && agentNeedsThreshold(agent.id, agent.type) 
          ? { threshold } 
          : {}),
      },
    }

    onSave(updatedAgent)
    onOpenChange(false)
  }

  const handleRestoreVersion = (version: PromptVersion) => {
    setPrompt(version.prompt)
    setVersionNotes(`Restored from version ${version.version}`)
  }

  const needsThreshold = agent ? agentNeedsThreshold(agent.id, agent.type) : false

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5" />
                Edit Agent: {agent?.name}
              </DialogTitle>
              <DialogDescription>
                {agent?.isCustom 
                  ? "Edit your custom agent's configuration and prompts." 
                  : "Edit agent settings and customize prompts. Changes will be versioned."}
              </DialogDescription>
            </div>
            {agent && agent.configVersions && agent.configVersions.length > 0 && !showConfigVersionHistory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfigVersionHistory(true)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                Config History ({agent.configVersions.length})
              </Button>
            )}
            {showConfigVersionHistory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowConfigVersionHistory(false)
                  setSelectedConfigVersion(null)
                }}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Current Config
              </Button>
            )}
          </div>
        </DialogHeader>

        {agent && !showConfigVersionHistory ? (
          // Current Configuration View
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Agent Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this agent does"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-prompt">Prompt / Instructions</Label>
                {agent.promptVersions && agent.promptVersions.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    className="gap-2"
                  >
                    <History className="h-4 w-4" />
                    Prompt Versions ({agent.promptVersions.length})
                  </Button>
                )}
              </div>
              <Textarea
                id="edit-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the prompt or instructions for this agent"
                className="min-h-[200px] font-mono text-sm"
              />
              {agent.promptVersions && agent.promptVersions.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Current version: {agent.promptVersions[agent.promptVersions.length - 1]?.version || 1}
                </p>
              )}
            </div>

            {showVersionHistory && agent.promptVersions && agent.promptVersions.length > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                {!selectedPromptVersion ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Prompt Version History</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          History of prompt changes. Click a version to view details.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVersionHistory(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {[...agent.promptVersions].reverse().map((version) => (
                          <div
                            key={version.id}
                            className="border rounded p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => setSelectedPromptVersion(version)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">v{version.version}</Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(version.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {version.notes && (
                              <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
                                {version.notes}
                              </p>
                            )}
                            <p className="text-xs font-mono bg-muted p-2 rounded mt-2 line-clamp-2">
                              {version.prompt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPromptVersion(null)}
                          className="gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to List
                        </Button>
                        <Badge variant="secondary">v{selectedPromptVersion.version}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(selectedPromptVersion.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-4 pt-2">
                      {selectedPromptVersion.notes && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs font-medium mb-1">Version Notes</p>
                          <p className="text-sm text-muted-foreground italic">{selectedPromptVersion.notes}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Prompt / Instructions</Label>
                        <div className="text-sm font-mono bg-muted p-3 rounded whitespace-pre-wrap">
                          {selectedPromptVersion.prompt}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => {
                            handleRestoreVersion(selectedPromptVersion)
                            setSelectedPromptVersion(null)
                            setShowVersionHistory(false)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                          Restore This Version
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        ) : showConfigVersionHistory && agent && agent.configVersions && agent.configVersions.length > 0 ? (
          // Configuration History View
          <div className="space-y-4 py-4">
            {!selectedConfigVersion ? (
              <>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-1">Agent Configuration History</h4>
                  <p className="text-xs text-muted-foreground">
                    Full history of all agent configuration changes. Click a version to view details.
                  </p>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {[...agent.configVersions].reverse().map((version) => (
                      <div
                        key={version.id}
                        className="border rounded p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedConfigVersion(version)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">v{version.version}</Badge>
                            <span className="text-sm font-medium">{version.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(version.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {version.notes && (
                          <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
                            {version.notes}
                          </p>
                        )}
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          {version.prompt && (
                            <span className="flex items-center gap-1">
                              <Edit2 className="h-3 w-3" />
                              Has prompt
                            </span>
                          )}
                          {version.threshold !== undefined && (
                            <span>Threshold: {version.threshold}%</span>
                          )}
                          <span>Enabled: {version.enabled ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConfigVersion(null)}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to List
                    </Button>
                    <Badge variant="secondary">v{selectedConfigVersion.version}</Badge>
                    <span className="text-sm font-semibold">{selectedConfigVersion.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedConfigVersion.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedConfigVersion.notes && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-1">Version Notes</p>
                      <p className="text-sm text-muted-foreground italic">{selectedConfigVersion.notes}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Name</Label>
                      <div className="text-sm">{selectedConfigVersion.name}</div>
                    </div>

                    {selectedConfigVersion.description && (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                        <div className="text-sm">{selectedConfigVersion.description}</div>
                      </div>
                    )}

                    {selectedConfigVersion.prompt && (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Prompt / Instructions</Label>
                        <div className="text-sm font-mono bg-muted p-3 rounded whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {selectedConfigVersion.prompt}
                        </div>
                      </div>
                    )}

                    {selectedConfigVersion.threshold !== undefined && (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Threshold</Label>
                        <div className="text-sm">{selectedConfigVersion.threshold}%</div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Enabled</Label>
                      <div className="text-sm">{selectedConfigVersion.enabled ? "Yes" : "No"}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedConfigVersion(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => {
                        setName(selectedConfigVersion.name)
                        setDescription(selectedConfigVersion.description || "")
                        setPrompt(selectedConfigVersion.prompt || "")
                        setThreshold(selectedConfigVersion.threshold ?? (template?.defaultConfig?.threshold ?? 70))
                        setVersionNotes(`Restored from config version ${selectedConfigVersion.version}`)
                        setSelectedConfigVersion(null)
                        setShowConfigVersionHistory(false)
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Restore This Version
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export function AgentSettings({ config, onUpdate }: AgentSettingsProps) {
  const [open, setOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState(config)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [createCustomDialogOpen, setCreateCustomDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)

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

  const handleThresholdChange = (agentId: string, type: AgentType, threshold: number) => {
    const updatedConfig = { ...localConfig }
    
    if (type === "stage-level") {
      updatedConfig.stageLevelAgents = updatedConfig.stageLevelAgents.map(agent =>
        agent.id === agentId
          ? { ...agent, config: { ...agent.config, threshold } }
          : agent
      )
    } else {
      updatedConfig.candidateLevelAgents = updatedConfig.candidateLevelAgents.map(agent =>
        agent.id === agentId
          ? { ...agent, config: { ...agent.config, threshold } }
          : agent
      )
    }
    
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
  }

  const handleCustomAgentCreated = (newAgent: Agent) => {
    const updatedConfig = { ...localConfig }
    if (newAgent.type === "stage-level") {
      updatedConfig.stageLevelAgents = [...updatedConfig.stageLevelAgents, newAgent as StageLevelAgent]
    } else {
      updatedConfig.candidateLevelAgents = [...updatedConfig.candidateLevelAgents, newAgent as CandidateLevelAgent]
    }
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
  }

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent)
    setEditDialogOpen(true)
  }

  const handleAgentSaved = (updatedAgent: Agent) => {
    const updatedConfig = { ...localConfig }
    if (updatedAgent.type === "stage-level") {
      updatedConfig.stageLevelAgents = updatedConfig.stageLevelAgents.map(agent =>
        agent.id === updatedAgent.id ? updatedAgent as StageLevelAgent : agent
      )
    } else {
      updatedConfig.candidateLevelAgents = updatedConfig.candidateLevelAgents.map(agent =>
        agent.id === updatedAgent.id ? updatedAgent as CandidateLevelAgent : agent
      )
    }
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
    setEditingAgent(null)
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
          const needsThreshold = agentNeedsThreshold(agent.id, type)
          const currentThreshold = agent.config?.threshold ?? (template?.defaultConfig?.threshold ?? 70)
          
          return (
            <div key={agent.id} className="p-3 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">{agent.name}</Label>
                    {agent.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                    {agent.isCustom && (
                      <Badge variant="outline" className="text-xs">
                        Custom
                      </Badge>
                    )}
                    {agent.prompt && (
                      <Badge variant="outline" className="text-xs">
                        <Edit2 className="h-3 w-3 mr-1" />
                        Prompt
                      </Badge>
                    )}
                  </div>
                  {(agent.description || template) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {agent.description || template?.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {agent.configVersions && agent.configVersions.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditingAgent(agent)
                        setEditDialogOpen(true)
                      }}
                      title="View version history (opens edit dialog)"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEditAgent(agent)}
                    title="Edit agent"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
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
              
              {needsThreshold && agent.enabled && (
                <div className="flex items-center gap-3 pt-2 border-t bg-muted/30 p-2 rounded">
                  <div className="flex-1">
                    <Label htmlFor={`threshold-${agent.id}`} className="text-xs font-medium">
                      Threshold (%)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Minimum score required to pass this check
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-32">
                    <Input
                      id={`threshold-${agent.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={currentThreshold}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10)
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          handleThresholdChange(agent.id, type, value)
                        }
                      }}
                      className="h-8 w-20 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
              )}
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
            Configure automated agents for the {localConfig.stage} stage. Stage-level agents manage the entire workflow, while candidate-level agents run for each candidate. Most candidate-level agents have threshold settings that determine if a candidate profile moves ahead in the pipeline.
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
              <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Add New Agent</Label>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setCreateCustomDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Custom Agent
                  </Button>
                </div>
                {availableTemplates.length > 0 && (
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
                )}
              </div>

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
                      Agents that run for each candidate (e.g., matching skills, checking salary range). Thresholds determine the minimum score required for a candidate to pass each check.
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

              {/* Threshold Info */}
              {localConfig.candidateLevelAgents.filter(a => a.enabled && agentNeedsThreshold(a.id, "candidate-level")).length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium mb-1">How Thresholds Work</p>
                    <p className="text-xs">
                      Each candidate-level agent with a threshold will evaluate candidates and assign a score (0-100%). 
                      Candidates must meet or exceed the threshold for each enabled agent to move forward in the pipeline. 
                      All thresholds must be met for a candidate to progress.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

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
                      .map((agent) => {
                        const threshold = agent.config?.threshold
                        const needsThreshold = agentNeedsThreshold(agent.id, "candidate-level")
                        return (
                          <Badge key={agent.id} variant="secondary" className="gap-1">
                            <Users className="h-3 w-3" />
                            {agent.name}
                            {needsThreshold && threshold !== undefined && (
                              <span className="ml-1 text-xs">({threshold}%)</span>
                            )}
                          </Badge>
                        )
                      })}
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

      {/* Custom Agent Creation Dialog */}
      <CreateCustomAgentDialog
        open={createCustomDialogOpen}
        onOpenChange={setCreateCustomDialogOpen}
        stage={localConfig.stage}
        onAgentCreated={handleCustomAgentCreated}
      />

      {/* Agent Edit Dialog */}
      <EditAgentDialog
        agent={editingAgent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleAgentSaved}
        templates={templates}
      />
    </Dialog>
  )
}
