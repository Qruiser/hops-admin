"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { buildOpportunityLikeFromTimeline, calculateMomentumFromOpportunity, getMomentumDescription } from "@/lib/momentum"

interface TimelineDataPoint {
  date: string
  applications: number
  matches: number
  evaluations: number
  recommendations: number
  deployments: number
}

interface OpportunityTimelineChartProps {
  data: TimelineDataPoint[]
}

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--chart-1))",
  },
  matches: {
    label: "Matches",
    color: "hsl(var(--chart-2))",
  },
  evaluations: {
    label: "Evaluations",
    color: "hsl(var(--chart-3))",
  },
  recommendations: {
    label: "Recommendations",
    color: "hsl(var(--chart-4))",
  },
  deployments: {
    label: "Deployments",
    color: "hsl(var(--chart-5))",
  },
}

export function OpportunityTimelineChart({ data }: OpportunityTimelineChartProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  
  // Find Fibonacci milestone dates and calculate days elapsed
  const fibonacciMilestones = [1, 2, 3, 5, 8]
  const startDate = new Date(data[0]?.date || new Date())
  
  const milestoneDates = fibonacciMilestones.map(milestone => {
    const milestoneData = data.find(point => point.recommendations >= milestone)
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
    applications: {
      current: latestData?.applications || 0,
      change: (latestData?.applications || 0) - (previousData?.applications || 0),
      trend: (latestData?.applications || 0) > (previousData?.applications || 0) ? 'up' : 'down'
    },
    matches: {
      current: latestData?.matches || 0,
      change: (latestData?.matches || 0) - (previousData?.matches || 0),
      trend: (latestData?.matches || 0) > (previousData?.matches || 0) ? 'up' : 'down'
    },
    evaluations: {
      current: latestData?.evaluations || 0,
      change: (latestData?.evaluations || 0) - (previousData?.evaluations || 0),
      trend: (latestData?.evaluations || 0) > (previousData?.evaluations || 0) ? 'up' : 'down'
    },
    recommendations: {
      current: latestData?.recommendations || 0,
      change: (latestData?.recommendations || 0) - (previousData?.recommendations || 0),
      trend: (latestData?.recommendations || 0) > (previousData?.recommendations || 0) ? 'up' : 'down'
    },
    deployments: {
      current: latestData?.deployments || 0,
      change: (latestData?.deployments || 0) - (previousData?.deployments || 0),
      trend: (latestData?.deployments || 0) > (previousData?.deployments || 0) ? 'up' : 'down'
    }
  }

  // Primary momentum identical to OpportunityCard
  const opportunityLike = buildOpportunityLikeFromTimeline(
    data.map(d => ({ date: d.date, recommendations: d.recommendations }))
  )
  const momentum = calculateMomentumFromOpportunity(opportunityLike)
  const momentumDescriptor = getMomentumDescription(momentum)

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
          {/* All metrics on one line with emphasis on velocity */}
          <div className="flex items-center justify-between gap-8">
            {/* Primary metric: Momentum score - High visual emphasis */}
            <div className={`relative px-6 py-4 rounded-xl border-2 shadow-sm transition-all ${
              momentum >= 80 
                ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50' 
                : momentum >= 60 
                ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50' 
                : momentum >= 40 
                ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50' 
                : 'border-slate-300 bg-gradient-to-br from-slate-50 to-gray-50'
            }`}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`text-xs font-bold tracking-widest uppercase ${
                    momentum >= 80 ? 'text-emerald-700' : momentum >= 60 ? 'text-blue-700' : momentum >= 40 ? 'text-amber-700' : 'text-slate-700'
                  }`}>
                    Pipeline Velocity
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                    momentum >= 80 ? 'bg-emerald-500' : momentum >= 60 ? 'bg-blue-500' : momentum >= 40 ? 'bg-amber-500' : 'bg-slate-500'
                  } animate-pulse`} />
                </div>
                <div className="flex items-baseline gap-3">
                  <div className={`text-6xl font-black tracking-tight drop-shadow-sm ${
                    momentum >= 80 ? 'text-emerald-600' : momentum >= 60 ? 'text-blue-600' : momentum >= 40 ? 'text-amber-600' : 'text-slate-600'
                  }`}>
                    {momentum}
                  </div>
                  <div className={`text-sm font-bold px-3 py-1.5 rounded-full shadow-sm ${
                    momentum >= 80 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : momentum >= 60 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : momentum >= 40 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    {momentumDescriptor}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <div className="text-xs text-muted-foreground font-medium">from spec to today</div>
                </div>
              </div>
            </div>
            
            {/* Secondary synopsis metrics - Inline layout */}
            <div className="flex items-center gap-8 flex-1 justify-end">
              {Object.entries(momentumMetrics).map(([key, metric]) => (
                <div key={key} className="flex flex-col items-center min-w-[70px] group">
                  <div className="text-3xl font-extrabold text-foreground mb-0.5 group-hover:scale-110 transition-transform">
                    {metric.current}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {key}
                  </div>
                  <div className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    metric.trend === 'up' 
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                      : 'text-red-700 bg-red-50 border border-red-200'
                  }`}>
                    {metric.trend === 'up' ? '↗' : '↘'} {Math.abs(metric.change)}
                  </div>
                </div>
              ))}
            </div>
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
              dataKey="applications"
              stroke="var(--color-applications)"
              strokeWidth={3}
              dot={{ fill: "var(--color-applications)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="matches"
              stroke="var(--color-matches)"
              strokeWidth={3}
              dot={{ fill: "var(--color-matches)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="evaluations"
              stroke="var(--color-evaluations)"
              strokeWidth={3}
              dot={{ fill: "var(--color-evaluations)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="recommendations"
              stroke="var(--color-recommendations)"
              strokeWidth={3}
              dot={{ fill: "var(--color-recommendations)", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="deployments"
              stroke="var(--color-deployments)"
              strokeWidth={3}
              dot={{ fill: "var(--color-deployments)", strokeWidth: 2, r: 5 }}
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
              <span className="text-sm text-muted-foreground">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
              <span className="text-sm text-muted-foreground">Matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]" />
              <span className="text-sm text-muted-foreground">Evaluations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-4))]" />
              <span className="text-sm text-muted-foreground">Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-5))]" />
              <span className="text-sm text-muted-foreground">Deployments</span>
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
