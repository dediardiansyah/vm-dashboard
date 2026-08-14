import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createActionColumn } from "@/components/action-column"
import { formatDate } from "@/lib/utils/format-date"
import { Badge } from "@/components/ui/badge"
import { IParfume } from "@/types/parfume"

export const columns: ColumnDef<IParfume>[] = [
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
  createActionColumn<IParfume>((parfume, table) => [
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => table.options.meta?.onRowAction?.("edit", parfume),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => table.options.meta?.onRowAction?.("delete", parfume),
      isDanger: true,
    },
  ]),
]