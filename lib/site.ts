import type { PublicSettings } from "./types";

/**
 * Public-facing brand details, pinned in the frontend.
 *
 * These override whatever the API/admin currently returns so they can be
 * changed without a backend deploy. To hand control back to the admin panel
 * later, drop the matching lines from `withSiteOverrides` below.
 */
/** Where the admin panel lives (override with NEXT_PUBLIC_ADMIN_URL). */
export const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://marvel-admin-two.vercel.app";

export const SITE = {
  email: "marvelsindia1@gmail.com",
  phone: "+91 97940 10180",
  instagramUrl: "https://instagram.com/marvelsonline",
  facebookUrl: "https://www.facebook.com/share/1Huhhvng4i/",
  /** Pre-launch notice shown in the top announcement bar, site-wide. */
  announcement:
    "Orders open December 2026 — browse the collection now, checkout opens soon",
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

/**
 * Photos used on the home page, picked from our own product shots.
 * `image` is the index into that product's gallery (upload order).
 */
export const HERO_PICKS = [
  { slug: "royal-blue-embellished-sharara-set", image: 0 },
  { slug: "scarlet-gold-motif-kurta-sharara-set", image: 1 },
  { slug: "lavender-silver-trim-bell-sleeve-set", image: 1 },
  { slug: "butter-yellow-gold-border-palazzo-set", image: 2 },
] as const;

export const FEATURE_PICK = { slug: "maroon-gold-zari-embroidered-sharara-set", image: 2 } as const;
