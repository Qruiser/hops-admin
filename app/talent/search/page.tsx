import { AdvancedSearchView } from "@/components/advanced-search-view"
import { PageHeader } from "@/components/page-header"

export default function AdvancedSearchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Advanced Talent Search"
        description="Search and filter talent profiles using advanced criteria"
      />
      <AdvancedSearchView />
    </div>
  )
}
