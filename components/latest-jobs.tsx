"use client"

import type React from "react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Clock,
  Search,
  Users,
  UserPlus,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Settings,
  Edit,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Star,
  Globe,
  Flame,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import type { QRate } from "@/types/client"

// Sample data for latest jobs
const latestJobs: (QRate & {
  clientName: string
  postedDate: string
  lastActivity: string
  description: string
  totalApplicants: number
  newApplicants: number
  recommendedApplicants: number
  payRangeMin: number
  payRangeMax: number
  location: string
  isRemote: boolean
  yearsExperience: number
  engagement: string
})[] = [
  {
    id: "1",
    title: "Senior Developer",
    qruId: "1",
    clientId: "1",
    clientName: "TechCorp",
    isPrincipal: true,
    isFullTime: false,
    isArchived: false,
    postedDate: "2023-05-15",
    lastActivity: "2023-05-20",
    description:
      "Experienced developer needed for leading a team on a new product launch. Strong knowledge of React, Node.js, and cloud infrastructure required.",
    totalApplicants: 24,
    newApplicants: 5,
    recommendedApplicants: 4,
    payRangeMin: 120000,
    payRangeMax: 150000,
    location: "San Francisco, CA",
    isRemote: true,
    yearsExperience: 5,
    engagement: "6 months",
  },
  {
    id: "2",
    title: "UX Designer",
    qruId: "2",
    clientId: "1",
    clientName: "TechCorp",
    isPrincipal: false,
    isFullTime: true,
    isArchived: false,
    postedDate: "2023-05-14",
    lastActivity: "2023-05-19",
    description:
      "Looking for a talented UX designer to improve our product interfaces. Experience with Figma and user research methodologies is a plus.",
    totalApplicants: 18,
    newApplicants: 3,
    recommendedApplicants: 2,
    payRangeMin: 90000,
    payRangeMax: 110000,
    location: "New York, NY",
    isRemote: false,
    yearsExperience: 3,
    engagement: "Permanent",
  },
  {
    id: "3",
    title: "Project Manager",
    qruId: "1",
    clientId: "1",
    clientName: "TechCorp",
    isPrincipal: false,
    isFullTime: false,
    isArchived: false,
    postedDate: "2023-05-12",
    lastActivity: "2023-05-18",
    description:
      "Project manager needed to oversee development of new enterprise software. PMP certification and agile experience required.",
    totalApplicants: 12,
    newApplicants: 0,
    recommendedApplicants: 3,
    payRangeMin: 100000,
    payRangeMax: 130000,
    location: "Chicago, IL",
    isRemote: true,
    yearsExperience: 4,
    engagement: "12 months",
  },
  {
    id: "4",
    title: "Frontend Developer",
    qruId: "1",
    clientId: "2",
    clientName: "FinanceHub",
    isPrincipal: false,
    isFullTime: true,
    isArchived: false,
    postedDate: "2023-05-10",
    lastActivity: "2023-05-21",
    description:
      "Frontend developer with strong TypeScript and React skills needed for our financial dashboard products.",
    totalApplicants: 31,
    newApplicants: 7,
    recommendedApplicants: 5,
    payRangeMin: 85000,
    payRangeMax: 115000,
    location: "Boston, MA",
    isRemote: false,
    yearsExperience: 2,
    engagement: "Permanent",
  },
  {
    id: "5",
    title: "Data Analyst",
    qruId: "2",
    clientId: "2",
    clientName: "FinanceHub",
    isPrincipal: true,
    isFullTime: true,
    isArchived: false,
    postedDate: "2023-05-08",
    lastActivity: "2023-05-17",
    description:
      "Data analyst with financial industry experience needed. Strong SQL and visualization skills required.",
    totalApplicants: 15,
    newApplicants: 2,
    recommendedApplicants: 1,
    payRangeMin: 95000,
    payRangeMax: 120000,
    location: "Remote",
    isRemote: true,
    yearsExperience: 3,
    engagement: "Permanent",
  },
]

// Sample client data for dropdown
const clients = [
  { id: "1", name: "TechCorp" },
  { id: "2", name: "FinanceHub" },
  { id: "3", name: "HealthTech" },
  { id: "4", name: "EduSystems" },
]

