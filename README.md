# Yzak Luxury Brand

Full-stack luxury e-commerce for Hawassa & Dire Dawa, Ethiopia.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js v5 (email + 4-digit PIN, credentials only)
- Local images in `/public/images/{category}/`
- Zustand (cart & wishlist)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure `.env.local`**

   Fill in:

   - `DATABASE_URL` — PostgreSQL connection string (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com))
   - `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
   - Product images — place `.jpg` files in `public/images/{category}/` (see `public/images/README.md`)

3. **Database**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Login

- **Sign up / Sign in:** [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
- **Password:** exactly 4 digits (numbers only)
- **Admin:** `admin@yzak.com` / PIN `1234` (from seed) → redirects to `/admin`
- **Customers:** any other email → redirects to homepage `/`

## Admin Access

- Seed creates `admin@yzak.com` as ADMIN with PIN `1234`
- Or promote any registered user in Admin → Settings
- Admin dashboard: `/admin`

## Deploy (Vercel)

1. Push to GitHub
2. Import project on Vercel
3. Add all env variables from `.env.local`
4. Use a hosted PostgreSQL `DATABASE_URL`
