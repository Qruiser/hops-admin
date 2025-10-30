"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  FileCheck,
  Calendar,
  DollarSign,
  Send,
  Archive,
  FileText,
  FileImage,
  CreditCard,
  AlertCircle,
  Bell,
  ClipboardList,
} from "lucide-react"
import { CandidateCard } from "../candidate-card"
import { CandidateInfoPanel } from "../candidate-info-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample candidates data
const candidates = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    source: "linkedin",
    matchScore: 92,
    skills: ["React", "TypeScript", "Node.js"],
    experience: "5 years",
    location: "San Francisco, CA",
    lastActivity: "2023-05-15",
    status: "deploy",
    deploymentChecklist: {
      contractShared: true,
      contractSigned: true,
      bankDetailsProvided: true,
      compensationAgreed: true,
      startDateConfirmed: true,
      relievingLetter: true,
    },
    startDate: "2023-06-01",
    compensation: "$120,000/year",
    currentPosition: "Senior Developer",
    currentCompany: "TechCorp",
    documents: {
      contract: "/documents/contract-john-smith.pdf",
      aadhar: "/documents/aadhar-john-smith.pdf",
      pan: "/documents/pan-john-smith.pdf",
      paySlips: [
        "/documents/payslip-john-smith-apr.pdf",
        "/documents/payslip-john-smith-may.pdf",
        "/documents/payslip-john-smith-jun.pdf",
      ],
      bankStatement: "/documents/bank-statement-john-smith.pdf",
      relievingLetter: "/documents/relieving-letter-john-smith.pdf",
    },
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 987-6543",
    source: "internal",
    matchScore: 87,
    skills: ["React", "JavaScript", "CSS"],
    experience: "4 years",
    location: "New York, NY",
    lastActivity: "2023-05-14",
    status: "deploy",
    deploymentChecklist: {
      contractShared: true,
      contractSigned: false,
      bankDetailsProvided: false,
      compensationAgreed: true,
      startDateConfirmed: false,
      relievingLetter: false,
    },
    startDate: "2023-06-15",
    compensation: "$105,000/year",
    currentPosition: "Frontend Developer",
    currentCompany: "WebSolutions Inc.",
    documents: {
      contract: "/documents/contract-emily-johnson.pdf",
      aadhar: "/documents/aadhar-emily-johnson.pdf",
      pan: "/documents/pan-emily-johnson.pdf",
      paySlips: [
        "/documents/payslip-emily-johnson-apr.pdf",
        "/documents/payslip-emily-johnson-may.pdf",
        "/documents/payslip-emily-johnson-jun.pdf",
      ],
      bankStatement: "/documents/bank-statement-emily-johnson.pdf",
      relievingLetter: null,
    },
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 456-7890",
    source: "referral",
    matchScore: 79,
    skills: ["JavaScript", "React", "HTML", "CSS"],
    experience: "3 years",
    location: "Chicago, IL",
    lastActivity: "2023-05-12",
    status: "deploy",
    deploymentChecklist: {
      contractShared: false,
      contractSigned: false,
      bankDetailsProvided: false,
      compensationAgreed: false,
      startDateConfirmed: false,
      relievingLetter: false,
    },
    startDate: "2023-07-01",
    compensation: "$95,000/year",
    currentPosition: "Web Developer",
    currentCompany: "Digital Agency Inc.",
    documents: {
      contract: "/documents/contract-michael-brown.pdf",
      aadhar: "/documents/aadhar-michael-brown.pdf",
      pan: "/documents/pan-michael-brown.pdf",
      paySlips: [
        "/documents/payslip-michael-brown-apr.pdf",
        "/documents/payslip-michael-brown-may.pdf",
        "/documents/payslip-michael-brown-jun.pdf",
      ],
      bankStatement: "/documents/bank-statement-michael-brown.pdf",
      relievingLetter: null,
    },
  },
]

