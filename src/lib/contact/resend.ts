export type ContactEmailPayload = {
  email: string
  fullname: string
  message: string
}

export type ResendContactConfig = {
  apiKey: string
  fromEmail: string
  toEmail: string
}

export type ContactEmailResult =
  | { ok: true }
  | {
      ok: false
      error: string
      status: number
    }

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

export async function sendContactEmail(
  config: ResendContactConfig,
  payload: ContactEmailPayload
): Promise<ContactEmailResult> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [config.toEmail],
      reply_to: payload.email,
      subject: `New portfolio contact from ${payload.fullname}`,
      text: formatContactMessage(payload),
    }),
  })

  if (response.ok) {
    return { ok: true }
  }

  const error = await response.text()

  return {
    ok: false,
    error,
    status: response.status,
  }
}
