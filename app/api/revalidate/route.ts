import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const SECRET = process.env.REVALIDATE_SECRET;

/** Called by marvels-api after a content mutation. Guarded by a shared secret. */
export async function POST(req: NextRequest) {
  if (!SECRET || req.headers.get("x-internal-secret") !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { tags?: string[] };
  const tags = Array.isArray(body.tags) ? body.tags : [];
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: tags });
}
