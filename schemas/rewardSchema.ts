import { z } from 'zod'

export const createRewardSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  points: z.number().min(0),
  quantity: z.number().min(0),
  image: z.string().optional()
}) 