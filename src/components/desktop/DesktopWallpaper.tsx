'use client'

import { useEffect } from 'react'
import { desktopWallpapers } from '@/data/wallpapers'

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
    const image = new Image()
    let currentIndex = chooseWallpaperIndex()
    let attempts = 0

    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.dataset.desktopWallpaper = 'true'
    document.head.appendChild(preloadLink)

    image.onload = () => {
      const wallpaper = desktopWallpapers[currentIndex]

      root.style.setProperty('--desktop-wallpaper', `url("${wallpaper}")`)
      root.classList.add('has-desktop-wallpaper')
    }

    image.onerror = () => {
      attempts += 1
      if (attempts >= desktopWallpapers.length) return

      currentIndex = (currentIndex + 1) % desktopWallpapers.length
      preloadWallpaper(desktopWallpapers[currentIndex])
    }

    function preloadWallpaper(wallpaper: string) {
      preloadLink.href = wallpaper
      image.src = wallpaper
    }

    preloadWallpaper(desktopWallpapers[currentIndex])

    return () => {
      image.onload = null
      image.onerror = null
      preloadLink.remove()
      root.classList.remove('has-desktop-wallpaper')
      root.style.removeProperty('--desktop-wallpaper')
    }
  }, [])

  return null
}
