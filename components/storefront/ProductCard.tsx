import Link from "next/link";
import Image from "next/image";
import { Price } from "@/components/ui";
import type { ProductCard as Card } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Card }) {
  const [primary, hover] = product.images;
  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-blush/40">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.alt ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
          )}
          {hover && (
            <Image
              src={hover.url}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          {product.discountPercent > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-bg">
              {product.discountPercent}% off
            </span>
          )}
          {!product.inStock && (
            <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-1.5 text-center text-xs font-medium uppercase tracking-wide text-bg">
              Sold out
            </span>
          )}
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <WishlistButton productId={product.id} />
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted">{product.category.name}</p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-sm font-medium text-ink hover:text-primary"
        >
          {product.title}
        </Link>
        <Price price={product.price} mrp={product.mrp} size="sm" />
        {product.colours.length > 1 && (
          <div className="flex items-center gap-1 pt-1">
            {product.colours.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-line"
                style={{ background: c.hex ?? "#ccc" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Card[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted">No products found. Try adjusting your filters.</p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
