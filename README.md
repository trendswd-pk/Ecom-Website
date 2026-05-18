# Ecom Website

A full-stack e-commerce web app built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, and **Supabase** (Auth, PostgreSQL, Storage).

- **Storefront:** public home page and layout (products listing coming next).
- **Admin panel:** Supabase Auth login, product management with variants & images, user management with role-based permissions.

**Live repo (deploy):** [github.com/atonespotpk-ecom/Ecom-Website](https://github.com/atonespotpk-ecom/Ecom-Website)  
**Backup repo:** [github.com/trendswd-pk/Ecom-Website](https://github.com/trendswd-pk/Ecom-Website)

---Updated File Done

## Tech stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (Postgres, Auth, Storage) |
| Auth (admin) | `@supabase/ssr` + middleware session |
| Icons | Lucide React |
| Deploy | Vercel (connected to `atonespotpk-ecom/Ecom-Website`) |

---

## Features

### Storefront (`/`)

- Hero section and shared layout (header / footer)
- Ready for product catalog backed by Supabase `products` table

### Admin panel (`/admin`)

| Route | Description |
|--------|-------------|
| `/admin/login` | Email + password (Supabase Auth) |
| `/admin` | Dashboard |
| `/admin/products` | Product table (status, actions) |
| `/admin/products/new` | Two-tab form: details + variant matrix |
| `/admin/users` | User list with permissions |
| `/admin/users/[id]` | User detail |
| `/admin/users/[id]/edit` | Edit role & permissions |

**Products**

- Title, description, status (Active / Draft)
- Multiple images (client upload to Supabase Storage, max 5 MB each)
- Color / size tags → auto-generated variant combinations
- Per variant: sale price, compare-at, cost, profit, stock

**Users & permissions**

- Roles: `admin`, `user`
- Granular flags: `can_view`, `can_edit`, `can_delete`
- Admins have full access; delete is admin-only

**Security**

- Middleware protects `/admin/*` (except login)
- Passwords live only in `auth.users` (bcrypt) — never in `.env` or `profiles`
- Server actions use service role for admin writes; RLS on public tables

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Storefront home
│   └── admin/
│       ├── login/               # Admin sign-in
│       └── (panel)/             # Dashboard, products, users
├── components/
│   ├── admin/                   # Tables, forms, product wizard
│   ├── layout/                  # Header, footer, shells
│   ├── storefront/
│   └── ui/
├── lib/
│   ├── supabase/                # Browser, server, middleware clients
│   ├── admin/                   # Session & current user helpers
│   ├── storage/                 # Client-side image upload
│   └── products/                # Variant combination logic
├── middleware.ts                # Admin route protection
└── types/

supabase/                        # SQL migrations (run in SQL Editor)
scripts/seed-admin.mjs           # Create default admin user
```

---

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- (Optional) Second Git remote `trendswd` for backup pushes

---

## Local setup

### 1. Clone & install

```bash
git clone https://github.com/atonespotpk-ecom/Ecom-Website.git
cd Ecom-Website
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (server only, never expose to client) |

Also add the same three variables in **Vercel → Project → Settings → Environment Variables**.

### 3. Supabase database

In **Supabase Dashboard → SQL Editor**, run these files **in order**:

1. `supabase/schema.sql` — categories, products, orders + RLS
2. `supabase/profiles.sql` — profiles, signup trigger, RLS
3. `supabase/products-variants.sql` — status, `image_urls`, `product_variants`
4. `supabase/storage-product-images.sql` — `product-images` bucket + policies
5. `supabase/policies-profiles-own-read.sql` — optional idempotent policy fix

Reference only (do not run as migration): `supabase/auth-passwords.sql`

### 4. Seed admin user

```bash
npm run seed:admin
```

Creates:

- **Email:** `admin@trendswd.com`
- **Password:** `admin123`

Change the password after first login in production.

Alternatively: create the user in **Authentication → Users**, then run `supabase/seed-admin.sql` for the `profiles` row.

### 5. Run dev server

```bash
npm run dev
```

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run seed:admin` | Create admin Auth user + profile |

---

## Git remotes

This project uses two remotes:

```bash
git remote -v
# origin    → atonespotpk-ecom/Ecom-Website   (primary, Vercel)
# trendswd  → trendswd-pk/Ecom-Website         (backup)
```

**Push to production repo:**

```bash
git add .
git commit -m "Your message"
git push origin main
```

**Optional backup:**

```bash
git push trendswd main
```

---

## Deploy on Vercel

1. Import **atonespotpk-ecom/Ecom-Website** in Vercel.
2. Set environment variables (same as `.env.local`).
3. Deploy — every push to `main` triggers a new deployment.

---

## Configuration notes

- **Server Actions body limit:** `next.config.ts` sets `experimental.serverActions.bodySizeLimit` to `10mb` for large payloads; product images upload **client-side** to Storage to avoid limits.
- **Hydration:** `suppressHydrationWarning` on `<html>` / `<body>` for browser-extension attribute mismatches.

---

## License

Private project — all rights reserved.
