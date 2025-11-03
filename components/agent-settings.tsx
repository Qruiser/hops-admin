"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, CheckCircle2 } from "lucide-react"
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

// Base agent settings interface
export interface BaseAgentSettingsConfig {
  stage: string
  enabled: boolean
}

// Sourcing Stage specific criteria
export interface SourcingCriteria {
  gatherFromExistingDB: boolean
  checkMatchingSkills: boolean
  checkMatchingFrameworks: boolean
  checkJobConsistency: boolean
  matchSalaryRange: boolean
  checkContractOpenness: boolean
  locationBasedExperience: boolean
}

// Match Stage specific criteria
export interface MatchCriteria {
  candidateInterested: boolean
  preferencesMatch: boolean
  withinBudget: boolean
  valueForMoney: boolean
  skillLevelMatch: boolean
  relevantCVInfo: boolean
  availableImmediately: boolean
}

// Screening Stage specific criteria  
export interface ScreeningCriteria {
  jobConsistency: boolean
  salaryMatch: boolean
  contractOpenness: boolean
}

// Recommend Stage specific criteria
export interface RecommendCriteria {
  // Can be empty or have specific criteria
}

// Deploy Stage specific criteria
export interface DeployCriteria {
  // Can be empty or have specific criteria
}

export type AgentSettingsConfig = 
  | (BaseAgentSettingsConfig & { criteria: SourcingCriteria; thresholds?: any; locationSettings?: any })
  | (BaseAgentSettingsConfig & { criteria: MatchCriteria })
  | (BaseAgentSettingsConfig & { criteria: ScreeningCriteria })
  | (BaseAgentSettingsConfig & { criteria: RecommendCriteria })
  | (BaseAgentSettingsConfig & { criteria: DeployCriteria })

interface AgentSettingsProps {
  config: AgentSettingsConfig
  onUpdate: (config: AgentSettingsConfig) => void
}

