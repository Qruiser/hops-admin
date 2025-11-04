"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CandidateLifecycle } from "@/components/candidate-lifecycle"
import { OpportunityDetails } from "@/components/opportunity-details"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { OpportunityTimelineChart } from "@/components/opportunity-timeline-chart"
import { useOpportunityTimeline } from "@/hooks/useOpportunityTimeline"
import { Edit, ArrowLeft, Pause, Play, Archive, Share2, Briefcase, TrendingUp, Eye, EyeOff, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useHeader } from "@/components/header-context"
import { getOpportunityById } from "@/data/mock-opportunities"

export default function OpportunityPage() {
  const params = useParams()
  const opportunityId = params.id as string
  const { setHeader } = useHeader()
  const { toast } = useToast()

  // Use shared data to derive the selected opportunity
  const base = getOpportunityById(opportunityId) ?? getOpportunityById("1")!
  const opportunity = {
    ...base,
    id: opportunityId,
    companyLogo: base.companyLogo || "/placeholder.svg?height=40&width=40",
    stages: {
      sourcing: { count: 24, avgTime: "2 days" },
      matching: { count: 18, avgTime: "3 days" },
      deployability: { count: 12, avgTime: "2 days" },
      verifications: { count: 9, avgTime: "1 day" },
      recommendation: { count: 6, avgTime: "1 day" },
      putting: { count: 4, avgTime: "1 day" },
      deployment: { count: 3, avgTime: "5 days" },
    },
  }

  const [activeTab, setActiveTab] = useState("lifecycle")
  const [isPublished, setIsPublished] = useState(true)
  
  // Generate timeline data for the chart (seeded per opportunity)
  const timelineData = useOpportunityTimeline(opportunityId)

  // Update the header with opportunity details
  useEffect(() => {
    setHeader(opportunity.title, `${opportunity.company} • ${opportunity.workType} • ${opportunity.location}`)
    
    // Cleanup: reset to default when component unmounts
    return () => {
      setHeader("Recruitment Dashboard", "Manage your recruitment opportunities and candidates")
    }
  }, [opportunityId, opportunity.title, opportunity.company, opportunity.workType, opportunity.location, setHeader])

  return (
    <div className="w-full p-6 py-8 space-y-6">
      <div className="container max-w-[1600px] mx-auto">
        <Tabs defaultValue="lifecycle" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="h-10">
              <TabsTrigger value="lifecycle" className="px-4">
                <Briefcase className="h-4 w-4 mr-2" />
                Pipeline
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
              <Button variant="outline" onClick={() => setIsPublished((p) => !p)}>
                {isPublished ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Publish
                  </>
                )}
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
              <Button
                variant="outline"
                onClick={() => {
                  const origin = typeof window !== "undefined" ? window.location.origin : ""
                  const base = origin || "https://jobs.example.com"
                  const url = `${base}/jobs/${opportunityId}`
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(url)
                    toast({ title: "Link copied", description: url })
                  } else {
                    toast({ title: "Job URL", description: url })
                  }
                }}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Link
              </Button>
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>

          {/* Timeline Chart - Full Width */}
          <div className="w-full mb-6">
            <OpportunityTimelineChart data={timelineData} />
          </div>

          <TabsContent value="lifecycle" className="mt-4">
            <CandidateLifecycle opportunity={opportunity} timelineData={timelineData} />
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <OpportunityDetails opportunity={opportunity} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <AnalyticsDashboard opportunity={opportunity} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
