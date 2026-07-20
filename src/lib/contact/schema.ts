import { z } from 'zod'

export const contactMessageSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  fullname: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(80, 'Please keep your name under 80 characters.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please enter a message with at least 10 characters.')
    .max(2000, 'Please keep your message under 2,000 characters.'),
})

export type ContactMessagePayload = z.infer<typeof contactMessageSchema>

export function formatZodError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? 'Please check the form fields.'
  }

  return 'Please check the form fields.'
}

export function parseContactFormData(data: FormData): ContactMessagePayload {
  return contactMessageSchema.parse(Object.fromEntries(data))
}
