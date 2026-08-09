import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getContactConfig, sendContactEmail, verifyTurnstileToken } = vi.hoisted(
  () => ({
    getContactConfig: vi.fn(),
    sendContactEmail: vi.fn(),
    verifyTurnstileToken: vi.fn(),
  })
)

vi.mock('@/lib/contact/config', () => ({
  getContactConfig,
}))

vi.mock('@/lib/contact/resend', () => ({
  sendContactEmail,
}))

vi.mock('@/lib/contact/turnstile', () => ({
  verifyTurnstileToken,
}))

const { POST } = await import('./route')

let requestCount = 0

function createContactRequest({
  body = {
    email: 'test@example.com',
    fullname: 'Test User',
    message: 'This is a test contact message.',
    turnstileToken: 'turnstile-token',
  },
  contentType = 'application/json',
  headers = {},
}: {
  body?: unknown
  contentType?: string
  headers?: HeadersInit
} = {}) {
  requestCount += 1

  return new Request('https://powell.place/api/contact', {
    method: 'POST',
    headers: {
      'cf-connecting-ip': `192.0.2.${requestCount}`,
      'content-type': contentType,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

async function readJson(response: Response) {
  return (await response.json()) as { error?: string; ok?: boolean }
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getContactConfig.mockReturnValue({
      resend: {
        apiKey: 'resend-key',
        fromEmail: 'Portfolio <contact@example.com>',
        toEmail: 'owner@example.com',
      },
      turnstileSecretKey: 'turnstile-secret',
    })
    sendContactEmail.mockResolvedValue({ ok: true })
    verifyTurnstileToken.mockResolvedValue(true)
  })

  it('rejects non-JSON requests before validation', async () => {
    const response = await POST(
      createContactRequest({
        body: 'fullname=Test',
        contentType: 'application/x-www-form-urlencoded',
      })
    )

    expect(response.status).toBe(415)
    expect(await readJson(response)).toEqual({
      error: 'Contact requests must be sent as JSON',
    })
    expect(verifyTurnstileToken).not.toHaveBeenCalled()
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('rejects oversized request bodies before parsing JSON', async () => {
    const response = await POST(
      createContactRequest({
        body: '{}',
        headers: {
          'content-length': `${9 * 1024}`,
        },
      })
    )

    expect(response.status).toBe(413)
    expect(await readJson(response)).toEqual({
      error: 'Contact request is too large',
    })
    expect(verifyTurnstileToken).not.toHaveBeenCalled()
  })

  it('rejects oversized request bodies after reading when length is missing', async () => {
    const response = await POST(
      createContactRequest({
        body: 'x'.repeat(9 * 1024),
      })
    )

    expect(response.status).toBe(413)
    expect(await readJson(response)).toEqual({
      error: 'Contact request is too large',
    })
    expect(verifyTurnstileToken).not.toHaveBeenCalled()
  })

  it('returns unavailable when contact services are not configured', async () => {
    getContactConfig.mockReturnValue(null)

    const response = await POST(createContactRequest())

    expect(response.status).toBe(503)
    expect(await readJson(response)).toEqual({
      error: 'Contact form is not configured',
    })
    expect(verifyTurnstileToken).not.toHaveBeenCalled()
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('rejects invalid request bodies', async () => {
    const response = await POST(createContactRequest({ body: '{not json' }))

    expect(response.status).toBe(400)
    expect(await readJson(response)).toEqual({
      error: 'Invalid request body',
    })
  })

  it('rejects names with control characters', async () => {
    const response = await POST(
      createContactRequest({
        body: {
          email: 'test@example.com',
          fullname: 'Test\nUser',
          message: 'This is a test contact message.',
          turnstileToken: 'turnstile-token',
        },
      })
    )

    expect(response.status).toBe(400)
    expect(await readJson(response)).toEqual({
      error: 'Please remove unsupported characters from your name.',
    })
    expect(verifyTurnstileToken).not.toHaveBeenCalled()
  })

  it('requires a valid Turnstile token before sending email', async () => {
    verifyTurnstileToken.mockResolvedValue(false)

    const response = await POST(createContactRequest())

    expect(response.status).toBe(400)
    expect(await readJson(response)).toEqual({
      error: 'Anti-bot check failed',
    })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('rate limits repeated contact requests from the same client', async () => {
    const repeatedClientHeaders = {
      'cf-connecting-ip': '203.0.113.10',
    }

    for (let requestIndex = 0; requestIndex < 3; requestIndex += 1) {
      const response = await POST(
        createContactRequest({ headers: repeatedClientHeaders })
      )

      expect(response.status).toBe(200)
    }

    const response = await POST(
      createContactRequest({ headers: repeatedClientHeaders })
    )

    expect(response.status).toBe(429)
    expect(await readJson(response)).toEqual({
      error: 'Too many messages. Please try again later.',
    })
  })

  it('sends email after validation and Turnstile verification', async () => {
    const response = await POST(createContactRequest())

    expect(response.status).toBe(200)
    expect(await readJson(response)).toEqual({ ok: true })
    expect(verifyTurnstileToken).toHaveBeenCalledOnce()
    expect(sendContactEmail).toHaveBeenCalledWith(
      {
        apiKey: 'resend-key',
        fromEmail: 'Portfolio <contact@example.com>',
        toEmail: 'owner@example.com',
      },
      {
        email: 'test@example.com',
        fullname: 'Test User',
        message: 'This is a test contact message.',
      }
    )
  })

  it('returns a temporary failure when email delivery fails', async () => {
    sendContactEmail.mockResolvedValue({
      ok: false,
      error: 'provider unavailable',
      status: 503,
    })

    const response = await POST(createContactRequest())

    expect(response.status).toBe(502)
    expect(await readJson(response)).toEqual({
      error: 'Unable to send message right now. Please try again later.',
    })
  })
})
