import { ClientPage } from "@/components/client-page"
import { notFound } from "next/navigation"

// This would typically come from a database
const clients = [
  { id: "1", name: "TechCorp", about: "Leading tech company", activeRoles: 5, deployedRoles: 3 },
  { id: "2", name: "FinanceHub", about: "Innovative fintech startup", activeRoles: 3, deployedRoles: 1 },
]

export default function Page({ params }: { params: { clientId: string } }) {
  const client = clients.find((c) => c.id === params.clientId)

  if (!client) {
    notFound()
  }

  return (
    <div className="container max-w-[1600px] mx-auto p-4 py-8">
      <ClientPage client={client} />
    </div>
  )
}
