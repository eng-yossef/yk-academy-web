# Architecture — YK Academy

This document describes the high-level architecture, design decisions, and technical patterns used in the YK Academy platform.

---

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│   React 19 SPA-like experience (RSC + client components)        │
└──────────────┬───────────────────────────────┬───────────────────┘
               │ HTTPS                         │ HTTPS
               ▼                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                        │
│               Next.js 16 Serverless Functions                   │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐│
│  │  Pages   │  │  API     │  │ Server   │  │ Middleware        ││
│  │  (RSC)   │  │  Routes  │  │ Actions  │  │ (auth, redirect) ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────────────┘│
│       │              │              │                             │
│       └──────────────┼──────────────┘                             │
│                      │                                            │
│               ┌──────▼──────┐                                     │
│               │ Prisma ORM  │                                     │
│               └──────┬──────┘                                     │
└──────────────────────┼───────────────────────────────────────────┘
                       │ Connection pool (PgBouncer / Neon proxy)
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │   (Neon /       │
              │   Supabase)     │
              └─────────────────┘
```

---

## Application Layers

### 1. Presentation Layer

The UI layer is built with React 19 and Next.js 16 App Router. It uses a mix of Server Components (RSC) for performance and Client Components (`"use client"`) for interactivity.

**Key technologies:**
- **Tailwind CSS 4** — utility-first styling
- **shadcn/ui** — accessible component primitives built on Radix UI
- **Framer Motion** — page transitions and micro-animations
- **Recharts** — dashboard charts and data visualizations
- **next-themes** — dark/light mode support

### 2. Business Logic Layer

All business logic lives in Next.js Route Handlers (`src/app/api/`) and is consumed via fetch calls or TanStack Query hooks.

**Responsibilities:**
- Input validation (Zod schemas in `src/lib/validations.ts`)
- Authentication checks (`auth()` from `src/lib/auth.ts`)
- Authorization checks (role-based inline in each route)
- Data transformation before response

### 3. Data Access Layer

Prisma ORM provides a type-safe query builder over PostgreSQL. The Prisma client is instantiated as a global singleton (`src/lib/prisma.ts`) to prevent connection exhaustion in serverless environments.

**Pattern:**

```typescript
// src/lib/prisma.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## Next.js App Router Structure

```
src/app/
├── layout.tsx                    # Root layout — fonts, providers, Toaster
├── page.tsx                      # Homepage (client component with animations)
├── globals.css                   # Tailwind imports + custom CSS variables
│
├── (dashboard)/                  # Route group — no URL segment
│   ├── admin/                    # /admin/* — protected to ADMIN, SUPER_ADMIN
│   │   ├── layout.tsx            # Client-side role guard
│   │   ├── page.tsx              # Admin dashboard overview
│   │   ├── courses/
│   │   ├── users/
│   │   ├── enrollments/
│   │   ├── payments/
│   │   ├── blog/
│   │   ├── media/
│   │   ├── settings/
│   │   ├── assignments/
│   │   ├── attendance/
│   │   ├── certificates/
│   │   ├── discounts/
│   │   ├── faq/
│   │   ├── testimonials/
│   │   ├── messages/
│   │   ├── subscribers/
│   │   └── activity/
│   │
│   └── student/                  # /student/* — protected to STUDENT, ADMIN, SUPER_ADMIN
│       ├── layout.tsx            # Server-side session check + DashboardLayout
│       ├── page.tsx              # Student dashboard overview
│       ├── courses/
│       ├── assignments/
│       ├── certificates/
│       ├── grades/
│       ├── attendance/
│       ├── bookmarks/
│       ├── calendar/
│       ├── downloads/
│       └── notifications/
│
├── auth/                         # /auth/* — public
│   ├── signin/
│   └── signup/
│
├── courses/                      # /courses — public
│   ├── page.tsx                  # Course catalog with filters
│   └── [slug]/                   # Course detail page
│
├── blog/                         # /blog — public
│   ├── page.tsx                  # Blog listing
│   └── [slug]/                   # Blog post detail
│
├── about/                        # /about — public
├── contact/                      # /contact — public
├── faq/                          # /faq — public
├── pricing/                      # /pricing — public
│
└── api/                          # API route handlers
    ├── auth/[...nextauth]/       # NextAuth catch-all
    ├── contact/                  # POST contact form
    ├── newsletter/               # POST subscribe
    ├── admin/                    # Admin CRUD APIs
    │   ├── stats/
    │   ├── courses/  [+ id]
    │   ├── users/    [+ id]
    │   ├── enrollments/
    │   ├── payments/
    │   ├── blog/     [+ id]
    │   ├── media/upload/
    │   └── settings/
    └── student/
        ├── courses/
        ├── progress/
        └── assignments/[id]/submit/
```

