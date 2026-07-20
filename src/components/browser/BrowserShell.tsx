'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent, PointerEvent, ReactNode } from 'react'
import { useDesktop } from '@/components/desktop/DesktopContext'
import { EarthIcon } from '@/components/EarthIcon'
import { site, tabs } from '@/data/site'
import { getAddressForPath } from '@/lib/address'
import { icons } from '@/lib/icons'
import { activeTabFromPath, getBrowserTitle } from '@/lib/routing'
import {
  IconDocument,
  IconResizeGrip,
  IconWinMaximize,
  IconWinMinimize,
} from './BrowserIcons'
import { BrowserToolbar } from './BrowserToolbar'
import { StatusPageWebIcon } from './StatusPageWebIcon'
import { StatusZoneNetworkIcon } from './StatusZoneNetworkIcon'
import statusStyles from './styles/browserStatus.module.css'
import tabStyles from './styles/browserTabs.module.css'
import styles from './styles/browserWindow.module.css'
import { useDraggableResizable } from './useDraggableResizable'
import { Win98ScrollViewport } from './Win98ScrollViewport'

type BrowserShellProps = {
  children: ReactNode
}

export function BrowserShell({ children }: BrowserShellProps) {
  const pathname = usePathname()
  const active = activeTabFromPath(pathname)
  const {
    desktopRef,
    isMaximized,
    rect,
    startDrag,
    startResize,
    toggleMaximize,
  } = useDraggableResizable()
  const {
    isBrowserActive,
    isBrowserMinimized,
    activateBrowser,
    deactivateBrowser,
    minimizeBrowser,
  } = useDesktop()

  const stopTitleBarClick = (event: MouseEvent | PointerEvent) => {
    activateBrowser()
    event.stopPropagation()
  }

  return (
    <div
      ref={desktopRef}
      className={styles.desktop}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          deactivateBrowser()
        }
      }}
    >
      <div
        id="portfolio-browser-window"
        className={`${styles.window} ${isBrowserMinimized ? styles.windowMinimized : ''}`}
        role="application"
        aria-hidden={isBrowserMinimized}
        aria-label={`${site.name} — Portfolio`}
        onFocusCapture={activateBrowser}
        onPointerDown={activateBrowser}
        style={{
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
        }}
      >
        <div
          className={`${styles.titleBar} ${isBrowserActive ? '' : styles.titleBarInactive}`}
          onPointerDown={startDrag}
          role="presentation"
        >
          <EarthIcon
            className={styles.titleIcon}
            width={16}
            height={16}
            src={icons.html}
            fallback={<IconDocument className={styles.titleIcon} />}
          />
          <span className={styles.titleText}>{getBrowserTitle(active)}</span>
          <div className={styles.windowControls}>
            <button
              type="button"
              className={`${styles.winBtn} ${styles.winBtnMinimize} win98Button`}
              aria-label="Minimize to taskbar"
              title="Minimize"
              onPointerDown={stopTitleBarClick}
              onClick={(event) => {
                event.stopPropagation()
                minimizeBrowser()
              }}
            >
              <IconWinMinimize className={styles.winBtnIcon} />
            </button>
            <button
              type="button"
              className={`${styles.winBtn} ${styles.winBtnMaximize} win98Button`}
              aria-label={
                isMaximized
                  ? 'Restore browser window'
                  : 'Maximize browser window'
              }
              aria-pressed={isMaximized}
              title={isMaximized ? 'Restore' : 'Maximize'}
              onPointerDown={stopTitleBarClick}
              onClick={(event) => {
                event.stopPropagation()
                toggleMaximize()
              }}
            >
              <IconWinMaximize className={styles.winBtnIcon} />
            </button>
          </div>
        </div>

        <BrowserToolbar address={getAddressForPath(pathname)} />

        <div className={styles.contentShell}>
          <menu
            className={`${tabStyles.tabBar} win95Scrollbar`}
            role="tablist"
            aria-label="Open pages"
          >
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`${tabStyles.tabItem} ${active === tab.id ? tabStyles.tabItemActive : ''}`}
                role="tab"
                aria-selected={active === tab.id}
              >
                <Link
                  href={tab.path}
                  className={tabStyles.tab}
                  aria-current={active === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </menu>
          <div className={styles.contentFrame}>
            <Win98ScrollViewport className={styles.viewport}>
              {children}
            </Win98ScrollViewport>
          </div>
        </div>

        <div className={statusStyles.statusBar}>
          <div
            className={statusStyles.statusPane}
            data-variant="main"
            title="Page status"
          >
            <StatusPageWebIcon />
            <span>Done</span>
          </div>
          <div
            className={statusStyles.statusPane}
            data-variant="spacer"
            aria-hidden
          />
          <div
            className={statusStyles.statusPane}
            data-variant="small"
            aria-hidden
          />
          <div
            className={statusStyles.statusPane}
            data-variant="zone"
            title="Security zone"
          >
            <StatusZoneNetworkIcon />
            <span>Internet</span>
          </div>
          <button
            type="button"
            className={statusStyles.statusGrip}
            aria-label="Resize window"
            onPointerDown={startResize}
          >
            <IconResizeGrip className={statusStyles.statusGripIcon} />
          </button>
        </div>
      </div>
    </div>
  )
}
