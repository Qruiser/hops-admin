"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Plus, Archive, RefreshCw } from "lucide-react"
import type { Client, Qru, QRate } from "@/types/client"
import { Breadcrumb } from "./breadcrumb"
import { AddQRateDialog } from "./add-q-rate-dialog"

interface ClientPageProps {
  client: Client
}

const initialQrus: Qru[] = [
  { id: "1", name: "Engineering Qru", clientId: "1", isContract: true, isArchived: false },
  { id: "2", name: "Design Qru", clientId: "1", isContract: false, isArchived: false },
  { id: "3", name: "Marketing Qru", clientId: "1", isContract: true, isArchived: true },
]

const initialQRates: QRate[] = [
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
    isArchived: true,
  },
]

export function ClientPage({ client }: ClientPageProps) {
  const [qrus, setQrus] = useState<Qru[]>(initialQrus)
  const [qRates, setQRates] = useState<QRate[]>(initialQRates)
  const [newQru, setNewQru] = useState<Omit<Qru, "id">>({
    name: "",
    clientId: client.id,
    isContract: true,
    isArchived: false,
  })
  const [selectedQru, setSelectedQru] = useState<Qru | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const activeQrus = qrus.filter((qru) => !qru.isArchived)
  const archivedQrus = qrus.filter((qru) => qru.isArchived)
  const activeQRates = qRates.filter((qRate) => !qRate.isArchived)
  const archivedQRates = qRates.filter((qRate) => qRate.isArchived)

  const filteredQRates = selectedQru
    ? qRates.filter((qRate) => qRate.qruId === selectedQru.id && !qRate.isArchived)
    : activeQRates

  const handleAddQru = () => {
    const id = (qrus.length + 1).toString()
    setQrus([...qrus, { ...newQru, id }])
    setNewQru({ name: "", clientId: client.id, isContract: true, isArchived: false })
  }

  const handleAddQRate = (newQRate: Omit<QRate, "id">) => {
    const id = (qRates.length + 1).toString()
    setQRates([...qRates, { ...newQRate, id }])
  }

  const toggleQruArchive = (qruId: string) => {
    setQrus(qrus.map((qru) => (qru.id === qruId ? { ...qru, isArchived: !qru.isArchived } : qru)))
  }

  const toggleQRateArchive = (qRateId: string) => {
    setQRates(qRates.map((qRate) => (qRate.id === qRateId ? { ...qRate, isArchived: !qRate.isArchived } : qRate)))
  }

  const QRateCard = ({ qRate }: { qRate: QRate }) => (
    <Link href={`/clients/${client.id}/q-rates/${qRate.id}`} passHref>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{qRate.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{qRate.isFullTime ? "Full-time" : "Contract"}</p>
          <p>{qRate.isPrincipal ? "Principal" : "Normal"}</p>
          <p>Qru: {qrus.find((qru) => qru.id === qRate.qruId)?.name || "Unknown"}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleQRateArchive(qRate.id)
            }}
          >
            {qRate.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )

  return (
    <div className="container max-w-[1600px] mx-auto p-4">
      <Breadcrumb
        items={[
          { label: "Clients", href: "/" },
          { label: client.name, href: `/clients/${client.id}` },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">{client.name}</h1>
      <Tabs defaultValue="qrus">
        <TabsList>
          <TabsTrigger value="qrus">Qru</TabsTrigger>
          <TabsTrigger value="q-rates">Q-Rate</TabsTrigger>
        </TabsList>
        <TabsContent value="qrus">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Qrus</h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? <RefreshCw className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                {showArchived ? "Show Active" : "Show Archived"}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Qru
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Qru</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teamName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="teamName"
                        value={newQru.name}
                        onChange={(e) => setNewQru({ ...newQru, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddQru}>Add Qru</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(showArchived ? archivedQrus : activeQrus).map((qru) => (
              <Card
                key={qru.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedQru?.id === qru.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedQru(qru)}
              >
                <CardHeader>
                  <CardTitle>{qru.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{qru.isContract ? "Contract" : "Full-time"}</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleQruArchive(qru.id)
                    }}
                  >
                    {qru.isArchived ? "Unarchive" : "Archive"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedQru && !selectedQru.isArchived && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Q-Rates for {selectedQru.name}</h3>
                <AddQRateDialog clientId={client.id} qruId={selectedQru.id} onAddQRate={handleAddQRate} />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredQRates.map((qRate) => (
                  <QRateCard key={qRate.id} qRate={qRate} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="q-rates">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Q-Rates</h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? <RefreshCw className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                {showArchived ? "Show Active" : "Show Archived"}
              </Button>
              <AddQRateDialog clientId={client.id} qruId="" onAddQRate={handleAddQRate} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(showArchived ? archivedQRates : activeQRates).map((qRate) => (
              <QRateCard key={qRate.id} qRate={qRate} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
