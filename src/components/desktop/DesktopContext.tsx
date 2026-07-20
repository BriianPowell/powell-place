'use client'

import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type DesktopContextValue = {
  isProfileOpen: boolean
  isBrowserMinimized: boolean
  isBrowserActive: boolean
  toggleProfile: () => void
  minimizeBrowser: () => void
  focusBrowser: () => void
  activateBrowser: () => void
  deactivateBrowser: () => void
}

const DesktopContext = createContext<DesktopContextValue | null>(null)

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isBrowserMinimized, setIsBrowserMinimized] = useState(false)
  const [isBrowserActive, setIsBrowserActive] = useState(true)

  const toggleProfile = useCallback(() => {
    setIsBrowserActive(false)
    setIsProfileOpen((open) => !open)
  }, [])

  const minimizeBrowser = useCallback(() => {
    setIsProfileOpen(false)
    setIsBrowserMinimized(true)
    setIsBrowserActive(false)
  }, [])

  const focusBrowser = useCallback(() => {
    setIsProfileOpen(false)
    setIsBrowserMinimized(false)
    setIsBrowserActive(true)
  }, [])

  const activateBrowser = useCallback(() => {
    setIsProfileOpen(false)
    setIsBrowserActive(true)
  }, [])

  const deactivateBrowser = useCallback(() => {
    setIsBrowserActive(false)
  }, [])

  const value = useMemo(
    () => ({
      isProfileOpen,
      isBrowserMinimized,
      isBrowserActive,
      toggleProfile,
      minimizeBrowser,
      focusBrowser,
      activateBrowser,
      deactivateBrowser,
    }),
    [
      isProfileOpen,
      isBrowserMinimized,
      isBrowserActive,
      toggleProfile,
      minimizeBrowser,
      focusBrowser,
      activateBrowser,
      deactivateBrowser,
    ]
  )

  return (
    <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
  )
}

export function useDesktop() {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error('useDesktop must be used within DesktopProvider')
  }
  return context
}