// Sample Qru data for dropdown
const qrus = [
  { id: "1", name: "Engineering Qru", clientId: "1" },
  { id: "2", name: "Design Qru", clientId: "1" },
  { id: "3", name: "Marketing Qru", clientId: "1" },
  { id: "4", name: "Finance Qru", clientId: "2" },
  { id: "5", name: "Data Qru", clientId: "2" },
]

interface JobPreferences {
  isRemoteOnly: boolean
  minSalary: number
  maxYearsExperience: number
  isFullTimeOnly: boolean
}

type SortOption =
  | "lastActivity"
  | "postedDate"
  | "alphabetical"
  | "salaryDesc"
  | "salaryAsc"
  | "experienceAsc"
  | "experienceDesc"
  | "applicantsDesc"

interface Filters {
  employmentType: "all" | "fulltime" | "contract"
  remoteStatus: "all" | "remote" | "onsite"
  principalStatus: "all" | "principal" | "nonPrincipal"
  salaryRange: [number, number]
  experienceRange: [number, number]
}

interface NewJob {
  title: string
  clientId: string
  qruId: string
  description: string
  payRangeMin: number
  payRangeMax: number
  location: string
  isRemote: boolean
  yearsExperience: number
  engagement: string
  isPrincipal: boolean
  isFullTime: boolean
}

