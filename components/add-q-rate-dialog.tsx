import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import type { QRate } from "@/types/client"

interface AddQRateDialogProps {
  clientId: string
  qruId: string
  onAddQRate: (qRate: Omit<QRate, "id">) => void
}

export function AddQRateDialog({ clientId, qruId, onAddQRate }: AddQRateDialogProps) {
  const [newQRate, setNewQRate] = useState<Omit<QRate, "id">>({
    title: "",
    qruId,
    clientId,
    isPrincipal: false,
    isFullTime: true,
    isArchived: false,
  })

  const handleAddQRate = () => {
    onAddQRate(newQRate)
    setNewQRate({
      title: "",
      qruId,
      clientId,
      isPrincipal: false,
      isFullTime: true,
      isArchived: false,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Q-Rate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Q-Rate</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roleTitle" className="text-right">
              Title
            </Label>
            <Input
              id="roleTitle"
              value={newQRate.title}
              onChange={(e) => setNewQRate({ ...newQRate, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isFullTime" className="text-right">
              Full-time
            </Label>
            <Checkbox
              id="isFullTime"
              checked={newQRate.isFullTime}
              onCheckedChange={(checked) => setNewQRate({ ...newQRate, isFullTime: checked as boolean })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isPrincipal" className="text-right">
              Principal
            </Label>
            <Checkbox
              id="isPrincipal"
              checked={newQRate.isPrincipal}
              onCheckedChange={(checked) => setNewQRate({ ...newQRate, isPrincipal: checked as boolean })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isArchived" className="text-right">
              Archived
            </Label>
            <Checkbox
              id="isArchived"
              checked={newQRate.isArchived}
              onCheckedChange={(checked) => setNewQRate({ ...newQRate, isArchived: checked as boolean })}
            />
          </div>
        </div>
        <Button onClick={handleAddQRate}>Add Q-Rate</Button>
      </DialogContent>
    </Dialog>
  )
}
