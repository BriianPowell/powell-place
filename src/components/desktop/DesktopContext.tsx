"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DesktopContextValue = {
  isProfileOpen: boolean;
  isBrowserMinimized: boolean;
  toggleProfile: () => void;
  minimizeBrowser: () => void;
  focusBrowser: () => void;
};

const DesktopContext = createContext<DesktopContextValue | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBrowserMinimized, setIsBrowserMinimized] = useState(false);

  const toggleProfile = useCallback(() => setIsProfileOpen((open) => !open), []);

  const minimizeBrowser = useCallback(() => {
    setIsProfileOpen(false);
    setIsBrowserMinimized(true);
  }, []);

  const focusBrowser = useCallback(() => {
    setIsProfileOpen(false);
    setIsBrowserMinimized(false);
  }, []);

  const value = useMemo(
    () => ({
      isProfileOpen,
      isBrowserMinimized,
      toggleProfile,
      minimizeBrowser,
      focusBrowser,
    }),
    [isProfileOpen, isBrowserMinimized, toggleProfile, minimizeBrowser, focusBrowser],
  );

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error("useDesktop must be used within DesktopProvider");
  }
  return context;
}
