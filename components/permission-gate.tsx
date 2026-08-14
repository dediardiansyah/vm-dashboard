"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { ReactNode } from "react"

interface PermissionGateProps {
  permission: keyof typeof PERMISSIONS
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const { hasPermission } = usePermissions()
  
  if (!hasPermission(permission)) {
    return fallback
  }

  return children
}