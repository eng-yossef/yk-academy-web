# Admin Guide — YK Academy

Complete guide for administrators to manage the YK Academy platform.

---

## Getting Started

### Accessing the Admin Dashboard

1. Navigate to `https://ykacademy.com/admin`
2. Sign in with your admin credentials
3. You'll be redirected to the admin dashboard

### Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@ykacademy.com` |
| Password | `admin123` (change immediately after first login) |

### Roles & Permissions

| Role | Dashboard Access | Can Do |
|------|-----------------|--------|
| **Super Admin** | Full access | Everything, including delete users |
| **Admin** | Full access | Course, user, enrollment, payment, content management |
| **Content Editor** | Blog only | Create and edit blog posts |
| **Moderator** | Reviews, comments | Approve reviews, manage comments |

---

## Dashboard Overview

The admin dashboard provides a real-time overview of the platform.

### Stats Cards

| Card | Description |
|------|-------------|
| **Total Students** | Registered users with STUDENT role |
| **Revenue** | Total completed payment amount |
| **Active Courses** | Published courses |
| **Enrollments This Month** | New enrollments in the current month |
| **Completion Rate** | Percentage of enrollments marked COMPLETED |
| **Pending Tasks** | Items requiring attention (reviews, messages) |

### Charts

- **Revenue Overview** — Line chart showing monthly revenue for the last 12 months
- **Student Enrollments** — Bar chart showing monthly enrollment count

### Recent Activity

A live feed of recent actions:
- New enrollments
- Payments received
- Course publications
- New user registrations
- Assignment submissions
- Course completions

### Quick Actions

Shortcuts to common tasks:
- Create Course
- Manage Users
- View Payments
- Blog Posts
- Discount Codes
- Settings

---

## Managing Courses

Navigate to **Admin → Courses** (`/admin/courses`).

### Course List

The course list shows all courses with:
- Title and description
- Category and instructor
- Enrollment count
- Published status
- Price

**Filters:**
- **Search** — Filter by title or description
- **Status** — Show published, draft, or all

### Creating a Course

1. Click **New Course** button
2. Fill in the required fields:

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | Course title (min 3 characters) |
| **Description** | Yes | Full course description (min 10 characters) |
| **Short Description** | No | Brief summary for cards |
| **Category** | Yes | Select from existing categories |
| **Level** | Yes | BEGINNER, INTERMEDIATE, or ADVANCED |
| **Price** | Yes | Price in EGP (0 for free) |
| **Discount Price** | No | Sale price |
| **Instructor** | No | Assigned to you by default |
| **Tags** | No | Comma-separated tags |
| **Published** | No | Toggle to publish immediately |

3. Click **Create Course**

The slug is automatically generated from the title.

### Editing a Course

1. Click on a course in the list
2. Click **Edit**
3. Modify the fields
4. Click **Save**

### Managing Modules & Lessons

Each course is organized into modules (chapters), and each module contains lessons.

#### Adding a Module

1. Open the course detail page
2. Click **Add Module**
3. Enter the module title and description
4. Set the display order

#### Adding a Lesson

1. Open a module
2. Click **Add Lesson**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Title** | Lesson title |
| **Description** | Brief description |
| **Content** | Lesson content (supports rich text) |
| **Video URL** | Link to hosted video |
| **Duration** | Duration in minutes |
| **Is Free** | Allow non-enrolled users to view |
| **Is Published** | Toggle visibility |

4. Click **Save**

#### Reordering

Drag and drop modules or lessons to reorder them.

### Publishing / Unpublishing

Toggle the **Published** status on any course to make it visible or hidden from the public catalog.

### Deleting a Course

Click **Delete** on a course. This performs a soft-delete (`deletedAt` is set). The course disappears from all public and student views but remains in the database.

---

## Managing Users

Navigate to **Admin → Users** (`/admin/users`).

### User List

Shows all non-deleted users with:
- Name and email
- Role
- Active status
- Registration date
- Phone number

**Filters:**
- **Search** — Filter by name or email
- **Role** — Filter by specific role

### Creating a User

