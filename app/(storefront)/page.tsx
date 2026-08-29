import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { HomeContent } from "@/lib/types";
import { Container, SectionHeading, ButtonLink } from "@/components/ui";
import { HeroCarousel } from "@/components/storefront/HeroCarousel";
import { Row, TestimonialRow } from "@/components/storefront/Carousels";
import { ValueStrip } from "@/components/storefront/ValueStrip";
import { NewsletterForm } from "@/components/storefront/NewsletterForm";
import { Price } from "@/components/ui";

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

      {/* Category tiles */}
      <Container className="py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {home.categories.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush/40"
            >
              {c.image && (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              <span className="absolute bottom-5 left-5 font-display text-2xl text-bg">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>

      {/* New arrivals */}
      <Container className="pb-14">
        <SectionHeading title="New Arrivals" href="/collections/kurtis?sort=newest" />
        <Row>
          {home.newArrivals.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="w-[220px] shrink-0 snap-start"
            >
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
      </Container>

      <ValueStrip />

      {/* Editorial banner */}
      <Container className="py-16">
        <div className="grid items-center gap-8 rounded-3xl bg-blush/50 p-8 sm:grid-cols-2 sm:p-12">
          <div>
            <p className="font-script text-2xl text-primary-hover">A new experience</p>
            <h2 className="mt-2 font-display text-3xl text-primary">
              Your favourite styles, now a click away
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted">
              Carefully curated kurtis, dresses and co-ord sets. Secure &amp; easy
              payments. Fast, reliable delivery across India.
            </p>
            <ButtonLink href="/collections/co-ord-sets" className="mt-6">
              Explore Co-ord Sets
            </ButtonLink>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            {home.slides[1]?.imageDesktop && (
              <Image
                src={home.slides[1].imageDesktop}
                alt=""
                fill
                sizes="(max-width:640px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </Container>

      {/* Testimonials */}
      <Container className="pb-16">
        <SectionHeading title="Loved by our customers" />
        <TestimonialRow testimonials={home.testimonials} />
      </Container>

      {/* Newsletter */}
      <section className="bg-primary py-16 text-bg">
        <Container className="flex flex-col items-center text-center">
          <h2 className="font-display text-3xl">Stay tuned</h2>
          <p className="mt-2 max-w-md text-sm text-blush">
            Be first to know about new drops and offers. Something beautiful is on
            its way to you ♥
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </>
  );
}
