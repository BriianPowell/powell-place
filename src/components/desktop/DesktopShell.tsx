'use client'

import { ReactNode } from 'react'
import { DesktopProvider } from './DesktopContext'
import { DesktopWallpaper } from './DesktopWallpaper'
import { ProfilePanel } from './ProfilePanel'

export function DesktopShell({ children }: { children: ReactNode }) {
  return (
    <DesktopProvider>
      <DesktopWallpaper />
      {children}
      <ProfilePanel />
    </DesktopProvider>
  )
}
