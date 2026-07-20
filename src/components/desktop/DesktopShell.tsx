'use client'

import { ReactNode } from 'react'
import { DesktopProvider } from './DesktopContext'
import { ProfilePanel } from './ProfilePanel'

export function DesktopShell({ children }: { children: ReactNode }) {
  return (
    <DesktopProvider>
      {children}
      <ProfilePanel />
    </DesktopProvider>
  )
}
