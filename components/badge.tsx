import { cn } from "@/lib/utils"

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info"

interface BadgeProps {
  variant?: BadgeVariant
  label: string
  className?: string
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
}

export function TableBadge({ variant = "default", label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {label}
    </span>
  )
}