"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, CheckCircle2, Star, Briefcase } from "lucide-react"
import { SourceStage } from "./stages/source-stage"
import { ScreeningStage } from "./stages/screening-stage"
import { MatchStage } from "./stages/match-stage"
import { RecommendStage } from "./stages/recommend-stage"
import { DeployStage } from "./stages/deploy-stage"
import type { TimelinePipelineDataPoint } from "@/data/mock-timeline-data"

interface CandidateLifecycleProps {
  opportunity: any
  timelineData?: TimelinePipelineDataPoint[]
}

export function CandidateLifecycle({ opportunity, timelineData }: CandidateLifecycleProps) {
  const [activeStage, setActiveStage] = useState("sourcing")

  const latest = timelineData && timelineData.length > 0 ? timelineData[timelineData.length - 1] : undefined
  const previous = timelineData && timelineData.length > 1
    ? timelineData[timelineData.length - 2]
    : latest

  const deltas = {
    sourcing: {
      change: (latest?.sourcing || 0) - (previous?.sourcing || 0),
      trend: ((latest?.sourcing || 0) > (previous?.sourcing || 0)) ? "up" : "down",
    },
    matching: {
      change: (latest?.matching || 0) - (previous?.matching || 0),
      trend: ((latest?.matching || 0) > (previous?.matching || 0)) ? "up" : "down",
    },
    deployability: {
      change: (latest?.deployability || 0) - (previous?.deployability || 0),
      trend: ((latest?.deployability || 0) > (previous?.deployability || 0)) ? "up" : "down",
    },
    verifications: {
      change: (latest?.verifications || 0) - (previous?.verifications || 0),
      trend: ((latest?.verifications || 0) > (previous?.verifications || 0)) ? "up" : "down",
    },
    recommendation: {
      change: (latest?.recommendation || 0) - (previous?.recommendation || 0),
      trend: ((latest?.recommendation || 0) > (previous?.recommendation || 0)) ? "up" : "down",
    },
    putting: {
      change: (latest?.putting || 0) - (previous?.putting || 0),
      trend: ((latest?.putting || 0) > (previous?.putting || 0)) ? "up" : "down",
    },
    deployment: {
      change: (latest?.deployment || 0) - (previous?.deployment || 0),
      trend: ((latest?.deployment || 0) > (previous?.deployment || 0)) ? "up" : "down",
    },
  } as const

  const stages = [
    { id: "sourcing", label: "Sourcing", icon: Users, color: "bg-blue-500", count: latest?.sourcing ?? (opportunity.stages.sourcing?.count ?? 0), change: deltas.sourcing.change, trend: deltas.sourcing.trend },
    { id: "matching", label: "Preferences", icon: Star, color: "bg-indigo-500", count: latest?.matching ?? (opportunity.stages.matching?.count ?? 0), change: deltas.matching.change, trend: deltas.matching.trend },
    { id: "deployability", label: "Deployability", icon: Briefcase, color: "bg-cyan-500", count: latest?.deployability ?? (opportunity.stages.deployability?.count ?? 0), change: deltas.deployability.change, trend: deltas.deployability.trend },
    { id: "verifications", label: "Verifications", icon: CheckCircle2, color: "bg-purple-500", count: latest?.verifications ?? (opportunity.stages.verifications?.count ?? 0), change: deltas.verifications.change, trend: deltas.verifications.trend },
    { id: "recommendation", label: "Recommendation", icon: Star, color: "bg-amber-500", count: latest?.recommendation ?? (opportunity.stages.recommendation?.count ?? 0), change: deltas.recommendation.change, trend: deltas.recommendation.trend },
    { id: "putting", label: "Putting", icon: Users, color: "bg-pink-500", count: latest?.putting ?? (opportunity.stages.putting?.count ?? 0), change: deltas.putting.change, trend: deltas.putting.trend },
    { id: "deployment", label: "Deployment", icon: UserCheck, color: "bg-green-500", count: latest?.deployment ?? (opportunity.stages.deployment?.count ?? 0), change: deltas.deployment.change, trend: deltas.deployment.trend },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="sourcing" value={activeStage} onValueChange={setActiveStage}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
          {stages.map((stage) => (
            <TabsTrigger key={stage.id} value={stage.id} className="flex items-center gap-1 py-1.5 whitespace-nowrap">
              <stage.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">{stage.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs py-0 px-1.5 h-5">
                {stage.count}
              </Badge>
              <span className={`ml-1 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${stage.trend === "up" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-red-700 bg-red-50 border-red-200"}`}>
                {stage.trend === "up" ? "↗" : "↘"}
                {Math.abs(stage.change)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="sourcing">
          <SourceStage />
        </TabsContent>
        <TabsContent value="matching">
          <MatchStage />
        </TabsContent>
        <TabsContent value="deployability">
          <ScreeningStage />
        </TabsContent>
        <TabsContent value="verifications">
          <ScreeningStage />
        </TabsContent>
        <TabsContent value="recommendation">
          <RecommendStage />
        </TabsContent>
        <TabsContent value="putting">
          {/* (Optional: create a PuttingStage, else use placeholder) */}
          <div className="p-4 text-center text-muted-foreground">Helping both parties arrive at decision</div>
        </TabsContent>
        <TabsContent value="deployment">
          <DeployStage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
