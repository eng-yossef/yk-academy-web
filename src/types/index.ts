export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: string;
  phone: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string | null;
  slug: string;
  level: string;
  price: number;
  discountPrice: number | null;
  thumbnail: string | null;
  trailerUrl: string | null;
  duration: number | null;
  isPublished: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  instructorId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  duration: number | null;
  order: number;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  moduleId: string | null;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
}

export interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolledAt: Date;
  completedAt: Date | null;
  userId: string;
  courseId: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  transactionId: string | null;
  invoiceNumber: string;
  createdAt: Date;
  userId: string;
  enrollmentId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  type: string;
  allowLateSubmission: boolean;
  maxAttempts: number | null;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
  lessonId: string | null;
}

export interface Submission {
  id: string;
  content: string | null;
  fileUrl: string | null;
  score: number | null;
  feedback: string | null;
  submittedAt: Date;
  gradedAt: Date | null;
  attempt: number;
  userId: string;
  assignmentId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  courseId: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  status: string;
  tags: string[];
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  avatar: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: string;
  value: number;
  minPurchase: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  courseId: string | null;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: Date;
  pdfUrl: string | null;
  userId: string;
  courseId: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}

// ─── Relation types ───────────────────────────────────────────────

export interface UserWithRelations extends User {
  enrollments?: Enrollment[];
  reviews?: Review[];
  assignments?: Submission[];
  certificates?: Certificate[];
}

export interface CourseWithRelations extends Course {
  category?: Category;
  instructor?: User;
  lessons?: Lesson[];
  modules?: Module[];
  enrollments?: Enrollment[];
  reviews?: Review[];
  assignments?: Assignment[];
  _count?: {
    lessons: number;
    enrollments: number;
    reviews: number;
  };
}

export interface EnrollmentWithRelations extends Enrollment {
  user?: User;
  course?: CourseWithRelations;
  payment?: Payment;
}

export interface LessonWithRelations extends Lesson {
  course?: Course;
  module?: Module;
  assignments?: Assignment[];
}

export interface BlogPostWithRelations extends BlogPost {
  author?: User;
  category?: Category;
}

// ─── API types ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  enrollmentsThisMonth: number;
  revenueThisMonth: number;
  publishedCourses: number;
  pendingReviews: number;
  activeStudents: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}
