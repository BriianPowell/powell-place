"use client";

import { ReactNode } from "react";
import { ContactMapProvider } from "@/components/content/ContactMapContext";
import { DesktopProvider } from "./DesktopContext";
import { ProfilePanel } from "./ProfilePanel";

export function DesktopShell({ children }: { children: ReactNode }) {
  return (
    <DesktopProvider>
      <ContactMapProvider>
        {children}
        <ProfilePanel />
      </ContactMapProvider>
    </DesktopProvider>
  );
}
