"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import { TalentCard } from "@/components/talent-card"
import { TalentProfile } from "@/components/talent-profile"
import { TalentSearch } from "@/components/talent-search"
import { FilterDialog } from "@/components/filter-dialog"
import { mockTalentData } from "@/data/mock-talent-data"
import type { Talent } from "@/types/talent"

export function AdvancedSearchView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Talent[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSearch = () => {
    // Filter talent based on search criteria
    const results = mockTalentData.filter((talent) => {
      // Comprehensive search across all fields
      const matchesQuery =
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

      return matchesQuery
    })

    setSearchResults(results)
    setHasSearched(true)
  }

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <TalentSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search across all talent data..."
              />
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
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
                <div className="flex flex-wrap gap-2 mt-4">
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
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{hasSearched ? `${searchResults.length} Results` : "Search Results"}</h2>

          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {hasSearched ? (
          searchResults.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {searchResults.map((talent) => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  viewMode={viewMode}
                  onClick={() => handleTalentClick(talent)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            </Card>
          )
        ) : (
          <Card className="p-8 text-center">
            <div className="space-y-2">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">Use the search filters</h3>
              <p className="text-muted-foreground">Set your search criteria and click Search to find talent</p>
            </div>
          </Card>
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
