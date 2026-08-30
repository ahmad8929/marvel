import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { HomeContent } from "@/lib/types";
import { Container } from "@/components/ui";
import { HeroCarousel } from "@/components/storefront/HeroCarousel";
import { Row } from "@/components/storefront/Carousels";
import { ProductCard } from "@/components/storefront/ProductCard";
import { NewsletterForm } from "@/components/storefront/NewsletterForm";
import {
  CategoryTiles,
  ReviewsPolaroid,
  ServicesStrip,
  StyleJournal,
  UspBar,
} from "@/components/storefront/HomeSections";

export const metadata: Metadata = {
  description:
    "Shop women's kurtis, dresses and co-ord sets at Marvel's Online Clothings. Elegant. Feminine. Effortless.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const home = await apiGet<HomeContent>("/content/home", { tags: ["home"] });

  return (
    <>
      <HeroCarousel slides={home.slides} />

      <UspBar />

      <CategoryTiles categories={home.categories} />

      {/* New arrivals */}
      <Container className="py-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-primary">
            New Arrivals
          </h2>
          <Link
            href="/collections/kurtis?sort=newest"
            className="mt-2 inline-block text-xs uppercase tracking-[0.16em] text-primary underline underline-offset-4"
          >
            View all
          </Link>
        </div>
        <Row>
          {home.newArrivals.map((p) => (
            <div key={p.id} className="w-[240px] shrink-0 snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </Row>
      </Container>

      {/* Editorial banner */}
      <section className="relative aspect-[16/9] w-full overflow-hidden bg-blush/40 sm:aspect-[3/1]">
        {home.slides[1]?.imageDesktop && (
          <Image
            src={home.slides[1].imageDesktop}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/25 text-center text-bg">
          <p className="font-script text-3xl">A new experience</p>
          <h2 className="mt-1 font-display text-2xl uppercase tracking-[0.16em] sm:text-3xl">
            Your favourite styles, a click away
          </h2>
          <Link
            href="/collections/co-ord-sets"
            className="mt-4 border-b-2 border-bg pb-1 text-xs font-medium uppercase tracking-[0.2em]"
          >
            Shop Co-ord Sets
          </Link>
        </div>
      </section>

      <ReviewsPolaroid testimonials={home.testimonials} />

      <StyleJournal />

      {/* Newsletter */}
      <section className="bg-primary py-16 text-bg">
        <Container className="flex flex-col items-center text-center">
          <h2 className="font-display text-2xl uppercase tracking-[0.2em]">Stay Tuned</h2>
          <p className="mt-2 max-w-md text-sm text-blush">
            Be first to know about new drops and offers. Something beautiful is on
            its way to you ♥
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </Container>
      </section>

      <ServicesStrip />
    </>
  );
}
