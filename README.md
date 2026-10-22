# Kyaw Zaw Hein — Personal Site

**Live at [kyawzawhein.com](https://kyawzawhein.com)** — a QA engineer portfolio with a CMS-style admin panel, Markdown blog, unique visitor counter, and Playwright smoke tests.

Maintained by [Kyaw Zaw Hein](https://github.com/kyawzawhein-qa) (`kyawzawhein-qa`).

## What's here

| Route | Purpose |
| --- | --- |
| [`/`](https://kyawzawhein.com) | Public portfolio (SQLite via Prisma): hero, metrics, market signals, capability map, skills, projects, experience flip-cards, education, testimonials, certifications, contact form. Light/dark theme toggle. |
| [`/blog`](https://kyawzawhein.com/blog) | Markdown posts from `content/blog` |
| [`/feed.xml`](https://kyawzawhein.com/feed.xml) | Blog RSS feed |
| [`/login`](https://kyawzawhein.com/login) | NextAuth credentials sign-in |
| [`/admin`](https://kyawzawhein.com/admin) | Session-protected dashboard with `requireAdmin()` on mutations: profile (image/resume upload), projects, experience, education, skills, metrics, market signals, delivery map, testimonials, certifications, contact inbox |

**SEO:** Open Graph metadata, robots, sitemap, Person JSON-LD, RSS alternate link.

**Visitor counter:** hashed IPs with `VISITOR_HASH_SALT` (`UniqueVisitor` model).

## Tech stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-file%3Adev.db-003B57?logo=sqlite)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4-000000)

## Quick start

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/kyawzawhein-qa/portfolio.git
cd portfolio
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:db-push
npm run prisma:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at `/login` to reach `/admin`.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma SQLite URL, e.g. `file:./dev.db` |
| `NEXTAUTH_URL` | App URL for NextAuth |
| `NEXTAUTH_SECRET` | Session signing secret |
| `ADMIN_EMAIL` | Admin username at login |
| `ADMIN_PASSWORD` | Plain password when hash is unset |
| `ADMIN_PASSWORD_HASH` | Optional bcrypt hash |
| `VISITOR_HASH_SALT` | Salt for visitor IP hashing (required in production) |
| `NEXT_PUBLIC_SITE_URL` | Canonical/RSS base URL |

**Before any public deploy:** set strong, unique secrets. Never commit `.env`.

### Playwright smoke tests

```bash
npx playwright install chromium
npm run test:e2e
```

## Deploy

GitHub Actions (SCP + PM2):

- `main` → `kyawzawhein.com` (port 3000)
- `qa` → `test.kyawzawhein.com` (port 3001)

Default branch for staging is `qa`; `main` tracks production.
