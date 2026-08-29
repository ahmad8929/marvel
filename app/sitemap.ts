import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";
import type { Category, Paginated, ProductCard } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.marvelsonline.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/collections/kurtis",
    "/collections/dresses",
    "/collections/co-ord-sets",
    "/pages/shipping-policy",
    "/pages/returns-refunds",
    "/pages/privacy-policy",
    "/pages/terms",
    "/pages/about",
    "/pages/faq",
    "/size-guide",
    "/track-order",
    "/contact",
  ].map((path) => ({ url: `${SITE}${path}`, lastModified: new Date() }));

  try {
    const [cats, products] = await Promise.all([
      apiGet<{ data: Category[] }>("/categories", { revalidate: 3600 }),
      apiGet<Paginated<ProductCard>>("/products?pageSize=60", { revalidate: 3600 }),
    ]);
    const catRoutes = cats.data.map((c) => ({
      url: `${SITE}/collections/${c.slug}`,
      lastModified: new Date(),
    }));
    const productRoutes = products.data.map((p) => ({
      url: `${SITE}/products/${p.slug}`,
      lastModified: new Date(),
    }));
    return [...staticRoutes, ...catRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
