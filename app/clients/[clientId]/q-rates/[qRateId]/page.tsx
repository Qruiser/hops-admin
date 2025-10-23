import { QRatePage } from "@/components/q-rate-page"
import { notFound } from "next/navigation"

// This would typically come from a database
const clients = [
  { id: "1", name: "TechCorp", about: "Leading tech company", activeRoles: 5, deployedRoles: 3 },
  { id: "2", name: "FinanceHub", about: "Innovative fintech startup", activeRoles: 3, deployedRoles: 1 },
]

const qRates = [
  {
    id: "1",
    title: "Senior Developer",
    qruId: "1",
    clientId: "1",
    isPrincipal: true,
    isFullTime: false,
    isArchived: false,
  },
  {
    id: "2",
    title: "UX Designer",
    qruId: "2",
    clientId: "1",
    isPrincipal: false,
    isFullTime: true,
    isArchived: false,
  },
  {
    id: "3",
    title: "Project Manager",
    qruId: "1",
    clientId: "1",
    isPrincipal: false,
    isFullTime: false,
    isArchived: false,
  },
  {
    id: "4",
    title: "Frontend Developer",
    qruId: "1",
    clientId: "2",
    isPrincipal: false,
    isFullTime: true,
    isArchived: false,
  },
  {
    id: "5",
    title: "Data Analyst",
    qruId: "2",
    clientId: "2",
    isPrincipal: true,
    isFullTime: true,
    isArchived: false,
  },
]

export default function Page({ params }: { params: { clientId: string; qRateId: string } }) {
  const client = clients.find((c) => c.id === params.clientId)
  const qRate = qRates.find((r) => r.id === params.qRateId && r.clientId === params.clientId)

  if (!client || !qRate) {
    notFound()
  }

  return (
    <div className="container max-w-[1600px] mx-auto p-4 py-8">
      <QRatePage qRate={qRate} client={client} />
    </div>
  )
}