export function LatestJobs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("lastActivity")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    employmentType: "all",
    remoteStatus: "all",
    principalStatus: "all",
    salaryRange: [0, 200000],
    experienceRange: [0, 10],
  })
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<JobPreferences>({
    isRemoteOnly: false,
    minSalary: 80000,
    maxYearsExperience: 5,
    isFullTimeOnly: false,
  })
  const [jobs, setJobs] = useState(latestJobs)
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false)
  const [newJob, setNewJob] = useState<NewJob>({
    title: "",
    clientId: "",
    qruId: "",
    description: "",
    payRangeMin: 80000,
    payRangeMax: 120000,
    location: "",
    isRemote: false,
    yearsExperience: 2,
    engagement: "Permanent",
    isPrincipal: false,
    isFullTime: true,
  })
  const [selectedClientId, setSelectedClientId] = useState<string>("")

  // Filter Qrus based on selected client
  const filteredQrus = qrus.filter((qru) => !selectedClientId || qru.clientId === selectedClientId)

  // Apply filters
  const filteredJobs = jobs.filter((job) => {
    // Search term filter
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    // Employment type filter
    const matchesEmployment =
      filters.employmentType === "all" ||
      (filters.employmentType === "fulltime" && job.isFullTime) ||
      (filters.employmentType === "contract" && !job.isFullTime)

    // Remote status filter
    const matchesRemote =
      filters.remoteStatus === "all" ||
      (filters.remoteStatus === "remote" && job.isRemote) ||
      (filters.remoteStatus === "onsite" && !job.isRemote)

    // Principal status filter
    const matchesPrincipal =
      filters.principalStatus === "all" ||
      (filters.principalStatus === "principal" && job.isPrincipal) ||
      (filters.principalStatus === "nonPrincipal" && !job.isPrincipal)

    // Salary range filter
    const matchesSalary = job.payRangeMin <= filters.salaryRange[1] && job.payRangeMax >= filters.salaryRange[0]

    // Experience range filter
    const matchesExperience =
      job.yearsExperience >= filters.experienceRange[0] && job.yearsExperience <= filters.experienceRange[1]

    return matchesSearch && matchesEmployment && matchesRemote && matchesPrincipal && matchesSalary && matchesExperience
  })

  // Apply sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortOption) {
      case "lastActivity":
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      case "postedDate":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "salaryDesc":
        return b.payRangeMax - a.payRangeMax
      case "salaryAsc":
        return a.payRangeMin - b.payRangeMin
      case "experienceAsc":
        return a.yearsExperience - b.yearsExperience
      case "experienceDesc":
        return b.yearsExperience - a.yearsExperience
      case "applicantsDesc":
        return b.totalApplicants - a.totalApplicants
      default:
        return 0
    }
  })

  const handleApplicantClick = (e: React.MouseEvent, type: "total" | "new" | "recommended", jobId: string) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real application, you would navigate to the applicants page or open a modal
    console.log(`Viewing ${type} applicants for job ${jobId}`)
    alert(`Viewing ${type} applicants for job ${jobId}`)
  }

  const handleEditPreferences = (e: React.MouseEvent, jobId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedJob(jobId)
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "lastActivity":
        return "Last Activity"
      case "postedDate":
        return "Date Posted"
      case "alphabetical":
        return "Alphabetical"
      case "salaryDesc":
        return "Highest Salary"
      case "salaryAsc":
        return "Lowest Salary"
      case "experienceAsc":
        return "Least Experience"
      case "experienceDesc":
        return "Most Experience"
      case "applicantsDesc":
        return "Most Applicants"
    }
  }

  const resetFilters = () => {
    setFilters({
      employmentType: "all",
      remoteStatus: "all",
      principalStatus: "all",
      salaryRange: [0, 200000],
      experienceRange: [0, 10],
    })
  }

  const getActiveFilterCount = (): number => {
    let count = 0
    if (filters.employmentType !== "all") count++
    if (filters.remoteStatus !== "all") count++
    if (filters.principalStatus !== "all") count++
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) count++
    if (filters.experienceRange[0] > 0 || filters.experienceRange[1] < 10) count++
    return count
  }

  const handleAddNewJob = () => {
    // Find client name
    const client = clients.find((c) => c.id === newJob.clientId)
    const clientName = client ? client.name : "Unknown Client"

    // Create new job object
    const job = {
      ...newJob,
      id: `new-${Date.now()}`,
      clientName,
      postedDate: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
      totalApplicants: 0,
      newApplicants: 0,
      recommendedApplicants: 0,
      isArchived: false,
    }

    // Add to jobs list
    setJobs((prevJobs) => [job, ...prevJobs])

    // Reset form and close dialog
    setNewJob({
      title: "",
      clientId: "",
      qruId: "",
      description: "",
      payRangeMin: 80000,
      payRangeMax: 120000,
      location: "",
      isRemote: false,
      yearsExperience: 2,
      engagement: "Permanent",
      isPrincipal: false,
      isFullTime: true,
    })
    setSelectedClientId("")
    setIsNewJobDialogOpen(false)
  }

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId)
    setNewJob((prev) => ({
      ...prev,
      clientId,
      qruId: "", // Reset qruId when client changes
    }))
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        {/* Search and primary controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">All Q-Rates</h2>
            <Dialog open={isNewJobDialogOpen} onOpenChange={setIsNewJobDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Job</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input
                      id="job-title"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      placeholder="e.g. Senior Developer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Select value={newJob.clientId} onValueChange={handleClientChange}>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qru">Qru</Label>
                    <Select
                      value={newJob.qruId}
                      onValueChange={(value) => setNewJob({ ...newJob, qruId: value })}
                      disabled={!selectedClientId}
                    >
                      <SelectTrigger id="qru">
                        <SelectValue placeholder={selectedClientId ? "Select Qru" : "Select client first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredQrus.map((qru) => (
                          <SelectItem key={qru.id} value={qru.id}>
                            {qru.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="engagement">Engagement</Label>
                    <Select
                      value={newJob.engagement}
                      onValueChange={(value) => setNewJob({ ...newJob, engagement: value })}
                    >
                      <SelectTrigger id="engagement">
                        <SelectValue placeholder="Select engagement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="3 months">3 months</SelectItem>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="12 months">12 months</SelectItem>
                        <SelectItem value="18 months">18 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years-experience">Years of Experience</Label>
                    <Input
                      id="years-experience"
                      type="number"
                      min="0"
                      value={newJob.yearsExperience}
                      onChange={(e) => setNewJob({ ...newJob, yearsExperience: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-salary">Min Salary</Label>
                      <Input
                        id="min-salary"
                        type="number"
                        min="0"
                        step="5000"
                        value={newJob.payRangeMin}
                        onChange={(e) => setNewJob({ ...newJob, payRangeMin: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-salary">Max Salary</Label>
                      <Input
                        id="max-salary"
                        type="number"
                        min="0"
                        step="5000"
                        value={newJob.payRangeMax}
                        onChange={(e) => setNewJob({ ...newJob, payRangeMax: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      placeholder="Describe the job requirements and responsibilities"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-remote"
                      checked={newJob.isRemote}
                      onCheckedChange={(checked) => setNewJob({ ...newJob, isRemote: checked === true })}
                    />
                    <Label htmlFor="is-remote">Remote Position</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-fulltime"
                      checked={newJob.isFullTime}
                      onCheckedChange={(checked) => setNewJob({ ...newJob, isFullTime: checked === true })}
                    />
                    <Label htmlFor="is-fulltime">Full-time Position</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-principal"
                      checked={newJob.isPrincipal}
                      onCheckedChange={(checked) => setNewJob({ ...newJob, isPrincipal: checked === true })}
                    />
                    <Label htmlFor="is-principal">Principal Role</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewJobDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNewJob} disabled={!newJob.title || !newJob.clientId || !newJob.qruId}>
                    Create Job
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs or clients..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort: {getSortLabel(sortOption)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortOption("lastActivity")}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Last Activity</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("postedDate")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date Posted</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>
                    <span className="mr-2 h-4 w-4 flex items-center justify-center">A</span>
                    <span>Alphabetical</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOption("salaryDesc")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Highest Salary</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("salaryAsc")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Lowest Salary</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOption("experienceDesc")}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Most Experience</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("experienceAsc")}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Least Experience</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOption("applicantsDesc")}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Most Applicants</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter toggle button */}
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filter controls */}
        {showFilters && (
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filter Q-Rates</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select
                  value={filters.employmentType}
                  onValueChange={(value) => setFilters({ ...filters, employmentType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Remote Status</Label>
                <Select
                  value={filters.remoteStatus}
                  onValueChange={(value) => setFilters({ ...filters, remoteStatus: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote Only</SelectItem>
                    <SelectItem value="onsite">On-site Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Principal Status</Label>
                <Select
                  value={filters.principalStatus}
                  onValueChange={(value) => setFilters({ ...filters, principalStatus: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="principal">Principal Only</SelectItem>
                    <SelectItem value="nonPrincipal">Non-Principal Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <div className="flex justify-between">
                  <Label>Salary Range</Label>
                  <span className="text-xs text-muted-foreground">
                    {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={200000}
                  step={10000}
                  value={filters.salaryRange}
                  onValueChange={(value) => setFilters({ ...filters, salaryRange: value as [number, number] })}
                  className="py-4"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <div className="flex justify-between">
                  <Label>Years of Experience</Label>
                  <span className="text-xs text-muted-foreground">
                    {filters.experienceRange[0]} - {filters.experienceRange[1]} years
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={filters.experienceRange}
                  onValueChange={(value) => setFilters({ ...filters, experienceRange: value as [number, number] })}
                  className="py-4"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sortedJobs.map((job) => (
          <Link href={`/clients/${job.clientId}/q-rates/${job.id}`} key={job.id} passHref>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow w-full overflow-hidden">
              <CardContent className="p-3">
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Left section - Job title, company, and details */}
                  <div className="flex-grow">
                    {/* Header with title and company */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
                              {job.clientName.charAt(0)}
                            </div>
                            <span className="text-xs font-medium">{job.clientName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={job.isFullTime ? "default" : "secondary"} className="text-xs">
                          {job.isFullTime ? "Full-time" : "Contract"}
                        </Badge>
                        {job.isPrincipal && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                            <Star className="h-3 w-3 mr-0.5" />
                            Principal
                          </Badge>
                        )}
                        {job.isRemote && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                            <Globe className="h-3 w-3 mr-0.5" />
                            Remote
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Job tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold border-transparent bg-primary text-primary-foreground">
                        <DollarSign className="h-3 w-3 mr-0.5" />
                        {formatSalary(job.payRangeMin)} - {formatSalary(job.payRangeMax)}
                      </div>
                      {!job.isRemote && (
                        <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold border-transparent bg-blue-100 text-blue-800">
                          <MapPin className="h-3 w-3 mr-0.5" />
                          {job.location}
                        </div>
                      )}
                      <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold border-transparent bg-orange-100 text-orange-800">
                        <Calendar className="h-3 w-3 mr-0.5" />
                        {job.yearsExperience}+ years
                      </div>
                      <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold border-transparent bg-purple-100 text-purple-800">
                        <Settings className="h-3 w-3 mr-0.5" />
                        {job.engagement}
                      </div>
                    </div>

                    {/* Job description and posted date */}
                    <div className="relative">
                      <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>
                      <div className="absolute right-0 bottom-0 text-[10px] text-gray-400 italic">
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Right section - Applicant stats and actions */}
                  <div className="flex flex-col lg:border-l lg:pl-3 lg:min-w-[180px]">
                    {/* Applicant stats - always horizontal */}
                    <div className="flex gap-2 mb-3">
                      {/* Total Applicants */}
                      <div
                        className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-lg p-2 cursor-pointer transition-colors flex items-center gap-1.5 justify-center"
                        onClick={(e) => handleApplicantClick(e, "total", job.id)}
                      >
                        <Users className="h-4 w-4 text-gray-600" />
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-base leading-tight">{job.totalApplicants}</span>
                          <span className="text-xs text-gray-600 leading-tight">Total</span>
                        </div>
                      </div>

                      {/* New Applicants */}
                      <div
                        className={`flex-1 rounded-lg p-2 cursor-pointer transition-colors flex items-center gap-1.5 justify-center ${
                          job.newApplicants > 0 ? "bg-green-100 hover:bg-green-200" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={(e) => handleApplicantClick(e, "new", job.id)}
                      >
                        <UserPlus className={`h-4 w-4 ${job.newApplicants > 0 ? "text-green-600" : "text-gray-600"}`} />
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-bold text-base leading-tight ${
                              job.newApplicants > 0 ? "text-green-600" : "text-gray-600"
                            }`}
                          >
                            {job.newApplicants}
                          </span>
                          <span
                            className={`text-xs leading-tight ${
                              job.newApplicants > 0 ? "text-green-600" : "text-gray-600"
                            }`}
                          >
                            New
                          </span>
                        </div>
                      </div>

                      {/* Recommended Applicants */}
                      <div
                        className={`flex-1 rounded-lg p-2 cursor-pointer transition-colors flex items-center gap-1.5 justify-center relative ${
                          job.recommendedApplicants > 0
                            ? "bg-blue-100 hover:bg-blue-200"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={(e) => handleApplicantClick(e, "recommended", job.id)}
                      >
                        {job.recommendedApplicants > 3 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
                            <Flame className="h-5 w-5 text-orange-500 z-10 drop-shadow-md" />
                          </div>
                        )}
                        <Star
                          className={`h-4 w-4 ${job.recommendedApplicants > 0 ? "text-blue-600" : "text-gray-600"}`}
                        />
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-bold text-base leading-tight ${
                              job.recommendedApplicants > 0 ? "text-blue-600" : "text-gray-600"
                            }`}
                          >
                            {job.recommendedApplicants}
                          </span>
                          <span
                            className={`text-xs leading-tight ${
                              job.recommendedApplicants > 0 ? "text-blue-600" : "text-gray-600"
                            }`}
                          >
                            Rec
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Edit button */}
                    <Dialog open={selectedJob === job.id} onOpenChange={(open) => !open && setSelectedJob(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 w-full"
                          onClick={(e) => handleEditPreferences(e, job.id)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Job Preferences</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remote-only"
                              checked={preferences.isRemoteOnly}
                              onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, isRemoteOnly: checked as boolean })
                              }
                            />
                            <Label htmlFor="remote-only">Remote jobs only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fulltime-only"
                              checked={preferences.isFullTimeOnly}
                              onCheckedChange={(checked) =>
                                setPreferences({ ...preferences, isFullTimeOnly: checked as boolean })
                              }
                            />
                            <Label htmlFor="fulltime-only">Full-time jobs only</Label>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="min-salary" className="text-right">
                              Minimum Salary
                            </Label>
                            <Input
                              id="min-salary"
                              type="number"
                              value={preferences.minSalary}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  minSalary: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="max-experience" className="text-right">
                              Max Years Experience
                            </Label>
                            <Input
                              id="max-experience"
                              type="number"
                              value={preferences.maxYearsExperience}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  maxYearsExperience: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={() => setSelectedJob(null)}>Save Preferences</Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {sortedJobs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
