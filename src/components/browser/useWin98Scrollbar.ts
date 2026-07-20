'use client'

import { usePathname } from 'next/navigation'
import type { PointerEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

const TRACK_BUTTON_SPACE = 32
const MIN_THUMB_HEIGHT = 28

export function useWin98Scrollbar(children: ReactNode) {
  const pathname = usePathname()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ pointerStart: 0, scrollStart: 0 })
  const [metrics, setMetrics] = useState({
    clientHeight: 0,
    scrollHeight: 0,
    scrollTop: 0,
    trackHeight: 0,
  })

  const updateMetrics = useCallback(() => {
    const scrollArea = scrollAreaRef.current
    const track = trackRef.current
    if (!scrollArea) return

    setMetrics({
      clientHeight: scrollArea.clientHeight,
      scrollHeight: scrollArea.scrollHeight,
      scrollTop: scrollArea.scrollTop,
      trackHeight:
        track?.clientHeight ??
        Math.max(0, scrollArea.clientHeight - TRACK_BUTTON_SPACE),
    })
  }, [])

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    const content = contentRef.current
    const track = trackRef.current
    if (!scrollArea) return

    updateMetrics()

    const resizeObserver = new ResizeObserver(updateMetrics)
    resizeObserver.observe(scrollArea)
    if (content) resizeObserver.observe(content)
    if (track) resizeObserver.observe(track)

    return () => resizeObserver.disconnect()
  }, [metrics.trackHeight, updateMetrics])

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateMetrics)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [children, updateMetrics])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }

    const animationFrame = window.requestAnimationFrame(updateMetrics)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [pathname, updateMetrics])

  const maxScroll = Math.max(0, metrics.scrollHeight - metrics.clientHeight)
  const canScroll = maxScroll > 0
  const thumbHeight = canScroll
    ? Math.max(
        MIN_THUMB_HEIGHT,
        Math.round(
          (metrics.clientHeight / metrics.scrollHeight) * metrics.trackHeight
        )
      )
    : metrics.trackHeight
  const maxThumbTop = Math.max(0, metrics.trackHeight - thumbHeight)
  const thumbTop = canScroll
    ? Math.round((metrics.scrollTop / maxScroll) * maxThumbTop)
    : 0

  const scrollBy = useCallback((delta: number) => {
    scrollAreaRef.current?.scrollBy({ top: delta })
  }, [])

  const handleTrackPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        event.target !== event.currentTarget ||
        !trackRef.current ||
        !scrollAreaRef.current
      )
        return

      const { top } = trackRef.current.getBoundingClientRect()
      const pointerY = event.clientY - top
      scrollBy(
        pointerY < thumbTop ? -metrics.clientHeight : metrics.clientHeight
      )
    },
    [metrics.clientHeight, scrollBy, thumbTop]
  )

  const handleThumbPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!scrollAreaRef.current) return

      event.currentTarget.setPointerCapture(event.pointerId)
      dragRef.current = {
        pointerStart: event.clientY,
        scrollStart: scrollAreaRef.current.scrollTop,
      }
    },
    []
  )

  const handleThumbPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        !event.currentTarget.hasPointerCapture(event.pointerId) ||
        !scrollAreaRef.current ||
        !canScroll
      ) {
        return
      }

      const pointerDelta = event.clientY - dragRef.current.pointerStart
      const scrollDelta =
        maxThumbTop > 0 ? (pointerDelta / maxThumbTop) * maxScroll : 0
      scrollAreaRef.current.scrollTop =
        dragRef.current.scrollStart + scrollDelta
    },
    [canScroll, maxScroll, maxThumbTop]
  )

  return {
    canScroll,
    contentRef,
    handleThumbPointerDown,
    handleThumbPointerMove,
    handleTrackPointerDown,
    scrollAreaRef,
    scrollBy,
    thumbHeight,
    thumbTop,
    trackRef,
    updateMetrics,
  }
}
