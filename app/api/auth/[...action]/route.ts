import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

/**
 * Thin proxy so the browser talks to a first-party origin for auth. The
 * marvels-api Set-Cookie (refresh token, Domain=.marvelsonline.in) is forwarded
 * straight through; the access token is returned in the JSON body for the client
 * to hold in memory.
 */
const ALLOWED = new Set([
  "login",
  "register",
  "refresh",
  "logout",
  "forgot-password",
  "reset-password",
]);

async function proxy(req: NextRequest, action: string) {
  if (!ALLOWED.has(action)) {
    return NextResponse.json({ error: "unknown action" }, { status: 404 });
  }
  const body = await req.text();
  const upstream = await fetch(`${API_BASE}/auth/${action}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: body || undefined,
  });

  const res = new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);
  return res;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ action: string[] }> },
) {
  const { action } = await ctx.params;
  return proxy(req, action[0] ?? "");
}
