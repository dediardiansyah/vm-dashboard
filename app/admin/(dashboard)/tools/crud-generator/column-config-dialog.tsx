"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ColumnConfig } from "./types"

interface ColumnConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: ColumnConfig
  onUpdate: (column: ColumnConfig) => void
}

export function ColumnConfigDialog({
  open,
  onOpenChange,
  column,
  onUpdate,
}: ColumnConfigDialogProps) {
  const handleUpdate = (key: string, value: any) => {
    const updatedColumn = {
      ...column,
      config: {
        ...column.config,
        [key]: value,
      },
    }
    onUpdate(updatedColumn)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Column: {column.key}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sortable">Sortable</Label>
            <Switch
              id="sortable"
              checked={column.config.isSortable}
              onCheckedChange={(checked) => handleUpdate("isSortable", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="filterable">Filterable</Label>
            <Switch
              id="filterable"
              checked={column.config.isFilterable}
              onCheckedChange={(checked) => handleUpdate("isFilterable", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Render Type</Label>
            <Select
              value={column.config.renderType || "text"}
              onValueChange={(value) => handleUpdate("renderType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="badge">Badge</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {column.config.renderType === "badge" && (
            <div className="space-y-2">
              <Label>Badge Variants (JSON)</Label>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded"
                value={JSON.stringify(column.config.badgeConfig?.variants || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const variants = JSON.parse(e.target.value)
                    handleUpdate("badgeConfig", { 
                      ...column.config.badgeConfig,
                      variants 
                    })
                  } catch (error) {
                    // Handle invalid JSON
                  }
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}