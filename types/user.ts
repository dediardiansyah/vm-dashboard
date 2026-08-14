import { UserRole, UserStatus } from "@/contants/user"

export interface IUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus,
  password: string
  emailVerified: Date | null
}