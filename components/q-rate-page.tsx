import { TalentBoard } from "./talent-board"
import { QruSpecEditor } from "./qru-spec-editor"
import { Breadcrumb } from "./breadcrumb"
import type { QRate } from "@/types/client"
import type { Client } from "@/types/client"

interface QRatePageProps {
  qRate: QRate
  client: Client
}

export function QRatePage({ qRate, client }: QRatePageProps) {
  return (
    <div className="container max-w-[1600px] mx-auto p-4">
      <Breadcrumb
        items={[
          { label: "Clients", href: "/" },
          { label: client.name, href: `/clients/${client.id}` },
          { label: qRate.title, href: `/clients/${client.id}/q-rates/${qRate.id}` },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{qRate.title}</h1>
        <QruSpecEditor />
      </div>
      <TalentBoard />
    </div>
  )
}
