# Database — YK Academy

Complete database documentation covering schema design, relationships, queries, migrations, and performance.

---

## Provider

- **Engine:** PostgreSQL
- **Recommended Hosts:** [Neon](https://neon.tech) (serverless, free tier), [Supabase](https://supabase.com) (free tier)
- **ORM:** Prisma 7
- **Schema file:** `prisma/schema.prisma`

---

## ORM: Prisma

Prisma provides type-safe database access with auto-generated TypeScript types.

### Client Setup (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from "@prisma/client";

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

export default prisma;
```

The singleton pattern prevents connection pool exhaustion in serverless environments (Vercel).

---

## Schema Overview

The schema defines **25+ models** across 12 domains with **18 enums**.

### Enums

| Enum | Values |
|------|--------|
| `Role` | STUDENT, PARENT, TEACHER, ASSISTANT, CONTENT_EDITOR, MODERATOR, ADMIN, SUPER_ADMIN |
| `CourseLevel` | BEGINNER, INTERMEDIATE, ADVANCED |
| `EnrollmentStatus` | PENDING, ACTIVE, COMPLETED, SUSPENDED, CANCELLED |
| `LessonProgressStatus` | NOT_STARTED, IN_PROGRESS, COMPLETED |
| `AssignmentType` | HOMEWORK, QUIZ, EXAM, PROJECT |
| `SubmissionStatus` | SUBMITTED, GRADED, RETURNED, LATE |
| `AttendanceStatus` | PRESENT, ABSENT, LATE, EXCUSED |
| `BlogStatus` | DRAFT, PUBLISHED, ARCHIVED |
| `PaymentMethod` | STRIPE, PAYMOB, FAWRY, VODAFONE_CASH, INSTAPAY, BANK_TRANSFER |
| `PaymentStatus` | PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED |
| `NotificationType` | INFO, SUCCESS, WARNING, ERROR, COURSE, ASSIGNMENT, PAYMENT, SYSTEM |
| `SettingType` | STRING, NUMBER, BOOLEAN, JSON, TEXT |
| `ContactStatus` | UNREAD, READ, REPLIED, ARCHIVED |
| `DiscountType` | PERCENTAGE, FIXED |
| `InvoiceStatus` | PENDING, PAID, OVERDUE, CANCELLED |

### Models by Domain

#### Auth

| Model | Description |
|-------|-------------|
| `User` | Central user model with role, profile, soft-delete |
| `Account` | OAuth provider accounts (Google, GitHub) |
| `Session` | Active user sessions |
| `VerificationToken` | Email verification / password reset tokens |

#### Courses

| Model | Description |
|-------|-------------|
| `CourseCategory` | Course grouping (e.g., Programming, AI) |
| `Course` | Full course with pricing, metadata, tags |
| `Module` | Course section/chapter |
| `Lesson` | Individual lesson with content, video, duration |

#### Enrollment & Progress

| Model | Description |
|-------|-------------|
| `Enrollment` | Student-course enrollment with status and progress |
| `LessonProgress` | Per-lesson progress tracking |

#### Assignments & Grades

| Model | Description |
|-------|-------------|
| `Assignment` | Homework, quiz, exam, or project |
| `AssignmentSubmission` | Student submission with file, grade, feedback |
| `Grade` | Score record for a student in a course |
| `Attendance` | Daily attendance record |

#### Certificates & Reviews

| Model | Description |
|-------|-------------|
| `Certificate` | Issued certificate with unique number and PDF URL |
| `Review` | Student course review with rating (1-5) |

#### Blog

| Model | Description |
|-------|-------------|
| `BlogPost` | Blog article with SEO, tags, status, view count |
| `BlogComment` | Nested comments (self-referencing replies) |

#### FAQ & Testimonials

| Model | Description |
|-------|-------------|
| `FAQ` | Frequently asked question |
| `Testimonial` | Student testimonial with optional rating |

#### Payments & Invoices

| Model | Description |
|-------|-------------|
| `Payment` | Payment record with method, amount, status |
| `Invoice` | Formal invoice linked to a payment |
| `DiscountCode` | Coupon code (percentage or fixed amount) |

#### Messaging & Notifications

| Model | Description |
|-------|-------------|
| `Notification` | System/user notification |
| `Message` | Direct message between users |
| `ContactMessage` | Contact form submission |
| `Subscriber` | Newsletter subscriber |

#### Resources & Bookmarks

| Model | Description |
|-------|-------------|
| `Resource` | Downloadable file attached to a course/lesson |
| `Bookmark` | Student lesson bookmark |

#### Settings & Content

| Model | Description |
|-------|-------------|
| `SiteSetting` | Key-value site configuration |
| `PageContent` | CMS-like page section content |
| `MediaLibrary` | Uploaded file metadata |

#### Activity Logs

| Model | Description |
|-------|-------------|
| `ActivityLog` | Audit trail for admin/user actions |

---

## Key Relationships

```
┌───────────┐     1:N     ┌──────────────┐     N:1     ┌──────────┐
│   User    │────────────▶│  Enrollment  │◀────────────│  Course  │
└─────┬─────┘             └──────┬───────┘             └────┬─────┘
      │                          │                          │
      │ 1:N                     │ 1:N                     │ 1:N
      ▼                         ▼                          ▼
┌──────────────┐     N:1    ┌──────────────┐         ┌──────────┐
│  Notification│             │   Payment    │         │  Module  │
└──────────────┘             └──────┬───────┘         └────┬─────┘
                                    │ 1:1                  │ 1:N
                                    ▼                      ▼
                              ┌──────────┐           ┌──────────┐
                              │ Invoice  │           │  Lesson  │
                              └──────────┘           └────┬─────┘
                                                         │ 1:N
                           ┌─────────────────────────────┤
                           │                             │
                           ▼                             ▼
                    ┌──────────────┐             ┌──────────────┐
                    │   Resource   │             │   Bookmark   │
                    └──────────────┘             └──────────────┘
```

### Important Unique Constraints

| Model | Unique Fields |
|-------|---------------|
| `User` | `email` |
| `Account` | `(provider, providerAccountId)` |
| `Session` | `sessionToken` |
| `CourseCategory` | `slug` |
| `Course` | `slug` |
| `Enrollment` | `(userId, courseId)` — one enrollment per user per course |
| `LessonProgress` | `(userId, lessonId)` |
| `AssignmentSubmission` | `(assignmentId, studentId)` |
| `Review` | `(userId, courseId)` — one review per user per course |
| `BlogPost` | `slug` |
| `Bookmark` | `(userId, lessonId)` |
| `Invoice` | `invoiceNumber`, `paymentId` |
| `SiteSetting` | `key` |
| `Subscriber` | `email` |
| `DiscountCode` | `code` |
| `Certificate` | `certificateNumber` |
| `Attendance` | `(userId, courseId, date)` |

---

## Important Queries

### Fetch Enrolled Courses with Progress

```typescript
const enrollments = await prisma.enrollment.findMany({
  where: { userId: session.user.id },
  include: {
    course: {
      include: {
        category: true,
        instructor: { select: { name: true } },
        modules: {
          include: {
            lessons: { select: { id: true } },
          },
        },
      },
    },
    progressRecords: {
      select: { lessonId: true, status: true },
    },
  },
  orderBy: { enrolledAt: "desc" },
});
```

### Update Lesson Progress and Recalculate Course Progress

```typescript
// Upsert lesson progress
await prisma.lessonProgress.upsert({
  where: {
    userId_lessonId: { userId, lessonId },
  },
  update: { status: "COMPLETED", progress: 100, completedAt: new Date() },
  create: { userId, lessonId, enrollmentId, status: "COMPLETED", progress: 100 },
});

// Recalculate course progress
const totalLessons = await prisma.lesson.count({
  where: { module: { courseId } },
});
const completedLessons = await prisma.lessonProgress.count({
  where: {
    userId,
    status: "COMPLETED",
    lesson: { module: { courseId } },
  },
});
const courseProgress = Math.round((completedLessons / totalLessons) * 100);

// Update enrollment
await prisma.enrollment.update({
  where: { id: enrollmentId },
  data: {
    progress: courseProgress,
    status: courseProgress === 100 ? "COMPLETED" : enrollment.status,
    completedAt: courseProgress === 100 ? new Date() : null,
  },
});
```

### Admin Dashboard Stats

```typescript
const [totalUsers, totalCourses, totalEnrollments, revenueResult] =
  await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.course.count({ where: { deletedAt: null } }),
    prisma.enrollment.count(),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);
