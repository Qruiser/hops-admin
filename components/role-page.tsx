import { TalentBoard } from "./talent-board"
import { QruSpecEditor } from "./qru-spec-editor"
import { Breadcrumb } from "./breadcrumb"
import type { Role } from "@/types/client"
import type { Client } from "@/types/client"

interface RolePageProps {
  role: Role
  client: Client
}

export function RolePage({ role, client }: RolePageProps) {
  return (
    <div className="container max-w-[1600px] mx-auto p-4">
      <Breadcrumb
        items={[
          { label: "Clients", href: "/" },
          { label: client.name, href: `/clients/${client.id}` },
          { label: role.title, href: `/clients/${client.id}/roles/${role.id}` },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{role.title}</h1>
        <QruSpecEditor />
      </div>
      <TalentBoard />
    </div>
  )
}
