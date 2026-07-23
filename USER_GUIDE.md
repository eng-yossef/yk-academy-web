# Student User Guide — YK Academy

Everything you need to know to get started, learn effectively, and earn your certificates.

---

## Getting Started

### Creating Your Account

1. Go to [ykacademy.com](https://ykacademy.com)
2. Click **Sign Up** in the top navigation
3. Choose a sign-up method:
   - **Email & Password** — Enter your name, email, and password
   - **Google** — One-click sign up with your Google account
   - **GitHub** — Sign up with your GitHub account
4. Verify your email if using email/password sign-up
5. You're redirected to your student dashboard

### Signing In

1. Go to [ykacademy.com/auth/signin](https://ykacademy.com/auth/signin)
2. Enter your email and password, or click the Google/GitHub button
3. You'll be taken to your dashboard

### First-Time Experience

After your first sign-in, your dashboard shows:
- **Enrolled Courses** — Empty (browse courses to get started!)
- **Stats** — All zeros until you enroll
- **Recent Courses** — Will populate as you learn
- **Notifications** — Welcome messages and platform updates

---

## Browsing & Enrolling in Courses

### Browsing the Course Catalog

1. Click **Courses** in the main navigation
2. Browse the catalog by:
   - **Category** — Programming, AI & Data Science, Web Development, Mobile Development
   - **Level** — Beginner, Intermediate, Advanced
   - **Price** — Free or paid courses
   - **Search** — Search by course title or description

### Course Details Page

Click any course card to see:

| Section | Description |
|---------|-------------|
| **Overview** | Course description, learning outcomes, requirements |
| **Curriculum** | List of modules and lessons with durations |
| **Instructor** | About the course instructor |
| **Reviews** | Student ratings and comments |
| **Pricing** | Price, discount price, and enrollment button |

### Enrolling in a Course

#### Free Courses

1. Click **Enroll for Free**
2. You're instantly enrolled
3. Click **Start Learning** to begin

#### Paid Courses

1. Click **Enroll Now**
2. Review the price and any applicable discount
3. Choose a payment method:
   - Credit/Debit Card (Stripe)
   - Vodafone Cash
   - InstaPay
   - Fawry
   - Bank Transfer
4. Complete the payment
5. You're enrolled and redirected to the course

#### Using a Discount Code

1. On the enrollment/checkout page, find the **Discount Code** field
2. Enter your code (e.g., `SUMMER2026`)
3. Click **Apply**
4. The discount is reflected in the total price

---

## The Learning Experience

### Your Course Dashboard

After enrolling, access your courses from:

**Student Dashboard → My Enrollments** (`/student/courses`)

Each enrolled course shows:
- **Title & Thumbnail**
- **Instructor Name**
- **Category**
- **Progress Bar** — Percentage of completed lessons
- **Status** — Active, Completed
- **Continue Button** — Jump back to where you left off

### Course Player

Click **Continue** or **Start Learning** to enter the course player.

#### Layout

| Area | Description |
|------|-------------|
| **Sidebar** | Module/lesson tree with completion checkmarks |
| **Main Area** | Lesson content (video, text, resources) |
| **Progress** | Current lesson and overall progress |
| **Navigation** | Previous/Next lesson buttons |

#### Modules & Lessons

Courses are organized hierarchically:

```
Course
├── Module 1: Getting Started
│   ├── Lesson 1.1: Introduction (video + text)
│   ├── Lesson 1.2: Setup Guide (video)
│   └── Lesson 1.3: First Project (video + resources)
├── Module 2: Core Concepts
│   ├── Lesson 2.1: ...
│   └── Lesson 2.2: ...
└── Module 3: Advanced Topics
    └── ...
```

#### Lesson Types

| Type | What You Get |
|------|-------------|
| **Video Lesson** | Watch the instructor's video tutorial |
| **Text Lesson** | Read written content with code examples |
| **Mixed** | Video + text + downloadable resources |
| **Free Preview** | Available without enrollment (look for the "Free" badge) |

#### Tracking Progress

Progress is tracked automatically:

- **Not Started** — Lesson hasn't been opened
- **In Progress** — Lesson has been opened but not completed
- **Completed** — Lesson is marked as done

To mark a lesson complete:
1. Watch the video / read the content fully
2. Click **Mark as Complete** button
3. Your progress updates in real-time
4. The overall course progress bar recalculates

### Bookmarks

Save important lessons for quick access:

1. While viewing a lesson, click the **Bookmark** icon
2. Access your bookmarks from **Student Dashboard → Bookmarks**
3. Remove bookmarks by clicking the icon again

### Downloads

Downloadable resources (PDFs, code files, slides) are available:

1. Navigate to the lesson with resources
2. Click the resource name under **Materials**
3. The file downloads to your device

---

## Assignments & Grades

### Viewing Assignments

Navigate to **Student Dashboard → Assignments** (`/student/assignments`).

Your assignments list shows:
- **Assignment Title**
- **Course Name**
- **Type** — Homework, Quiz, Exam, or Project
- **Due Date**
- **Status** — Not Submitted, Submitted, Graded, Late

### Submitting an Assignment

1. Click on an assignment
2. Review the instructions and requirements
3. Prepare your submission:
   - **Text submissions** — Type your answer in the text area
   - **File submissions** — Upload a file (PDF, DOCX, or ZIP)
4. Click **Submit**

**Important:**
- You can re-submit before the due date (replaces your previous submission)
- Late submissions are marked as `LATE` if the due date has passed
- Some assignments may have attempt limits

### Viewing Grades

Navigate to **Student Dashboard → Grades** (`/student/grades`).

Your grade book shows:
- **Course** name
- **Assignment** name
- **Score** (e.g., 85/100)
- **Percentage** (85%)
- **Letter Grade** (if applicable)
- **Feedback** from the instructor
- **Date** graded

---

## Certificates

### Earning a Certificate

Certificates are automatically issued when you:

1. **Complete 100% of course lessons**
2. **Pass all required assignments** (if applicable)
3. The system generates a unique certificate number

### Viewing Your Certificates

Navigate to **Student Dashboard → Certificates** (`/student/certificates`).

Each certificate shows:
- **Certificate Number** — Unique identifier (e.g., `YK-2026-00123`)
- **Course Name** — The completed course
- **Issued Date** — When the certificate was earned
- **PDF Download** — Download a printable PDF

### Certificate Verification

Each certificate has a unique verification URL. Employers or third parties can verify your certificate by visiting the URL.

---

## Attendance

Navigate to **Student Dashboard → Attendance** (`/student/attendance`).

### Calendar View

Your attendance is displayed in a calendar format:

| Color | Status |
|-------|--------|
| Green | Present |
| Red | Absent |
| Yellow | Late |
| Gray | Excused |

### Viewing Details

Click on any date to see:
- Status for each enrolled course
- Any notes from the instructor

---

## Notifications

Navigate to **Student Dashboard → Notifications** (`/student/notifications`).

### Notification Types

| Type | Description |
|------|-------------|
| **INFO** | General information |
| **SUCCESS** | Positive events (certificate earned, grade posted) |
| **WARNING** | Upcoming deadlines, low progress |
| **ERROR** | Issues requiring attention |
| **COURSE** | Course updates, new lessons |
| **ASSIGNMENT** | Assignment due dates, grading |
| **PAYMENT** | Payment confirmations |
| **SYSTEM** | Platform announcements |

### Managing Notifications

- **Mark as Read** — Click the notification to mark it as read
- **Delete** — Swipe or click delete (if available)
- **Unread Count** — Shown as a badge on the bell icon in the header

---

## Profile Management

Navigate to **Student Dashboard → Profile** (`/student/profile`).

### Viewing Your Profile

Your profile shows:
- **Name**
- **Email**
- **Phone** (if set)
- **Profile Picture**
- **Role** (Student)
- **Member Since** date

### Editing Your Profile

1. Click **Edit Profile**
2. Update your information:

| Field | Description |
|-------|-------------|
| **Name** | Your display name |
| **Email** | Your email (may require verification to change) |
| **Phone** | Optional phone number |
| **Bio** | Short bio (max 500 characters) |
| **Profile Picture** | Upload or set a URL |

3. Click **Save**

### Changing Your Password

1. Go to **Settings**
2. Enter your current password
3. Enter and confirm your new password
4. Click **Update Password**

---

## Notifications & Communication

### In-App Notifications

All important events generate in-app notifications:
- New enrollment confirmation
- Payment receipt
- Assignment graded
- New course materials
- Certificate issued
- Upcoming deadlines

### Direct Messages

You may receive direct messages from instructors or admins:

1. Check the message icon in the header
2. Read the message
3. Reply if needed

---

## Tips for Success

### Learning Effectively

1. **Set a schedule** — Dedicate regular time slots for learning
2. **Follow the curriculum order** — Modules are designed to build on each other
3. **Complete all lessons** — Don't skip; even review lessons reinforce knowledge
4. **Practice hands-on** — Code along with the instructor
5. **Take notes** — Write down key concepts and patterns
6. **Ask questions** — Use course discussions or message your instructor

### Staying on Track

1. **Check your dashboard daily** — See upcoming assignments and deadlines
2. **Use bookmarks** — Save lessons you want to revisit
3. **Track progress** — Watch your progress bar grow as motivation
4. **Set reminders** — For assignment due dates

### Getting Help

1. **FAQ** — Check the [FAQ page](https://ykacademy.com/faq) for common questions
2. **Contact Form** — Use the [Contact page](https://ykacademy.com/contact) for support
3. **Instructor Messages** — Message your course instructor directly
4. **Community** — Join the student community (if available)

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/pause video |
| `→` | Next lesson |
| `←` | Previous lesson |
| `F` | Toggle fullscreen (video) |
| `M` | Mute/unmute (video) |

---

## Frequently Asked Questions

**Can I access courses on mobile?**
Yes. The platform is fully responsive and works on any device with a web browser.

**Can I download videos for offline viewing?**
Video downloads are not currently available. You need an internet connection to stream.

**What happens if I don't finish a course?**
Your progress is saved. You can return anytime and continue from where you left off.

**Can I enroll in multiple courses?**
Yes! There's no limit on the number of courses you can enroll in.

**How long do I have access to a course?**
Lifetime access. Once enrolled, you can access the course materials forever, including future updates.

**Can I get a refund?**
Contact support within 30 days of enrollment for a full refund (paid courses only).

**How do I update my email address?**
Go to Profile → Edit Profile → change your email → verify the new email.