1. Click **Add User**
2. Fill in:

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Full name |
| **Email** | Yes | Must be unique |
| **Password** | Yes | Min 6 characters (hashed with bcrypt) |
| **Role** | No | Defaults to STUDENT |

3. Click **Create**

### Editing a User

1. Click on a user
2. Click **Edit**
3. Modify:
   - **Role** — Change the user's role
   - **Active Status** — Activate or deactivate the account
   - **Name** — Update display name
   - **Phone** — Update phone number
4. Click **Save**

### Deactivating a User

Set **Active Status** to `false`. The user will be unable to sign in.

### Deleting a User

Only **Super Admins** can delete users. This is a soft-delete — the user's record is preserved with a `deletedAt` timestamp for data integrity.

---

## Managing Enrollments

Navigate to **Admin → Enrollments** (`/admin/enrollments`).

### Enrollment List

Shows all enrollments with:
- Student name and email
- Course title
- Enrollment status
- Progress percentage
- Enrollment date
- Payment info

**Filters:**
- **Search** — By student name, email, or course title
- **Status** — PENDING, ACTIVE, COMPLETED, SUSPENDED, CANCELLED
- **Course** — Filter by specific course
- **Date Range** — From/to dates

### Changing Enrollment Status

1. Find the enrollment
2. Click **Edit**
3. Select the new status:

| Status | Meaning |
|--------|---------|
| `PENDING` | Awaiting payment or approval |
| `ACTIVE` | Student has access to course content |
| `COMPLETED` | Student finished the course |
| `SUSPENDED` | Access temporarily revoked |
| `CANCELLED` | Enrollment cancelled |

4. Click **Save**

Setting status to `COMPLETED` automatically sets the `completedAt` timestamp.

---

## Managing Payments

Navigate to **Admin → Payments** (`/admin/payments`).

### Payment List

Shows all payment records with:
- Student name and email
- Amount and currency
- Payment method
- Status
- Invoice number
- Date

**Filters:**
- **Search** — By student name, email, or invoice number
- **Status** — PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED
- **Method** — STRIPE, PAYMOB, FAWRY, VODAFONE_CASH, INSTAPAY, BANK_TRANSFER
- **Date Range** — From/to dates

### Payment Methods

| Method | Description |
|--------|-------------|
| `STRIPE` | Credit/debit card via Stripe |
| `PAYMOB` | Egyptian payment gateway |
| `FAWRY` | Fawry payment network |
| `VODAFONE_CASH` | Vodafone Cash mobile wallet |
| `INSTAPAY` | InstaPay bank transfer |
| `BANK_TRANSFER` | Manual bank transfer |

---

## Managing Blog Content

Navigate to **Admin → Blog** (`/admin/blog`).

### Blog Post List

Shows all blog posts with:
- Title and slug
- Author
- Status (DRAFT, PUBLISHED, ARCHIVED)
- View count
- Tags
- Created date

### Creating a Blog Post

1. Click **New Post**
2. Fill in:

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | Post title (min 3 characters) |
| **Content** | Yes | Full article content (min 50 characters) |
| **Excerpt** | No | Summary for cards (max 300 characters) |
| **Cover Image** | No | Featured image URL |
| **Category** | No | Post category |
| **Tags** | No | Comma-separated tags |
| **Status** | No | DRAFT (default), PUBLISHED, ARCHIVED |

3. **SEO Settings:**
   - **SEO Title** — Custom title tag
   - **SEO Description** — Meta description
   - **SEO Keywords** — Comma-separated keywords

4. Click **Save**

The slug is auto-generated from the title. If a duplicate slug exists, a timestamp suffix is added.

### Publishing a Post

Change the status from `DRAFT` to `PUBLISHED`. The `publishedAt` date is set automatically.

### Managing Comments

Navigate to **Admin → Messages** to view and moderate blog comments. Comments require approval before appearing publicly.

---

## Managing FAQ & Testimonials

### FAQ

Navigate to **Admin → FAQs** (`/admin/faqs`).

| Field | Description |
|-------|-------------|
| **Question** | The FAQ question |
| **Answer** | The answer text |
| **Category** | Optional grouping |
| **Sort Order** | Display order (lower = first) |
| **Active** | Show/hide toggle |

