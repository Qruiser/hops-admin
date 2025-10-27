"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CandidateLifecycle } from "@/components/candidate-lifecycle"
import { OpportunityDetails } from "@/components/opportunity-details"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Edit, ArrowLeft, Pause, Play, Archive, Share2, Briefcase, TrendingUp } from "lucide-react"
import { useHeader } from "@/components/header-context"

export default function OpportunityPage() {
  const params = useParams()
  const opportunityId = params.id as string
  const { setHeader } = useHeader()

  // In a real app, you would fetch the opportunity details based on the ID
  const opportunity = {
    id: opportunityId,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    companyLogo: "/placeholder.svg?height=40&width=40",
    workType: "Remote",
    location: "United States",
    employmentType: "Full-time",
    status: "active",
    isHot: true,
    isAging: false,
    applications: 24,
    matchPercentage: 85,
    recommended: 6,
    shortlisted: 3,
    lastUpdated: "2023-05-15",
    description:
      "We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have experience with React, TypeScript, and modern frontend development practices.",
    requirements: [
      "5+ years of experience in frontend development",
      "Strong knowledge of React and TypeScript",
      "Experience with state management libraries",
      "Understanding of responsive design principles",
      "Experience with testing frameworks",
    ],
    stages: {
      source: { count: 24, avgTime: "2 days" },
      screen: { count: 18, avgTime: "3 days" },
      match: { count: 12, avgTime: "2 days" },
      recommend: { count: 6, avgTime: "1 day" },
      deploy: { count: 3, avgTime: "5 days" },
    },
  }

  const [activeTab, setActiveTab] = useState("lifecycle")

  // Update the header with opportunity details
  useEffect(() => {
    setHeader(opportunity.title, `${opportunity.company} • ${opportunity.workType} • ${opportunity.location}`)
    
    // Cleanup: reset to default when component unmounts
    return () => {
      setHeader("Recruitment Dashboard", "Manage your recruitment opportunities and candidates")
    }
  }, [opportunity.title, opportunity.company, opportunity.workType, opportunity.location, setHeader])

  return (
    <div className="container max-w-[1600px] mx-auto p-6 py-8 space-y-6">
      <Tabs defaultValue="lifecycle" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="h-10">
            <TabsTrigger value="lifecycle" className="px-4">
              <Briefcase className="h-4 w-4 mr-2" />
              Candidate Lifecycle
            </TabsTrigger>
            <TabsTrigger value="details" className="px-4">
              <Edit className="h-4 w-4 mr-2" />
              Opportunity Details
            </TabsTrigger>
            <TabsTrigger value="analytics" className="px-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </a>
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              {opportunity.status === "active" ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>

        <TabsContent value="lifecycle" className="mt-4">
          <CandidateLifecycle opportunity={opportunity} />
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <OpportunityDetails opportunity={opportunity} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <AnalyticsDashboard opportunity={opportunity} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
