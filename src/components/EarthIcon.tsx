"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { icons } from "@/lib/icons";

type EarthIconProps = {
  className: string;
  width: number;
  height: number;
  fallback: ReactNode;
  src?: string;
};

export function EarthIcon({ className, width, height, fallback, src = icons.earth }: EarthIconProps) {
  const [useFallback, setUseFallback] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (useFallback) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      width={width}
      height={height}
      decoding="async"
      onError={() => {
        if (mountedRef.current) setUseFallback(true);
      }}
    />
  );
}
