"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Plus, FileText, Mail, Clock, CheckCircle, User, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { mockTalentData } from "@/data/mock-talent-data"
import { formatDistanceToNow } from "date-fns"

interface Communication {
  id: string
  type: "job" | "hidi"
  title: string
  content: string
  recipients: string[]
  sentAt: string
  status: "draft" | "sent" | "delivered" | "opened"
  responses: number
}

const mockCommunications: Communication[] = [
  {
    id: "1",
    type: "job",
    title: "Senior Frontend Developer Opportunity",
    content: "We have an exciting opportunity for a Senior Frontend Developer...",
    recipients: ["1", "4"],
    sentAt: "2023-04-28T14:30:00Z",
    status: "opened",
    responses: 2,
  },
  {
    id: "2",
    type: "hidi",
    title: "Share your experience with React Performance Optimization",
    content: "We'd love to hear about your experience optimizing React applications...",
    recipients: ["1", "2", "3"],
    sentAt: "2023-04-15T11:20:00Z",
    status: "delivered",
    responses: 1,
  },
  {
    id: "3",
    type: "job",
    title: "Product Manager Role at FinTech Startup",
    content: "A leading FinTech startup is looking for an experienced Product Manager...",
    recipients: ["2", "5"],
    sentAt: "2023-04-05T13:40:00Z",
    status: "sent",
    responses: 0,
  },
  {
    id: "4",
    type: "hidi",
    title: "Request: Your approach to Data Science projects",
    content: "We're collecting insights on how data scientists approach new projects...",
    recipients: ["3", "5"],
    sentAt: "2023-03-10T09:45:00Z",
    status: "draft",
    responses: 0,
  },
]

export function CommunicationsView() {
  const [activeTab, setActiveTab] = useState("all")
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [messageType, setMessageType] = useState<"job" | "hidi">("job")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCommunications = mockCommunications.filter((comm) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "job" && comm.type === "job") ||
      (activeTab === "hidi" && comm.type === "hidi") ||
      (activeTab === "draft" && comm.status === "draft")

    const matchesSearch =
      searchQuery === "" ||
      comm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case "sent":
        return <Send className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "opened":
        return <Mail className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft"
      case "sent":
        return "Sent"
      case "delivered":
        return "Delivered"
      case "opened":
        return "Opened"
      default:
        return status
    }
  }

  const getRecipientNames = (recipientIds: string[]) => {
    return recipientIds.map((id) => {
      const talent = mockTalentData.find((t) => t.id === id)
      return talent ? talent.name : "Unknown"
    })
  }

  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="job">Job Opportunities</TabsTrigger>
            <TabsTrigger value="hidi">HIDI Requests</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search communications..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Communication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Message Type</Label>
                  <Select value={messageType} onValueChange={(value) => setMessageType(value as "job" | "hidi")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Job Opportunity</SelectItem>
                      <SelectItem value="hidi">HIDI Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Enter subject..." />
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Enter your message..." className="min-h-[150px]" />
                </div>

                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                    <div className="space-y-2">
                      {mockTalentData.map((talent) => (
                        <div key={talent.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`recipient-${talent.id}`}
                            checked={selectedRecipients.includes(talent.id)}
                            onChange={() => toggleRecipient(talent.id)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`recipient-${talent.id}`} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={talent.photo || "/placeholder.svg"} alt={talent.name} />
                              <AvatarFallback>{talent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{talent.name}</span>
                            <span className="text-sm text-muted-foreground">({talent.title})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                  Save as Draft
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCommunications.map((comm) => (
          <Card key={comm.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={comm.type === "job" ? "default" : "secondary"}>
                      {comm.type === "job" ? "Job" : "HIDI"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(comm.status)}
                      <span className="text-sm">{getStatusText(comm.status)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium">{comm.title}</h3>

                  <p className="text-sm text-muted-foreground line-clamp-2">{comm.content}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {comm.recipients.length} recipient{comm.recipients.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {comm.status !== "draft"
                          ? `Sent ${formatDistanceToNow(new Date(comm.sentAt))} ago`
                          : "Not sent yet"}
                      </span>
                    </div>

                    {comm.responses > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {comm.responses} response{comm.responses !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {comm.status === "draft" ? (
                    <>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Responses
                      </Button>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Send Again
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCommunications.length === 0 && (
          <Card className="p-8 text-center">
            <div className="space-y-2">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">No communications found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "Create a new message to get started"}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
