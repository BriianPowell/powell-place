import { describe, expect, it } from 'vitest'

import { contactRequestSchema, parseContactFormData } from './schema'

describe('contact schema', () => {
  it('accepts valid contact requests', () => {
    const result = contactRequestSchema.safeParse({
      email: 'test@example.com',
      fullname: 'Test User',
      message: 'This is a valid test message.',
      turnstileToken: 'token',
    })

    expect(result.success).toBe(true)
  })

  it('trims fields and rejects names with control characters', () => {
    const result = contactRequestSchema.safeParse({
      email: ' test@example.com ',
      fullname: 'Test\r\nUser',
      message: ' This is a valid test message. ',
      turnstileToken: ' token ',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'Please remove unsupported characters from your name.'
    )
  })

  it('parses form data with the shared client/server schema', () => {
    const data = new FormData()
    data.set('email', 'test@example.com')
    data.set('fullname', 'Test User')
    data.set('message', 'This is a valid test message.')

    expect(parseContactFormData(data)).toEqual({
      email: 'test@example.com',
      fullname: 'Test User',
      message: 'This is a valid test message.',
    })
  })
})
