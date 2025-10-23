"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TalentBoard } from "@/components/talent-board"
import { JobSpecEditor } from "@/components/job-spec-editor"
import { Upload, Edit, ArrowUpDown } from "lucide-react"
import { UploadModal } from "@/components/upload-modal"
import { Breadcrumb } from "@/components/breadcrumb"

export default function JobPage() {
  const params = useParams()
  const jobId = params.jobId as string
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // In a real app, you would fetch the job details based on the jobId
  const jobTitle = "Senior Developer"
  const clientName = "TechCorp"

  return (
    <div className="container max-w-[1600px] mx-auto p-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Jobs", href: "/" },
          { label: jobTitle, href: `/jobs/${jobId}` },
        ]}
      />

      <PageHeader
        title={jobTitle}
        description={`Client: ${clientName}`}
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Highest Match
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setUploadModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload CVs
            </Button>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Spec
            </Button>
          </>
        }
      />

      <Tabs defaultValue="candidates" className="mt-6">
        <TabsList>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="spec">Job Spec</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates">
          <TalentBoard />
        </TabsContent>

        <TabsContent value="spec">
          <JobSpecEditor />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="p-4 text-center text-muted-foreground">Analytics content will be displayed here.</div>
        </TabsContent>
      </Tabs>

      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </div>
  )
}
