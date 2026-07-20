import type { ResendContactConfig } from './resend'

export type ContactConfig = {
  resend: ResendContactConfig
  turnstileSecretKey: string
}

export function getContactConfig(): ContactConfig | null {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const toEmail = process.env.CONTACT_TO_EMAIL
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY

  if (!apiKey || !fromEmail || !toEmail || !turnstileSecretKey) {
    return null
  }

  return {
    resend: {
      apiKey,
      fromEmail,
      toEmail,
    },
    turnstileSecretKey,
  }
}
