type ContactEmailPayload = {
  email: string
  fullname: string
  message: string
}

export type ResendContactConfig = {
  apiKey: string
  fromEmail: string
  toEmail: string
}

type ContactEmailResult =
  | { ok: true }
  | {
      ok: false
      error: string
      status: number
    }

const RESEND_REQUEST_TIMEOUT_MS = 10_000
const RESEND_ERROR_MAX_LENGTH = 500

function formatContactMessage({
  email,
  fullname,
  message,
}: ContactEmailPayload) {
  return [
    'New contact request from the portfolio website.',
    '',
    `Name: ${fullname}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n')
}

export function formatContactSubjectName(fullname: string) {
  return Array.from(fullname)
    .map((char) => {
      const charCode = char.charCodeAt(0)
      return charCode <= 31 || charCode === 127 ? ' ' : char
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

async function getResendError(response: Response) {
  const error = await response.text()
  return error.slice(0, RESEND_ERROR_MAX_LENGTH)
}

export async function sendContactEmail(
  config: ResendContactConfig,
  payload: ContactEmailPayload
): Promise<ContactEmailResult> {
  let response: Response

  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.fromEmail,
        to: [config.toEmail],
        reply_to: payload.email,
        subject: `New portfolio contact from ${formatContactSubjectName(
          payload.fullname
        )}`,
        text: formatContactMessage(payload),
      }),
      signal: AbortSignal.timeout(RESEND_REQUEST_TIMEOUT_MS),
    })
  } catch {
    return {
      ok: false,
      error: 'Resend request failed',
      status: 0,
    }
  }

  if (response.ok) {
    return { ok: true }
  }

  const error = await getResendError(response)

  return {
    ok: false,
    error,
    status: response.status,
  }
}
