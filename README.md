# FoodieBites

A responsive restaurant storefront built with the Next.js App Router, TypeScript,
Tailwind CSS v4 + daisyUI, Framer Motion, BetterAuth and MongoDB. It includes a
marketing home page, a filterable menu of 15 dishes, protected dish detail pages,
a per-user cart and a dashboard for profile settings.

## Features

- **Home page** — hero with search, scrolling offer marquee, six featured dishes,
  category-filtered menu pack, services, reservation dialog, testimonials, chefs
  and an app-download banner.
- **Menu** (`/menu`) — 15 dishes across six categories with server-side search
  (`?q=`) and category filtering (`?category=`).
- **Dish details** (`/products/[id]`) — full description, ingredients, nutrition
  facts, quantity picker, add-to-cart and related dishes. **Sign-in required.**
- **Cart** (`/cart`) — per-user cart stored in MongoDB, quantity controls, demo
  checkout summary and order confirmation. **Sign-in required.**
- **Auth** — BetterAuth email + password sign-up / sign-in with sessions in
  MongoDB; `/profile` is protected and re-validates the session server-side.
- **Dashboard** (`/profile`) — account overview, display-name update, password
  change and cart totals. **Sign-in required.**
- Animations with Framer Motion (page transitions + scroll reveals), fully
  mobile-first layout, custom daisyUI theme and a custom favicon.

## Getting started

Requirements: Node.js 20.19+ (24 recommended) and MongoDB 7.

```bash
npm install
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local
npm run dev
```

Open http://localhost:3000.

### Database

Start MongoDB with Docker (standalone, matching the default connection string):

```bash
docker compose up -d
```

Then load the catalogue:

```bash
npm run seed
```

The app works without MongoDB — pages fall back to the bundled catalogue in
`src/data/products.ts` and log a warning — but auth, carts and profile settings
need a running database.

### Environment variables

| Variable | Default | Notes |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/foodiebites` | Connection string |
| `MONGODB_DB` | `foodiebites` | Database name |
| `BETTER_AUTH_SECRET` | development fallback | **Set this in production** |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Base URL for auth |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Upsert the 15 products into MongoDB |
| `npm run fetch:assets` | Re-download the images in `public/images` |

## Project structure

```
src/
├── app/                 # routes, API handlers, global styles, layout, template
├── components/          # auth, cart, home, layout, products, profile, ui
├── data/                # canonical products + site content
└── lib/                 # auth, MongoDB, product + cart data access, helpers
scripts/                 # seed script and image fetcher
```

Server data access lives in `src/lib`; interactive pieces (cart, forms, carousels)
are client components. Nuxt-style route protection is handled by `src/proxy.ts`
(Next.js 16's replacement for middleware) plus a server-side session check on
protected pages.

## Images

Dish photos come from Wikimedia Commons and the people/hero photos from Unsplash.
Attribution for the Commons files is recorded in `public/images/ATTRIBUTION.md`.

## Demo notes

- Checkout is a mock: it clears the cart and shows a confirmation, and no
  payment is taken or order stored.
- The reservation form validates input but does not persist reservations.
- Email verification and password reset are intentionally out of scope.
