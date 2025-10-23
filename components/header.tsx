"use client"

import { useState } from "react"
import { ArrowUpDown, Upload, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadModal } from "./upload-modal"

export function Header() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Qru Spec Recommendations</h1>
        <div className="flex flex-wrap gap-3">
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
        </div>
      </div>

      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </>
  )
}
