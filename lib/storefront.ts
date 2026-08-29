import { apiGet } from "./api";
import type { Category, PublicSettings } from "./types";

/** Shared chrome data (header + footer). Cached with the "nav"/"settings" tags. */
export async function getChrome(): Promise<{
  categories: Category[];
  settings: PublicSettings;
}> {
  const [cats, settings] = await Promise.all([
    apiGet<{ data: Category[] }>("/categories", { tags: ["nav"] }),
    apiGet<PublicSettings>("/settings/public", { tags: ["settings"], revalidate: 300 }),
  ]);
  return { categories: cats.data, settings };
}
