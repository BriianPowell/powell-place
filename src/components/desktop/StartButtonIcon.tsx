"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "@/lib/icons";
import styles from "./taskbar.module.css";

function IconStartFallback() {
  return (
    <svg className={styles.startIcon} viewBox="0 0 16 14" aria-hidden>
      <rect x="1" y="1" width="6" height="6" fill="#ff0000" stroke="#000" strokeWidth="0.5" />
      <rect x="9" y="1" width="6" height="6" fill="#00a854" stroke="#000" strokeWidth="0.5" />
      <rect x="1" y="7" width="6" height="6" fill="#0078d7" stroke="#000" strokeWidth="0.5" />
      <rect x="9" y="7" width="6" height="6" fill="#ffcc00" stroke="#000" strokeWidth="0.5" />
    </svg>
  );
}

export function StartButtonIcon() {
  const [useFallback, setUseFallback] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (useFallback) {
    return <IconStartFallback />;
  }

  return (
    <img
      src={icons.w95}
      alt=""
      className={styles.startIconImg}
      width={26}
      height={26}
      decoding="async"
      onError={() => {
        if (mountedRef.current) setUseFallback(true);
      }}
    />
  );
}
