import { z } from "zod"

export const registerMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional(),
})

export const loginMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type IRegisterMember = z.infer<typeof registerMemberSchema>
export type ILoginMember = z.infer<typeof loginMemberSchema> 