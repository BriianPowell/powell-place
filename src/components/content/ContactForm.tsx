'use client'

import type { FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { formatZodError, parseContactFormData } from '@/lib/contact/schema'
import styles from './styles/contactForm.module.css'
import { TurnstileWidget } from './TurnstileWidget'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const contactMessageSentKey = 'powell-place:contact-message-sent-at'

function hasSentContactMessage() {
  return Boolean(window.localStorage.getItem(contactMessageSentKey))
}

function rememberContactMessageSent() {
  window.localStorage.setItem(contactMessageSentKey, new Date().toISOString())
}

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const handleTurnstileTokenChange = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const resetTurnstile = () => {
    setTurnstileToken('')
    setTurnstileResetKey((key) => key + 1)
  }

  useEffect(() => {
    if (hasSentContactMessage()) {
      setState('success')
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (state === 'success') return

    if (!turnstileToken) {
      setState('error')
      setErrorMessage('Please complete the anti-bot check before sending.')
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    let payload: ReturnType<typeof parseContactFormData>

    try {
      payload = parseContactFormData(data)
    } catch (err) {
      setState('error')
      setErrorMessage(formatZodError(err))
      return
    }

    setState('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          turnstileToken,
        }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string
        }
        throw new Error(body.error ?? 'Failed to send message')
      }

      setState('success')
      rememberContactMessageSent()
    } catch (err) {
      setState('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong'
      )
      resetTurnstile()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldRow}>
        <input
          className={styles.input}
          type="text"
          name="fullname"
          placeholder="Full Name"
          autoComplete="name"
          minLength={2}
          maxLength={80}
          required
          disabled={state === 'submitting' || state === 'success'}
        />
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          autoComplete="email"
          inputMode="email"
          pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}"
          maxLength={254}
          required
          disabled={state === 'submitting' || state === 'success'}
        />
      </div>
      <textarea
        className={styles.textarea}
        name="message"
        placeholder="Message"
        minLength={10}
        maxLength={2000}
        required
        disabled={state === 'submitting' || state === 'success'}
      />
      <TurnstileWidget
        className={styles.turnstileWrap}
        errorClassName={`${styles.formMessage} ${styles.formMessageError}`}
        resetKey={turnstileResetKey}
        onTokenChange={handleTurnstileTokenChange}
      />
      <button
        type="submit"
        className={`${styles.submitBtn} win98Button`}
        disabled={
          state === 'submitting' || state === 'success' || !turnstileToken
        }
      >
        {state === 'submitting'
          ? 'Sending...'
          : state === 'success'
            ? 'Sent!'
            : 'Send Message'}
      </button>
      {state === 'success' && (
        <p
          className={`${styles.formMessage} ${styles.formMessageSuccess}`}
          role="status"
        >
          Message transmitted. I&apos;ll get back to you soon.
        </p>
      )}
      {state === 'error' && (
        <p
          className={`${styles.formMessage} ${styles.formMessageError}`}
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </form>
  )
}
