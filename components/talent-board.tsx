"use client"

import { useState } from "react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Upload, Filter } from "lucide-react"
import { CandidateCard } from "./candidate-card"
import { CandidateProfile } from "./candidate-profile"
import { CandidateLeaderboard } from "./candidate-leaderboard"
import { Column } from "./column"

// Define candidate stages
const columns = [
  { id: "sourcing", title: "Sourcing" },
  { id: "matching", title: "Matching" },
  { id: "deployability", title: "Deployability" },
  { id: "verifications", title: "Verifications" },
  { id: "recommendation", title: "Recommendation" },
  { id: "putting", title: "Putting" },
  { id: "deployment", title: "Deployment" },
]

// Sample candidate data
const initialCandidates = [
  {
    id: "1",
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "123-456-7890",
    yearsExperience: 4,
    skills: ["Java", "Spring", "SQL"],
    matchScore: 92,
    verified: true,
    stage: "sourcing",
    isPotentialPrincipal: false,
    notes: "",
    applyDate: new Date("2023-01-15").toISOString(),
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    phone: "234-567-8901",
    yearsExperience: 5,
    skills: ["React", "Node.js"],
    matchScore: 85,
    verified: true,
    stage: "sourcing",
    isPotentialPrincipal: false,
    notes: "",
    applyDate: new Date("2023-02-01").toISOString(),
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "345-678-9012",
    yearsExperience: 3,
    skills: ["Python", "Data Science"],
    matchScore: 78,
    verified: true,
    stage: "matching",
    isPotentialPrincipal: false,
    notes: "",
    applyDate: new Date("2023-01-20").toISOString(),
  },
  {
    id: "4",
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "456-789-0123",
    yearsExperience: 7,
    skills: ["JavaScript", "React", "Vue"],
    matchScore: 88,
    verified: true,
    stage: "deployment",
    isPotentialPrincipal: true,
    notes: "Excellent candidate, ready for client recommendation",
    applyDate: new Date("2023-02-10").toISOString(),
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "567-890-1234",
    yearsExperience: 6,
    skills: ["Java", "Spring Boot", "Microservices"],
    matchScore: 91,
    verified: true,
    stage: "recommendation",
    isPotentialPrincipal: true,
    notes: "Excellent candidate, ready for offer",
    applyDate: new Date("2023-01-05").toISOString(),
  },
]

export function TalentBoard() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [viewMode, setViewMode] = useState<"board" | "leaderboard">("board")
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null)
  const [isProfileVisible, setIsProfileVisible] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newStage = destination.droppableId

    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) => {
        if (candidate.id === draggableId) {
          return {
            ...candidate,
            stage: newStage,
          }
        }
        return candidate
      }),
    )
  }

  const handleCandidateClick = (candidate: any) => {
    setSelectedCandidate(candidate)
    setIsProfileVisible(true)
  }

  const handleCloseProfile = () => {
    setIsProfileVisible(false)
    setTimeout(() => setSelectedCandidate(null), 300) // Wait for the animation to complete
  }

  const updateCandidate = (updatedCandidate: any) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) => (candidate.id === updatedCandidate.id ? updatedCandidate : candidate)),
    )
    setSelectedCandidate(updatedCandidate)
  }

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "board" ? "leaderboard" : "board"))
    setFilter("all")
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload CVs
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={toggleViewMode} variant="outline">
            {viewMode === "board" ? (
              <>
                <List className="mr-2 h-4 w-4" />
                Leaderboard View
              </>
            ) : (
              <>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Board View
              </>
            )}
          </Button>
        </div>
      </div>

      {viewMode === "board" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {columns.map((column) => (
              <Column key={column.id} column={column}>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {candidates
                        .filter((candidate) => candidate.stage === column.id)
                        .map((candidate, index) => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            index={index}
                            onClick={handleCandidateClick}
                          />
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Column>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <CandidateLeaderboard
          candidates={candidates}
          updateCandidate={updateCandidate}
          filter={filter}
          onFilterChange={setFilter}
        />
      )}

      {selectedCandidate && (
        <CandidateProfile
          candidate={selectedCandidate}
          onClose={handleCloseProfile}
          updateCandidate={updateCandidate}
          isVisible={isProfileVisible}
        />
      )}
    </div>
  )
}
