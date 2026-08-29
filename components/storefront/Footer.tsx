import Link from "next/link";
import { Container } from "@/components/ui";
import { Logo } from "@/components/brand/Logo";
import { NewsletterForm } from "./NewsletterForm";
import type { Category, PublicSettings } from "@/lib/types";

export function Footer({
  categories,
  settings,
}: {
  categories: Category[];
  settings: PublicSettings;
}) {
  return (
    <footer className="mt-20 bg-primary text-blush">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <Logo tone="light" />
          <p className="max-w-xs text-sm text-blush/80">
            Elegant, feminine, effortless women&apos;s wear — designed in India,
            delivered to your door.
          </p>
          <p className="font-script text-xl text-bg">Style that defines you</p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-bg">Shop</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/collections/${c.slug}`} className="hover:text-bg">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/collections/kurtis?sort=newest" className="hover:text-bg">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-bg">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/pages/shipping-policy" className="hover:text-bg">Shipping</Link></li>
            <li><Link href="/pages/returns-refunds" className="hover:text-bg">Returns &amp; Refunds</Link></li>
            <li><Link href="/track-order" className="hover:text-bg">Track Order</Link></li>
            <li><Link href="/size-guide" className="hover:text-bg">Size Guide</Link></li>
            <li><Link href="/faq" className="hover:text-bg">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-bg">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bg">
            Get launch updates
          </h3>
          <NewsletterForm compact />
          <div className="flex gap-3 pt-1 text-sm">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} className="hover:text-bg" rel="noreferrer" target="_blank">
                Instagram
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} className="hover:text-bg" rel="noreferrer" target="_blank">
                Facebook
              </a>
            )}
          </div>
        </div>
      </Container>

      <div className="border-t border-blush/20">
        <Container className="flex flex-col gap-2 py-5 text-xs text-blush/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Marvel&apos;s Online Clothings. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/pages/privacy-policy" className="hover:text-bg">Privacy</Link>
            <Link href="/pages/terms" className="hover:text-bg">Terms</Link>
            {settings.gstin && <span>GSTIN: {settings.gstin}</span>}
          </div>
        </Container>
      </div>
    </footer>
  );
}
