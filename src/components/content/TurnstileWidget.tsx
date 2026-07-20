'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type TurnstileOptions = {
  sitekey: string
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
  theme: 'light'
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileOptions) => string
      reset: (widgetId?: string) => void
    }
  }
}

type TurnstileWidgetProps = {
  className: string
  errorClassName: string
  resetKey: number
  onTokenChange: (token: string) => void
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function TurnstileWidget({
  className,
  errorClassName,
  resetKey,
  onTokenChange,
}: TurnstileWidgetProps) {
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetRef = useRef<string | null>(null)

  useEffect(() => {
    if (
      !turnstileSiteKey ||
      !turnstileReady ||
      !window.turnstile ||
      !turnstileContainerRef.current
    ) {
      return
    }

    if (turnstileWidgetRef.current) return

    turnstileWidgetRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: onTokenChange,
        'expired-callback': () => onTokenChange(''),
        'error-callback': () => onTokenChange(''),
      }
    )
  }, [onTokenChange, turnstileReady])

  useEffect(() => {
    if (resetKey === 0) return

    onTokenChange('')
    window.turnstile?.reset(turnstileWidgetRef.current ?? undefined)
  }, [onTokenChange, resetKey])

  return (
    <>
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
          onReady={() => setTurnstileReady(true)}
        />
      )}
      <div className={className}>
        {turnstileSiteKey ? (
          <div ref={turnstileContainerRef} />
        ) : (
          <p className={errorClassName}>
            Contact form anti-bot check is not configured.
          </p>
        )}
      </div>
    </>
  )
}
