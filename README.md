# marvels-web

Public storefront for **Marvel's Online Clothings** (`www.marvelsazamgarh.in`).
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · deployed to **Vercel**.

Talks to `marvels-api` (`api.marvelsazamgarh.in`) over HTTPS; media served from
`media.marvelsazamgarh.in`. Full spec: [`../docs/BUILD_BRIEF.md`](../docs/BUILD_BRIEF.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Structure

```
app/            routes (storefront group, api handlers, sitemap/robots/OG)
components/ui/         headless + Tailwind primitives
components/storefront/ page-level sections (header, footer, product card, ...)
lib/            api client, auth/session, seo, formatting helpers
stores/         Zustand stores (cart, ui)
public/brand/   logo SVG set
```

## Brand

Design tokens live in [`app/globals.css`](app/globals.css) (`@theme`): `primary` (maroon
`#6D1533`), `gold`, `blush`, `bg` (ivory), `ink`, `line`, `sale`. Fonts (via `next/font`):
`font-display` Playfair Display, `font-serif` Cormorant Garamond, `font-sans` Jost,
`font-script` Dancing Script.

Logo: `public/brand/logo-full.svg` (header lockup), `logo-stacked.svg` (emails / splash),
`logo-mark.svg` (monogram), `logo-light.svg` (ivory, for the maroon footer),
`app/icon.svg` (favicon). Original artwork — informed by the brand promo graphics.
Wordmark uses live `<text>`; convert to outlines before final launch for pixel-perfect
rendering off-site.

## Status

Phase 0 — scaffold + brand shell. The home route is a temporary branded placeholder.
