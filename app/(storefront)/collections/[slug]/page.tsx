import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGet, ApiError } from "@/lib/api";
import type { Category, Paginated, ProductCard } from "@/lib/types";
import { Container } from "@/components/ui";
import { ProductGrid } from "@/components/storefront/ProductCard";
import { Filters, Pagination } from "@/components/storefront/Filters";

export const revalidate = 3600;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Virtual collection that lists every product (no category filter). */
const ALL_SLUG = "the-collection";
const ALL_CATEGORY = {
  id: ALL_SLUG,
  name: "The Collection",
  slug: ALL_SLUG,
  description: "Every piece from Marvel's, all in one place.",
} as unknown as Category;

async function getData(slug: string, sp: Record<string, string | string[] | undefined>) {
  const category =
    slug === ALL_SLUG
      ? ALL_CATEGORY
      : await apiGet<Category>(`/categories/${slug}`, { tags: ["nav", `category:${slug}`] });
  const qs = new URLSearchParams();
  if (slug !== ALL_SLUG) qs.set("category", slug);
  for (const key of ["sort", "size", "color", "tag", "minPrice", "maxPrice", "inStock", "page"]) {
    const v = sp[key];
    if (typeof v === "string" && v) qs.set(key, v);
  }
  qs.set("pageSize", "24");
  const products = await apiGet<Paginated<ProductCard>>(`/products?${qs.toString()}`, {
    tags: ["plp", `category:${slug}`],
  });
  return { category, products };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category =
      slug === ALL_SLUG ? ALL_CATEGORY : await apiGet<Category>(`/categories/${slug}`, { tags: ["nav"] });
    return {
      title: `${category.name} for Women`,
      description:
        category.description ?? `Shop ${category.name} at Marvel's Online Clothings.`,
      alternates: { canonical: `/collections/${slug}` },
    };
  } catch {
    return { title: "Collection" };
  }
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  let data;
  try {
    data = await getData(slug, sp);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const { category, products } = data;
  const colourMap = new Map<string, string | null>();
  for (const p of products.data) for (const c of p.colours) if (!colourMap.has(c.name)) colourMap.set(c.name, c.hex);
  const colours = [...colourMap].map(([name, hex]) => ({ name, hex })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container className="py-8">
      <nav className="mb-4 text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / <span className="text-ink">{category.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="font-display text-3xl text-primary">{category.name}</h1>
        {category.description && (
          <p className="mt-1 max-w-2xl text-sm text-muted">{category.description}</p>
        )}
      </header>

      <div className="mb-6 flex items-center justify-between gap-4">
        <Filters colours={colours} />
        <span className="hidden shrink-0 text-sm text-muted sm:block">
          {products.pagination.total} items
        </span>
      </div>

      <ProductGrid products={products.data} />
      <Pagination
        page={products.pagination.page}
        totalPages={products.pagination.totalPages}
      />
    </Container>
  );
}
