"use client"

import type React from "react"

import { useState } from "react"
import { X, CheckCircle, Download, Edit, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CandidateProfileProps {
  candidate: any
  onClose: () => void
  updateCandidate: (candidate: any) => void
  isVisible: boolean
}

export function CandidateProfile({ candidate, onClose, updateCandidate, isVisible }: CandidateProfileProps) {
  const [notes, setNotes] = useState(candidate.notes)
  const [editingCandidate, setEditingCandidate] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value)
  }

  const handleSaveNotes = () => {
    updateCandidate({ ...candidate, notes })
  }

  const togglePrincipal = () => {
    updateCandidate({ ...candidate, isPotentialPrincipal: !candidate.isPotentialPrincipal })
  }

  const openEditDialog = () => {
    setEditingCandidate({ ...candidate })
    setIsEditDialogOpen(true)
  }

  const saveEditedCandidate = () => {
    if (editingCandidate) {
      updateCandidate(editingCandidate)
      setIsEditDialogOpen(false)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed inset-y-0 right-0 w-2/5 bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <h2 className="text-2xl font-bold">{candidate.name}</h2>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Score</h3>
                <div className="text-3xl font-bold text-green-600">{candidate.matchScore}%</div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <Textarea value={notes} onChange={handleNotesChange} className="w-full min-h-[100px]" />
                <Button onClick={handleSaveNotes} className="mt-2">
                  Save Notes
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="potential-principal"
                  checked={candidate.isPotentialPrincipal}
                  onCheckedChange={togglePrincipal}
                />
                <label htmlFor="potential-principal" className="text-sm font-medium">
                  Potential Principal
                </label>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {candidate.verified && (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    Verified
                  </div>
                )}
                <div>{candidate.yearsExperience} years of experience</div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Current Stage</h3>
                <div>{candidate.stage}</div>
              </div>

              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{candidate.phone}</span>
                </div>
                <div>Applied: {new Date(candidate.applyDate).toLocaleDateString()}</div>
              </div>

              <Button onClick={openEditDialog} className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resume</h3>
                  <div className="border rounded-lg p-4 bg-gray-50 text-center">
                    <p className="text-muted-foreground">Resume preview would appear here</p>
                  </div>
                  <Button className="mt-2" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills & Experience</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {candidate.skills.map((skill: string) => (
                      <div key={skill} className="flex items-center justify-between border p-2 rounded">
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{candidate.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
    </>
  )
}
