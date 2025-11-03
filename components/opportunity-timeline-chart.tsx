"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
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
  
  // Calculate velocity change based on recommendation growth rate
  // Velocity delta represents how momentum is changing today
  const recDelta = (latestData?.recommendation || 0) - (previousData?.recommendation || 0)
  const daysBetween = data.length > 1
    ? Math.max(1, (new Date(latestData.date).getTime() - new Date(previousData.date).getTime()) / (1000 * 60 * 60 * 24))
    : 1
  
  // Velocity is the rate of change, normalized to momentum-like scale (-20 to +20)
  // A recommendation added quickly (same day) counts more than one over many days
  const velocityDelta = Math.round((recDelta / daysBetween) * 5) // Scale factor to match typical momentum changes

  // Calculate 7-day velocity change vs previous 7-day period
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  
  // Find data points in last 7 days and previous 7 days
  const last7DaysData = data.filter(d => new Date(d.date) >= sevenDaysAgo)
  const previous7DaysData = data.filter(d => 
    new Date(d.date) >= fourteenDaysAgo && new Date(d.date) < sevenDaysAgo
  )
  
  // Calculate velocity for last 7 days
  const last7DaysStart = last7DaysData[0] || latestData
  const last7DaysEnd = last7DaysData[last7DaysData.length - 1] || latestData
  const last7DaysRecDelta = (last7DaysEnd?.recommendation || 0) - (last7DaysStart?.recommendation || 0)
  const last7DaysDuration = Math.max(1, (new Date(last7DaysEnd.date).getTime() - new Date(last7DaysStart.date).getTime()) / (1000 * 60 * 60 * 24))
  const last7DaysVelocity = last7DaysDuration > 0 ? (last7DaysRecDelta / last7DaysDuration) * 5 : 0
  
  // Calculate velocity for previous 7 days
  const previous7DaysStart = previous7DaysData[0] || last7DaysStart
  const previous7DaysEnd = previous7DaysData[previous7DaysData.length - 1] || last7DaysStart
  const previous7DaysRecDelta = (previous7DaysEnd?.recommendation || 0) - (previous7DaysStart?.recommendation || 0)
  const previous7DaysDuration = Math.max(1, (new Date(previous7DaysEnd.date).getTime() - new Date(previous7DaysStart.date).getTime()) / (1000 * 60 * 60 * 24))
  const previous7DaysVelocity = previous7DaysDuration > 0 ? (previous7DaysRecDelta / previous7DaysDuration) * 5 : 0
  
  // 7-day velocity change = current 7-day velocity vs previous 7-day velocity
  const sevenDayVelocityChange = Math.round(last7DaysVelocity - previous7DaysVelocity)
  
  // Calculate 15-day velocity change vs previous 15-day period
  const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Find data points in last 15 days and previous 15 days
  const last15DaysData = data.filter(d => new Date(d.date) >= fifteenDaysAgo)
  const previous15DaysData = data.filter(d => 
    new Date(d.date) >= thirtyDaysAgo && new Date(d.date) < fifteenDaysAgo
  )
  
  // Calculate velocity for last 15 days
  const last15DaysStart = last15DaysData[0] || latestData
  const last15DaysEnd = last15DaysData[last15DaysData.length - 1] || latestData
  const last15DaysRecDelta = (last15DaysEnd?.recommendation || 0) - (last15DaysStart?.recommendation || 0)
  const last15DaysDuration = Math.max(1, (new Date(last15DaysEnd.date).getTime() - new Date(last15DaysStart.date).getTime()) / (1000 * 60 * 60 * 24))
  const last15DaysVelocity = last15DaysDuration > 0 ? (last15DaysRecDelta / last15DaysDuration) * 5 : 0
  
  // Calculate velocity for previous 15 days
  const previous15DaysStart = previous15DaysData[0] || last15DaysStart
  const previous15DaysEnd = previous15DaysData[previous15DaysData.length - 1] || last15DaysStart
  const previous15DaysRecDelta = (previous15DaysEnd?.recommendation || 0) - (previous15DaysStart?.recommendation || 0)
  const previous15DaysDuration = Math.max(1, (new Date(previous15DaysEnd.date).getTime() - new Date(previous15DaysStart.date).getTime()) / (1000 * 60 * 60 * 24))
  const previous15DaysVelocity = previous15DaysDuration > 0 ? (previous15DaysRecDelta / previous15DaysDuration) * 5 : 0
  
  // 15-day velocity change = current 15-day velocity vs previous 15-day velocity
  const fifteenDayVelocityChange = Math.round(last15DaysVelocity - previous15DaysVelocity)

  // Primary momentum identical to OpportunityCard
  const opportunityLike = buildOpportunityLikeFromTimeline(
    data.map(d => ({ date: d.date, recommendation: d.recommendation }))
  )
  const momentum = calculateMomentumFromOpportunity(opportunityLike)
  const momentumDescriptor = getMomentumDescription(momentum)
  
  // Calculate historical average from similar roles
  // In a real app, this would come from actual historical data
  // For now, we'll simulate it based on current momentum with some variance
  // Use a seeded approach based on momentum to ensure consistency
  const historicalAverage = useMemo(() => {
    const variance = (momentum * 0.15) % 20 - 10 // ±10 variance, but consistent
    return Math.max(10, Math.min(90, Math.round(momentum + variance)))
  }, [momentum])
  const historicalDelta = momentum - historicalAverage

  // Progress ring for momentum - smaller size for inline display
  const ringSize = 60
  const ringStroke = 6
  const radius = (ringSize - ringStroke) / 2
  const circumference = 2 * Math.PI * radius
  
  // Momentum progress
  const momentumProgress = Math.max(0, Math.min(100, momentum))
  const momentumDashOffset = circumference - (momentumProgress / 100) * circumference
  
  // Velocity delta progress: normalize to 0-100 (map -20 to 0, 0 to 50, +20 to 100)
  const velocityMaxRange = 20
  const velocityProgress = Math.max(0, Math.min(100, 50 + (velocityDelta / velocityMaxRange) * 50))
  const velocityDashOffset = circumference - (velocityProgress / 100) * circumference
  
  // Historical average progress (already 0-100)
  const historicalProgress = Math.max(0, Math.min(100, historicalAverage))
  const historicalDashOffset = circumference - (historicalProgress / 100) * circumference
  
  // 7-day velocity change progress: normalize to 0-100 (map -20 to 0, 0 to 50, +20 to 100)
  const sevenDayVelocityProgress = Math.max(0, Math.min(100, 50 + (sevenDayVelocityChange / velocityMaxRange) * 50))
  const sevenDayVelocityDashOffset = circumference - (sevenDayVelocityProgress / 100) * circumference
  
  // 15-day velocity change progress: normalize to 0-100 (map -20 to 0, 0 to 50, +20 to 100)
  const fifteenDayVelocityProgress = Math.max(0, Math.min(100, 50 + (fifteenDayVelocityChange / velocityMaxRange) * 50))
  const fifteenDayVelocityDashOffset = circumference - (fifteenDayVelocityProgress / 100) * circumference

  return (
    <Card>
      <CardHeader 
        className={`cursor-pointer hover:bg-muted/50 transition-colors ${isCollapsed ? 'pb-6' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between w-full">
          {isCollapsed ? (
            <>
              {/* Left: Title */}
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-semibold">Pipeline Velocity</span>
              </div>
              
              {/* Center: Metrics Group */}
              <div className="flex items-center gap-6 flex-1 justify-center">
                {/* Velocity Score Group: Current + Similar Roles */}
                <div className="flex items-center gap-4 pl-2">
                  {/* Current Velocity Score */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
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
                          strokeDashoffset={momentumDashOffset}
                          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-2xl font-black ${momentum >= 80 ? 'text-emerald-600' : momentum >= 60 ? 'text-blue-600' : momentum >= 40 ? 'text-amber-600' : 'text-slate-600'}`}>{momentum}</div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${momentum >= 80 ? 'text-emerald-700' : momentum >= 60 ? 'text-blue-700' : momentum >= 40 ? 'text-amber-700' : 'text-slate-700'}`}>
                        {momentumDescriptor}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Velocity score</span>
                    </div>
                  </div>
                  
                  {/* Similar Roles Velocity Score */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
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
                          stroke={historicalDelta >= 0 ? '#3b82f6' : '#64748b'}
                          strokeWidth={ringStroke}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={historicalDashOffset}
                          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-2xl font-black ${historicalDelta >= 0 ? 'text-blue-600' : 'text-slate-500'}`}>
                          {historicalAverage}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${historicalDelta >= 0 ? 'text-blue-700' : 'text-slate-700'}`}>
                        Similar roles
                      </span>
                      <span className="text-[10px] text-muted-foreground">Average velocity</span>
                    </div>
                  </div>
                </div>
                
                {/* Secondary Metrics: Change Today & 7-Day */}
                <div className="flex items-center gap-6 pl-4 border-l border-border">
                  {/* Today's Change */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
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
                          stroke={velocityDelta >= 0 ? '#10b981' : '#ef4444'}
                          strokeWidth={ringStroke}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={velocityDashOffset}
                          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className={`text-lg font-bold ${velocityDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {velocityDelta >= 0 ? '+' : '-'}
                          </span>
                          <span className={`text-2xl font-black ${velocityDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {Math.abs(velocityDelta)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${velocityDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        Today
                      </span>
                      <span className="text-[10px] text-muted-foreground">Velocity change</span>
                    </div>
                  </div>
                  
                  {/* 7-Day Velocity Change */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
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
                          stroke={sevenDayVelocityChange >= 0 ? '#10b981' : '#ef4444'}
                          strokeWidth={ringStroke}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={sevenDayVelocityDashOffset}
                          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className={`text-lg font-bold ${sevenDayVelocityChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {sevenDayVelocityChange >= 0 ? '+' : '-'}
                          </span>
                          <span className={`text-2xl font-black ${sevenDayVelocityChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {Math.abs(sevenDayVelocityChange)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${sevenDayVelocityChange >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        7d vs 7d
                      </span>
                      <span className="text-[10px] text-muted-foreground">Velocity change</span>
                    </div>
                  </div>
                  
                  {/* 15-Day Velocity Change */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
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
                          stroke={fifteenDayVelocityChange >= 0 ? '#10b981' : '#ef4444'}
                          strokeWidth={ringStroke}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={fifteenDayVelocityDashOffset}
                          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className={`text-lg font-bold ${fifteenDayVelocityChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {fifteenDayVelocityChange >= 0 ? '+' : '-'}
                          </span>
                          <span className={`text-2xl font-black ${fifteenDayVelocityChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {Math.abs(fifteenDayVelocityChange)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${fifteenDayVelocityChange >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        15d vs 15d
                      </span>
                      <span className="text-[10px] text-muted-foreground">Velocity change</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Chevron */}
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5" />
                <span className="text-lg font-semibold">Pipeline Velocity</span>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </div>
      </CardHeader>
      
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

