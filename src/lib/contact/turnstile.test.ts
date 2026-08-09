import { afterEach, describe, expect, it, vi } from 'vitest'

import { verifyTurnstileToken } from './turnstile'

function createRequest(headers: HeadersInit = {}) {
  return new Request('https://powell.place/api/contact', {
    headers,
  })
}

describe('verifyTurnstileToken', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true for successful Siteverify responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          success: true,
        })
      )
    )

    await expect(
      verifyTurnstileToken({
        request: createRequest(),
        secretKey: 'secret',
        token: 'token',
      })
    ).resolves.toBe(true)
  })

  it('passes the Cloudflare visitor IP when present', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: true }))
    vi.stubGlobal('fetch', fetchMock)

    await verifyTurnstileToken({
      request: createRequest({
        'cf-connecting-ip': '203.0.113.10',
      }),
      secretKey: 'secret',
      token: 'token',
    })

    const requestBody = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams
    expect(requestBody.get('remoteip')).toBe('203.0.113.10')
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    )
  })

  it('fails closed when Siteverify rejects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network error'))
    )

    await expect(
      verifyTurnstileToken({
        request: createRequest(),
        secretKey: 'secret',
        token: 'token',
      })
    ).resolves.toBe(false)
  })
})
