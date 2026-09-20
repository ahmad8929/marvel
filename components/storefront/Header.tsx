"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, ShoppingBag, User, X } from "lucide-react";
import { Container } from "@/components/ui";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { useAuth } from "@/lib/auth-client";
import { MENU_EXTRAS, NAV_GROUPS, NEW_IN_HREF } from "@/lib/nav";
import { ADMIN_URL, SITE } from "@/lib/site";
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
        <Container className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-4">
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
            <Logo tone="dark" />
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-4">
            <AccountMenu />
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
          <nav className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-bg shadow-2xl motion-safe:animate-[slideInLeft_.28s_ease-out]">
            <div className="flex items-center justify-between bg-primary px-5 py-5 text-bg">
              <Logo tone="light" />
              <button
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-bg/30 transition-colors hover:bg-bg/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 px-5 pb-4 pt-5">
              {/* main destinations */}
              <ul>
                {[
                  { label: "New In", href: NEW_IN_HREF, badge: "New" },
                  { label: "The Collection", href: "/collections/the-collection" },
                  ...NAV_GROUPS.map((g) => ({ label: g.title, href: `/collections/${g.slug}` })),
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={() => setNavOpen(false)}
                      className="group relative flex items-center justify-between overflow-hidden border-b border-line py-4"
                    >
                      <span className="absolute inset-y-0 left-0 w-0 bg-blush/70 transition-all duration-300 group-hover:w-full" />
                      <span className="relative flex items-center gap-3 font-display text-xl uppercase tracking-[0.1em] text-ink transition-transform duration-300 group-hover:translate-x-2 group-hover:text-primary">
                        {l.label}
                        {"badge" in l && l.badge && (
                          <span className="rounded-full bg-gold px-2 py-0.5 font-sans text-[0.6rem] font-medium tracking-[0.16em] text-bg">
                            {l.badge}
                          </span>
                        )}
                      </span>
                      <ChevronRight className="relative h-4 w-4 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* curated edits */}
              <p className="mt-7 font-script text-2xl text-gold">Curated edits</p>
              <ul className="mt-1">
                {MENU_EXTRAS.map((l, i) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setNavOpen(false)}
                      className="group flex items-center gap-4 py-2.5 text-sm uppercase tracking-[0.14em] text-ink/80 transition-colors hover:text-primary"
                    >
                      <span className="w-6 text-[0.68rem] text-gold">{String(i + 1).padStart(2, "0")}</span>
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* utility + social */}
            <div className="bg-blush/50 px-5 py-5">
              <div className="space-y-1 text-sm">
                <Link href={user ? "/account" : "/login"} onClick={() => setNavOpen(false)} className="block py-1 hover:text-primary">
                  {user ? "My account" : "Sign in / Register"}
                </Link>
                <Link href="/pages/returns-refunds" onClick={() => setNavOpen(false)} className="block py-1 hover:text-primary">
                  Returns &amp; exchanges
                </Link>
                <Link href="/contact" onClick={() => setNavOpen(false)} className="block py-1 hover:text-primary">
                  Contact us
                </Link>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="font-script text-xl text-primary">Style that defines you</span>
                <span className="flex gap-3 text-xs uppercase tracking-[0.14em]">
                  <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary">Insta</a>
                  <a href={SITE.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-primary">FB</a>
                </span>
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
                {["New In", "Sharara Set", "Palazzo Set", "Bell Sleeve", "Festive"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      if (t === "New In") router.push(NEW_IN_HREF);
                      else {
                        setQ(t);
                        router.push(`/search?q=${encodeURIComponent(t)}`);
                      }
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

function AccountMenu() {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (ready && !user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-ink hover:text-primary"
        aria-label="Sign in"
      >
        <User className="h-5 w-5" />
        <span className="hidden text-xs font-medium uppercase tracking-[0.14em] sm:inline">
          Sign In
        </span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-ink hover:text-primary"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <User className="h-5 w-5" />
        <span className="hidden max-w-[90px] truncate text-xs font-medium uppercase tracking-[0.12em] sm:inline">
          {user?.name?.split(" ")[0] ?? "Account"}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 border border-line bg-surface py-1 text-sm shadow-lg"
        >
          <p className="px-4 py-2 text-xs text-muted">{user?.email}</p>
          {[
            ["/account", "My account"],
            ["/account/orders", "My orders"],
            ["/account/addresses", "Addresses"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-blush"
            >
              {label}
            </Link>
          ))}
          {(user?.role === "ADMIN" || user?.role === "STAFF") && (
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="block border-t border-line px-4 py-2 font-medium text-primary hover:bg-blush"
            >
              Admin panel ↗
            </a>
          )}
          <button
            onClick={() => {
              setOpen(false);
              void logout();
            }}
            className="block w-full px-4 py-2 text-left text-primary hover:bg-blush"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
