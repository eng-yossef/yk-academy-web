# API Documentation — YK Academy

Complete reference for all API endpoints, request/response formats, and error handling.

---

## Base URL

| Environment | URL |
|------------|-----|
| Development | `http://localhost:3000` |
| Production | `https://ykacademy.com` |

---

## Response Format

All API endpoints return JSON with a consistent envelope:

### Success

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error description"
}
```

### Paginated

```json
{
  "success": true,
  "data": [ ... ],
  "total": 150,
  "page": 1,
  "pageSize": 12,
  "totalPages": 13
}
```

---

## Authentication

### NextAuth Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signin` | GET/POST | Sign in page / credential handler |
| `/api/auth/signup` | GET/POST | Sign up page / registration handler |
| `/api/auth/signout` | POST | Sign out |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/csrf` | GET | Get CSRF token |
| `/api/auth/callback/:provider` | GET | OAuth callback (google, github) |

### Sign In (Credentials)

**POST** `/api/auth/signin/credentials`

```
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=secret123&csrfToken=xxx
```

**Response:** Redirects to the page the user came from, or returns session data.

### Get Session

**GET** `/api/auth/session`

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Ahmed",
    "email": "ahmed@example.com",
    "image": null,
    "role": "STUDENT"
  },
  "expires": "2026-08-23T00:00:00.000Z"
}
```

---

## Public APIs

### Contact Form

**POST** `/api/contact`

Submit a contact message. No authentication required.

**Request:**

```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "+201234567890",
  "subject": "Question about React course",
  "message": "I want to know if the course covers React 19 features."
}
```

**Validation:**
| Field | Rules |
|-------|-------|
| `name` | Required, min 2 characters |
| `email` | Required, valid email |
| `phone` | Optional |
| `subject` | Required, min 3 characters |
| `message` | Required, min 10 characters |

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "status": "UNREAD",
    "createdAt": "2026-07-23T10:00:00.000Z"
  },
  "message": "Your message has been sent successfully. We'll get back to you soon."
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Name is required, Message must be at least 10 characters"
}
```

---

### Newsletter Subscription

**POST** `/api/newsletter`

Subscribe to the newsletter. No authentication required.

**Request:**

```json
{
  "email": "ahmed@example.com",
  "name": "Ahmed Ali"
}
```

**Validation:**
| Field | Rules |
|-------|-------|
| `email` | Required, valid email |
| `name` | Optional |

**Success Response (201):**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Thank you for subscribing to our newsletter!"
}
```

**Already Subscribed (409):**

```json
{
  "success": false,
  "error": "Already subscribed",
  "message": "You are already subscribed to our newsletter."
}
```

**Reactivated (200):**

```json
{
  "success": true,
  "message": "Welcome back! Your subscription has been reactivated."
}
```

---

## Student APIs

All student APIs require authentication. The user must have the `STUDENT`, `ADMIN`, or `SUPER_ADMIN` role.

### Get Enrolled Courses

**GET** `/api/student/courses`

Returns all courses the authenticated student is enrolled in, with progress data.

**Headers:**

```
Cookie: next-auth.session-token=xxx
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "course-uuid",
      "title": "Advanced React Patterns",
      "thumbnail": "/images/courses/react.jpg",
      "category": "Web Development",
      "instructor": "Omar Hassan",
      "progress": 72,
      "status": "ACTIVE",
      "lastAccessed": "2026-07-22T14:30:00.000Z",
      "totalLessons": 24,
      "completedLessons": 17
    }
  ]
}
```

---

### Update Lesson Progress

**POST** `/api/student/progress`

Track progress for a specific lesson. Automatically recalculates course-level progress.

**Request:**

```json
{
  "lessonId": "lesson-uuid",
  "courseId": "course-uuid",
  "status": "COMPLETED",
  "progress": 100
}
```

