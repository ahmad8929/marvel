"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-client";
import { Container, Button } from "@/components/ui";
import { ADMIN_URL } from "@/lib/site";

const NAV = [
  ["/account", "Overview"],
  ["/account/orders", "Orders"],
  ["/account/addresses", "Addresses"],
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  if (!ready) {
    return <Container className="py-20 text-center text-muted">Loading…</Container>;
  }
  if (!user) return null;

  return (
    <Container className="py-10">
      <h1 className="mb-6 font-display text-3xl text-primary">Hi, {user.name.split(" ")[0]}</h1>
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {NAV.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm ${
                pathname === href ? "bg-blush font-medium text-primary" : "hover:bg-blush/60"
              }`}
            >
              {label}
            </Link>
          ))}
          {(user.role === "ADMIN" || user.role === "STAFF") && (
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-bg hover:bg-primary-hover"
            >
              Admin panel ↗
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 justify-start"
            onClick={() => logout().then(() => router.push("/"))}
          >
            Sign out
          </Button>
        </nav>
        <div>{children}</div>
      </div>
    </Container>
  );
}
