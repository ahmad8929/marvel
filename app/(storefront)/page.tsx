import Link from "next/link";
import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import type { HomeContent, ProductDetail } from "@/lib/types";
import { FEATURE_PICK, HERO_PICKS, SITE } from "@/lib/site";
import { Container } from "@/components/ui";
import { HeroCarousel, type ProductSlide } from "@/components/storefront/HeroCarousel";
import { Row } from "@/components/storefront/Carousels";
import { OccasionSection } from "@/components/storefront/OccasionSection";
import { SocialSection } from "@/components/storefront/SocialSection";
import { ParallaxBg } from "@/components/storefront/ParallaxBg";
import { Reveal } from "@/components/storefront/Reveal";
import { FloatCard } from "@/components/storefront/FloatCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  ReviewsPolaroid,
  UspBar,
} from "@/components/storefront/HomeSections";

export const metadata: Metadata = {
  description:
    "Shop embroidered kurta sets, sharara and palazzo sets at Marvel's Online Clothings. Elegant. Feminine. Effortless.",
};

// Short revalidate so the page fills in once the API is reachable.
export const revalidate = 120;

const EMPTY_HOME: HomeContent = {
  slides: [],
  testimonials: [],
  categories: [],
  newArrivals: [],
  announcementText: "",
  announcementHref: null,
};

type Look = { href: string; src: string; title: string; price: number; mrp: number };

async function pick(slug: string, image: number): Promise<(Look & { images: string[] }) | null> {
  try {
    const p = await apiGet<ProductDetail>(`/products/${slug}`, { tags: ["home", `product:${slug}`] });
    const urls = p.images.map((im) => im.url);
    const first = urls[image] ?? urls[0];
    if (!first) return null;
    const images = [first, ...urls.filter((u) => u !== first)];
    return { href: `/products/${p.slug}`, src: first, title: p.title, price: p.price, mrp: p.mrp, images };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [home, heroLooks, feature, catalogue] = await Promise.all([
    apiGet<HomeContent>("/content/home", { tags: ["home"] }).catch(() => EMPTY_HOME),
    Promise.all(HERO_PICKS.map((h) => pick(h.slug, h.image))),
    pick(FEATURE_PICK.slug, FEATURE_PICK.image),
    apiGet<{ data: HomeContent["newArrivals"] }>("/products?pageSize=60", { tags: ["plp"] }).catch(() => ({ data: [] })),
  ]);

  const slides: ProductSlide[] = heroLooks.filter((l): l is NonNullable<typeof l> => !!l);
  // Fall back to the newest products if the picked ones aren't available.
  if (slides.length === 0) {
    for (const p of home.newArrivals.slice(0, 4)) {
      if (!p.images[0]) continue;
      slides.push({ href: `/products/${p.slug}`, title: p.title, price: p.price, mrp: p.mrp, images: p.images.map((i) => i.url) });
    }
  }

  // Social strip: products not already featured in the carousel or New Arrivals.
  const used = new Set([...slides.map((sl) => sl.href), ...home.newArrivals.map((p) => `/products/${p.slug}`)]);
  const socialPhotos = catalogue.data
    .filter((p) => !used.has(`/products/${p.slug}`) && p.images.length > 0)
    .map((p) => (p.images[1] ?? p.images[0]).url)
    .slice(0, 12);

  return (
    <>
      <HeroCarousel slides={slides} />

      <UspBar />

      {/* New arrivals */}
      {home.newArrivals.length > 0 && (
        <Container className="py-16">
          <Reveal className="mb-8 text-center">
            <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-primary">
              New Arrivals
            </h2>
            <span aria-hidden className="mx-auto mt-2 block h-px w-16 origin-left bg-gold motion-safe:animate-[drawLine_1.2s_.3s_ease-out_both]" />
            <Link
              href="/collections/the-collection?tag=new-in&sort=newest"
              className="mt-2 inline-block text-xs uppercase tracking-[0.16em] text-primary underline underline-offset-4"
            >
              View all
            </Link>
          </Reveal>
          <Row>
            {home.newArrivals.map((p, i) => (
              <div key={p.id} className="w-[240px] shrink-0 snap-start">
                <FloatCard index={i}>
                  <ProductCard product={p} />
                </FloatCard>
              </div>
            ))}
          </Row>
        </Container>
      )}

      <OccasionSection />

      {/* Editorial banner — background is one of our own product photos */}
      <section className="relative aspect-[4/5] w-full overflow-hidden bg-blush/40 sm:aspect-[16/7]">
        {feature && <ParallaxBg src={feature.src} className="object-[50%_22%]" />}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/45 px-4 text-center text-bg">
          <Reveal>
            <p className="font-script text-3xl">A new experience</p>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="mt-1 font-display text-2xl uppercase tracking-[0.16em] sm:text-3xl">
              Your favourite styles, a click away
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <Link
              href="/collections/co-ord-sets"
              className="mt-4 inline-block border-b-2 border-bg pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:tracking-[0.3em]"
            >
              Shop Co-ord Sets
            </Link>
          </Reveal>
        </div>
      </section>

      <ReviewsPolaroid
        testimonials={home.testimonials}
        photos={[...slides.map((sl) => sl.images[0]), ...slides.map((sl) => sl.images[1] ?? sl.images[0])]}
      />

      <SocialSection
        photos={socialPhotos}
        socials={[
          {
            name: "Instagram",
            handle: "@" + SITE.instagramUrl.split("/").filter(Boolean).pop(),
            href: SITE.instagramUrl,
            hover: "hover:bg-[linear-gradient(135deg,#f58529,#dd2a7b_55%,#8134af)]",
            icon: (
              <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
              </>
            ),
          },
          {
            name: "Facebook",
            handle: "Marvel's Online Clothings",
            href: SITE.facebookUrl,
            hover: "hover:bg-[#1877F2]",
            icon: <path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />,
          },
        ]}
      />

    </>
  );
}
