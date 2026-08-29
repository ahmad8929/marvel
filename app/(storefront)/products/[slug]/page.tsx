import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGet, ApiError } from "@/lib/api";
import type { ProductCard, ProductDetail } from "@/lib/types";
import { Container, Price, Rating } from "@/components/ui";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { BuyBox } from "@/components/storefront/BuyBox";
import { Accordion } from "@/components/storefront/Accordion";
import { Reviews } from "@/components/storefront/Reviews";
import { Row } from "@/components/storefront/Carousels";
import Image from "next/image";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await apiGet<ProductDetail>(`/products/${slug}`, {
      tags: [`product:${slug}`],
    });
    return {
      title: p.seoTitle ?? p.title,
      description: p.seoDescription ?? p.description.slice(0, 155),
      alternates: { canonical: `/products/${slug}` },
      openGraph: {
        title: p.title,
        images: p.images[0]?.url ? [p.images[0].url] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: ProductDetail;
  try {
    product = await apiGet<ProductDetail>(`/products/${slug}`, {
      tags: [`product:${slug}`, "plp"],
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const related = await apiGet<{ data: ProductCard[] }>(
    `/products/${slug}/related`,
    { tags: [`product:${slug}`] },
  ).catch(() => ({ data: [] as ProductCard[] }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "Marvel's Online Clothings" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.price / 100).toFixed(2),
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingAvg,
            reviewCount: product.ratingCount,
          },
        }
      : {}),
  };

  return (
    <Container className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-4 text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link href={`/collections/${product.category.slug}`} className="hover:text-primary">
          {product.category.name}
        </Link>{" "}
        / <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {product.category.name}
          </p>
          <h1 className="mt-1 font-display text-3xl text-primary">{product.title}</h1>
          {product.ratingCount > 0 && (
            <Link href="#reviews" className="mt-2 inline-block">
              <Rating value={product.ratingAvg} count={product.ratingCount} />
            </Link>
          )}
          <Price price={product.price} mrp={product.mrp} size="lg" className="mt-4" />
          <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>

          <div className="mt-6">
            <BuyBox product={product} />
          </div>

          <div className="mt-8">
            <Accordion
              items={[
                { title: "Description", content: <p>{product.description}</p> },
                {
                  title: "Fabric & Care",
                  content: (
                    <ul className="list-disc space-y-1 pl-4">
                      {product.fabric && <li>Fabric: {product.fabric}</li>}
                      {product.care && <li>Care: {product.care}</li>}
                    </ul>
                  ),
                },
                {
                  title: "Size Chart",
                  content: (
                    <p>
                      Sizes {product.sizes.join(", ")}. Refer to the{" "}
                      <Link href="/size-guide" className="text-primary underline">
                        size guide
                      </Link>{" "}
                      for measurements.
                    </p>
                  ),
                },
                {
                  title: "Shipping & Returns",
                  content: (
                    <p>
                      Dispatched in 2 business days. 7-day easy returns on unworn
                      items with tags. See{" "}
                      <Link href="/pages/returns-refunds" className="text-primary underline">
                        our policy
                      </Link>
                      .
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <Reviews slug={product.slug} />

      {related.data.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl text-primary">You may also like</h2>
          <Row>
            {related.data.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="w-[220px] shrink-0 snap-start">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-blush/40">
                  {p.images[0] && (
                    <Image
                      src={p.images[0].url}
                      alt={p.images[0].alt ?? p.title}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-medium">{p.title}</p>
                <Price price={p.price} mrp={p.mrp} size="sm" />
              </Link>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
}
