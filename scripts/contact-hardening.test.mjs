import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

async function readProjectFile(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('contact API rejects non-JSON and oversized requests before parsing', async () => {
  const route = await readProjectFile('src/app/api/contact/route.ts')

  assert.match(route, /hasJsonContentType/)
  assert.match(route, /status:\s*415/)
  assert.match(route, /CONTACT_REQUEST_BODY_MAX_CHARS/)
  assert.match(route, /status:\s*413/)
})

test('contact names are rejected or sanitized before use in email headers', async () => {
  const schema = await readProjectFile('src/lib/contact/schema.ts')
  const resend = await readProjectFile('src/lib/contact/resend.ts')

  assert.match(schema, /hasControlCharacter/)
  assert.match(resend, /charCode <= 31/)
  assert.match(resend, /formatContactSubjectName/)
})

test('contact provider calls have request timeouts', async () => {
  const turnstile = await readProjectFile('src/lib/contact/turnstile.ts')
  const resend = await readProjectFile('src/lib/contact/resend.ts')

  assert.match(turnstile, /AbortSignal\.timeout\(TURNSTILE_VERIFY_TIMEOUT_MS\)/)
  assert.match(resend, /AbortSignal\.timeout\(RESEND_REQUEST_TIMEOUT_MS\)/)
})
