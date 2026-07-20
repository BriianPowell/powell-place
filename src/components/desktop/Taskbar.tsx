'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EarthIcon } from '@/components/EarthIcon'
import { site } from '@/data/site'
import { formatTaskbarClock } from '@/lib/formatClock'
import { activeTabFromPath, getTaskbarAppLabel } from '@/lib/routing'
import { useDesktop } from './DesktopContext'
import { StartButtonIcon } from './StartButtonIcon'
import styles from './styles/taskbar.module.css'
import { TrayInternetIcon } from './TrayInternetIcon'

export function Taskbar() {
  const pathname = usePathname()
  const active = activeTabFromPath(pathname)
  const {
    isProfileOpen,
    isBrowserActive,
    isBrowserMinimized,
    toggleProfile,
    focusBrowser,
    deactivateBrowser,
  } = useDesktop()
  const [time, setTime] = useState<string | null>(null)
  const startButtonClassName = `${styles.startBtn} win98Button ${
    isProfileOpen ? `${styles.startBtnPressed} win98ButtonPressed` : ''
  }`
  const appButtonClassName = `${styles.appBtn} win98Button ${
    isBrowserActive ? `${styles.appBtnPressed} win98ButtonPressed` : ''
  }`

  useEffect(() => {
    const tick = () => setTime(formatTaskbarClock(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <footer
      className={styles.taskbar}
      role="contentinfo"
      aria-label="Taskbar"
      onPointerDown={deactivateBrowser}
    >
      <div className={styles.taskbarStart}>
        <button
          type="button"
          className={startButtonClassName}
          aria-label="Start — profile and contacts"
          aria-pressed={isProfileOpen}
          title={isProfileOpen ? 'Close profile' : 'Open profile'}
          onClick={toggleProfile}
        >
          <StartButtonIcon />
          <span className={styles.startLabel}>Start</span>
        </button>
      </div>

      <div className={styles.taskbarSeparator} aria-hidden />

      <div className={styles.taskbarApps}>
        <button
          type="button"
          className={appButtonClassName}
          aria-label={`${getTaskbarAppLabel(active)} — ${isBrowserMinimized ? 'Restore' : 'Show'} browser`}
          aria-pressed={isBrowserActive}
          title={isBrowserMinimized ? 'Restore portfolio' : 'Show portfolio'}
          onClick={focusBrowser}
        >
          <EarthIcon
            className={styles.appIconImg}
            width={16}
            height={16}
            fallback={<span className={styles.appIconFallback} aria-hidden />}
          />
          <span>{site.name}</span>
        </button>
      </div>

      <div className={styles.tray} aria-label="Notification area">
        <TrayInternetIcon />
        <time
          className={styles.clock}
          dateTime={time ?? undefined}
          suppressHydrationWarning
        >
          {time ?? '—:—'}
        </time>
      </div>
    </footer>
  )
}
