"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { formatTaskbarClock } from "@/lib/formatClock";
import { activeTabFromPath, getTaskbarAppLabel } from "@/lib/routing";
import { useDesktop } from "./DesktopContext";
import { EarthIcon } from "@/components/EarthIcon";
import { StartButtonIcon } from "./StartButtonIcon";
import { TrayInternetIcon } from "./TrayInternetIcon";
import styles from "./taskbar.module.css";

export function Taskbar() {
  const pathname = usePathname();
  const active = activeTabFromPath(pathname);
  const { isProfileOpen, isBrowserMinimized, toggleProfile, focusBrowser } = useDesktop();
  const isBrowserActive = !isProfileOpen && !isBrowserMinimized;
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatTaskbarClock(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className={styles.taskbar} role="contentinfo" aria-label="Taskbar">
      <div className={styles.taskbarStart}>
        <button
          type="button"
          className={`${styles.startBtn} ${isProfileOpen ? styles.startBtnPressed : ""}`}
          aria-label="Start — profile and contacts"
          aria-pressed={isProfileOpen}
          title={isProfileOpen ? "Close profile" : "Open profile"}
          onClick={toggleProfile}
        >
          <StartButtonIcon />
        </button>
      </div>

      <div className={styles.taskbarSeparator} aria-hidden />

      <div className={styles.taskbarApps}>
        <button
          type="button"
          className={`${styles.appBtn} ${isBrowserActive ? styles.appBtnPressed : ""}`}
          aria-label={`${getTaskbarAppLabel(active)} — ${isBrowserMinimized ? "Restore" : "Show"} browser`}
          aria-pressed={isBrowserActive}
          title={isBrowserMinimized ? "Restore portfolio" : "Show portfolio"}
          onClick={focusBrowser}
        >
          <EarthIcon
            className={styles.appIconImg}
            width={20}
            height={20}
            fallback={<span className={styles.appIconFallback} aria-hidden />}
          />
          <span>{site.name}</span>
        </button>
      </div>

      <div className={styles.tray} aria-label="Notification area">
        <TrayInternetIcon />
        <time className={styles.clock} dateTime={time ?? undefined} suppressHydrationWarning>
          {time ?? "—:—"}
        </time>
      </div>
    </footer>
  );
}
