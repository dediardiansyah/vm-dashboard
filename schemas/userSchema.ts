import { z } from "zod"

export const userRoleEnum = z.enum(["ADMIN", "USER", "MANAGER"])
export const userStatusEnum = z.enum(["ACTIVE", "INACTIVE", "PENDING"])

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  role: userRoleEnum.refine((val) => !!val, {
    message: "Role is required"
  }),
  status: userStatusEnum.default('ACTIVE')
})

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string()
    .email("Invalid email address")
    .optional(),
  role: userRoleEnum.optional(),
  status: userStatusEnum.optional(),
})

export type ICreateUser = z.infer<typeof createUserSchema>
export type IUpdateUser = z.infer<typeof updateUserSchema>