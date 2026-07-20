'use client'

import { useEffect, useRef, useState } from 'react'
import { icons } from '@/lib/icons'
import { IconGlobe } from './BrowserIcons'
import styles from './styles/browserStatus.module.css'

export function StatusZoneNetworkIcon() {
  const [useFallback, setUseFallback] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  if (useFallback) {
    return <IconGlobe className={styles.statusZoneIcon} />
  }

  return (
    <img
      src={icons.earth}
      alt=""
      className={styles.statusZoneIcon}
      width={16}
      height={16}
      decoding="async"
      onError={() => {
        if (mountedRef.current) setUseFallback(true)
      }}
    />
  )
}
