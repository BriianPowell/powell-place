"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, type MouseEvent, type PointerEvent } from "react";
import { site, tabs } from "@/data/site";
import { activeTabFromPath, getBrowserTitle } from "@/lib/routing";
import { EarthIcon } from "@/components/EarthIcon";
import {
  IconDocument,
  IconResizeGrip,
  IconWinMaximize,
  IconWinMinimize,
} from "./BrowserIcons";
import { useDesktop } from "@/components/desktop/DesktopContext";
import { getAddressForPath } from "@/lib/address";
import { toggleBrowserFullscreen } from "@/lib/fullscreen";
import { icons } from "@/lib/icons";
import { BrowserToolbar } from "./BrowserToolbar";
import { StatusPageWebIcon } from "./StatusPageWebIcon";
import { StatusZoneNetworkIcon } from "./StatusZoneNetworkIcon";
import styles from "./browser.module.css";
import { useDraggableResizable } from "./useDraggableResizable";

type BrowserShellProps = {
  children: ReactNode;
};

export function BrowserShell({ children }: BrowserShellProps) {
  const pathname = usePathname();
  const active = activeTabFromPath(pathname);
  const { desktopRef, rect, startDrag, startResize } = useDraggableResizable();
  const { isBrowserMinimized, minimizeBrowser } = useDesktop();

  const stopTitleBarClick = (event: MouseEvent | PointerEvent) => {
    event.stopPropagation();
  };

  return (
    <div ref={desktopRef} className={styles.desktop}>
      <div
        id="portfolio-browser-window"
        className={`${styles.window} ${isBrowserMinimized ? styles.windowMinimized : ""}`}
        role="application"
        aria-hidden={isBrowserMinimized}
        aria-label={`${site.name} — Portfolio`}
        style={{
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
        }}
      >
          <div
            className={styles.titleBar}
            onPointerDown={startDrag}
            role="presentation"
          >
            <EarthIcon
              className={styles.titleIcon}
              width={16}
              height={16}
              src={icons.html}
              fallback={<IconDocument className={styles.titleIcon} />}
            />
            <span className={styles.titleText}>{getBrowserTitle(active)}</span>
            <div className={styles.windowControls}>
              <button
                type="button"
                className={`${styles.winBtn} ${styles.winBtnMinimize}`}
                aria-label="Minimize to taskbar"
                title="Minimize"
                onPointerDown={stopTitleBarClick}
                onClick={(event) => {
                  event.stopPropagation();
                  minimizeBrowser();
                }}
              >
                <IconWinMinimize className={styles.winBtnIcon} />
              </button>
              <button
                type="button"
                className={`${styles.winBtn} ${styles.winBtnMaximize}`}
                aria-label="Maximize browser window"
                title="Maximize"
                onPointerDown={stopTitleBarClick}
                onClick={(event) => {
                  event.stopPropagation();
                  void toggleBrowserFullscreen();
                }}
              >
                <IconWinMaximize className={styles.winBtnIcon} />
              </button>
            </div>
          </div>

          <BrowserToolbar address={getAddressForPath(pathname)} />

          <nav className={`${styles.tabBar} win95Scrollbar`} aria-label="Open pages">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.path}
                className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}
                aria-current={active === tab.id ? "page" : undefined}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className={styles.contentShell}>
            <div className={styles.contentFrame}>
              <div className={`${styles.viewport} win95Scrollbar`}>{children}</div>
            </div>
          </div>

          <div className={styles.statusBar}>
            <div className={styles.statusPane} data-variant="main" title="Page status">
              <StatusPageWebIcon />
              <span>Done</span>
            </div>
            <div className={styles.statusPane} data-variant="spacer" aria-hidden />
            <div className={styles.statusPane} data-variant="small" aria-hidden />
            <div className={styles.statusPane} data-variant="zone" title="Security zone">
              <StatusZoneNetworkIcon />
              <span>Internet</span>
            </div>
            <button
              type="button"
              className={styles.statusGrip}
              aria-label="Resize window"
              onPointerDown={startResize}
            >
              <IconResizeGrip className={styles.statusGripIcon} />
            </button>
          </div>
      </div>
    </div>
  );
}
