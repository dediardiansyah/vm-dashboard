export const USER_ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
    MANAGER: "MANAGER"
  } as const
  
  export const USER_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending"
  } as const
  
  export type UserRole = keyof typeof USER_ROLES
  export type UserStatus = keyof typeof USER_STATUS