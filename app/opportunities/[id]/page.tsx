"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CandidateLifecycle } from "@/components/candidate-lifecycle"
import { OpportunityDetails } from "@/components/opportunity-details"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Edit, ArrowLeft, Pause, Play, Archive, Share2 } from "lucide-react"
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
    <div className="container max-w-[1600px] mx-auto p-2 py-4">
      <div className="flex flex-col gap-2 mb-4">
        <Tabs defaultValue="lifecycle" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <TabsList className="h-8">
              <TabsTrigger value="lifecycle" className="text-xs px-2 py-1">
                Candidate Lifecycle
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs px-2 py-1">
                Opportunity Details
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs px-2 py-1">
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" asChild>
                <a href="/">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back
                </a>
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                {opportunity.status === "active" ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Activate
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="h-3 w-3 mr-1" />
                Archive
              </Button>
            </div>
          </div>

          <TabsContent value="lifecycle" className="mt-3">
            <CandidateLifecycle opportunity={opportunity} />
          </TabsContent>

          <TabsContent value="details" className="mt-3">
            <OpportunityDetails opportunity={opportunity} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-3">
            <AnalyticsDashboard opportunity={opportunity} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
