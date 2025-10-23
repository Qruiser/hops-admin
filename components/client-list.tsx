"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Plus, ArrowRight, Building } from "lucide-react"

interface Client {
  id: string
  name: string
  about: string
  activeJobs: number
  deployedJobs: number
}

const initialClients: Client[] = [
  { id: "1", name: "TechCorp", about: "Leading tech company", activeJobs: 5, deployedJobs: 3 },
  { id: "2", name: "FinanceHub", about: "Innovative fintech startup", activeJobs: 3, deployedJobs: 1 },
]

export function ClientList() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [newClient, setNewClient] = useState<Omit<Client, "id">>({
    name: "",
    about: "",
    activeJobs: 0,
    deployedJobs: 0,
  })

  const handleAddClient = () => {
    const id = (clients.length + 1).toString()
    setClients([...clients, { ...newClient, id }])
    setNewClient({ name: "", about: "", activeJobs: 0, deployedJobs: 0 })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Clients</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="about" className="text-right">
                  About
                </Label>
                <Input
                  id="about"
                  value={newClient.about}
                  onChange={(e) => setNewClient({ ...newClient, about: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddClient}>Add Client</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {clients.map((client) => (
          <Link href={`/clients/${client.id}`} key={client.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow w-full">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{client.name}</h3>
                    <p className="text-muted-foreground">{client.about}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Active Jobs: {client.activeJobs}</span>
                      </div>
                      <div>
                        <span>Deployed Jobs: {client.deployedJobs}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-2 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
