import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ContactForm } from './ContactForm'

vi.mock('./TurnstileWidget', () => ({
  TurnstileWidget: ({
    onTokenChange,
  }: {
    onTokenChange: (token: string) => void
  }) => {
    React.useEffect(() => {
      onTokenChange('turnstile-token')
    }, [onTokenChange])

    return React.createElement('div', { 'data-testid': 'turnstile-widget' })
  },
}))

describe('ContactForm', () => {
  afterEach(() => {
    window.localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('submits a validated payload and shows success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    render(React.createElement(ContactForm))

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'This is a valid contact form message.' },
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeEnabled()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Send Message' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        "Message transmitted. I'll get back to you soon."
      )
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const requestBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)
    expect(requestBody).toEqual({
      email: 'test@example.com',
      fullname: 'Test User',
      message: 'This is a valid contact form message.',
      turnstileToken: 'turnstile-token',
    })
  })
})
