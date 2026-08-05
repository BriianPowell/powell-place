'use client'

import { useEffect, useState } from 'react'
import { icons } from '@/lib/icons'
import styles from './styles/taskbar.module.css'

export function TrayInternetIcon() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((currentFrame) => (currentFrame + 1) % icons.connect.length)
    }, 800)

    return () => window.clearInterval(id)
  }, [])

  return (
    <img
      src={icons.connect[frame]}
      alt=""
      className={styles.trayIconImg}
      width={16}
      height={16}
      decoding="async"
    />
  )
}