### Testimonials

Navigate to **Admin → Testimonials** (`/admin/testimonials`).

| Field | Description |
|-------|-------------|
| **Name** | Student name |
| **Role** | Job title or description |
| **Content** | Testimonial text |
| **Rating** | 1-5 stars |
| **Featured** | Show on homepage |
| **Active** | Show/hide toggle |

---

## Discount Codes

Navigate to **Admin → Discounts** (`/admin/discounts`).

### Creating a Discount Code

| Field | Description |
|-------|-------------|
| **Code** | Unique code (e.g., `SUMMER2026`) |
| **Type** | `PERCENTAGE` or `FIXED` |
| **Value** | Discount amount (percentage 1-100 or fixed amount) |
| **Minimum Purchase** | Optional minimum order amount |
| **Max Uses** | Optional usage limit |
| **Expires At** | Optional expiration date |
| **Active** | Enable/disable toggle |

---

## Media Library

Navigate to **Admin → Media** (`/admin/media`).

### Uploading Files

1. Click **Upload**
2. Select a file or drag and drop
3. Choose a folder (optional)
4. The file is uploaded and tracked in the database

**Supported Types:**
- Images: JPEG, PNG, WebP, GIF (max 5 MB)
- Videos: MP4, WebM, OGG (max 500 MB)
- Documents: PDF, DOC, DOCX (max 10 MB)

### File Management

- Files are stored in `public/uploads/`
- Each file has metadata: filename, original name, MIME type, size, URL
- Files are organized by folder

---

## Settings

Navigate to **Admin → Settings** (`/admin/site-settings`).

### Available Settings

| Key | Description | Example |
|-----|-------------|---------|
| `siteName` | Platform name | YK Academy |
| `siteDescription` | Platform description | Online learning platform |
| `contactEmail` | Support email | info@ykacademy.com |
| `contactPhone` | Support phone | +201234567890 |
| `address` | Physical address | 123 Education Street |
| `currency` | Default currency | EGP |
| `timezone` | Platform timezone | Africa/Cairo |
| `maintenanceMode` | Pause the site | true/false |

All settings are stored as key-value pairs in the `SiteSetting` table and can be updated in bulk.

---

## Contact Messages

Navigate to **Admin → Messages** (`/admin/messages`).

### Message Inbox

View all contact form submissions:

| Status | Description |
|--------|-------------|
| `UNREAD` | New, not yet viewed |
| `READ` | Viewed but not replied |
| `REPLIED` | Responded to |
| `ARCHIVED` | Old/archived messages |

### Managing Messages

1. Click on a message to view full details
2. Mark as read
3. Reply (external email)
4. Mark as replied
5. Archive old messages

---

## Subscriber Management

Navigate to **Admin → Subscribers** (`/admin/subscribers`).

View all newsletter subscribers with:
- Email address
- Name (if provided)
- Subscription status
- Subscription date

---

## Activity Logs

Navigate to **Admin → Activity** (`/admin/activity`).

The activity log tracks:
- **Action** — What was done (CREATE, UPDATE, DELETE, etc.)
- **Entity** — What was affected (User, Course, etc.)
- **Entity ID** — ID of the affected record
- **Details** — JSON payload with change details
- **IP Address** — Requester's IP
- **User Agent** — Browser info
- **Timestamp** — When the action occurred

This provides a complete audit trail for compliance and debugging.

---

## Tips & Best Practices

### Course Management
- Always set a **Short Description** — it appears on course cards
- Use **Tags** to improve searchability
- Set **Free Preview** on 1-2 lessons per course to attract students
- Publish courses only when all modules and lessons are complete

### User Management
- Change the default admin password immediately
- Use **Deactivate** instead of **Delete** for temporary access revocation
- Regularly review user roles to ensure least-privilege access

### Content Management
- Use **Draft** status to work on blog posts before publishing
- Set SEO fields for every published post
- Keep FAQs organized by category

### Payments
- Check the payment list daily for failed or pending transactions
- Use the date range filter for monthly reporting
- Export payment data for accounting reconciliation
