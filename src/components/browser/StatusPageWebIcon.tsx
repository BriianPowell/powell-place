"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "@/lib/icons";
import { IconStatusPage } from "./BrowserIcons";
import styles from "./browser.module.css";

export function StatusPageWebIcon() {
  const [useFallback, setUseFallback] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (useFallback) {
    return <IconStatusPage className={styles.statusPaneIconImg} />;
  }

  return (
    <img
      src={icons.html}
      alt=""
      className={styles.statusPaneIconImg}
      width={14}
      height={14}
      decoding="async"
      onError={() => {
        if (mountedRef.current) setUseFallback(true);
      }}
    />
  );
}
