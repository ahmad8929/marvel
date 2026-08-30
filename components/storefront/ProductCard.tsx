import Link from "next/link";
import Image from "next/image";
import { inr } from "@/lib/format";
import type { ProductCard as Card } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Card }) {
  const [primary, hover] = product.images;
  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-blush/30">
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
            <span className="absolute left-0 top-3 bg-primary px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-bg">
              {product.discountPercent}% off
            </span>
          )}
          {!product.inStock && (
            <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-1.5 text-center text-[0.65rem] font-medium uppercase tracking-[0.16em] text-bg">
              Sold out
            </span>
          )}
        </div>
      </Link>
      <div className="absolute right-2 top-2">
        <WishlistButton productId={product.id} />
      </div>
      <div className="mt-3 text-center">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-sm text-ink hover:text-primary"
        >
          {product.title}
        </Link>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm">
          <span className="font-medium text-ink">{inr(product.price)}</span>
          {product.discountPercent > 0 && (
            <span className="text-xs text-muted line-through">{inr(product.mrp)}</span>
          )}
        </div>
        {product.colours.length > 1 && (
          <div className="mt-1.5 flex items-center justify-center gap-1">
            {product.colours.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-line"
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
      <p className="py-16 text-center text-muted">
        No products found. Try adjusting your filters.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
