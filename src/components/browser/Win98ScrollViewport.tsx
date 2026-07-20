'use client'

import type { ReactNode } from 'react'
import styles from './styles/win98ScrollViewport.module.css'
import { useWin98Scrollbar } from './useWin98Scrollbar'

type Win98ScrollViewportProps = {
  children: ReactNode
  className?: string
}

const LINE_SCROLL = 48

export function Win98ScrollViewport({
  children,
  className,
}: Win98ScrollViewportProps) {
  const {
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
  } = useWin98Scrollbar(children)

  return (
    <div className={className}>
      <div
        ref={scrollAreaRef}
        className={styles.scrollArea}
        onScroll={updateMetrics}
      >
        <div ref={contentRef} className={styles.scrollContent}>
          {children}
        </div>
      </div>
      {canScroll && (
        <div className={styles.scrollbar}>
          <button
            type="button"
            className={`${styles.scrollButton} ${styles.scrollButtonUp}`}
            aria-label="Scroll up"
            onClick={() => scrollBy(-LINE_SCROLL)}
          />
          <div
            ref={trackRef}
            className={styles.track}
            onPointerDown={handleTrackPointerDown}
          >
            <div
              className={styles.thumb}
              style={{
                height: thumbHeight,
                transform: `translateY(${thumbTop}px)`,
              }}
              onPointerDown={handleThumbPointerDown}
              onPointerMove={handleThumbPointerMove}
            />
          </div>
          <button
            type="button"
            className={`${styles.scrollButton} ${styles.scrollButtonDown}`}
            aria-label="Scroll down"
            onClick={() => scrollBy(LINE_SCROLL)}
          />
        </div>
      )}
    </div>
  )
}
