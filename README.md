<p align="center">
  <img src="public/logo.png" alt="YK Academy Logo" width="120" />
</p>

<h1 align="center">YK Academy</h1>

<p align="center">
  <strong>Egypt's premier tech education platform — master programming, AI, and modern technology.</strong>
</p>

<p align="center">
  <a href="#-tech-stack">Tech Stack</a> &bull;
  <a href="#-features">Features</a> &bull;
  <a href="#-quick-start">Quick Start</a> &bull;
  <a href="#-project-structure">Structure</a> &bull;
  <a href="#-deployment">Deployment</a> &bull;
  <a href="#-license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/NextAuth-v5-000?logo=nextauth" alt="NextAuth" />
</p>

---

## Screenshots

> Screenshots coming soon.

---

## Features

### Public Site
- Responsive landing page with animated hero, partner bar, and pricing
- Course catalog with filtering by category, level, and price
- Individual course detail pages with modules, lessons, and reviews
- Blog with categories, tags, SEO metadata, and comments
- FAQ accordion section
- Testimonials carousel
- Contact form with server-side validation
- Newsletter subscription
- Pricing plans (Basic / Professional / Enterprise)

### Student Dashboard
- Personalized dashboard with enrolled courses, stats, and activity feed
- Course learning experience with progress tracking per lesson
- Assignment submissions (text + file uploads)
- Grade book and certificate viewer
- Bookmarks and lesson downloads
- Attendance calendar
- Notification center
- Profile management

### Admin Dashboard
- Overview with revenue, enrollment, and user charts (Recharts)
- Course management (CRUD, modules, lessons, publish/unpublish)
- User management with role assignment and soft-delete
- Enrollment management with status filtering
- Payment tracking with date range and method filters
- Blog post management with SEO fields
- Discount code management (percentage / fixed)
- FAQ, testimonial, and review management
- Media library with file upload
- Contact message inbox
- Subscriber management
- Site settings (key-value store)
- Activity logs audit trail

### Technical
- Next.js 16 App Router with route groups (`(dashboard)`)
- NextAuth v5 with Credentials, Google, and GitHub providers
- Role-based access control (RBAC) with 8 roles
- Prisma ORM with PostgreSQL (Neon / Supabase)
- Zod validation on all forms and API routes
- Framer Motion animations throughout
- TanStack Query for server state
- Zustand for client state
- shadcn/ui component library
- Soft-delete pattern across users, courses, and blog posts
- Database indexes on all frequently queried columns

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.17
- **npm** >= 9 (or pnpm / yarn)
- **PostgreSQL** database ([Neon](https://neon.tech) free tier recommended)

### 1. Clone the repository

```bash
git clone https://github.com/eng-yossef/yk-academy-web.git
cd yk-academy-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in all required values (see [Environment Variables](#-environment-variables)).

### 4. Set up the database

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
yk-academy-web/
├── prisma/
│   ├── schema.prisma            # Database schema (25+ models)
│   └── seed.ts                  # Database seed script
├── public/                      # Static assets (images, favicon, etc.)
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── admin/           # Admin dashboard pages (20 sections)
│   │   │   └── student/         # Student dashboard pages (13 sections)
│   │   ├── api/                 # API route handlers
│   │   │   ├── auth/            # NextAuth catch-all route
│   │   │   ├── contact/         # Contact form submission
│   │   │   ├── newsletter/      # Newsletter subscription
│   │   │   ├── admin/           # Admin-only APIs (CRUD)
│   │   │   └── student/         # Student APIs (courses, progress, assignments)
│   │   ├── auth/                # Sign-in / Sign-up pages
│   │   ├── courses/             # Public course listing & detail
│   │   ├── blog/                # Public blog listing & detail
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact page
│   │   ├── faq/                 # FAQ page
│   │   ├── pricing/             # Pricing page
│   │   ├── layout.tsx           # Root layout (fonts, theme, session)
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global styles & Tailwind theme
│   ├── proxy.ts                 # Proxy configuration for external APIs
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, Sidebar, DashboardLayout
│   │   ├── shared/              # Reusable business components
│   │   └── ui/                  # shadcn/ui primitives (22 components)
│   ├── config/
│   │   └── constants.ts         # App-wide constants & nav items
│   ├── lib/
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── utils.ts             # Utility functions (cn, formatCurrency, etc.)
│   │   └── validations.ts       # Zod schemas for all forms
│   └── types/
│       └── index.ts             # TypeScript interfaces & API types
├── .env                         # Environment variables
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── prisma.config.ts             # Prisma config (dotenv)
├── eslint.config.mjs            # ESLint flat config
└── package.json                 # Dependencies & scripts
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Secret for NextAuth JWT signing (generate with `npx auth secret`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | No | App base URL (default: `http://localhost:3000`) |

Generate `AUTH_SECRET`:

```bash
npx auth secret
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma db seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma Studio (visual DB browser) |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Next.js — keep the defaults
5. Add all environment variables in the Vercel dashboard
6. Click **Deploy**

### Custom Domain

1. Go to your project settings on Vercel
2. Navigate to **Domains**
3. Add your custom domain and verify DNS

### Database

We recommend [Neon](https://neon.tech) (free tier) or [Supabase](https://supabase.com) for a managed PostgreSQL instance.

1. Create a free project on Neon
2. Copy the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables
4. Run `npx prisma db push` locally against the Neon database to initialize the schema

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

Please follow the existing code style and run `npm run lint` before committing.

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 YK Academy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