```

### Search Enrollments with Filters

```typescript
const enrollments = await prisma.enrollment.findMany({
  where: {
    ...(status && { status }),
    ...(courseId && { courseId }),
    ...(search && {
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { course: { title: { contains: search, mode: "insensitive" } } },
      ],
    }),
  },
  include: {
    user: { select: { id: true, name: true, email: true } },
    course: { select: { id: true, title: true, price: true } },
    payments: { select: { id: true, amount: true, status: true }, take: 1 },
  },
  orderBy: { enrolledAt: "desc" },
});
```

---

## Migration Guide

### Making Schema Changes

1. Edit `prisma/schema.prisma`
2. Generate the client:

```bash
npx prisma generate
```

3. Push changes to the database:

```bash
npx prisma db push
```

4. If you need a migration history:

```bash
npx prisma migrate dev --name descriptive_migration_name
```

### Production Migrations

For production deployments, use `migrate deploy`:

```bash
npx prisma migrate deploy
```

This runs pending migrations without generating new ones. In Vercel, add this to your **Build Command**:

```bash
npx prisma generate && npx prisma migrate deploy && next build
```

### Safe Migration Practices

- **Never drop columns** in production without a code deployment first
- **Add columns with defaults** or as nullable to avoid breaking existing rows
- **Use `@@index`** for any new foreign keys or frequently queried columns
- **Test migrations** on a staging database (Neon branching is ideal)

---

## Seeding Guide

The seed script populates the database with initial data for development.

### Running the Seed

```bash
npx prisma db seed
```

### What the Seed Creates

- An admin user (`admin@ykacademy.com`)
- Sample course categories
- Sample courses with modules and lessons
- Sample student users
- Sample enrollments, reviews, and blog posts

### Custom Seed Script

Edit `prisma/seed.ts` to customize your seed data:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@ykacademy.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ykacademy.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Configure the seed command in `package.json`:

```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

