import { HidiRecordsView } from "@/components/hidi-records-view"
import { PageHeader } from "@/components/page-header"

export default function HidiRecordsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="HIDIs" description="View and manage How I Did It records from talent" />
      <HidiRecordsView />
    </div>
  )
}
