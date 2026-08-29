import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { Paginated, ProductCard } from "@/lib/types";
import { Container } from "@/components/ui";
import { ProductGrid } from "@/components/storefront/ProductCard";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const results = query
    ? await apiGet<Paginated<ProductCard>>(
        `/search?q=${encodeURIComponent(query)}`,
        { cache: "no-store", revalidate: false },
      ).catch(() => null)
    : null;

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl text-primary">
        {query ? `Results for “${query}”` : "Search"}
      </h1>
      {results && (
        <p className="mt-1 text-sm text-muted">{results.pagination.total} items</p>
      )}
      <div className="mt-8">
        {!query ? (
          <p className="text-muted">Type a search term in the header to find products.</p>
        ) : results && results.data.length > 0 ? (
          <ProductGrid products={results.data} />
        ) : (
          <p className="text-muted">
            No matches. Try another term or browse our collections.
          </p>
        )}
      </div>
    </Container>
  );
}
