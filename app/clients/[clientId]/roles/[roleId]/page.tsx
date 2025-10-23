import { RolePage } from "@/components/role-page"
import { notFound } from "next/navigation"

// This would typically come from a database
const clients = [
  { id: "1", name: "TechCorp", about: "Leading tech company", activeRoles: 5, deployedRoles: 3 },
  { id: "2", name: "FinanceHub", about: "Innovative fintech startup", activeRoles: 3, deployedRoles: 1 },
]

const roles = [
  {
    id: "1",
    title: "Senior Developer",
    teamId: "1",
    clientId: "1",
    isPrincipal: true,
    isFullTime: false,
    isArchived: false,
  },
  {
    id: "2",
    title: "UX Designer",
    teamId: "2",
    clientId: "1",
    isPrincipal: false,
    isFullTime: true,
    isArchived: false,
  },
]

export default function Page({ params }: { params: { clientId: string; roleId: string } }) {
  const client = clients.find((c) => c.id === params.clientId)
  const role = roles.find((r) => r.id === params.roleId && r.clientId === params.clientId)

  if (!client || !role) {
    notFound()
  }

  return (
    <div className="container max-w-[1600px] mx-auto p-4 py-8">
      <RolePage role={role} client={client} />
    </div>
  )
}
