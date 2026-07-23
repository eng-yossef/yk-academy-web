export const APP_NAME = "YK Academy";
export const APP_DESCRIPTION =
  "Online learning platform for technology and programming courses";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const ROLES = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const ENROLLMENT_STATUSES = [
  "ACTIVE",
  "COMPLETED",
  "PAUSED",
  "CANCELLED",
] as const;

export const PAYMENT_METHODS = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "PAYPAL",
  "STRIPE",
  "BANK_TRANSFER",
  "CASH",
] as const;

export const PAYMENT_STATUSES = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
] as const;

export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  video: 500 * 1024 * 1024, // 500MB
  document: 10 * 1024 * 1024, // 10MB
  avatar: 2 * 1024 * 1024, // 2MB
} as const;

export const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const ITEMS_PER_PAGE = 12;

export const SITE_CONFIG = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: APP_URL,
  ogImage: `${APP_URL}/og.svg`,
  email: "info@ykacademy.com",
  phone: "+1 (555) 123-4567",
  address: "123 Education Street, Learning City, LC 12345",
  social: {
    facebook: "https://facebook.com/ykacademy",
    twitter: "https://twitter.com/ykacademy",
    instagram: "https://instagram.com/ykacademy",
    youtube: "https://youtube.com/ykacademy",
    linkedin: "https://linkedin.com/company/ykacademy",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const DASHBOARD_NAV_ITEMS = [
  { label: "Dashboard", href: "/student", icon: "LayoutDashboard" },
  { label: "My Courses", href: "/student/courses", icon: "BookOpen" },
  { label: "Assignments", href: "/student/assignments", icon: "FileText" },
  { label: "Certificates", href: "/student/certificates", icon: "Award" },
  { label: "Profile", href: "/student/profile", icon: "User" },
  { label: "Settings", href: "/student/profile", icon: "Settings" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Admin Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Courses", href: "/admin/courses", icon: "BookOpen" },
  { label: "Categories", href: "/admin/courses", icon: "FolderTree" },
  { label: "Enrollments", href: "/admin/enrollments", icon: "GraduationCap" },
  { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
  { label: "Blog", href: "/admin/blog", icon: "PenTool" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Star" },
  { label: "Discounts", href: "/admin/discounts", icon: "Tag" },
  { label: "FAQs", href: "/admin/faq", icon: "HelpCircle" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Quote" },
  { label: "Messages", href: "/admin/messages", icon: "Mail" },
  { label: "Activity", href: "/admin/activity", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const STUDENT_NAV_ITEMS = [
  { label: "My Dashboard", href: "/student", icon: "LayoutDashboard" },
  { label: "Browse Courses", href: "/courses", icon: "Compass" },
  { label: "My Enrollments", href: "/student/courses", icon: "BookOpen" },
  { label: "Assignments", href: "/student/assignments", icon: "FileText" },
  { label: "Certificates", href: "/student/certificates", icon: "Award" },
  { label: "Profile", href: "/student/profile", icon: "User" },
] as const;
