# QA Engineer Portfolio (Next.js + Prisma + NextAuth)

Single-page dynamic portfolio with a full CMS-style admin panel.

## Features

- Public portfolio at `/` driven by Prisma (SQLite)
- Admin login at `/login` (NextAuth Credentials)
- Protected admin dashboard at `/admin` with CRUD for:
  - Profile (including LinkedIn/GitHub/resume/hero tags)
  - Projects & Playwright demos (GitHub links, case-study fields)
  - Experience, Education, Skills
  - Metrics, Market signals, Delivery map
  - Testimonials, Certifications
  - Contact inbox
- Working contact form (stores messages for admin review)
- SEO: Open Graph, robots, sitemap, Person JSON-LD
- Playwright smoke tests

## Setup

```bash
npm install
cp .env.example .env
npx prisma db push
npm run prisma:seed
npm run dev
```

## Admin login

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` (or `ADMIN_PASSWORD`) in `.env`.

Default username from `.env.example`: `kyawzawhein` (use your configured password/hash).

## Playwright smoke tests

```bash
npx playwright install chromium
npm run test:e2e
```

## Deploy

Pushing to `main` deploys to `kyawzawhein.com` via GitHub Actions (SCP + PM2).
Pushing to `qa` deploys to `test.kyawzawhein.com`.
