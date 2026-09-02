"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { SITE } from "@/lib/site";

const KEY = "marvels_prelaunch_v1";

/** Small, dismissible "opening in December" card. Shows once per browser. */
export function PreLaunchPopup() {
  const [show, setShow] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;

    const openT = setTimeout(() => {
      setShow(true);
      requestAnimationFrame(() => setEntered(true));
    }, 900);
    return () => clearTimeout(openT);
  }, []);

  const close = useCallback(() => {
    setEntered(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* private mode — fine, it just shows again next load */
    }
    setTimeout(() => setShow(false), 200);
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, close]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label={SITE.popupTitle}
      className={`fixed bottom-4 left-1/2 z-[70] w-[min(92vw,22rem)] -translate-x-1/2 transition-all duration-200 sm:left-auto sm:right-5 sm:translate-x-0 ${
        entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="relative rounded-sm border border-line bg-bg p-5 shadow-lg">
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className="absolute right-3 top-3 text-muted transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="font-display text-lg text-primary">{SITE.popupTitle}</p>
        <p className="mt-1.5 text-sm text-muted">{SITE.popupBody}</p>
        <Link
          href="/collections/kurtis"
          onClick={close}
          className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.14em] text-primary underline-offset-4 hover:underline"
        >
          Browse the collection
        </Link>
      </div>
    </div>
  );
}
