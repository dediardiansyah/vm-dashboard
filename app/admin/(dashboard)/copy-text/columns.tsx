import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createActionColumn } from "@/components/action-column"
import { ICopyText } from "@/types/copyText"
import { formatDate } from "@/lib/utils/format-date"

function stripHtml(html: string) {
  const tmp = document.createElement("div")
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ""
}

export const columns: ColumnDef<ICopyText>[] = [
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Type
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content = row.getValue("content") as string
      const plainText = stripHtml(content)
      return (
        <div className="max-w-[500px] truncate text-sm text-muted-foreground">
          {plainText}
        </div>
      )
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => formatDate(row.getValue("updatedAt")),
  },
  createActionColumn<ICopyText>((copyText, table) => [
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => table.options.meta?.onRowAction?.("edit", copyText),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => table.options.meta?.onRowAction?.("delete", copyText),
      isDanger: true,
    },
  ]),
]