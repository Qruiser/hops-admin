"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, LineChart, Star } from "lucide-react"
import { Candidates } from "./candidates"

export function RecommendationTabs() {
  const [activeTab, setActiveTab] = useState("initial")

  return (
    <Tabs defaultValue="initial" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="initial" className="flex items-center gap-2">
          <Clock className={`h-4 w-4 ${activeTab === "initial" ? "text-primary" : "text-muted-foreground"}`} />
          Initial Match
        </TabsTrigger>
        <TabsTrigger value="analysis" className="flex items-center gap-2">
          <LineChart className={`h-4 w-4 ${activeTab === "analysis" ? "text-primary" : "text-muted-foreground"}`} />
          Talent Analysis
        </TabsTrigger>
        <TabsTrigger value="final" className="flex items-center gap-2">
          <Star className={`h-4 w-4 ${activeTab === "final" ? "text-primary" : "text-muted-foreground"}`} />
          Final Recommendation
        </TabsTrigger>
      </TabsList>
      <TabsContent value="initial">
        <Candidates />
      </TabsContent>
      <TabsContent value="analysis">
        <div className="p-4 text-center text-muted-foreground">Talent analysis content will be displayed here.</div>
      </TabsContent>
      <TabsContent value="final">
        <div className="p-4 text-center text-muted-foreground">
          Final recommendation content will be displayed here.
        </div>
      </TabsContent>
    </Tabs>
  )
}
