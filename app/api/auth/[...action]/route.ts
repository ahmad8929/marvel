import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

/**
 * Thin first-party proxy for auth so the browser never makes a cross-site call.
 * The marvels-api Set-Cookie(s) (refresh token) are forwarded verbatim; the
 * access token comes back in the JSON body for the client to hold in memory.
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
    return NextResponse.json(
      { error: { message: "unknown action" } },
      { status: 404 },
    );
  }

  const body = await req.text();

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}/auth/${action}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      body: body || undefined,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          message:
            "Could not reach the API. Check NEXT_PUBLIC_API_URL on this deployment.",
          detail: err instanceof Error ? err.message : String(err),
          target: `${API_BASE}/auth/${action}`,
        },
      },
      { status: 502 },
    );
  }

  const res = new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
  // undici exposes multiple Set-Cookie via getSetCookie(); .get() would drop them.
  for (const cookie of upstream.headers.getSetCookie()) {
    res.headers.append("set-cookie", cookie);
  }
  return res;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ action: string[] }> },
) {
  const { action } = await ctx.params;
  return proxy(req, action[0] ?? "");
}
