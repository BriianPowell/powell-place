import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test } from 'vitest'

async function readProjectFile(relativePath) {
  return readFile(path.join(process.cwd(), relativePath), 'utf8')
}

test('contact API rejects non-JSON and oversized requests before parsing', async () => {
  const route = await readProjectFile('src/app/api/contact/route.ts')

  expect(route).toMatch(/hasJsonContentType/)
  expect(route).toMatch(/status:\s*415/)
  expect(route).toMatch(/CONTACT_REQUEST_BODY_MAX_CHARS/)
  expect(route).toMatch(/status:\s*413/)
})

test('contact names are rejected or sanitized before use in email headers', async () => {
  const schema = await readProjectFile('src/lib/contact/schema.ts')
  const resend = await readProjectFile('src/lib/contact/resend.ts')

  expect(schema).toMatch(/hasControlCharacter/)
  expect(resend).toMatch(/charCode <= 31/)
  expect(resend).toMatch(/formatContactSubjectName/)
})

test('contact provider calls have request timeouts', async () => {
  const turnstile = await readProjectFile('src/lib/contact/turnstile.ts')
  const resend = await readProjectFile('src/lib/contact/resend.ts')

  expect(turnstile).toMatch(
    /AbortSignal\.timeout\(TURNSTILE_VERIFY_TIMEOUT_MS\)/
  )
  expect(resend).toMatch(/AbortSignal\.timeout\(RESEND_REQUEST_TIMEOUT_MS\)/)
})
