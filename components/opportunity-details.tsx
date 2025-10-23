"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface OpportunityDetailsProps {
  opportunity: any
}

export function OpportunityDetails({ opportunity }: OpportunityDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Job Description</CardTitle>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{opportunity.description}</p>

            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1">
              {opportunity.requirements.map((requirement: string, index: number) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Company</h3>
              <p>{opportunity.company}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Work Type</h3>
              <Badge>{opportunity.workType}</Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Location</h3>
              <p>{opportunity.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Employment Type</h3>
              <Badge>{opportunity.employmentType}</Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <Badge variant={opportunity.status === "active" ? "default" : "secondary"}>
                {opportunity.status === "active" ? "Active" : "Paused"}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Last Updated</h3>
              <p>{new Date(opportunity.lastUpdated).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
