import { z } from 'zod'

export const CONTACT_EMAIL_MAX_LENGTH = 254
export const CONTACT_FULLNAME_MAX_LENGTH = 80
export const CONTACT_MESSAGE_MAX_LENGTH = 2000

function hasControlCharacter(value: string) {
  return Array.from(value).some((char) => {
    const charCode = char.charCodeAt(0)
    return charCode <= 31 || charCode === 127
  })
}

export const contactMessageSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(
      CONTACT_EMAIL_MAX_LENGTH,
      'Please keep your email under 254 characters.'
    ),
  fullname: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .refine(
      (value) => !hasControlCharacter(value),
      'Please remove unsupported characters from your name.'
    )
    .max(
      CONTACT_FULLNAME_MAX_LENGTH,
      'Please keep your name under 80 characters.'
    ),
  message: z
    .string()
    .trim()
    .min(10, 'Please enter a message with at least 10 characters.')
    .max(
      CONTACT_MESSAGE_MAX_LENGTH,
      'Please keep your message under 2,000 characters.'
    ),
})

export const contactRequestSchema = contactMessageSchema.extend({
  turnstileToken: z
    .string()
    .trim()
    .min(1, 'Please complete the anti-bot check before sending.'),
})

type ContactMessagePayload = z.infer<typeof contactMessageSchema>

export function formatZodError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? 'Please check the form fields.'
  }

  return 'Please check the form fields.'
}

export function parseContactFormData(data: FormData): ContactMessagePayload {
  return contactMessageSchema.parse(Object.fromEntries(data))
}
