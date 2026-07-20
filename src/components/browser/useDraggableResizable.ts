'use client'

import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export const WINDOW_DEFAULTS = {
  width: 1040,
  height: 720,
  minWidth: 420,
  minHeight: 360,
} as const

export type WindowRect = {
  x: number
  y: number
  width: number
  height: number
}

type DragSession = {
  target: HTMLElement
  pointerId: number
  pointerX: number
  pointerY: number
  originX: number
  originY: number
}

type ResizeSession = {
  target: HTMLElement
  pointerId: number
  pointerX: number
  pointerY: number
  originWidth: number
  originHeight: number
}

function clampRect(rect: WindowRect, bounds: DOMRect): WindowRect {
  const { minWidth, minHeight } = WINDOW_DEFAULTS
  const width = Math.min(bounds.width, Math.max(minWidth, rect.width))
  const height = Math.min(bounds.height, Math.max(minHeight, rect.height))
  const maxX = Math.max(0, bounds.width - width)
  const maxY = Math.max(0, bounds.height - height)

  return {
    width,
    height,
    x: Math.min(Math.max(0, rect.x), maxX),
    y: Math.min(Math.max(0, rect.y), maxY),
  }
}

function centeredRect(bounds: DOMRect): WindowRect {
  const width = Math.min(WINDOW_DEFAULTS.width, bounds.width)
  const height = Math.min(WINDOW_DEFAULTS.height, bounds.height)

  return clampRect(
    {
      x: (bounds.width - width) / 2,
      y: (bounds.height - height) / 2,
      width,
      height,
    },
    bounds
  )
}

function maximizedRect(bounds: DOMRect): WindowRect {
  return {
    x: 0,
    y: 0,
    width: bounds.width,
    height: bounds.height,
  }
}

/** Same on server and first client paint — centering runs in useLayoutEffect after hydration. */
const HYDRATION_RECT: WindowRect = {
  x: 0,
  y: 0,
  width: WINDOW_DEFAULTS.width,
  height: WINDOW_DEFAULTS.height,
}

export function useDraggableResizable() {
  const desktopRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<WindowRect>(HYDRATION_RECT)
  const [isMaximized, setIsMaximized] = useState(false)
  const restoreRect = useRef<WindowRect | null>(null)
  const dragSession = useRef<DragSession | null>(null)
  const resizeSession = useRef<ResizeSession | null>(null)

  const getBounds = useCallback(() => {
    return (
      desktopRef.current?.getBoundingClientRect() ??
      new DOMRect(0, 0, window.innerWidth, window.innerHeight)
    )
  }, [])

  useLayoutEffect(() => {
    setRect(centeredRect(getBounds()))
  }, [getBounds])

  useEffect(() => {
    const onResize = () => {
      setRect((current) =>
        isMaximized
          ? maximizedRect(getBounds())
          : clampRect(current, getBounds())
      )
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [getBounds, isMaximized])

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!desktopRef.current?.isConnected) return

      if (dragSession.current) {
        const { pointerX, pointerY, originX, originY } = dragSession.current
        const dx = event.clientX - pointerX
        const dy = event.clientY - pointerY
        setRect((current) =>
          clampRect(
            {
              ...current,
              x: originX + dx,
              y: originY + dy,
            },
            getBounds()
          )
        )
      }

      if (resizeSession.current) {
        const { pointerX, pointerY, originWidth, originHeight } =
          resizeSession.current
        const dx = event.clientX - pointerX
        const dy = event.clientY - pointerY
        setRect((current) =>
          clampRect(
            {
              ...current,
              width: originWidth + dx,
              height: originHeight + dy,
            },
            getBounds()
          )
        )
      }
    }

    const releaseCapture = (session: DragSession | ResizeSession | null) => {
      if (!session) return
      try {
        session.target.releasePointerCapture(session.pointerId)
      } catch {
        /* pointer already released */
      }
    }

    const endInteraction = () => {
      releaseCapture(dragSession.current)
      releaseCapture(resizeSession.current)
      dragSession.current = null
      resizeSession.current = null
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endInteraction)
    window.addEventListener('pointercancel', endInteraction)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endInteraction)
      window.removeEventListener('pointercancel', endInteraction)
      dragSession.current = null
      resizeSession.current = null
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [getBounds])

  const startDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      if (isMaximized) return
      if ((event.target as HTMLElement).closest('button, a')) return

      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      dragSession.current = {
        target: event.currentTarget,
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        originX: rect.x,
        originY: rect.y,
      }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'move'
    },
    [isMaximized, rect.x, rect.y]
  )

  const startResize = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      if (isMaximized) return

      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.setPointerCapture(event.pointerId)
      resizeSession.current = {
        target: event.currentTarget,
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        originWidth: rect.width,
        originHeight: rect.height,
      }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'nwse-resize'
    },
    [isMaximized, rect.width, rect.height]
  )

  const toggleMaximize = useCallback(() => {
    const bounds = getBounds()

    if (isMaximized) {
      setRect(clampRect(restoreRect.current ?? centeredRect(bounds), bounds))
      restoreRect.current = null
      setIsMaximized(false)
      return
    }

    restoreRect.current = rect
    setRect(maximizedRect(bounds))
    setIsMaximized(true)
  }, [getBounds, isMaximized, rect])

  return {
    desktopRef,
    isMaximized,
    rect,
    startDrag,
    startResize,
    toggleMaximize,
  }
}