export function AgentSettings({ config, onUpdate }: AgentSettingsProps) {
  const [open, setOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState(config)

  const handleEnableToggle = () => {
    const updatedConfig = { ...localConfig, enabled: !localConfig.enabled }
    setLocalConfig(updatedConfig)
    onUpdate(updatedConfig)
  }

  const activeCriteriaCount = Object.values(localConfig.criteria).filter(Boolean).length

  const renderCriteria = () => {
    const stage = config.stage.toLowerCase()
    
    if (stage === "sourcing") {
      return renderSourcingCriteria()
    } else if (stage === "match" || stage === "matching") {
      return renderMatchCriteria()
    } else if (stage === "screening" || stage === "deployability") {
      return renderScreeningCriteria()
    } else if (stage === "recommend") {
      return renderRecommendCriteria()
    } else if (stage === "deploy") {
      return renderDeployCriteria()
    }
    
    return null
  }

  const renderSourcingCriteria = () => {
    const criteria = localConfig.criteria as SourcingCriteria
    
    const handleToggle = (field: keyof SourcingCriteria) => {
      const updatedCriteria = {
        ...criteria,
        [field]: !criteria[field],
      }
      const updatedConfig = { ...localConfig, criteria: updatedCriteria }
      setLocalConfig(updatedConfig)
      onUpdate(updatedConfig)
    }

    return (
      <>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Gathering Criteria</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Gather from Existing DB</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Collect potential candidates from internal database
                </p>
              </div>
              <Switch checked={criteria.gatherFromExistingDB} onCheckedChange={() => handleToggle("gatherFromExistingDB")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Check Matching Skills</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Verify candidate skills align with job requirements
                </p>
              </div>
              <Switch checked={criteria.checkMatchingSkills} onCheckedChange={() => handleToggle("checkMatchingSkills")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Check Matching Frameworks</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Ensure candidate experience with required frameworks
                </p>
              </div>
              <Switch checked={criteria.checkMatchingFrameworks} onCheckedChange={() => handleToggle("checkMatchingFrameworks")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Check Job Consistency</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Analyze long-term vs short-term employment patterns
                </p>
              </div>
              <Switch checked={criteria.checkJobConsistency} onCheckedChange={() => handleToggle("checkJobConsistency")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Match Salary Range</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Verify candidate expectations within budget
                </p>
              </div>
              <Switch checked={criteria.matchSalaryRange} onCheckedChange={() => handleToggle("matchSalaryRange")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Check Contract Openness</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Confirm willingness for contract/freelance work
                </p>
              </div>
              <Switch checked={criteria.checkContractOpenness} onCheckedChange={() => handleToggle("checkContractOpenness")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Location-Based Experience</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust experience requirements based on location
                </p>
              </div>
              <Switch checked={criteria.locationBasedExperience} onCheckedChange={() => handleToggle("locationBasedExperience")} />
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderMatchCriteria = () => {
    const criteria = localConfig.criteria as MatchCriteria
    
    const handleToggle = (field: keyof MatchCriteria) => {
      const updatedCriteria = {
        ...criteria,
        [field]: !criteria[field],
      }
      const updatedConfig = { ...localConfig, criteria: updatedCriteria }
      setLocalConfig(updatedConfig)
      onUpdate(updatedConfig)
    }

    return (
      <>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Match Criteria</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Candidate Interest</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Is candidate interested in the job and company?
                </p>
              </div>
              <Switch checked={criteria.candidateInterested} onCheckedChange={() => handleToggle("candidateInterested")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Preferences Match</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Candidate preferences align with client requirements
                </p>
              </div>
              <Switch checked={criteria.preferencesMatch} onCheckedChange={() => handleToggle("preferencesMatch")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Within Budget</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Candidate asking range is within company's budget
                </p>
              </div>
              <Switch checked={criteria.withinBudget} onCheckedChange={() => handleToggle("withinBudget")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Value for Money</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Is the asking rate value for money?
                </p>
              </div>
              <Switch checked={criteria.valueForMoney} onCheckedChange={() => handleToggle("valueForMoney")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Skill Level Match</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Base check - is there a skill level match with the opportunity
                </p>
              </div>
              <Switch checked={criteria.skillLevelMatch} onCheckedChange={() => handleToggle("skillLevelMatch")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Relevant CV Information</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Is there relevant information in the CV that matches with the opportunity
                </p>
              </div>
              <Switch checked={criteria.relevantCVInfo} onCheckedChange={() => handleToggle("relevantCVInfo")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Available Immediately</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Readiness - Is candidate available to start immediately?
                </p>
              </div>
              <Switch checked={criteria.availableImmediately} onCheckedChange={() => handleToggle("availableImmediately")} />
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderScreeningCriteria = () => {
    const criteria = localConfig.criteria as ScreeningCriteria
    
    const handleToggle = (field: keyof ScreeningCriteria) => {
      const updatedCriteria = {
        ...criteria,
        [field]: !criteria[field],
      }
      const updatedConfig = { ...localConfig, criteria: updatedCriteria }
      setLocalConfig(updatedConfig)
      onUpdate(updatedConfig)
    }

    return (
      <>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Screening Criteria</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Job Consistency</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Check for consistency in terms of long-term/short-term employment
                </p>
              </div>
              <Switch checked={criteria.jobConsistency} onCheckedChange={() => handleToggle("jobConsistency")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Salary Match</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Verify candidate expectations are within budget
                </p>
              </div>
              <Switch checked={criteria.salaryMatch} onCheckedChange={() => handleToggle("salaryMatch")} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Contract Openness</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Confirm willingness for contract work
                </p>
              </div>
              <Switch checked={criteria.contractOpenness} onCheckedChange={() => handleToggle("contractOpenness")} />
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderRecommendCriteria = () => {
    return (
      <>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Recommendation Criteria</h3>
          <div className="p-4 border rounded-lg text-center text-muted-foreground">
            <p className="text-sm">No automated criteria configured for this stage.</p>
            <p className="text-xs mt-1">Candidates are reviewed manually before being sent to clients.</p>
          </div>
        </div>
      </>
    )
  }

  const renderDeployCriteria = () => {
    return (
      <>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Deployment Criteria</h3>
          <div className="p-4 border rounded-lg text-center text-muted-foreground">
            <p className="text-sm">No automated criteria configured for this stage.</p>
            <p className="text-xs mt-1">Focus is on documentation, contracts, and onboarding process.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Agent Settings
          {localConfig.enabled && (
            <Badge variant="secondary" className="ml-1">
              {activeCriteriaCount} active
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Agent Settings - {localConfig.stage}
          </DialogTitle>
          <DialogDescription>
            Configure automated criteria for candidate evaluation in the {localConfig.stage} stage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-agent" className="text-base font-medium">
                Enable Agent
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Turn on automated candidate filtering for this stage
              </p>
            </div>
            <Switch id="enable-agent" checked={localConfig.enabled} onCheckedChange={handleEnableToggle} />
          </div>

          {localConfig.enabled && (
            <>
              {renderCriteria()}

              {/* Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <p className="text-sm font-medium">Active Criteria Summary</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(localConfig.criteria).map(([key, value]) => {
                    if (value) {
                      return (
                        <Badge key={key} variant="secondary">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Badge>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
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
