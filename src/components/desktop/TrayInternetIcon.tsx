'use client'

import { useEffect, useRef, useState } from 'react'
import { icons } from '@/lib/icons'
import styles from './styles/taskbar.module.css'

function IconTrayNetworkFallback() {
  return (
    <svg className={styles.trayIcon} viewBox="0 0 16 14" aria-hidden>
      <rect
        x="1"
        y="3"
        width="7"
        height="9"
        fill="#c0c0c0"
        stroke="#000"
        strokeWidth="1"
      />
      <rect x="2" y="4" width="5" height="6" fill="#fff" />
      <rect
        x="8"
        y="1"
        width="7"
        height="9"
        fill="#c0c0c0"
        stroke="#000"
        strokeWidth="1"
      />
      <rect x="9" y="2" width="5" height="6" fill="#fff" />
      <path d="M4 10h3M11 8h3" stroke="#000" strokeWidth="1" />
    </svg>
  )
}

export function TrayInternetIcon() {
  const [useFallback, setUseFallback] = useState(false)
  const [frame, setFrame] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((currentFrame) => (currentFrame + 1) % icons.connect.length)
    }, 800)

    return () => window.clearInterval(id)
  }, [])

  if (useFallback) {
    return <IconTrayNetworkFallback />
  }

  return (
    <img
      src={icons.connect[frame]}
      alt=""
      className={styles.trayIconImg}
      width={16}
      height={16}
      decoding="async"
      onError={() => {
        if (mountedRef.current) setUseFallback(true)
      }}
    />
  )
}
