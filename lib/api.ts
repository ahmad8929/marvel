/**
 * Server-side API client for marvels-api. Used from Server Components and route
 * handlers. Tag-based caching feeds on-demand ISR (see app/api/revalidate).
 */
const BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

type FetchOpts = {
  tags?: string[];
  revalidate?: number | false;
  cache?: RequestCache;
};

export async function apiGet<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { accept: "application/json" },
    next: {
      tags: opts.tags,
      revalidate: opts.revalidate ?? 3600,
    },
    ...(opts.cache ? { cache: opts.cache } : {}),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText, path);
  }
  return res.json() as Promise<T>;
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
  headers?: Record<string, string>,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || res.statusText, path);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export class ApiError extends Error {
  status: number;
  path: string;
  constructor(status: number, message: string, path: string) {
    super(message);
    this.status = status;
    this.path = path;
  }
}

export const API_BASE = BASE;
