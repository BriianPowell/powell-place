"use client";

import { useLayoutEffect, useRef } from "react";
import { useContactMap } from "./ContactMapContext";
import styles from "./content.module.css";

export function ContactMapSlot() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { registerSlot } = useContactMap();

  useLayoutEffect(() => {
    registerSlot(hostRef.current);
    return () => registerSlot(null);
  }, [registerSlot]);

  return <div ref={hostRef} className={styles.mapHost} />;
}
