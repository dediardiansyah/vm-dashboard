import { z } from "zod"

export const createMachineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["ACTIVE", "DISCONNECTED"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either ACTIVE or DISCONNECTED"
  }),
  location: z.string().optional(),
  parfumeIds: z.array(z.number()).optional(),
})

export const updateMachineSchema = createMachineSchema.partial()

export type ICreateMachine = z.infer<typeof createMachineSchema>
export type IUpdateMachine = z.infer<typeof updateMachineSchema>