import { NextResponse } from 'next/server'
import { getContactConfig } from '@/lib/contact/config'
import { sendContactEmail } from '@/lib/contact/resend'
import { contactMessageSchema, formatZodError } from '@/lib/contact/schema'
import { verifyTurnstileToken } from '@/lib/contact/turnstile'

type ContactRequestBody = {
  fullname?: string
  email?: string
  message?: string
  turnstileToken?: string
}

export async function POST(request: Request) {
  const config = getContactConfig()

  if (!config) {
    return NextResponse.json(
      { error: 'Contact form is not configured' },
      { status: 503 }
    )
  }

  let body: ContactRequestBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { turnstileToken } = body
  const parsedMessage = contactMessageSchema.safeParse(body)

  if (!parsedMessage.success) {
    return NextResponse.json(
      { error: formatZodError(parsedMessage.error) },
      { status: 400 }
    )
  }

  const passedTurnstile =
    turnstileToken &&
    (await verifyTurnstileToken({
      request,
      secretKey: config.turnstileSecretKey,
      token: turnstileToken,
    }))

  if (!passedTurnstile) {
    return NextResponse.json(
      { error: 'Anti-bot check failed' },
      { status: 400 }
    )
  }

  const delivery = await sendContactEmail(config.resend, {
    email: parsedMessage.data.email,
    fullname: parsedMessage.data.fullname,
    message: parsedMessage.data.message,
  })

  if (!delivery.ok) {
    return NextResponse.json(
      {
        error:
          'Email provider rejected the message. Check that RESEND_FROM_EMAIL uses a verified Resend sending domain.',
        ...(process.env.NODE_ENV === 'development'
          ? { details: delivery.error }
          : {}),
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