**Fields:**
| Field | Required | Values |
|-------|----------|--------|
| `lessonId` | Yes | UUID of the lesson |
| `courseId` | Yes | UUID of the course |
| `status` | Yes | `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED` |
| `progress` | No | 0-100 (defaults to 100 if status is COMPLETED) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "progressRecord": {
      "id": "uuid",
      "status": "COMPLETED",
      "progress": 100,
      "completedAt": "2026-07-23T10:00:00.000Z"
    },
    "courseProgress": 71,
    "completedLessons": 17,
    "totalLessons": 24
  }
}
```

**Error (403):**

```json
{
  "success": false,
  "error": "Not enrolled in this course"
}
```

---

### Get Lesson Progress

**GET** `/api/student/progress?courseId=xxx` or `/api/student/progress?lessonId=xxx`

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `courseId` | Get all progress records for a course |
| `lessonId` | Get progress for a specific lesson |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "COMPLETED",
      "progress": 100,
      "lesson": {
        "id": "lesson-uuid",
        "title": "Custom Hooks Deep Dive",
        "moduleId": "module-uuid"
      }
    }
  ]
}
```

---

### Submit Assignment

**POST** `/api/student/assignments/[id]/submit`

Submit an assignment. Supports text content and file uploads.

**Request:**

```
Content-Type: multipart/form-data

content=My solution involves using React hooks...
file=@submission.pdf
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | No | Text-based submission content |
| `file` | file | No | File attachment (PDF, DOCX, ZIP) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "submission-uuid",
    "content": "My solution involves using React hooks...",
    "fileUrl": "/uploads/submissions/user-assignment-uuid.pdf",
    "status": "SUBMITTED",
    "submittedAt": "2026-07-23T10:00:00.000Z"
  }
}
```

**Re-submission (200):** If a submission already exists, it is updated.

**Error (403):**

```json
{
  "success": false,
  "error": "Not enrolled in this course"
}
```

---

## Admin APIs

All admin APIs require authentication with `ADMIN` or `SUPER_ADMIN` role.

---

### Dashboard Stats

**GET** `/api/admin/stats`

Returns aggregated statistics for the admin dashboard.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1284,
    "totalCourses": 24,
    "totalEnrollments": 3420,
    "totalRevenue": 328400,
    "newUsersThisMonth": 89,
    "enrollmentsThisMonth": 160,
    "revenueThisMonth": 45800,
    "publishedCourses": 20,
    "pendingReviews": 5,
    "activeStudents": 342,
    "completionRate": 67
  }
}
```

---

### Courses

#### List Courses

**GET** `/api/admin/courses?search=react&status=published`

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `search` | Search by title or description (case-insensitive) |
| `status` | Filter by `published` or `draft` |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "React Masterclass",
      "slug": "react-masterclass",
      "description": "Complete React course...",
      "level": "INTERMEDIATE",
      "price": 49.99,
      "discountPrice": 29.99,
      "isPublished": true,
      "isFeatured": true,
      "tags": ["react", "javascript"],
      "image": "/images/courses/react.jpg",
      "enrolledCount": 1250,
      "rating": 4.9,
      "category": { "id": "uuid", "name": "Web Development" },
      "instructor": { "id": "uuid", "name": "Omar Hassan" },
      "students": 1250
    }
  ]
}
```

#### Create Course

**POST** `/api/admin/courses`

**Request:**

```json
{
  "title": "New Course",
  "description": "Course description here...",
  "shortDescription": "Short description",
  "level": "BEGINNER",
  "categoryId": "category-uuid",
  "price": 39.99,
  "discountPrice": 19.99,
  "tags": ["new", "course"],
  "isPublished": false,
  "instructorId": "instructor-uuid"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "title": "New Course",
    "slug": "new-course",
    "createdAt": "2026-07-23T10:00:00.000Z"
  }
}
```

#### Get Course Detail

**GET** `/api/admin/courses/[id]`

