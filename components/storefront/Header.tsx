"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Heart, Search, ShoppingBag, User, X } from "lucide-react";
import { Container } from "@/components/ui";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { useAuth } from "@/lib/auth-client";
import { NAV_GROUPS } from "@/lib/nav";
import type { Category } from "@/lib/types";
import { CartDrawer } from "./CartDrawer";

export function Header({
  announcement,
  announcementHref,
  freeShipThreshold,
}: {
  categories?: Category[];
  announcement: string;
  announcementHref: string | null;
  freeShipThreshold: number;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const { cartOpen, openCart, closeCart, navOpen, setNavOpen } = useUI();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const open = navOpen || searchOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen, searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    setNavOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <>
      {announcement && (
        <div className="bg-primary text-center text-[0.7rem] uppercase tracking-[0.18em] text-bg">
          <Container className="py-2">
            {announcementHref ? (
              <Link href={announcementHref}>{announcement}</Link>
            ) : (
              announcement
            )}
          </Container>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* left */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setNavOpen(true)}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink hover:text-primary"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
              <span className="hidden sm:inline">Menu</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink hover:text-primary"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* center */}
          <Link href="/" aria-label="Marvel's Online Clothings — home" className="justify-self-center">
            <Logo />
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/contact"
              className="hidden text-xs font-medium uppercase tracking-[0.16em] text-ink hover:text-primary md:inline"
            >
              Contact Us
            </Link>
            <Link href={user ? "/account" : "/login"} aria-label={user ? "Account" : "Sign in"}>
              <User className="h-5 w-5 text-ink hover:text-primary" />
            </Link>
            <Link href="/account/wishlist" aria-label="Wishlist">
              <Heart className="h-5 w-5 text-ink hover:text-primary" />
            </Link>
            <button onClick={openCart} aria-label="Open bag" className="relative">
              <ShoppingBag className="h-5 w-5 text-ink hover:text-primary" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] text-bg">
                  {count}
                </span>
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* MENU drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setNavOpen(false)} />
          <nav className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-bg">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Menu</span>
              <button onClick={() => setNavOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 px-5 py-4">
              <Link
                href="/collections/kurtis?sort=newest"
                onClick={() => setNavOpen(false)}
                className="mb-4 block text-sm font-medium uppercase tracking-[0.14em] text-primary"
              >
                New In
              </Link>
              {NAV_GROUPS.map((g) => (
                <details key={g.slug} className="border-t border-line py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium uppercase tracking-[0.12em]">
                    {g.title}
                    <ChevronRight className="h-4 w-4 transition-transform [details[open]>summary_&]:rotate-90" />
                  </summary>
                  <ul className="pb-3 pl-1">
                    <li>
                      <Link
                        href={`/collections/${g.slug}`}
                        onClick={() => setNavOpen(false)}
                        className="block py-1.5 text-sm text-primary"
                      >
                        Shop all {g.title}
                      </Link>
                    </li>
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setNavOpen(false)}
                          className="block py-1.5 text-sm text-muted hover:text-ink"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <Link href={user ? "/account" : "/login"} onClick={() => setNavOpen(false)} className="block py-1">
                  {user ? "My account" : "Sign in / Register"}
                </Link>
                <Link href="/track-order" onClick={() => setNavOpen(false)} className="block py-1">
                  Track order
                </Link>
                <Link href="/pages/returns-refunds" onClick={() => setNavOpen(false)} className="block py-1">
                  Returns &amp; exchanges
                </Link>
                <Link href="/contact" onClick={() => setNavOpen(false)} className="block py-1">
                  Contact us
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* SEARCH overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSearchOpen(false)} />
          <div className="absolute inset-x-0 top-0 bg-bg p-6">
            <Container>
              <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-primary pb-3">
                <Search className="h-5 w-5 text-muted" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search for kurtis, dresses, co-ord sets…"
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted"
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {["New In", "Cotton Kurtis", "Co-ord Sets", "Maxi Dresses", "Festive"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setQ(t);
                      router.push(`/search?q=${encodeURIComponent(t)}`);
                      setSearchOpen(false);
                    }}
                    className="rounded-full border border-line px-3 py-1 hover:border-primary hover:text-primary"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Container>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={closeCart} freeShipThreshold={freeShipThreshold} />
    </>
  );
}
