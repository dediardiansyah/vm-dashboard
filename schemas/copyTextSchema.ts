import { z } from "zod"

export const createCopyTextSchema = z.object({
  type: z.string().min(1, "Type is required"),
  content: z.string().min(1, "Content is required"),
})

export const updateCopyTextSchema = z.object({
  type: z.string().optional(),
  content: z.string().optional(),
})

export type ICreateCopyText = z.infer<typeof createCopyTextSchema>
export type IUpdateCopyText = z.infer<typeof updateCopyTextSchema>