"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, FileText, Clock, ExternalLink, Filter, Calendar, Tag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { mockTalentData } from "@/data/mock-talent-data"

interface HidiRecord {
  id: string
  title: string
  summary: string
  url: string
  createdAt: string
  talentId: string
  tags: string[]
  views: number
}

// Extract HIDIs from talent data
const mockHidiRecords: HidiRecord[] = mockTalentData.flatMap((talent) =>
  talent.hidiRecords.map((record, index) => ({
    id: `${talent.id}-${index}`,
    title: record.title,
    summary: record.summary,
    url: record.url,
    createdAt: record.createdAt,
    talentId: talent.id,
    tags: talent.skills.slice(0, 3), // Use some skills as tags for demo
    views: Math.floor(Math.random() * 100) + 1,
  })),
)

export function HidiRecordsView() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month" | "quarter">("all")

  // Get all unique tags
  const allTags = Array.from(new Set(mockHidiRecords.flatMap((record) => record.tags)))

  // Filter records based on search query, tags, and date
  const filteredRecords = mockHidiRecords.filter((record) => {
    const talent = mockTalentData.find((t) => t.id === record.talentId)

    const matchesSearch =
      searchQuery === "" ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (talent && talent.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => record.tags.includes(tag))

    const recordDate = new Date(record.createdAt)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "week" && daysDiff <= 7) ||
      (dateFilter === "month" && daysDiff <= 30) ||
      (dateFilter === "quarter" && daysDiff <= 90)

    return matchesSearch && matchesTags && matchesDate
  })

  // Sort records by date (newest first)
  const sortedRecords = [...filteredRecords].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All HIDIs</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="popular">Most Viewed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search HIDIs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={() => setSelectedTags([])}>
            <Filter className="h-4 w-4 mr-2" />
            {selectedTags.length > 0 ? `Filters (${selectedTags.length})` : "Filters"}
          </Button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleTag(tag)}>
              {tag} ×
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
            Clear all
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRecords.map((record) => {
          const talent = mockTalentData.find((t) => t.id === record.talentId)

          return (
            <Card key={record.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{record.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{record.summary}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {record.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {talent && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={talent.photo || "/placeholder.svg"} alt={talent.name} />
                      <AvatarFallback>{talent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{talent.name}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(record.createdAt))} ago
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{record.views} views</span>
                  </div>
                </div>
                <a
                  href={record.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-primary hover:underline"
                >
                  View HIDI <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {sortedRecords.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">No HIDIs found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedTags.length > 0
                ? "Try adjusting your search or filters"
                : "HIDIs will appear here when talent adds them"}
            </p>
          </div>
        </Card>
      )}

      <div className="bg-muted rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Filter by Tag</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-lg font-medium mt-4 mb-2">Filter by Date</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={dateFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setDateFilter("all")}
          >
            <Calendar className="h-3 w-3 mr-1" />
            All time
          </Badge>
          <Badge
            variant={dateFilter === "week" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setDateFilter("week")}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Last week
          </Badge>
          <Badge
            variant={dateFilter === "month" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setDateFilter("month")}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Last month
          </Badge>
          <Badge
            variant={dateFilter === "quarter" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setDateFilter("quarter")}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Last quarter
          </Badge>
        </div>
      </div>
    </div>
  )
}
