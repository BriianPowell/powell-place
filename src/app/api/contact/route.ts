import { NextResponse } from 'next/server'
import { getContactConfig } from '@/lib/contact/config'
import { sendContactEmail } from '@/lib/contact/resend'
import { contactRequestSchema, formatZodError } from '@/lib/contact/schema'
import { verifyTurnstileToken } from '@/lib/contact/turnstile'

const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 3
const CONTACT_RATE_LIMIT_MAX_BUCKETS = 1000

type ContactRateLimitBucket = {
  count: number
  resetAt: number
}

const contactRateLimitBuckets = new Map<string, ContactRateLimitBucket>()

function pruneExpiredRateLimitBuckets(now: number) {
  for (const [key, bucket] of contactRateLimitBuckets) {
    if (bucket.resetAt <= now) {
      contactRateLimitBuckets.delete(key)
    }
  }
}

function getClientRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]
  const ipAddress =
    request.headers.get('cf-connecting-ip') ?? forwardedFor?.trim()

  if (ipAddress) return ipAddress

  return `unknown:${request.headers.get('user-agent') ?? 'anonymous'}`
}

function isContactRateLimited(request: Request) {
  const now = Date.now()
  const key = getClientRateLimitKey(request)
  const currentBucket = contactRateLimitBuckets.get(key)

  if (contactRateLimitBuckets.size > CONTACT_RATE_LIMIT_MAX_BUCKETS) {
    pruneExpiredRateLimitBuckets(now)

    const oldestKey = contactRateLimitBuckets.keys().next().value
    if (
      contactRateLimitBuckets.size > CONTACT_RATE_LIMIT_MAX_BUCKETS &&
      oldestKey
    ) {
      contactRateLimitBuckets.delete(oldestKey)
    }
  }

  if (!currentBucket || currentBucket.resetAt <= now) {
    contactRateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (currentBucket.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  currentBucket.count += 1
  return false
}

export async function POST(request: Request) {
  const config = getContactConfig()

  if (!config) {
    return NextResponse.json(
      { error: 'Contact form is not configured' },
      { status: 503 }
    )
  }

  if (isContactRateLimited(request)) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429 }
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsedRequest = contactRequestSchema.safeParse(body)

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: formatZodError(parsedRequest.error) },
      { status: 400 }
    )
  }

  const passedTurnstile = await verifyTurnstileToken({
    request,
    secretKey: config.turnstileSecretKey,
    token: parsedRequest.data.turnstileToken,
  })

  if (!passedTurnstile) {
    return NextResponse.json(
      { error: 'Anti-bot check failed' },
      { status: 400 }
    )
  }

  const delivery = await sendContactEmail(config.resend, {
    email: parsedRequest.data.email,
    fullname: parsedRequest.data.fullname,
    message: parsedRequest.data.message,
  })

  if (!delivery.ok) {
    return NextResponse.json(
      {
        error: 'Unable to send message right now. Please try again later.',
        ...(process.env.NODE_ENV === 'development'
          ? { details: delivery.error }
          : {}),
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
