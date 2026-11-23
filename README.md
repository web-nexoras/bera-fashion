# BERA FASHION — Next.js SaaS Frontend

Production-grade Next.js 16 frontend for the **BERA FASHION** e-commerce backend. Maroon & white SaaS design system, customer storefront, protected user panel and full admin console — with SSG, SSR, ISR and CSR used deliberately across the app.

## Quick start

```powershell
cd "C:\Users\webne\Documents\Default Project\bera-fashion"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app calls `http://localhost:5000/api/v1` by default. A deterministic local dataset keeps every screen usable when the API is unreachable, so the storefront and admin console can be developed and reviewed without a running backend. Product imagery is loaded from Unsplash (requires internet).

### Local access

For local development with no backend running, sign in with `admin@berafashion.com` or `customer@berafashion.com` and any password that satisfies the sign-in form. Connect the Express API on port 5000 to use real credentials and live data.

## Rendering strategy map

| Mode | Where | Configuration |
| --- | --- | --- |
| **SSG** | `/`, `/about`, `/contact`, `/categories`, `/terms`, `/privacy` | `export const dynamic = "force-static"` |
| **SSR** | `/products` (filters, search, pagination) | `export const dynamic = "force-dynamic"` |
| **ISR** | `/products/[slug]`, `/categories/[slug]` | `export const revalidate = 60/300` + `generateStaticParams()` |
| **CSR** | `/cart`, `/checkout`, `/wishlist`, `/account/*`, `/admin/*` | `"use client"` + TanStack Query |

A live, in-app explanation is available at `/rendering`.

## Route map

```text
src/app/
  (store)/                 Customer storefront (store header + footer)
    page.tsx               SSG home with rotating announcement slider
    products/              SSR listing + ISR detail
    categories/            ISR taxonomy
    cart/ checkout/ wishlist/ orders/ track/   CSR commerce
    about/ contact/ terms/ privacy/ rendering/ SSG content
  (auth)/                  Login, register, password + email flows
  account/                 Protected user panel (profile, addresses, orders, returns…)
  admin/                   Protected admin console (dashboard, orders, catalogue, reports…)
  api/
    backend/[...path]/     BFF proxy → Express API (JWT injected from httpOnly cookie)
    auth/[...path]/        Session issue / refresh / logout with Zod validation
    health/                Frontend + backend health
```

Shared code lives in `src/components/{ui,shared,layout,store,account,admin}`, `src/lib/{api,fallback}`, `src/hooks` and `src/types`.

## Architecture

- **BFF pattern** — browser code never sees backend JWTs. All client calls hit `/api/backend/*`, which forwards `Authorization` and `X-Session-Id` headers from httpOnly cookies.
- **Resilient data layer** — `serverFetch` (Server Components) and the BFF both fall back to a deterministic local dataset, matching the Express response envelope `{ success, message, data, pagination }`.
- **Auth** — Express login/register responses are converted into a signed-session httpOnly cookie. `requireUser()` / `requireAdmin()` guards protect the two dashboards.
- **Validation** — shared Zod schemas in `src/lib/validation.ts` are enforced both in the forms and at the auth BFF boundary. Passwords require 10+ characters with mixed case, a number and a special character.
- **Data fetching** — Server Components use `serverFetch`; interactive screens use TanStack Query with `clientFetch`, optimistic toasts and cache invalidation.
- **Design system** — Tailwind v4 theme tokens in `src/app/globals.css` (`brand-*`, `gold-*`, `ink-*`, `surface`, `container-x`, `font-display`). Reusable primitives in `src/components/ui`.
- **Cloudinary / Unsplash images** configured in `next.config.ts`, AVIF/WebP optimisation enabled.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript validation |
| `npm run lint` | ESLint |

## Environment

Copy `.env.example` to `.env.local` (already present for local dev).

| Variable | Purpose |
| --- | --- |
| `API_BASE_URL` | Express API base URL (server-side) |
| `NEXT_PUBLIC_API_BASE_URL` | Public copy used in UI copy |
| `NEXT_PUBLIC_SITE_URL` | Canonical/metadata base URL |
| `OFFLINE_FALLBACK` | Development only: `true` serves the local dataset directly; production uses the real API and returns 503 if it is unreachable |
| `AUTH_SECRET` | Required in production; use a unique random secret of at least 32 bytes to sign the httpOnly session cookie |
| `REVALIDATE_PRODUCTS` / `REVALIDATE_CATEGORY` | ISR windows in seconds |

## Backend compatibility

Implements the API contract documented in `BERA-BACKEND/src/docs/swagger.js`: auth, users/addresses, categories, brands, products/variants, inventory, cart, wishlist, coupons, orders, payments, returns, shipping and admin analytics.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, TanStack Query, React Hook Form, Zod, Recharts, Lucide and Sonner.
