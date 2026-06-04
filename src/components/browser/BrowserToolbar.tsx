"use client";

import { useRouter } from "next/navigation";
import { homeTabPath } from "@/lib/routing";
import { IconBack, IconForward, IconHome } from "./BrowserIcons";
import styles from "./browser.module.css";

type BrowserToolbarProps = {
  address: string;
};

export function BrowserToolbar({ address }: BrowserToolbarProps) {
  const router = useRouter();

  return (
    <div className={styles.toolbar}>
      <div className={styles.navGroup} role="group" aria-label="Navigation">
        <button
          type="button"
          className={styles.toolBtn}
          title="Back"
          aria-label="Back"
          onClick={() => router.back()}
        >
          <IconBack className={styles.toolIcon} />
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          title="Forward"
          aria-label="Forward"
          onClick={() => router.forward()}
        >
          <IconForward className={styles.toolIcon} />
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          title="Home"
          aria-label="Home"
          onClick={() => router.push(homeTabPath)}
        >
          <IconHome className={styles.toolIcon} />
        </button>
      </div>

      <label className={styles.addressWrap}>
        <span className="sr-only">Address</span>
        <input
          className={styles.addressBar}
          type="text"
          readOnly
          value={address}
          aria-readonly
        />
      </label>
    </div>
  );
}
