'use client'

import { Sidebar } from '@/components/sidebar/Sidebar'
import { site } from '@/data/site'
import { useDesktop } from './DesktopContext'
import styles from './styles/profilePanel.module.css'

export function ProfilePanel() {
  const { isProfileOpen, deactivateBrowser } = useDesktop()

  return (
    <div
      className={isProfileOpen ? styles.panel : styles.panelHidden}
      role="dialog"
      aria-label={`${site.name} — contact information`}
      aria-hidden={!isProfileOpen}
      onFocusCapture={deactivateBrowser}
      onPointerDown={deactivateBrowser}
    >
      <div className={styles.spine} aria-hidden>
        <span className={styles.spineLabel}>{site.website.pretty}</span>
      </div>
      <div className={styles.menuBody}>
        <Sidebar embedded />
      </div>
    </div>
  )
}
