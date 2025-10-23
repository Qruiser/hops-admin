"use client"

import { useState } from "react"
import { TalentCard } from "@/components/talent-card"
import { TalentSearch } from "@/components/talent-search"
import { TalentProfile } from "@/components/talent-profile"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, List, Filter } from "lucide-react"
import { mockTalentData } from "@/data/mock-talent-data"
import type { Talent } from "@/types/talent"
import { FilterDialog } from "@/components/filter-dialog"

export function TalentPoolView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Filter talent based on search query and active tab
  const filteredTalent = mockTalentData.filter((talent) => {
    // Comprehensive search across all fields
    const matchesSearch =
      searchQuery === "" ||
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.engagementType.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      talent.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (talent.talentGraph?.capabilities || []).some((cap) =>
        cap.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      (talent.talentGraph?.traits || []).some((trait) => trait.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "available" && talent.availability.status === "Available") ||
      (activeTab === "partial" && talent.availability.status === "Partially Available") ||
      (activeTab === "unavailable" && talent.availability.status === "Unavailable")

    return matchesSearch && matchesTab
  })

  const handleTalentClick = (talent: Talent) => {
    setSelectedTalent(talent)
    setIsProfileOpen(true)
  }

  const handleCloseProfile = () => {
    setIsProfileOpen(false)
  }

  const handleApplyFilters = (filters: string[]) => {
    setActiveFilters(filters)
    setIsFilterOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Talent</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="partial">Partially Available</TabsTrigger>
            <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary/10" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary/10" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <TalentSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilters.length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div key={filter} className="bg-muted rounded-full px-3 py-1 text-sm flex items-center gap-1">
                {filter}
                <button
                  onClick={() => setActiveFilters(activeFilters.filter((f) => f !== filter))}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => setActiveFilters([])}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredTalent.map((talent) => (
            <TalentCard key={talent.id} talent={talent} viewMode={viewMode} onClick={() => handleTalentClick(talent)} />
          ))}
        </div>

        {filteredTalent.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No talent profiles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {selectedTalent && <TalentProfile talent={selectedTalent} isOpen={isProfileOpen} onClose={handleCloseProfile} />}

      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilters={handleApplyFilters}
        activeFilters={activeFilters}
      />
    </div>
  )
}
