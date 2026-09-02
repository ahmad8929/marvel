import type { PublicSettings } from "./types";

/**
 * Public-facing brand details, pinned in the frontend.
 *
 * These override whatever the API/admin currently returns so they can be
 * changed without a backend deploy. To hand control back to the admin panel
 * later, drop the matching lines from `withSiteOverrides` below.
 */
export const SITE = {
  email: "marvelsindia1@gmail.com",
  phone: "+91 97940 10180",
  instagramUrl: "https://instagram.com/marvelsonline",
  facebookUrl: "https://www.facebook.com/share/1Huhhvng4i/",
  /** Pre-launch notice shown in the top announcement bar, site-wide. */
  announcement:
    "Orders open December 2026 — browse the collection now, checkout opens soon",
  /** Dismissible pop-up shown once per visitor. */
  popupTitle: "Opening this December",
  popupBody:
    "Explore the full collection now — we start accepting orders in December 2026.",
} as const;

/** Layer the pinned brand details over the settings returned by the API. */
export function withSiteOverrides(s: PublicSettings): PublicSettings {
  return {
    ...s,
    supportEmail: SITE.email,
    supportPhone: SITE.phone,
    whatsappNumber: null,
    instagramUrl: SITE.instagramUrl,
    facebookUrl: SITE.facebookUrl,
    announcementText: SITE.announcement,
    announcementHref: null,
  };
}
