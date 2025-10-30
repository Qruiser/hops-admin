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
  const [activeStage, setActiveStage] = useState("sourcing")

  const stages = [
    { id: "sourcing", label: "Sourcing", icon: Users, color: "bg-blue-500", count: opportunity.stages.sourcing?.count ?? 0 },
    { id: "matching", label: "Matching Preferences", icon: Star, color: "bg-indigo-500", count: opportunity.stages.matching?.count ?? 0 },
    { id: "deployability", label: "Deployability Check", icon: Briefcase, color: "bg-cyan-500", count: opportunity.stages.deployability?.count ?? 0 },
    { id: "verifications", label: "Verifications", icon: CheckCircle2, color: "bg-purple-500", count: opportunity.stages.verifications?.count ?? 0 },
    { id: "recommendation", label: "Recommendation", icon: Star, color: "bg-amber-500", count: opportunity.stages.recommendation?.count ?? 0 },
    { id: "putting", label: "Putting", icon: Users, color: "bg-pink-500", count: opportunity.stages.putting?.count ?? 0 },
    { id: "deployment", label: "Deployment", icon: UserCheck, color: "bg-green-500", count: opportunity.stages.deployment?.count ?? 0 },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="sourcing" value={activeStage} onValueChange={setActiveStage}>
        <TabsList className="grid grid-cols-7 mb-4">
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
