"use client"

import { Mail, Phone, Building, Briefcase, FileText, History, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

interface CandidateInfoPanelProps {
  candidate: any
}

export function CandidateInfoPanel({ candidate }: CandidateInfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border rounded-md mb-4">
      <div
        className="p-3 flex items-center justify-between cursor-pointer border-b"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{candidate.name}</p>
            <p className="text-xs text-muted-foreground">{candidate.currentPosition || candidate.experience}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3 bg-muted/20">
          {/* Contact Information */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-muted-foreground">Contact Information</h4>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{candidate.phone}</span>
            </div>
          </div>

          {/* Candidate Metadata */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-muted-foreground">Candidate Information</h4>
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{candidate.experience} of experience</span>
            </div>
            {candidate.currentCompany && (
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs">
                  {candidate.currentPosition} at {candidate.currentCompany}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-7 px-2 gap-1 flex-1">
                  <FileText className="h-3 w-3" />
                  Resume
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>{candidate.name}'s Resume</DialogTitle>
                </DialogHeader>
                <div className="bg-muted h-[60vh] flex items-center justify-center rounded-md">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">Resume preview would appear here</p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-7 px-2 gap-1 flex-1">
                  <History className="h-3 w-3" />
                  Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Action Log for {candidate.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Sourced from LinkedIn</span>
                      <span className="text-xs text-muted-foreground">2023-05-10</span>
                    </div>
                    <p className="text-sm text-muted-foreground">System</p>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Initial screening completed</span>
                      <span className="text-xs text-muted-foreground">2023-05-12</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Jane Recruiter</p>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Candidate viewed job details</span>
                      <span className="text-xs text-muted-foreground">2023-05-13</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Candidate</p>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email sent to candidate</span>
                      <span className="text-xs text-muted-foreground">2023-05-14</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Jane Recruiter</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  )
}
