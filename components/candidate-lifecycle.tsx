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

interface CandidateLifecycleProps {
  opportunity: any
}

export function CandidateLifecycle({ opportunity }: CandidateLifecycleProps) {
  const [activeStage, setActiveStage] = useState("source")

  const stages = [
    { id: "source", label: "Source", icon: Users, count: opportunity.stages.source.count, color: "bg-blue-500" },
    { id: "screen", label: "Screen", icon: UserCheck, count: opportunity.stages.screen.count, color: "bg-purple-500" },
    { id: "match", label: "Match", icon: CheckCircle2, count: opportunity.stages.match.count, color: "bg-green-500" },
    {
      id: "recommend",
      label: "Recommend",
      icon: Star,
      count: opportunity.stages.recommend.count,
      color: "bg-amber-500",
    },
    { id: "deploy", label: "Deploy", icon: Briefcase, count: opportunity.stages.deploy.count, color: "bg-red-500" },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="source" value={activeStage} onValueChange={setActiveStage}>
        <TabsList className="grid grid-cols-5 mb-4">
          {stages.map((stage) => (
            <TabsTrigger key={stage.id} value={stage.id} className="flex items-center gap-1 py-1.5">
              <stage.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">{stage.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs py-0 px-1.5 h-5">
                {stage.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="source">
          <SourceStage />
        </TabsContent>

        <TabsContent value="screen">
          <ScreeningStage />
        </TabsContent>

        <TabsContent value="match">
          <MatchStage />
        </TabsContent>

        <TabsContent value="recommend">
          <RecommendStage />
        </TabsContent>

        <TabsContent value="deploy">
          <DeployStage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
