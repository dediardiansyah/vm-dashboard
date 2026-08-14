import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createActionColumn } from "@/components/action-column"
import { IMachine } from "@/types/machine"
import { formatDate } from "@/lib/utils/format-date"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<IMachine>[] = [
  {
    id: "select",
    header: "#",
    cell: ({ row }) => (
      <div className="text-center text-sm text-muted-foreground w-4">
        {row.index + 1}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Name
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status.toLowerCase() === "active" ? "default" : "destructive"}>
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string
      return (
        <div className="text-sm text-muted-foreground">
          {location || "N/A"}
        </div>
      )
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Last Updated
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue("updatedAt")),
  },
  {
    accessorKey: "parfumes",
    header: "Parfumes",
    cell: ({ row }) => {
      const parfumes = row.getValue("parfumes") as { name: string }[]
      return parfumes?.length ? (
        <div className="flex flex-wrap gap-1">
          {parfumes.map((parfume, index) => (
            <Badge key={index} variant="secondary">
              {parfume.name}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No parfumes</span>
      )
    }
  },
  createActionColumn<IMachine>((machine, table) => [
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => table.options.meta?.onRowAction?.("edit", machine),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => table.options.meta?.onRowAction?.("delete", machine),
      isDanger: true,
    },
  ]),
]