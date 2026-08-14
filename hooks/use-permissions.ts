import { useSession } from "next-auth/react"
import { ROLE_PERMISSIONS, PERMISSIONS } from "@/lib/rbac/permissions"

export function usePermissions() {
  const { data: session } = useSession()
  const userRole = session?.user?.role?.toUpperCase() as keyof typeof ROLE_PERMISSIONS
  const permissions = ROLE_PERMISSIONS[userRole] || []

  const hasPermission = (permission: keyof typeof PERMISSIONS) => {
    // console.log(permission)
    // return permissions.includes(PERMISSIONS[permission] as any)
    // console.log('123')
    // console.log(permissions)
    return permissions.includes(permission as any)
  }

  return {
    permissions,
    hasPermission,
    userRole,
  }
}