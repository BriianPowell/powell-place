"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { CONTACT_MAP_TITLE, getContactMapUrl } from "@/lib/contactMap";

const IFRAME_ID = "portfolio-contact-map-iframe";

type ContactMapContextValue = {
  registerSlot: (element: HTMLDivElement | null) => void;
};

const ContactMapContext = createContext<ContactMapContextValue | null>(null);

function getOrCreateIframe(): HTMLIFrameElement {
  let iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = IFRAME_ID;
    iframe.title = CONTACT_MAP_TITLE;
    iframe.src = getContactMapUrl();
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
  }
  return iframe;
}

export function ContactMapProvider({ children }: { children: ReactNode }) {
  const parkingRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);

  const moveIframe = useCallback((target: HTMLDivElement | null) => {
    const iframe = getOrCreateIframe();
    if (target && iframe.parentElement !== target) {
      target.appendChild(iframe);
    }
  }, []);

  const registerSlot = useCallback(
    (element: HTMLDivElement | null) => {
      slotRef.current = element;
      if (element) {
        moveIframe(element);
      } else if (parkingRef.current) {
        moveIframe(parkingRef.current);
      }
    },
    [moveIframe],
  );

  useLayoutEffect(() => {
    if (!slotRef.current && parkingRef.current) {
      moveIframe(parkingRef.current);
    }
  });

  return (
    <ContactMapContext.Provider value={{ registerSlot }}>
      <div ref={parkingRef} hidden aria-hidden />
      {children}
    </ContactMapContext.Provider>
  );
}

export function useContactMap() {
  const context = useContext(ContactMapContext);
  if (!context) {
    throw new Error("useContactMap must be used within ContactMapProvider");
  }
  return context;
}
