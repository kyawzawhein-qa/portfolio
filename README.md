# Kyaw Zaw Hein — Personal Site

**Live at [kyawzawhein.com](https://kyawzawhein.com)** — a QA engineer portfolio that presents resume-backed experience, skills, and delivery focus, with a small admin surface to keep the story current.

Maintained by [Kyaw Zaw Hein](https://github.com/kyawzawhein-qa) (`kyawzawhein-qa`).

## What's here

| Route | Purpose |
| --- | --- |
| [`/`](https://kyawzawhein.com) | Public single-page portfolio (SQLite via Prisma): hero and intro, capability map, summary, skills by category, projects, flip-card work experience with highlights, education, testimonials, certifications, and contact details. Light/dark theme toggle. |
| [`/login`](https://kyawzawhein.com/login) | NextAuth credentials sign-in (username + password). |
| [`/admin`](https://kyawzawhein.com/admin) | Session-protected dashboard: edit profile (including image upload to `public/uploads`), and create/update/delete **experience**, **education**, and **skills** via Server Actions. Projects and certifications on the homepage are stored in the database (seeded locally); additional CRUD helpers live in `app/api/actions/portfolio/crud.ts` for future admin UI. |

Data model: `Profile`, `Experience` (+ highlights), `Education`, `Skill`, `Project`, `Testimonial`, `Certification` (`prisma/schema.prisma`).

## Tech stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-file%3Adev.db-003B57?logo=sqlite)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4-000000)

Runtime dependencies also include `bcryptjs` and `lucide-react`.

## Quick start

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/kyawzawhein-qa/portfolio.git
cd portfolio
npm install
```

Copy [`.env.example`](.env.example) to `.env` in the project root, fill in your local values, then initialize the database and seed sample QA portfolio content:

```bash
npm run prisma:generate
npm run prisma:db-push
npm run prisma:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at [http://localhost:3000/login](http://localhost:3000/login) to reach `/admin`.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma SQLite URL, e.g. `file:./dev.db` |
| `NEXTAUTH_URL` | App URL for NextAuth, e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Session signing secret (generate a long random string for local/dev) |
| `ADMIN_EMAIL` | Admin **username** accepted at login (not necessarily an email address) |
| `ADMIN_PASSWORD` | Plain admin password when `ADMIN_PASSWORD_HASH` is unset |
| `ADMIN_PASSWORD_HASH` | Optional bcrypt hash; when set, login verifies against this instead of `ADMIN_PASSWORD` |

**Before any public deploy:** set strong, unique `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (or `ADMIN_PASSWORD_HASH`). Never commit real secrets or rely on unconfigured `lib/auth.ts` fallbacks.

### Local admin (dev only)

If you do not set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `ADMIN_PASSWORD_HASH` in `.env`, `lib/auth.ts` uses **unconfigured local fallbacks** for private dogfooding on your machine. Inspect that file locally if you need the defaults; do not copy those values into docs, commits, or public deploys.

Override auth via `.env` (and rotate secrets) before deploying anywhere public. The login form label says “email” but authentication matches `ADMIN_EMAIL` as the username.

## Repository

- **Description:** Personal site — kyawzawhein.com  
- **Default branch:** `qa` (staging deploy); `main` tracks production per `.github/workflows/deploy.yml`.
