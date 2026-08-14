import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import React from "react"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export interface ActionItem {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: () => void
  className?: string
  isDanger?: boolean
}

interface ActionColumnProps {
  actions: ActionItem[]
}

export function createActionColumn<TData>(
  actions: (row: TData, table: any) => ActionItem[]
): ColumnDef<TData> {
  return {
    id: "actions",
    cell: ({ row, table }) => {
      const rowActions = actions(row.original, table)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {rowActions.map((action, index) => {
              const Icon = action.icon

              return (
                <React.Fragment key={action.label}>
                  {index > 0 && !action.isDanger && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={action.onClick}
                    className={cn(
                      action.isDanger && "text-red-600",
                      action.className
                    )}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                </React.Fragment>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
}