Returns full course data including modules, lessons, and recent enrollments.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "React Masterclass",
    "modules": [
      {
        "id": "module-uuid",
        "title": "Getting Started",
        "order": 1,
        "lessons": [
          {
            "id": "lesson-uuid",
            "title": "Introduction to React",
            "order": 1,
            "duration": 600,
            "isPublished": true
          }
        ]
      }
    ],
    "enrollments": [
      {
        "id": "enrollment-uuid",
        "user": { "id": "uuid", "name": "Ahmed", "email": "ahmed@example.com" },
        "status": "ACTIVE",
        "progress": 45
      }
    ]
  }
}
```

#### Update Course

**PUT** `/api/admin/courses/[id]`

**Request:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "level": "ADVANCED",
  "price": 59.99,
  "isPublished": true,
  "isFeatured": true,
  "categoryId": "category-uuid"
}
```

#### Delete Course (Soft)

**DELETE** `/api/admin/courses/[id]`

Sets `deletedAt` timestamp. The course is hidden from all queries but not permanently removed.

**Success Response (200):**

```json
{ "success": true }
```

---

### Users

#### List Users

**GET** `/api/admin/users?search=ahmed&role=STUDENT`

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `search` | Search by name or email (case-insensitive) |
| `role` | Filter by role (STUDENT, ADMIN, etc.) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ahmed Ali",
      "email": "ahmed@example.com",
      "role": "STUDENT",
      "isActive": true,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "phone": "+201234567890"
    }
  ]
}
```

#### Create User

**POST** `/api/admin/users`

**Request:**

```json
{
  "name": "New Student",
  "email": "student@example.com",
  "password": "securePassword123",
  "role": "STUDENT"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "New Student",
    "email": "student@example.com",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2026-07-23T10:00:00.000Z"
  }
}
```

**Error (400):**

```json
{
  "success": false,
  "error": "Email already exists"
}
```

#### Get User Detail

**GET** `/api/admin/users/[id]`

#### Update User

**PUT** `/api/admin/users/[id]`

**Request:**

```json
{
  "role": "ADMIN",
  "name": "Updated Name",
  "phone": "+201987654321",
  "isActive": false
}
```

#### Delete User (Soft — SUPER_ADMIN only)

**DELETE** `/api/admin/users/[id]`

Only `SUPER_ADMIN` role can delete users. Sets `deletedAt` timestamp.

---

### Enrollments

#### List Enrollments

**GET** `/api/admin/enrollments?search=ahmed&status=ACTIVE&courseId=xxx&from=2026-01-01&to=2026-07-31`

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `search` | Search by student name, email, or course title |
| `status` | Filter: PENDING, ACTIVE, COMPLETED, SUSPENDED, CANCELLED |
| `courseId` | Filter by course UUID |
| `from` | Start date (ISO format) |
| `to` | End date (ISO format) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-uuid",
      "status": "ACTIVE",
      "progress": 68,
      "enrolledAt": "2026-03-15T10:00:00.000Z",
      "user": { "id": "uuid", "name": "Ahmed Ali", "email": "ahmed@example.com" },
      "course": { "id": "uuid", "title": "React Masterclass", "price": 49.99 },
      "payment": { "id": "uuid", "amount": 49.99, "status": "COMPLETED" }
    }
  ]
}
```

#### Update Enrollment Status

**PUT** `/api/admin/enrollments`

**Request:**

```json
{
  "id": "enrollment-uuid",
  "status": "COMPLETED"
}
```

---

### Payments

#### List Payments

