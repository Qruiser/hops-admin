import { TalentPoolView } from "@/components/talent-pool-view"

export default function TalentPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Talent Pool</h1>
        <p className="text-muted-foreground">Browse and search through our curated pool of talent.</p>
      </div>
      <TalentPoolView />
    </div>
  )
}
