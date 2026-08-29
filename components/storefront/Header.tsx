"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Container } from "@/components/ui";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/stores/cart";
import { useAuth } from "@/lib/auth-client";
import type { Category } from "@/lib/types";
import { CartDrawer } from "./CartDrawer";

export function Header({
  categories,
  announcement,
  announcementHref,
  freeShipThreshold,
}: {
  categories: Category[];
  announcement: string;
  announcementHref: string | null;
  freeShipThreshold: number;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <>
      {announcement && (
        <div className="bg-primary text-center text-xs text-bg">
          <Container className="py-2">
            {announcementHref ? (
              <Link href={announcementHref}>{announcement}</Link>
            ) : (
              announcement
            )}
          </Container>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur transition-shadow ${scrolled ? "shadow-sm" : ""}`}
      >
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-1">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <Link href="/" aria-label="Marvel's Online Clothings — home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="text-sm font-medium text-ink hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/collections/kurtis?sort=newest"
              className="text-sm font-medium text-primary"
            >
              New In
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="rounded-full p-2 hover:bg-blush"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "Account" : "Sign in"}
              className="rounded-full p-2 hover:bg-blush"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open bag"
              className="relative rounded-full p-2 hover:bg-blush"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] text-bg">
                  {count}
                </span>
              )}
            </button>
          </div>
        </Container>

        {searchOpen && (
          <div className="border-t border-line bg-bg">
            <Container className="py-3">
              <form onSubmit={submitSearch} className="flex gap-2">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search kurtis, dresses, co-ords…"
                  className="h-11 w-full rounded-lg border border-line bg-surface px-4 text-sm focus:border-primary focus:outline-none"
                />
                <button type="submit" className="rounded-lg bg-primary px-5 text-sm text-bg">
                  Search
                </button>
              </form>
            </Container>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-bg p-5">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="mb-6">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="h-11 w-full rounded-lg border border-line bg-surface px-4 text-sm"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-blush"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/collections/kurtis?sort=newest" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-primary hover:bg-blush">
                New In
              </Link>
              <hr className="my-2 border-line" />
              <Link href={user ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm hover:bg-blush">
                {user ? "My account" : "Sign in"}
              </Link>
              <Link href="/track-order" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm hover:bg-blush">
                Track order
              </Link>
            </nav>
          </div>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        freeShipThreshold={freeShipThreshold}
      />
    </>
  );
}