---

## Authentication Flow (NextAuth v5)

The project uses **NextAuth v5 (beta)** with the `@auth/prisma-adapter` for session persistence and JWT-based sessions.

### Providers

| Provider | Type | Use Case |
|----------|------|----------|
| Google | OAuth 2.0 | Social login |
| GitHub | OAuth 2.0 | Social login |
| Credentials | Email + Password | Primary login |

### Flow Diagram

```
User submits credentials
        │
        ▼
  ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
  │ /api/auth/   │────▶│ NextAuth         │────▶│ Prisma       │
  │ signIn()     │     │ authorize()      │     │ findUnique() │
  └──────────────┘     └────────┬────────┘     └──────────────┘
                                │
                    bcrypt.compare(password)
                                │
                        ┌───────▼───────┐
                        │  Valid?       │
                        │  Yes → JWT    │
                        │  No  → null   │
                        └───────┬───────┘
                                │
                    ┌───────────▼───────────┐
                    │  JWT Callback         │
                    │  token.id = user.id   │
                    │  token.role = user.role│
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Session Callback     │
                    │  session.user.id      │
                    │  session.user.role    │
                    └───────────────────────┘
```

### Key Configuration (`src/lib/auth.ts`)

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  providers: [Google, GitHub, Credentials({ ... })],
  callbacks: {
    jwt({ token, user }) { /* attach id + role */ },
    session({ session, token }) { /* expose id + role */ },
  },
});
```

---

## Authorization (RBAC)

### Roles

| Role | Value | Permissions |
|------|-------|-------------|
| Student | `STUDENT` | Browse courses, enroll, submit assignments, view grades, earn certificates |
| Parent | `PARENT` | View child's progress (planned) |
| Teacher | `TEACHER` | Create assignments, grade submissions for assigned courses |
| Assistant | `ASSISTANT` | Limited teacher permissions |
| Content Editor | `CONTENT_EDITOR` | Create/edit blog posts |
| Moderator | `MODERATOR` | Approve reviews, manage comments |
| Admin | `ADMIN` | Full CRUD on courses, users, enrollments, payments, settings, media |
| Super Admin | `SUPER_ADMIN` | All admin permissions + delete users |

### Enforcement Pattern

Authorization is enforced at **two levels**:

1. **Route Handler level** — every API route checks `session.user.role` inline:

```typescript
const session = await auth();
if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}
```

2. **Layout level** — dashboard layouts check roles before rendering:

```typescript
// Admin layout (client-side)
if (status === "authenticated" && !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
  router.push("/dashboard");
}

