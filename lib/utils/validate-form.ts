import { z } from "zod"

export interface ValidationResult<T extends Record<string, any>> {
  isValid: boolean
  errors: Partial<Record<keyof T, string>>
}

export function validateForm<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  data: T
): ValidationResult<T> {
  try {
    schema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formErrors: Partial<Record<keyof T, string>> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          formErrors[err.path[0] as keyof T] = err.message
        }
      })
      return { isValid: false, errors: formErrors }
    }
    return { isValid: false, errors: {} }
  }
}