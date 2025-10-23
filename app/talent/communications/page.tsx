import { CommunicationsView } from "@/components/communications-view"
import { PageHeader } from "@/components/page-header"

export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Talent Communications" description="Send and manage communications with talent" />
      <CommunicationsView />
    </div>
  )
}