// Student layout (server-side)
if (!ALLOWED_ROLES.includes(session.user.role)) {
  redirect("/auth/signin");
}
```

---

## Database Design

The database uses **PostgreSQL** with **Prisma ORM** and contains **25+ models** organized into domains.

### Schema Categories

| Domain | Models |
|--------|--------|
| **Auth** | `User`, `Account`, `Session`, `VerificationToken` |
| **Courses** | `CourseCategory`, `Course`, `Module`, `Lesson` |
| **Enrollment & Progress** | `Enrollment`, `LessonProgress` |
| **Assignments & Grades** | `Assignment`, `AssignmentSubmission`, `Grade`, `Attendance` |
| **Certificates & Reviews** | `Certificate`, `Review` |
| **Blog** | `BlogPost`, `BlogComment` |
| **Content** | `FAQ`, `Testimonial`, `PageContent` |
| **Payments** | `Payment`, `Invoice`, `DiscountCode` |
| **Communication** | `Notification`, `Message`, `ContactMessage`, `Subscriber` |
| **Resources** | `Resource`, `Bookmark`, `MediaLibrary` |
| **Settings** | `SiteSetting`, `ActivityLog` |

### Key Relationships

```
User ──1:N──▶ Enrollment ──N:1──▶ Course ──1:N──▶ Module ──1:N──▶ Lesson
  │                │                    │                              │
  │                │                    ├──1:N──▶ Assignment ──1:N──▶ AssignmentSubmission
  │                │                    ├──1:N──▶ Review                │
  │                │                    └──1:N──▶ Resource              │
  │                │                                                    │
  │                ├──1:N──▶ LessonProgress ◀──────────────────────────┘
  │                └──1:N──▶ Payment ──1:1──▶ Invoice
  │
  ├──1:N──▶ Notification
  ├──1:N──▶ Certificate
  ├──1:N──▶ Grade
  ├──1:N──▶ Attendance
  ├──1:N──▶ BlogPost ──1:N──▶ BlogComment (self-referencing for replies)
  ├──1:N──▶ Message (sender & receiver)
  ├──1:N──▶ ActivityLog
  └──1:N──▶ MediaLibrary
```

See [DATABASE.md](DATABASE.md) for the full schema reference.

---

## API Design

### Route Handlers

All API routes are defined using the Next.js App Router `route.ts` convention.

**Standard response format:**

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string, message?: string }

// Paginated
{ success: true, data: T[], total: number, page: number, pageSize: number, totalPages: number }
```

### Authentication Methods

| Method | Used For |
|--------|----------|
| `auth()` (server) | Route handlers, server components |
| `useSession()` (client) | Client components, layouts |
| `signIn()` / `signOut()` | Auth actions |

### API Categories

| Prefix | Auth Required | Role Restriction |
|--------|--------------|-----------------|
| `/api/auth/*` | No | Public |
| `/api/contact` | No | Public |
| `/api/newsletter` | No | Public |
| `/api/student/*` | Yes | STUDENT, ADMIN, SUPER_ADMIN |
| `/api/admin/*` | Yes | ADMIN, SUPER_ADMIN |

### Validation

All inputs are validated with **Zod** schemas defined in `src/lib/validations.ts`. API routes use `schema.safeParse()` and return structured error messages on failure.

---

## State Management

### Client State — Zustand

Zustand is used for lightweight client-side state that doesn't need server synchronization (e.g., sidebar collapse, modal states, UI preferences).

### Server State — TanStack Query

TanStack Query (`@tanstack/react-query`) handles:
- Data fetching from API routes
- Cache invalidation
- Loading and error states
- Optimistic updates

### Component State — React useState/useEffect

Simple component-level state (form inputs, toggles, local UI) uses standard React hooks.

---

## Caching Strategy

| Layer | Strategy |
|-------|----------|
| **Next.js ISR** | Pages can be statically generated with `revalidate` for public content (courses, blog) |
| **TanStack Query** | Client-side caching with configurable `staleTime` and `gcTime` |
| **Prisma** | No built-in cache; relies on PostgreSQL query performance |
| **CDN (Vercel)** | Static assets cached at the edge; API responses cached per `Cache-Control` headers |
| **Browser** | Standard HTTP caching headers for static assets (`/_next/static/*`) |

---

## Component Architecture

### shadcn/ui Primitives (`src/components/ui/`)

22 pre-built accessible components based on Radix UI:

```
avatar, badge, button, card, checkbox, dialog, dropdown-menu,
input, label, progress, scroll-area, select, separator, skeleton,
switch, table, tabs, textarea, toast, toaster, tooltip, use-toast
```

