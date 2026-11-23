# BERA FASHION — Next.js SaaS Frontend

Next.js 16 frontend for the **BERA FASHION** e-commerce backend. Includes the customer storefront, protected user panel and admin console.

## Quick start

```powershell
cd "C:\Users\webne\Documents\Default Project\bera-fashion"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

In development, the app calls `http://localhost:5000/api/v1` by default. A running Express API is required for products, categories, account actions and admin data. Set `API_BASE_URL` to the deployed API when hosting. If the API is unavailable, requests return an error instead of sample records. Editorial imagery is loaded from Unsplash.

### Local access

For local development, connect the Express API on port 5000 and use credentials created by that API. This frontend does not provide demo accounts or a local mock API.

## Rendering strategy map

| Mode | Where | Configuration |
| --- | --- | --- |
| **SSG** | `/about`, `/contact`, `/terms`, `/privacy` | `export const dynamic = "force-static"` |
| **SSR** | `/`, `/products` (filters, search, pagination) | `export const dynamic = "force-dynamic"` |
| **ISR** | `/categories`, `/products/[slug]`, `/categories/[slug]` | `export const revalidate = 60/300`; detail routes render on demand |
| **CSR** | `/cart`, `/checkout`, `/wishlist`, `/account/*`, `/admin/*` | `"use client"` + TanStack Query |

## Route map

```text
src/app/
  (store)/                 Customer storefront (store header + footer)
    page.jsx               Live home with rotating announcement slider
    products/              SSR listing + ISR detail
    categories/            ISR taxonomy
    cart/ checkout/ wishlist/ orders/ track/   CSR commerce
    about/ contact/ terms/ privacy/ SSG content
  (auth)/                  Login, register, password + email flows
  account/                 Protected user panel (profile, addresses, orders, returns…)
  admin/                   Protected admin console (dashboard, orders, catalogue, reports…)
  api/
    backend/[...path]/     BFF proxy → Express API (JWT injected from httpOnly cookie)
    auth/[...path]/        Session issue / refresh / logout with Zod validation
    health/                Frontend + backend health
```

Shared code lives in `src/components/{ui,shared,layout,store,account,admin}` and `src/lib/api`.

## Architecture

- **BFF pattern** — browser code never sees backend JWTs. All client calls hit `/api/backend/*`, which forwards `Authorization` and `X-Session-Id` headers from httpOnly cookies.
- **Live data layer** — `serverFetch` (Server Components) and the BFF forward requests to the Express API and return service errors when the API is unavailable.
- **Auth** — Express login/register responses are converted into a signed-session httpOnly cookie. `requireUser()` / `requireAdmin()` guards protect the two dashboards.
- **Validation** — shared Zod schemas in `src/lib/validation.js` are enforced both in the forms and at the auth BFF boundary. Sign-up passwords require at least six characters and a mix of letters and numbers.
- **Data fetching** — Server Components use `serverFetch`; interactive screens use TanStack Query with `clientFetch`, optimistic toasts and cache invalidation.
- **Design system** — Tailwind v4 theme tokens in `src/app/globals.css` (`brand-*`, `gold-*`, `ink-*`, `surface`, `container-x`, `font-display`). Reusable primitives in `src/components/ui`.
- **Cloudinary / Unsplash images** configured in `next.config.ts`, AVIF/WebP optimisation enabled.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Environment

Copy `.env.example` to `.env.local` for local development. Production requires `API_BASE_URL` and a unique `AUTH_SECRET` with at least 32 bytes of entropy. There are no built-in admin or customer accounts: create the first admin through a trusted backend bootstrap process, then sign in through `/sign-in`.

| Variable | Purpose |
| --- | --- |
| `API_BASE_URL` | Express API base URL (server-side) |
| `NEXT_PUBLIC_SITE_URL` | Canonical/metadata base URL |
| `AUTH_COOKIE_NAME` | Optional name for the signed httpOnly session cookie |
| `AUTH_SECRET` | Required in production; use a unique random secret of at least 32 bytes to sign the httpOnly session cookie |

## Backend compatibility

The BFF proxies auth, users/addresses, categories, brands, products/variants, inventory, cart, wishlist, coupons, orders, payments, returns, shipping and admin analytics. The Express backend is maintained separately and is not included in this repository.

Built with Next.js 16, React 19, Tailwind CSS v4, TanStack Query, React Hook Form, Zod, Recharts, Lucide and Sonner.
