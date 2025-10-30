"use client"

import { useState, useEffect } from "react"
import { OpportunityCard } from "@/components/opportunity-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Plus, Filter, Archive, Search, SlidersHorizontal } from "lucide-react"
import { CreateOpportunityDialog } from "@/components/create-opportunity-dialog"
import { FilterDialog } from "@/components/filter-dialog"
import { CompanyListView } from "@/components/company-list-view"
import { useHeader } from "@/components/header-context"
import { useOpportunityTimeline } from "@/hooks/useOpportunityTimeline"

import { opportunities } from "@/data/mock-opportunities"
import { generateOpportunityTimelinePipelineData, type TimelinePipelineDataPoint } from "@/data/mock-timeline-data"

const companies = [
  {
    id: "1",
    name: "TechCorp",
    logo: "/placeholder.svg?height=40&width=40",
    lastActivity: "Today",
    activeRoles: 5,
    notifications: 3,
  },
  {
    id: "2",
    name: "FinanceHub",
    logo: "/placeholder.svg?height=40&width=40",
    lastActivity: "Yesterday",
    activeRoles: 3,
    notifications: 1,
  },
  {
    id: "3",
    name: "CloudTech",
    logo: "/placeholder.svg?height=40&width=40",
    lastActivity: "3 days ago",
    activeRoles: 2,
    notifications: 0,
  },
  {
    id: "4",
    name: "CreativeStudio",
    logo: "/placeholder.svg?height=40&width=40",
    lastActivity: "Today",
    activeRoles: 4,
    notifications: 2,
  },
  {
    id: "5",
    name: "AnalyticsPro",
    logo: "/placeholder.svg?height=40&width=40",
    lastActivity: "1 week ago",
    activeRoles: 1,
    notifications: 0,
  },
]

export default function OpportunitiesPage() {
  const { setHeader } = useHeader()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("lastUpdated")
  const [viewMode, setViewMode] = useState("priority")
  const [viewType, setViewType] = useState("opportunities")

  // Update the header with page title
  useEffect(() => {
    setHeader("Opportunities", "Manage your recruitment opportunities and candidates")
    
    // Cleanup: reset to default when component unmounts
    return () => {
      setHeader("Recruitment Dashboard", "Manage your recruitment opportunities and candidates")
    }
  }, [setHeader])

  // Filter opportunities based on search term and view mode
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesViewMode =
      (viewMode === "active" && opportunity.status === "active") ||
      (viewMode === "paused" && opportunity.status === "paused") ||
      (viewMode === "priority" && opportunity.isHot === true) ||
      viewMode === "all"

    return matchesSearch && matchesViewMode
  })

  // Sort opportunities based on sort option
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortOption) {
      case "lastUpdated":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "applications":
        return b.applications - a.applications
      case "matchPercentage":
        return b.matchPercentage - a.matchPercentage
      case "shortlisted":
        return b.shortlisted - a.shortlisted
      case "notifications":
        return b.notifications - a.notifications
      default:
        return 0
    }
  })

  return (
    <div className="container max-w-[1600px] mx-auto p-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs defaultValue="priority" value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="priority">Priority</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs defaultValue="opportunities" value={viewType} onValueChange={setViewType} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="opportunities">Roles</TabsTrigger>
            <TabsTrigger value="companies">Clients</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={viewType === "opportunities" ? "Search roles..." : "Search companies..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-auto">
              <div className="flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sort by: </span>
                {sortOption === "lastUpdated" && "Last Updated"}
                {sortOption === "applications" && "Applications"}
                {sortOption === "matchPercentage" && "Match %"}
                {sortOption === "shortlisted" && "Shortlisted"}
                {sortOption === "notifications" && "Notifications"}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastUpdated">Last Updated</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
              <SelectItem value="matchPercentage">Match %</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="notifications">Notifications</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {viewType === "opportunities" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} timelineData={useOpportunityTimeline(opportunity.id)} />
          ))}
        </div>
      ) : (
        <CompanyListView companies={companies} searchTerm={searchTerm} />
      )}

      {viewType === "opportunities" && sortedOpportunities.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No roles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-lg bg-background"
          onClick={() => setIsFilterDialogOpen(true)}
        >
          <Filter className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="outline" className="h-12 w-12 rounded-full shadow-lg bg-background">
          <Archive className="h-5 w-5" />
        </Button>
      </div>

      <CreateOpportunityDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      <FilterDialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen} />
    </div>
  )
}