**GET** `/api/admin/payments?search=ahmed&status=COMPLETED&method=STRIPE&from=2026-01-01&to=2026-12-31`

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `search` | Search by user name, email, or invoice number |
| `status` | Filter: PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED |
| `method` | Filter: STRIPE, PAYMOB, FAWRY, VODAFONE_CASH, INSTAPAY, BANK_TRANSFER |
| `from` | Start date |
| `to` | End date |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "payment-uuid",
      "amount": 49.99,
      "currency": "EGP",
      "method": "STRIPE",
      "status": "COMPLETED",
      "transactionId": "txn_xxx",
      "invoiceNumber": "INV-2026-001",
      "createdAt": "2026-03-15T10:00:00.000Z",
      "user": { "id": "uuid", "name": "Ahmed Ali", "email": "ahmed@example.com" },
      "enrollment": {
        "course": { "title": "React Masterclass" }
      }
    }
  ]
}
```

---

### Blog Posts

#### List Blog Posts

**GET** `/api/admin/blog?search=react&status=PUBLISHED`

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `search` | Search by title or content |
| `status` | Filter: DRAFT, PUBLISHED, ARCHIVED |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "React 19 New Features",
      "slug": "react-19-new-features",
      "status": "PUBLISHED",
      "publishedAt": "2026-07-20T10:00:00.000Z",
      "views": 342,
      "tags": ["react", "javascript"],
      "author": { "name": "Admin" },
      "createdAt": "2026-07-20T10:00:00.000Z"
    }
  ]
}
```

#### Create Blog Post

**POST** `/api/admin/blog`

Allowed roles: `ADMIN`, `SUPER_ADMIN`, `CONTENT_EDITOR`.

**Request:**

```json
{
  "title": "Getting Started with Next.js 16",
  "content": "Full article content in markdown or HTML...",
  "excerpt": "A beginner's guide to Next.js 16",
  "coverImage": "/images/blog/nextjs16.jpg",
  "category": "Tutorial",
  "tags": ["nextjs", "react", "tutorial"],
  "status": "DRAFT",
  "seoTitle": "Getting Started with Next.js 16 | YK Academy",
  "seoDescription": "Learn the basics of Next.js 16...",
  "seoKeywords": ["nextjs 16", "react tutorial", "web development"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Getting Started with Next.js 16",
    "slug": "getting-started-with-nextjs-16",
    "status": "DRAFT"
  }
}
```

---

### Site Settings

#### Get All Settings

**GET** `/api/admin/settings`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "siteName": "YK Academy",
    "contactEmail": "info@ykacademy.com",
    "currency": "EGP",
    "maintenanceMode": "false"
  }
}
```

#### Update Settings

**PUT** `/api/admin/settings`

Accepts a flat key-value object. Each key is upserted.

**Request:**

```json
{
  "siteName": "YK Academy",
  "contactEmail": "info@ykacademy.com",
  "contactPhone": "+201234567890",
  "currency": "EGP",
  "maintenanceMode": "true"
}
```

**Success Response (200):**

```json
{ "success": true }
```

---

### Media Upload

**POST** `/api/admin/media/upload`

Upload a file to the media library.

**Request:**

```
Content-Type: multipart/form-data

file=@image.jpg
folder=courses
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | The file to upload |
| `folder` | string | No | Subfolder (default: `uploads`) |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "1721712000000-a1b2c3.jpg",
    "originalName": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 245000,
    "url": "/uploads/courses/1721712000000-a1b2c3.jpg",
    "folder": "courses",
    "createdAt": "2026-07-23T10:00:00.000Z"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 413 | Payload Too Large |
| 500 | Internal Server Error |

### Validation Errors (400)

Zod validation errors are formatted as comma-separated messages:

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Name is required, Email is invalid"
}
```

### Authentication Errors (401)

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Authorization Errors (401/403)

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Not Found Errors (404)

```json
{
  "success": false,
  "error": "User not found"
}
```

### Server Errors (500)

```json
{
  "success": false,
  "error": "Failed to fetch courses",
  "message": "Something went wrong. Please try again later."
}
```

---

## Rate Limiting

Currently, no rate limiting is applied at the application level. For production, consider:

- Vercel Edge Middleware rate limiting
- Upstash Redis + `@upstash/ratelimit`
- API gateway rate limiting via Cloudflare

---

## CORS

CORS is handled by Next.js defaults:
- Same-origin requests are allowed
- Cross-origin requests follow the browser's Same-Origin Policy
- No custom CORS headers are configured

For mobile app or third-party API access, add CORS headers in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://your-app.com" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE" },
        ],
      },
    ];
  },
};
```
