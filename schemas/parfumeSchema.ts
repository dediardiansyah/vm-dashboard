import { z } from "zod"

export const createParfumeSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export const updateParfumeSchema = createParfumeSchema.partial()

export type ICreateParfume = z.infer<typeof createParfumeSchema>
export type IUpdateParfume = z.infer<typeof updateParfumeSchema>