### Shared Components (`src/components/shared/`)

Business-level reusable components:

| Component | Purpose |
|-----------|---------|
| `AnimatedCounter` | Animated number counters for stats |
| `ConfirmDialog` | Reusable confirmation modal |
| `CourseCard` | Course display card |
| `EmptyState` | Empty state placeholder |
| `FileUpload` | Drag-and-drop file upload |
| `GlowCard` | Card with glow hover effect |
| `GradientText` | Styled gradient text |
| `LoadingPage` | Full-page loading spinner |
| `RichTextEditor` | Text editor for blog/content |
| `SearchInput` | Search input with debounce |
| `SectionHeader` | Section title with subtitle |
| `StatCard` | Stat display card with trend |

### Layout Components (`src/components/layout/`)

| Component | Purpose |
|-----------|---------|
| `Navbar` | Public site navigation |
| `Footer` | Public site footer |
| `Sidebar` | Dashboard sidebar (admin/student) |
| `DashboardLayout` | Full dashboard shell (sidebar + header + content) |
| `PageHeader` | Page title with subtitle and optional actions |

---

## Security Architecture

### Authentication
- JWT-based sessions (NextAuth v5 strategy: `"jwt"`)
- Passwords hashed with **bcryptjs** (12 rounds)
- OAuth via Google and GitHub (HTTPS-only redirects)
- `AUTH_SECRET` used for JWT signing/encryption

### Authorization
- Role-based access control enforced at API + layout levels
- User deletion restricted to `SUPER_ADMIN` only
- Soft-delete pattern (no hard deletes on users, courses, blog posts)

### Input Validation
- All API inputs validated with Zod before processing
- SQL injection prevented by Prisma parameterized queries
- XSS prevented by React's automatic escaping
- CSRF handled by NextAuth's built-in token rotation

### File Uploads
- File type validation against `ALLOWED_FILE_TYPES`
- File size limits defined in `MAX_FILE_SIZES`:
  - Images: 5 MB
  - Videos: 500 MB
  - Documents: 10 MB
  - Avatars: 2 MB
- Files stored in `public/uploads/` (configurable to cloud storage)

### Sensitive Data
- Environment variables loaded from `.env` (git-ignored)
- `DATABASE_URL`, `AUTH_SECRET`, and OAuth secrets never exposed to client
- Only `NEXT_PUBLIC_*` variables are available in browser code

---

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              VERCEL PLATFORM                 │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │         EDGE NETWORK (CDN)            │  │
│  │  Static assets, ISR pages, API cache  │  │
│  └──────────────┬────────────────────────┘  │
│                 │                            │
│  ┌──────────────▼────────────────────────┐  │
│  │      SERVERLESS FUNCTIONS             │  │
│  │  - Page rendering (RSC)               │  │
│  │  - API route handlers                 │  │
│  │  - Middleware (auth, redirects)        │  │
│  └──────────────┬────────────────────────┘  │
│                 │                            │
└─────────────────┼───────────────────────────┘
                  │
         ┌────────▼────────┐
         │   NEON POSTGRES  │
         │   (Serverless)   │
         │                  │
         │  Connection pool │
         │  branching       │
         │  auto-scaling    │
         └─────────────────┘
```

### Why Vercel + Neon

- **Vercel**: Native Next.js optimization, automatic preview deployments per PR, zero-config deployment, edge functions
- **Neon**: Serverless PostgreSQL with auto-scaling, branching for development, free tier sufficient for small projects
- Both platforms offer generous free tiers ideal for getting started

### Build Pipeline

```
git push → Vercel detects Next.js → Install deps →
Prisma generate → Next.js build → Deploy to edge → Ready
```

### Environment Configuration

| Environment | Vercel Project | Database |
|------------|----------------|----------|
| Development | Local (`npm run dev`) | Local PostgreSQL or Neon dev branch |
| Preview | Auto-created per PR | Neon preview branch |
| Production | Main project | Neon main branch |
