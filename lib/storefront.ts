import { apiGet } from "./api";
import type { Category, PublicSettings } from "./types";

const FALLBACK_SETTINGS: PublicSettings = {
  announcementText: "",
  announcementHref: null,
  freeShipThreshold: 99900,
  flatShipFee: 4900,
  codEnabled: true,
  codFee: 3000,
  platformFee: 0,
  platformFeeLabel: "Platform fee",
  handlingFee: 0,
  handlingFeeLabel: "Handling charges",
  taxNote: "Prices are inclusive of all taxes",
  supportEmail: "support@marvelsazamgarh.in",
  supportPhone: "",
  instagramUrl: null,
  facebookUrl: null,
  whatsappNumber: null,
  gstin: null,
  businessAddress: "",
  comingSoon: false,
};

/**
 * Shared chrome data (header + footer). Resilient: if the API is unreachable
 * (e.g. during a first deploy before the backend is up) the site still builds
 * and renders — ISR refills it once the API responds.
 */
export async function getChrome(): Promise<{
  categories: Category[];
  settings: PublicSettings;
}> {
  const [cats, settings] = await Promise.all([
    apiGet<{ data: Category[] }>("/categories", { tags: ["nav"] }).catch(() => ({
      data: [] as Category[],
    })),
    apiGet<PublicSettings>("/settings/public", {
      tags: ["settings"],
      revalidate: 300,
    }).catch(() => FALLBACK_SETTINGS),
  ]);
  return { categories: cats.data, settings };
}
