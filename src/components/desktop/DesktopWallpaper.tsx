'use client'

import { useEffect } from 'react'
import { desktopWallpapers } from '@/data/wallpapers'

const WALLPAPER_REVEAL_TIMEOUT_MS = 4000

function chooseWallpaperIndex() {
  const randomValue =
    typeof window.crypto?.getRandomValues === 'function'
      ? window.crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
      : Math.random()

  return Math.floor(randomValue * desktopWallpapers.length)
}

export function DesktopWallpaper() {
  useEffect(() => {
    const root = document.documentElement
    const preloadLink = document.createElement('link')
    let currentIndex = chooseWallpaperIndex()
    let attempts = 0

    const revealDesktop = () => {
      root.classList.remove('desktop-wallpaper-loading')
    }
    const revealFallback = window.setTimeout(
      revealDesktop,
      WALLPAPER_REVEAL_TIMEOUT_MS
    )

    root.classList.add('desktop-wallpaper-loading')
    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.dataset.desktopWallpaper = 'true'
    document.head.appendChild(preloadLink)

    preloadLink.onload = () => {
      const wallpaper = desktopWallpapers[currentIndex]

      window.clearTimeout(revealFallback)
      root.style.setProperty('--desktop-wallpaper', `url("${wallpaper}")`)
      root.classList.add('has-desktop-wallpaper')
      revealDesktop()
    }

    preloadLink.onerror = () => {
      attempts += 1
      if (attempts >= desktopWallpapers.length) {
        window.clearTimeout(revealFallback)
        revealDesktop()
        return
      }

      currentIndex = (currentIndex + 1) % desktopWallpapers.length
      preloadWallpaper(desktopWallpapers[currentIndex])
    }

    function preloadWallpaper(wallpaper: string) {
      preloadLink.href = wallpaper
    }

    preloadWallpaper(desktopWallpapers[currentIndex])

    return () => {
      window.clearTimeout(revealFallback)
      preloadLink.onload = null
      preloadLink.onerror = null
      preloadLink.remove()
      root.classList.remove('has-desktop-wallpaper')
      root.classList.remove('desktop-wallpaper-loading')
      root.style.removeProperty('--desktop-wallpaper')
    }
  }, [])

  return null
}
