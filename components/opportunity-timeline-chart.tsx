"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, ChevronDown, ChevronUp, Users, Star, CheckCircle2, Shield, MessageSquare, UserCheck, Briefcase } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { buildOpportunityLikeFromTimeline, calculateMomentumFromOpportunity, getMomentumDescription } from "@/lib/momentum"
import type { TimelinePipelineDataPoint } from "@/data/mock-timeline-data"

interface OpportunityTimelineChartProps {
  data: TimelinePipelineDataPoint[]
}

const chartConfig = {
  sourcing: {
    label: "Sourcing",
    color: "hsl(var(--chart-1))",
  },
  matching: {
    label: "Preference Match",
    color: "hsl(var(--chart-2))",
  },
  deployability: {
    label: "Deployability Check",
    color: "hsl(var(--chart-3))",
  },
  verifications: {
    label: "Verifications",
    color: "hsl(var(--chart-4))",
  },
  recommendation: {
    label: "Recommendation",
    color: "hsl(var(--chart-5))",
  },
  putting: {
    label: "Putting",
    color: "hsl(var(--chart-6))",
  },
  deployment: {
    label: "Deployment",
    color: "hsl(var(--chart-7))",
  },
};

export function OpportunityTimelineChart({ data }: OpportunityTimelineChartProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  
  // Find Fibonacci milestone dates and calculate days elapsed
  const fibonacciMilestones = [1, 2, 3, 5, 8]
  const startDate = new Date(data[0]?.date || new Date())
  
  const milestoneDates = fibonacciMilestones.map(milestone => {
    const milestoneData = data.find(point => point.recommendation >= milestone)
    if (!milestoneData) return null
    
    const milestoneDate = new Date(milestoneData.date)
    const daysElapsed = Math.ceil((milestoneDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      value: milestone,
      date: milestoneData.date,
      daysElapsed
    }
  }).filter(milestone => milestone !== null) // Only include milestones that were reached

  // Calculate momentum metrics
  const latestData = data[data.length - 1]
  const previousData = data[data.length - 2] || data[0]
  
  
  const momentumMetrics = {
    sourcing: {
      current: latestData?.sourcing || 0,
      change: (latestData?.sourcing || 0) - (previousData?.sourcing || 0),
      trend: (latestData?.sourcing || 0) > (previousData?.sourcing || 0) ? 'up' : 'down'
    },
    matching: {
      current: latestData?.matching || 0,
      change: (latestData?.matching || 0) - (previousData?.matching || 0),
      trend: (latestData?.matching || 0) > (previousData?.matching || 0) ? 'up' : 'down'
    },
    deployability: {
      current: latestData?.deployability || 0,
      change: (latestData?.deployability || 0) - (previousData?.deployability || 0),
      trend: (latestData?.deployability || 0) > (previousData?.deployability || 0) ? 'up' : 'down'
    },
    verifications: {
      current: latestData?.verifications || 0,
      change: (latestData?.verifications || 0) - (previousData?.verifications || 0),
      trend: (latestData?.verifications || 0) > (previousData?.verifications || 0) ? 'up' : 'down'
    },
    recommendation: {
      current: latestData?.recommendation || 0,
      change: (latestData?.recommendation || 0) - (previousData?.recommendation || 0),
      trend: (latestData?.recommendation || 0) > (previousData?.recommendation || 0) ? 'up' : 'down'
    },
    putting: {
      current: latestData?.putting || 0,
      change: (latestData?.putting || 0) - (previousData?.putting || 0),
      trend: (latestData?.putting || 0) > (previousData?.putting || 0) ? 'up' : 'down'
    },
    deployment: {
      current: latestData?.deployment || 0,
      change: (latestData?.deployment || 0) - (previousData?.deployment || 0),
      trend: (latestData?.deployment || 0) > (previousData?.deployment || 0) ? 'up' : 'down'
    }
  }

  // Build pretty stages list for collapsed view
  const stagesPretty = [
    { key: 'sourcing', label: 'Sourcing', icon: Users },
    { key: 'matching', label: 'Matching', icon: Star },
    { key: 'deployability', label: 'Deployability', icon: Briefcase },
    { key: 'verifications', label: 'Verifications', icon: Shield },
    { key: 'recommendation', label: 'Recommendation', icon: CheckCircle2 },
    { key: 'putting', label: 'Putting', icon: MessageSquare },
    { key: 'deployment', label: 'Deployment', icon: UserCheck },
  ] as const

  // Primary momentum identical to OpportunityCard
  const opportunityLike = buildOpportunityLikeFromTimeline(
    data.map(d => ({ date: d.date, recommendation: d.recommendation }))
  )
  const momentum = calculateMomentumFromOpportunity(opportunityLike)
  const momentumDescriptor = getMomentumDescription(momentum)

  // Progress ring for momentum
  const ringSize = 120
  const ringStroke = 10
  const radius = (ringSize - ringStroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, momentum))
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pipeline Velocity
          </div>
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      
      {isCollapsed && (
        <CardContent className="p-6">
          {/* Enhanced collapsed layout */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Momentum progress ring */}
            <div className={`relative rounded-2xl p-4 border ${momentum >= 80 ? 'border-emerald-300 bg-emerald-50/40' : momentum >= 60 ? 'border-blue-300 bg-blue-50/40' : momentum >= 40 ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-slate-50'}`}>
              <div className="relative flex flex-col items-center" style={{ width: ringSize, height: ringSize }}>
                <svg width={ringSize} height={ringSize}>
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={ringStroke}
                    fill="none"
                  />
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={momentum >= 80 ? '#10b981' : momentum >= 60 ? '#3b82f6' : momentum >= 40 ? '#f59e0b' : '#64748b'}
                    strokeWidth={ringStroke}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-5xl font-black ${momentum >= 80 ? 'text-emerald-600' : momentum >= 60 ? 'text-blue-600' : momentum >= 40 ? 'text-amber-600' : 'text-slate-600'}`}>{momentum}</div>
                </div>
              </div>
              {/* Descriptor pill/text placed below ring, centered */}
              <div className="mt-2 flex flex-col items-center">
                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${momentum >= 80 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : momentum >= 60 ? 'bg-blue-100 text-blue-800 border-blue-200' : momentum >= 40 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>{momentumDescriptor}</div>
                <div className="mt-1 text-xs text-muted-foreground">from spec to today</div>
              </div>
            </div>

            {/* Stages metric cards */}
            <TooltipProvider>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-3 w-full">
                {stagesPretty.map(({ key, label, icon: Icon }) => {
                  const metric = (momentumMetrics as any)[key]
                  const colorClasses = metric.trend === 'up'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-red-700 bg-red-50 border-red-200'

                  return (
                    <Tooltip key={key}>
                      <TooltipTrigger asChild>
                        <div className="group rounded-xl border bg-background hover:bg-muted/60 transition-colors p-3 flex flex-col items-center text-center cursor-default">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1"><Icon className="h-3.5 w-3.5" /> {label}</div>
                          <div className="text-2xl font-extrabold text-foreground leading-tight">{metric.current}</div>
                          <div className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorClasses}`}>
                            {metric.trend === 'up' ? '↗' : '↘'} {Math.abs(metric.change)}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">{label}: {metric.current} (change {metric.trend === 'up' ? '+' : '-'}{Math.abs(metric.change)})</div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      )}
      
      {!isCollapsed && (
        <CardContent className="p-6">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 50,
              left: 50,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-sm fill-muted-foreground"
              interval={4}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-sm fill-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            
            {/* Fibonacci Milestone Reference Lines */}
            {milestoneDates.map((milestone, index) => {
              const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]
              const color = colors[index % colors.length]
              
              return (
                <ReferenceLine 
                  key={milestone.value}
                  x={milestone.date} 
                  stroke={color} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ 
                    value: `${milestone.value} (${milestone.daysElapsed}d)`, 
                    position: "top", 
                    style: { fill: color, fontSize: "11px", fontWeight: "bold" } 
                  }}
                />
              )
            })}
            
            <Line
              type="monotone"
              dataKey="sourcing"
              stroke="var(--color-sourcing)"
              strokeWidth={3}
              dot={{ fill: "var(--color-sourcing)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="matching"
              stroke="var(--color-matching)"
              strokeWidth={3}
              dot={{ fill: "var(--color-matching)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="deployability"
              stroke="var(--color-deployability)"
              strokeWidth={3}
              dot={{ fill: "var(--color-deployability)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="verifications"
              stroke="var(--color-verifications)"
              strokeWidth={3}
              dot={{ fill: "var(--color-verifications)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="recommendation"
              stroke="var(--color-recommendation)"
              strokeWidth={3}
              dot={{ fill: "var(--color-recommendation)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="putting"
              stroke="var(--color-putting)"
              strokeWidth={3}
              dot={{ fill: "var(--color-putting)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="deployment"
              stroke="var(--color-deployment)"
              strokeWidth={3}
              dot={{ fill: "var(--color-deployment)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="space-y-3 mt-4">
          {/* Data Lines Legend */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
              <span className="text-sm text-muted-foreground">Sourcing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
              <span className="text-sm text-muted-foreground">Preferences match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]" />
              <span className="text-sm text-muted-foreground">Deployability Check</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-4))]" />
              <span className="text-sm text-muted-foreground">Verifications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-5))]" />
              <span className="text-sm text-muted-foreground">Recommendation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-6))]" />
              <span className="text-sm text-muted-foreground">Putting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-7))]" />
              <span className="text-sm text-muted-foreground">Deployment</span>
            </div>
          </div>
          
          {/* Fibonacci Milestone Markers Legend */}
          <div className="flex flex-wrap gap-4 justify-center">
            {milestoneDates.map((milestone, index) => {
              const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]
              const color = colors[index % colors.length]
              
              return (
                <div key={milestone.value} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-0.5" 
                    style={{ 
                      backgroundImage: `repeating-linear-gradient(to right, ${color} 0px, ${color} 5px, transparent 5px, transparent 10px)` 
                    }} 
                  />
                  <span className="text-sm text-muted-foreground">
                    {milestone.value} Recommendations ({milestone.daysElapsed} days)
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        </CardContent>
      )}
    </Card>
  )
}
