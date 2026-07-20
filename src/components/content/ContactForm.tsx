'use client'

import type { FormEvent } from 'react'
import { useCallback, useState } from 'react'
import styles from './styles/contactForm.module.css'
import { TurnstileWidget } from './TurnstileWidget'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!turnstileToken) {
      setState('error')
      setErrorMessage('Please complete the anti-bot check before sending.')
      return
    }

    setState('submitting')
    setErrorMessage('')

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: data.get('fullname'),
          email: data.get('email'),
          message: data.get('message'),
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
      form.reset()
    } catch (err) {
      setState('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong'
      )
      resetTurnstile()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldRow}>
        <input
          className={styles.input}
          type="text"
          name="fullname"
          placeholder="Full Name"
          required
          disabled={state === 'submitting' || state === 'success'}
        />
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          required
          disabled={state === 'submitting' || state === 'success'}
        />
      </div>
      <textarea
        className={styles.textarea}
        name="message"
        placeholder="Message"
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
        <p className={`${styles.formMessage} ${styles.formMessageSuccess}`}>
          Message transmitted. I&apos;ll get back to you soon.
        </p>
      )}
      {state === 'error' && (
        <p className={`${styles.formMessage} ${styles.formMessageError}`}>
          {errorMessage}
        </p>
      )}
    </form>
  )
}
