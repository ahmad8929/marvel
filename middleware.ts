import { NextResponse, type NextRequest } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
const BYPASS = process.env.PREVIEW_BYPASS_TOKEN;

// Paths that must stay reachable even in coming-soon mode.
const OPEN = [
  "/coming-soon",
  "/api",
  "/_next",
  "/favicon",
  "/brand",
  "/icon",
  "/robots.txt",
  "/sitemap.xml",
];

let cache: { at: number; on: boolean } = { at: 0, on: false };

async function comingSoon(): Promise<boolean> {
  if (Date.now() - cache.at < 60_000) return cache.on;
  try {
    const res = await fetch(`${API}/settings/public`, { cache: "no-store" });
    const data = (await res.json()) as { comingSoon?: boolean };
    cache = { at: Date.now(), on: Boolean(data.comingSoon) };
  } catch {
    cache = { at: Date.now(), on: false };
  }
  return cache.on;
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (OPEN.some((p) => pathname.startsWith(p))) return NextResponse.next();

  if (BYPASS && searchParams.get("preview") === BYPASS) {
    const res = NextResponse.next();
    res.cookies.set("preview", BYPASS, { path: "/", httpOnly: true });
    return res;
  }
  if (BYPASS && req.cookies.get("preview")?.value === BYPASS) {
    return NextResponse.next();
  }

  if (await comingSoon()) {
    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.search = "";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
