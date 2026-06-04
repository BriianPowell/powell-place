"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export const WINDOW_DEFAULTS = {
  width: 960,
  height: 640,
  minWidth: 420,
  minHeight: 360,
} as const;

export type WindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DragSession = {
  target: HTMLElement;
  pointerId: number;
  pointerX: number;
  pointerY: number;
  originX: number;
  originY: number;
};

type ResizeSession = {
  target: HTMLElement;
  pointerId: number;
  pointerX: number;
  pointerY: number;
  originWidth: number;
  originHeight: number;
};

function clampRect(rect: WindowRect, bounds: DOMRect): WindowRect {
  const { minWidth, minHeight } = WINDOW_DEFAULTS;
  const width = Math.min(bounds.width, Math.max(minWidth, rect.width));
  const height = Math.min(bounds.height, Math.max(minHeight, rect.height));
  const maxX = Math.max(0, bounds.width - width);
  const maxY = Math.max(0, bounds.height - height);

  return {
    width,
    height,
    x: Math.min(Math.max(0, rect.x), maxX),
    y: Math.min(Math.max(0, rect.y), maxY),
  };
}

function centeredRect(bounds: DOMRect): WindowRect {
  const width = Math.min(WINDOW_DEFAULTS.width, bounds.width);
  const height = Math.min(WINDOW_DEFAULTS.height, bounds.height);

  return clampRect(
    {
      x: (bounds.width - width) / 2,
      y: (bounds.height - height) / 2,
      width,
      height,
    },
    bounds,
  );
}

/** Same on server and first client paint — centering runs in useLayoutEffect after hydration. */
const HYDRATION_RECT: WindowRect = {
  x: 0,
  y: 0,
  width: WINDOW_DEFAULTS.width,
  height: WINDOW_DEFAULTS.height,
};

export function useDraggableResizable() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<WindowRect>(HYDRATION_RECT);
  const dragSession = useRef<DragSession | null>(null);
  const resizeSession = useRef<ResizeSession | null>(null);

  const getBounds = useCallback(() => {
    return (
      desktopRef.current?.getBoundingClientRect() ??
      new DOMRect(0, 0, window.innerWidth, window.innerHeight)
    );
  }, []);

  useLayoutEffect(() => {
    setRect(centeredRect(getBounds()));

    const onResize = () => {
      setRect((current) => clampRect(current, getBounds()));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getBounds]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!desktopRef.current?.isConnected) return;

      if (dragSession.current) {
        const { pointerX, pointerY, originX, originY } = dragSession.current;
        const dx = event.clientX - pointerX;
        const dy = event.clientY - pointerY;
        setRect((current) =>
          clampRect(
            {
              ...current,
              x: originX + dx,
              y: originY + dy,
            },
            getBounds(),
          ),
        );
      }

      if (resizeSession.current) {
        const { pointerX, pointerY, originWidth, originHeight } =
          resizeSession.current;
        const dx = event.clientX - pointerX;
        const dy = event.clientY - pointerY;
        setRect((current) =>
          clampRect(
            {
              ...current,
              width: originWidth + dx,
              height: originHeight + dy,
            },
            getBounds(),
          ),
        );
      }
    };

    const releaseCapture = (session: DragSession | ResizeSession | null) => {
      if (!session) return;
      try {
        session.target.releasePointerCapture(session.pointerId);
      } catch {
        /* pointer already released */
      }
    };

    const endInteraction = () => {
      releaseCapture(dragSession.current);
      releaseCapture(resizeSession.current);
      dragSession.current = null;
      resizeSession.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endInteraction);
    window.addEventListener("pointercancel", endInteraction);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endInteraction);
      window.removeEventListener("pointercancel", endInteraction);
      dragSession.current = null;
      resizeSession.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [getBounds]);

  const startDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest("button, a")) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragSession.current = {
        target: event.currentTarget,
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        originX: rect.x,
        originY: rect.y,
      };
      document.body.style.userSelect = "none";
      document.body.style.cursor = "move";
    },
    [rect.x, rect.y],
  );

  const startResize = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      resizeSession.current = {
        target: event.currentTarget,
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        originWidth: rect.width,
        originHeight: rect.height,
      };
      document.body.style.userSelect = "none";
      document.body.style.cursor = "nwse-resize";
    },
    [rect.width, rect.height],
  );

  return {
    desktopRef,
    rect,
    startDrag,
    startResize,
  };
}
