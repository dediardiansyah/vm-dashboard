"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { TableBadge } from "@/components/badge"
import { createActionColumn } from "@/components/action-column"
import { IUser } from "@/types/user"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<IUser>[] = [
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
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <TableBadge
        variant="info"
        label={row.getValue("role")}
      />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Status
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = {
        active: "success",
        pending: "warning",
        inactive: "danger",
      }[status] as any

      return <TableBadge variant={variant} label={status} />
    },
  },
  createActionColumn<IUser>((user, table) => [
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => table.options.meta?.onRowAction?.("edit", user),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => table.options.meta?.onRowAction?.("delete", user),
      isDanger: true,
    },
  ]),
]