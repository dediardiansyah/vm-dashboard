import { z } from "zod"

export const createCampaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  subdomain: z.string().min(1, "Subdomain is required"),
  about: z.string().optional(),
  howToPlay: z.string().optional(),
})

export const updateCampaignSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  subdomain: z.string().optional(),
  about: z.string().optional(),
  howToPlay: z.string().optional(),
})

export type ICreateCampaign = z.infer<typeof createCampaignSchema>
export type IUpdateCampaign = z.infer<typeof updateCampaignSchema>