// Contract Dialog Component
function ContractDialog({ contractUrl }: { contractUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <FileText className="h-4 w-4" />
          View Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Contract Document</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full">
          <iframe src={contractUrl} className="w-full h-full border rounded" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Documents Dialog Component
function DocumentsDialog({ aadharUrl, panUrl }: { aadharUrl: string; panUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <FileImage className="h-4 w-4" />
          View Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Identity Documents</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="aadhar" className="w-full h-[calc(100%-2rem)]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="aadhar">Aadhar Card</TabsTrigger>
            <TabsTrigger value="pan">PAN Card</TabsTrigger>
          </TabsList>
          <TabsContent value="aadhar" className="h-full">
            <iframe src={aadharUrl} className="w-full h-full border rounded" />
          </TabsContent>
          <TabsContent value="pan" className="h-full">
            <iframe src={panUrl} className="w-full h-full border rounded" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Finance Details Dialog Component
function FinanceDetailsDialog({
  paySlips,
  bankStatementUrl,
  relievingLetterUrl,
}: {
  paySlips: string[]
  bankStatementUrl: string
  relievingLetterUrl: string | null
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          View Finance Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Financial Documents</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="payslips" className="w-full h-[calc(100%-2rem)]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payslips">Pay Slips</TabsTrigger>
            <TabsTrigger value="bankstatement">Bank Statement</TabsTrigger>
            <TabsTrigger value="relieving" disabled={!relievingLetterUrl}>
              Relieving Letter
            </TabsTrigger>
          </TabsList>
          <TabsContent value="payslips" className="h-full">
            <Tabs defaultValue="payslip1" className="w-full h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="payslip1">April</TabsTrigger>
                <TabsTrigger value="payslip2">May</TabsTrigger>
                <TabsTrigger value="payslip3">June</TabsTrigger>
              </TabsList>
              <TabsContent value="payslip1" className="h-[calc(100%-2.5rem)]">
                <iframe src={paySlips[0]} className="w-full h-full border rounded" />
              </TabsContent>
              <TabsContent value="payslip2" className="h-[calc(100%-2.5rem)]">
                <iframe src={paySlips[1]} className="w-full h-full border rounded" />
              </TabsContent>
              <TabsContent value="payslip3" className="h-[calc(100%-2.5rem)]">
                <iframe src={paySlips[2]} className="w-full h-full border rounded" />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="bankstatement" className="h-full">
            <iframe src={bankStatementUrl} className="w-full h-full border rounded" />
          </TabsContent>
          <TabsContent value="relieving" className="h-full">
            {relievingLetterUrl ? (
              <iframe src={relievingLetterUrl} className="w-full h-full border rounded" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Relieving letter not available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export function DeployStage() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0])

  const handleSelectCandidate = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  // Calculate deployment progress
  const getDeploymentProgress = (checklist: any) => {
    const total = Object.keys(checklist).length
    const completed = Object.values(checklist).filter((value) => value === true).length
    return (completed / total) * 100
  }

  const progress = getDeploymentProgress(selectedCandidate.deploymentChecklist)
  const isDeployed = progress === 100
  const isNotStarted = progress === 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => handleSelectCandidate(candidate)}
              className={`cursor-pointer ${selectedCandidate.id === candidate.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
            >
              <CandidateCard candidate={candidate} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Card className="sticky top-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <CardContent className="space-y-4">
            {/* Compact Candidate Info Panel */}
            <CandidateInfoPanel candidate={selectedCandidate} />

            {/* Final Details Section */}
            <div className="border rounded-md p-4 bg-slate-50">
              <h3 className="text-sm font-medium mb-3">Final Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Start Date:</span>
                  </div>
                  <span className="text-sm">{new Date(selectedCandidate.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Compensation:</span>
                  </div>
                  <span className="text-sm">{selectedCandidate.compensation}</span>
                </div>
              </div>
            </div>

            {/* Deployment Progress - At the top */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Deployment Progress</span>
                <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Deployment Readiness Checklist */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Deployment Readiness Checklist</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="contractShared" checked={selectedCandidate.deploymentChecklist.contractShared} />
                  <Label htmlFor="contractShared" className="text-sm">
                    Contract Shared
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="contractSigned" checked={selectedCandidate.deploymentChecklist.contractSigned} />
                  <Label htmlFor="contractSigned" className="text-sm">
                    Contract Signed
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bankDetailsProvided"
                    checked={selectedCandidate.deploymentChecklist.bankDetailsProvided}
                  />
                  <Label htmlFor="bankDetailsProvided" className="text-sm">
                    Bank Details Provided
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compensationAgreed"
                    checked={selectedCandidate.deploymentChecklist.compensationAgreed}
                  />
                  <Label htmlFor="compensationAgreed" className="text-sm">
                    Compensation Agreed
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="startDateConfirmed"
                    checked={selectedCandidate.deploymentChecklist.startDateConfirmed}
                  />
                  <Label htmlFor="startDateConfirmed" className="text-sm">
                    Start Date Confirmed
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="relievingLetter" checked={selectedCandidate.deploymentChecklist.relievingLetter} />
                  <Label htmlFor="relievingLetter" className="text-sm">
                    Relieving Letter
                  </Label>
                </div>
              </div>
            </div>

            {/* Document Buttons */}
            <div className="space-y-2 border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Documents</h3>

              <ContractDialog contractUrl={selectedCandidate.documents.contract} />

              <DocumentsDialog
                aadharUrl={selectedCandidate.documents.aadhar}
                panUrl={selectedCandidate.documents.pan}
              />

              <FinanceDetailsDialog
                paySlips={selectedCandidate.documents.paySlips}
                bankStatementUrl={selectedCandidate.documents.bankStatement}
                relievingLetterUrl={selectedCandidate.documents.relievingLetter}
              />
            </div>

            {/* Action Buttons - Conditional based on progress */}
            <div className="flex flex-col gap-2 border-t pt-4">
              {isDeployed ? (
                <>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Successfully Deployed</p>
                        <p className="text-xs text-green-700 mt-1">
                          This candidate has been successfully deployed and is ready to start on{" "}
                          {new Date(selectedCandidate.startDate).toLocaleDateString()}.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <ClipboardList className="h-4 w-4" />
                    View Deployment Details
                  </Button>
                </>
              ) : isNotStarted ? (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Deployment Not Started</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Start the onboarding process by sending a welcome package to the candidate.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    Send Welcome Package
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-2">
                    <div className="flex items-start gap-2">
                      <FileCheck className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Deployment In Progress</p>
                        <p className="text-xs text-amber-700 mt-1">
                          {progress.toFixed(0)}% complete. Send a follow-up reminder to complete the remaining checklist
                          items.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2">
                      <Bell className="h-4 w-4" />
                      Send Follow-up Reminder
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Archive className="h-4 w-4" />
                          Archive
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem>Salary not match</DropdownMenuItem>
                        <DropdownMenuItem>Doesn't want contract</DropdownMenuItem>
                        <DropdownMenuItem>Skills not matched</DropdownMenuItem>
                        <DropdownMenuItem>No contact information</DropdownMenuItem>
                        <DropdownMenuItem>Doesn't want to complete profile</DropdownMenuItem>
                        <DropdownMenuItem>Traits not matched</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
