import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatContactSubjectName, sendContactEmail } from './resend'

const resendConfig = {
  apiKey: 'resend-key',
  fromEmail: 'Portfolio <contact@example.com>',
  toEmail: 'owner@example.com',
}

const payload = {
  email: 'test@example.com',
  fullname: 'Test User',
  message: 'This is a valid test message.',
}

describe('formatContactSubjectName', () => {
  it('removes header control characters', () => {
    expect(formatContactSubjectName('Test\r\nBcc: attacker@example.com')).toBe(
      'Test Bcc: attacker@example.com'
    )
  })
})

describe('sendContactEmail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the contact email through Resend', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(sendContactEmail(resendConfig, payload)).resolves.toEqual({
      ok: true,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        signal: expect.any(AbortSignal),
      })
    )
    const requestBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)
    expect(requestBody).toMatchObject({
      from: resendConfig.fromEmail,
      reply_to: payload.email,
      subject: 'New portfolio contact from Test User',
      text: expect.stringContaining(payload.message),
      to: [resendConfig.toEmail],
    })
  })

  it('returns a bounded provider error', async () => {
    const errorText = 'x'.repeat(1000)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(errorText, { status: 429 }))
    )

    const result = await sendContactEmail(resendConfig, payload)

    expect(result).toEqual({
      ok: false,
      error: 'x'.repeat(500),
      status: 429,
    })
  })

  it('returns a safe failure when the request rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))

    await expect(sendContactEmail(resendConfig, payload)).resolves.toEqual({
      ok: false,
      error: 'Resend request failed',
      status: 0,
    })
  })
})
