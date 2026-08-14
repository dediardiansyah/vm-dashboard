import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ROLE_PERMISSIONS, PERMISSIONS } from "./permissions"
import { NextResponse } from "next/server"

export async function checkPermission(permission: keyof typeof PERMISSIONS) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.role) {
    return false
  }

  const userRole = session.user.role.toUpperCase() as keyof typeof ROLE_PERMISSIONS
  const allowedPermissions = ROLE_PERMISSIONS[userRole] || []
  
  return allowedPermissions.includes(PERMISSIONS[permission] as any)
}

export async function withPermission(
  permission: keyof typeof PERMISSIONS, 
  handler: () => Promise<NextResponse> | Promise<Response>
) {
  const hasPermission = await checkPermission(permission)
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: "You don't have permission to perform this action" },
      { status: 403 }
    )
  }
  
  return handler()
}