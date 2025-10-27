"use client"

import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CandidateInfoPanel } from "./candidate-info-panel"
import {
  CheckCircle2,
  MapPin,
  Briefcase,
  UserPlus,
  ArrowRight,
  Archive,
  X,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CandidateScoringPanelProps {
  candidate: any
  title?: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function CandidateScoringPanel({ candidate, title = "Candidate Scoring", isOpen, onClose, children }: CandidateScoringPanelProps) {
  if (!candidate) return null

  const panelContent = (
    <>
      {/* Sliding Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[480px] bg-background border-l shadow-xl transition-transform duration-300 ease-in-out z-[9999] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Compact Candidate Info Panel */}
            <CandidateInfoPanel candidate={candidate} />

            {/* Custom Content (for stage-specific content) */}
            {children}

            {/* Default Scoring Section */}
            {!children && (
              <>
                {/* Stage-specific content - now more prominent */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
                    <span className="text-3xl font-bold text-green-600">{candidate.matchScore}%</span>
                  </div>
                  <p className="mt-2 font-medium">AI Match Score</p>
                </div>

                {/* Matched Skills Section */}
                {candidate.matchedSkills && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Matched Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matchedSkills.slice(0, 5).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match breakdown */}
                {(candidate.skillsMatch || candidate.experienceMatch || candidate.locationMatch) && (
                  <div className="space-y-3">
                    {candidate.skillsMatch && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Skills Match</span>
                          <span className="text-sm font-medium">{candidate.skillsMatch}%</span>
                        </div>
                        <Progress value={candidate.skillsMatch} className="h-2" />
                      </div>
                    )}

                    {/* Enhanced Experience Section */}
                    {candidate.experienceMatch && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">Experience Match</span>
                          </div>
                          <span className="text-sm font-medium">{candidate.experienceMatch}%</span>
                        </div>
                        <Progress value={candidate.experienceMatch} className="h-2" />
                        {candidate.currentPosition && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {candidate.experience} as {candidate.currentPosition} at {candidate.currentCompany}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Enhanced Location Section */}
                    {candidate.locationMatch && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">Location Match</span>
                          </div>
                          <span className="text-sm font-medium">{candidate.locationMatch}%</span>
                        </div>
                        <Progress value={candidate.locationMatch} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{candidate.location}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Potential Badge */}
                <div className="flex items-center justify-between">
                  {candidate.potential === "high" && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      High Potential
                    </Badge>
                  )}

                  {candidate.potential === "medium" && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Good Fit
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button className="w-full gap-2">
                    <UserPlus className="h-4 w-4" />
                    Review Profile
                  </Button>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Move to Next Stage
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[9998] transition-opacity" onClick={onClose} />}
    </>
  )

  // Render using portal to ensure proper z-index stacking
  if (typeof window === "undefined") return null
  
  return createPortal(panelContent, document.body)
}

