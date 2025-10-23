"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Edit, Star } from "lucide-react"
import type { Candidate, CandidateState } from "@/types/talent"

const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "123-456-7890",
    yearsOfExperience: 4,
    skills: ["Java", "Spring"],
    matchScore: 92,
    verified: true,
    state: "sourced",
    isPotentialPrincipal: false,
    notes: "",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    phone: "234-567-8901",
    yearsOfExperience: 5,
    skills: ["React", "Node.js"],
    matchScore: 85,
    verified: true,
    state: "contacted",
    isPotentialPrincipal: false,
    notes: "",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "345-678-9012",
    yearsOfExperience: 3,
    skills: ["Python", "Data Science"],
    matchScore: 78,
    verified: true,
    state: "onboarded",
    isPotentialPrincipal: false,
    notes: "",
  },
]

// Update the candidateStates array to remove "contact"
const candidateStates: CandidateState[] = [
  "sourced",
  "onboarded",
  "preferenceMatched",
  "specMatched",
  "recommended",
  "preferences unfit",
  "skill unfit",
]

export function Candidates() {
  const [activeState, setActiveState] = useState<CandidateState>("sourced")
  const [candidates, setCandidates] = useState(initialCandidates)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [showPrincipals, setShowPrincipals] = useState(false)

  const filteredCandidates = showPrincipals
    ? candidates.filter((candidate) => candidate.isPotentialPrincipal)
    : candidates.filter((candidate) => candidate.state === activeState)

  const updateCandidateState = (candidateId: string, newState: CandidateState) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, state: newState, stateUpdatedBy: "Current User" } : candidate,
      ),
    )
  }

  const openEditDialog = (candidate: Candidate) => {
    setEditingCandidate({ ...candidate })
  }

  const saveEditedCandidate = () => {
    if (editingCandidate) {
      setCandidates((prev) =>
        prev.map((candidate) => (candidate.id === editingCandidate.id ? editingCandidate : candidate)),
      )
      setEditingCandidate(null)
    }
  }

  const togglePrincipalView = () => {
    setShowPrincipals(!showPrincipals)
  }

  const togglePotentialPrincipal = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, isPotentialPrincipal: !candidate.isPotentialPrincipal }
          : candidate,
      ),
    )
  }

  const updateNotes = (candidateId: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((candidate) => (candidate.id === candidateId ? { ...candidate, notes } : candidate)),
    )
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Based on Qru Spec and Data Sources</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePrincipalView}
            className={showPrincipals ? "bg-primary text-primary-foreground" : ""}
          >
            <Star className="h-4 w-4 mr-2" />
            {showPrincipals ? "Show All" : "Show Principals"}
          </Button>
          <span className="text-gray-500">{filteredCandidates.length} matches</span>
        </div>
      </div>
      {!showPrincipals && (
        <Tabs value={activeState} onValueChange={(value) => setActiveState(value as CandidateState)}>
          <TabsList className="grid w-full grid-cols-5">
            {candidateStates.map((state) => (
              <TabsTrigger key={state} value={state} className="text-xs sm:text-sm">
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{candidate.name}</h3>
                  {candidate.verified && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {candidate.isPotentialPrincipal && <Star className="h-5 w-5 text-yellow-500" />}
                </div>
                <p className="text-gray-500">{candidate.yearsOfExperience} years of experience</p>
                <div className="flex gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">State:</span>
                  <Select
                    value={candidate.state}
                    onValueChange={(value) => updateCandidateState(candidate.id, value as CandidateState)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidateStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state.charAt(0).toUpperCase() + state.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {candidate.stateUpdatedBy && (
                  <p className="text-xs text-gray-400">Updated by: {candidate.stateUpdatedBy}</p>
                )}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`isPotentialPrincipal-${candidate.id}`}
                    checked={candidate.isPotentialPrincipal}
                    onCheckedChange={() => togglePotentialPrincipal(candidate.id)}
                  />
                  <label htmlFor={`isPotentialPrincipal-${candidate.id}`}>Potential Principal</label>
                </div>
                <div className="space-y-2">
                  <label htmlFor={`notes-${candidate.id}`} className="text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    id={`notes-${candidate.id}`}
                    value={candidate.notes}
                    onChange={(e) => updateNotes(candidate.id, e.target.value)}
                    placeholder="Add notes about the candidate..."
                    className="w-full"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => openEditDialog(candidate)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Candidate Details</DialogTitle>
                    </DialogHeader>
                    {editingCandidate && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name" className="text-right">
                            Name
                          </label>
                          <Input
                            id="name"
                            value={editingCandidate.name}
                            onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="email" className="text-right">
                            Email
                          </label>
                          <Input
                            id="email"
                            value={editingCandidate.email}
                            onChange={(e) => setEditingCandidate({ ...editingCandidate, email: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="phone" className="text-right">
                            Phone
                          </label>
                          <Input
                            id="phone"
                            value={editingCandidate.phone}
                            onChange={(e) => setEditingCandidate({ ...editingCandidate, phone: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <Button onClick={saveEditedCandidate}>Save Changes</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-right">
                <div className="text-4xl font-semibold text-green-600">{candidate.matchScore}%</div>
                <div className="text-gray-500">Match Score</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
