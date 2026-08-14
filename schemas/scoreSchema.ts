import { z } from "zod"

export const createScoreSchema = z.object({
  score: z.number()
    .min(0, "Score must be greater than or equal to 0")
    .max(999999, "Score is too high")
})

export type ICreateScore = z.infer<typeof createScoreSchema>