---

## Backup Procedures

### Neon (Automatic)

Neon provides:
- **Point-in-time recovery** (paid plans)
- **Daily automatic backups** (paid plans)
- **Branch-based snapshots** (all plans)

### Manual Backup

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
psql $DATABASE_URL < backup_20260723.sql
```

### Recommended Schedule

| Environment | Backup Frequency |
|------------|-----------------|
| Production | Daily automatic (Neon) + weekly manual export |
| Staging | On-demand before major changes |
| Development | Not needed (re-seed) |

---

## Performance Tips

### Indexes

The schema includes indexes on all high-traffic query paths:

```prisma
// User lookups
@@index([email])
@@index([role])
@@index([isActive])
@@index([deletedAt])

// Course filtering
@@index([slug])
@@index([categoryId])
@@index([instructorId])
@@index([isPublished])
@@index([isFeatured])
@@index([level])
@@index([deletedAt])

// Enrollment queries
@@unique([userId, courseId])
@@index([userId])
@@index([courseId])
@@index([status])

// Progress tracking
@@unique([userId, lessonId])
@@index([enrollmentId])

// Payment reporting
@@index([userId])
@@index([status])
@@index([transactionId])
@@index([createdAt])

// Blog SEO
@@index([slug])
@@index([status])
@@index([publishedAt])

// Notifications
@@index([userId])
@@index([isRead])
@@index([type])
@@index([createdAt])
```

### Query Optimization Tips

1. **Use `select`** to fetch only needed fields:

```typescript
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true, role: true },
});
```

2. **Use `take`** for pagination:

```typescript
const recentEnrollments = await prisma.enrollment.findMany({
  take: 50,
  orderBy: { enrolledAt: "desc" },
});
```

3. **Use `Promise.all`** for independent queries:

```typescript
const [users, courses, revenue] = await Promise.all([
  prisma.user.count(),
  prisma.course.count(),
  prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
]);
```

4. **Avoid N+1 queries** — use `include` to eagerly load relations:

```typescript
const courses = await prisma.course.findMany({
  include: {
    category: { select: { name: true } },
    instructor: { select: { name: true } },
    _count: { select: { enrollments: true } },
  },
});
```

5. **Use connection pooling** — Neon and Supabase provide built-in connection pooling. No additional configuration needed.

6. **Monitor slow queries** — enable Prisma query logging in development:

```typescript
new PrismaClient({ log: ["query"] })
```

### Database Size Considerations

| Table | Expected Growth | Notes |
|-------|----------------|-------|
| `User` | Low-Medium | One row per user |
| `Enrollment` | Medium | One per user-course pair |
| `LessonProgress` | High | One per user-lesson pair |
| `ActivityLog` | Very High | Consider periodic cleanup |
| `Notification` | High | Consider archiving old notifications |
| `BlogPost` | Low | Content-heavy but few rows |
| `Payment` | Medium | Grows with enrollments |
