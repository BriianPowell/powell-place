'use client'

import { useEffect } from 'react'
import { icons } from '@/lib/icons'

const faviconFrames = icons.joystick

export function FaviconAnimator() {
  useEffect(() => {
    let frame = 0
    let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

    if (!iconLink) {
      iconLink = document.createElement('link')
      iconLink.rel = 'icon'
      document.head.appendChild(iconLink)
    }

    const tick = () => {
      iconLink.href = faviconFrames[frame]
      frame = (frame + 1) % faviconFrames.length
    }

    tick()
    const intervalId = window.setInterval(tick, 1000)

    return () => {
      window.clearInterval(intervalId)
      iconLink.href = faviconFrames[0]
    }
  }, [])

  return null
}
