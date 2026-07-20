type TurnstileResponse = {
  success: boolean
  'error-codes'?: string[]
}

function getRemoteIp(request: Request): string | null {
  return (
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null
  )
}

export async function verifyTurnstileToken({
  request,
  secretKey,
  token,
}: {
  request: Request
  secretKey: string
  token: string
}): Promise<boolean> {
  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  })
  const remoteIp = getRemoteIp(request)

  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    }
  )

  if (!response.ok) return false

  const result = (await response.json()) as TurnstileResponse
  return result.success
}
