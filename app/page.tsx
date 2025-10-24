"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Briefcase, 
  Building, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  Star,
  Target,
  Calendar
} from "lucide-react"
import Link from "next/link"

// Dashboard data
const dashboardStats = {
  totalRoles: 24,
  activeRoles: 18,
  totalCandidates: 1247,
  newCandidates: 23,
  totalClients: 12,
  activeClients: 8,
  placementsThisMonth: 5,
  targetPlacements: 8,
  avgTimeToHire: 21,
  candidateSatisfaction: 4.8
}

const recentActivity = [
  {
    id: "1",
    type: "application",
    title: "New application received",
    description: "John Smith applied for Senior Frontend Developer at TechCorp",
    time: "2 minutes ago",
    icon: Users,
    color: "text-blue-600"
  },
  {
    id: "2",
    type: "interview",
    title: "Interview scheduled",
    description: "Sarah Johnson - Product Manager at FinanceHub",
    time: "1 hour ago",
    icon: Calendar,
    color: "text-green-600"
  },
  {
    id: "3",
    type: "placement",
    title: "Placement completed",
    description: "Mike Chen placed as DevOps Engineer at CloudTech",
    time: "3 hours ago",
    icon: CheckCircle,
    color: "text-emerald-600"
  },
  {
    id: "4",
    type: "urgent",
    title: "Urgent: Client feedback needed",
    description: "CreativeStudio needs feedback on UX Designer candidates",
    time: "5 hours ago",
    icon: AlertCircle,
    color: "text-orange-600"
  }
]

const topPerformers = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "FinanceHub",
    matchScore: 95,
    status: "Interview Scheduled"
  },
  {
    id: "2",
    name: "Alex Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    matchScore: 92,
    status: "Shortlisted"
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    role: "UX Designer",
    company: "CreativeStudio",
    matchScore: 88,
    status: "Under Review"
  }
]

const upcomingDeadlines = [
  {
    id: "1",
    title: "TechCorp - Senior Frontend Developer",
    deadline: "2024-01-15",
    daysLeft: 3,
    priority: "high"
  },
  {
    id: "2",
    title: "FinanceHub - Product Manager",
    deadline: "2024-01-18",
    daysLeft: 6,
    priority: "medium"
  },
  {
    id: "3",
    title: "CloudTech - DevOps Engineer",
    deadline: "2024-01-22",
    daysLeft: 10,
    priority: "low"
  }
]

export default function Home() {
  return (
    <div className="container max-w-[1600px] mx-auto p-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/opportunities">
              <Plus className="h-4 w-4 mr-2" />
              New Role
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/talent">
              <Users className="h-4 w-4 mr-2" />
              View Talent Pool
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeRoles}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalRoles} total roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCandidates.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats.newCandidates} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalClients} total clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Placements</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.placementsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.targetPlacements} target this month
            </p>
            <Progress 
              value={(dashboardStats.placementsThisMonth / dashboardStats.targetPlacements) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your recruitment pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/talent/communications">
                  View All Activity
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Highest scoring candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer) => (
                <div key={performer.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">{performer.role} at {performer.company}</p>
                    <Badge variant="secondary" className="text-xs">
                      {performer.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{performer.matchScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/talent">
                  View All Candidates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Roles requiring immediate attention</CardDescription>
          </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{deadline.title}</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {deadline.daysLeft} days left
                    </span>
                    <Badge 
                      variant={deadline.priority === "high" ? "destructive" : deadline.priority === "medium" ? "default" : "secondary"}
                    >
                      {deadline.priority} priority
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
