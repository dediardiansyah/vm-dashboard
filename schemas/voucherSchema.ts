import { z } from "zod"

export const generateVoucherSchema = z.object({
  quantity: z.number()
    .min(1, "Quantity must be at least 1")
    .max(100, "Maximum 100 vouchers can be generated at once"),
})

export type IGenerateVoucher = z.infer<typeof generateVoucherSchema>