import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().optional(),
  thumbnail: z.string().url("Invalid URL").optional(),
  trailerUrl: z.string().url("Invalid URL").optional(),
  duration: z.number().positive().optional(),
  isPublished: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(300, "Excerpt must be under 300 characters").optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featuredImage: z.string().url("Invalid URL").optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5, "Max rating is 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  courseId: z.string().min(1, "Course ID is required"),
});

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is required"),
  dueDate: z.string().datetime("Invalid date"),
  totalPoints: z.number().positive("Points must be positive"),
  type: z.enum(["HOMEWORK", "QUIZ", "EXAM", "PROJECT"]),
  courseId: z.string().min(1, "Course ID is required"),
  lessonId: z.string().optional(),
  allowLateSubmission: z.boolean().default(false),
  maxAttempts: z.number().positive().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  image: z.string().url("Invalid URL").optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional(),
      twitter: z.string().url().optional(),
      instagram: z.string().url().optional(),
      youtube: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    })
    .optional(),
  currency: z.string().default("USD"),
  timezone: z.string().default("UTC"),
  maintenanceMode: z.boolean().default(false),
});

export const faqSchema = z.object({
  question: z.string().min(5, "Question is required"),
  answer: z.string().min(10, "Answer is required"),
  categoryId: z.string().optional(),
  sortOrder: z.number().default(0),
  isPublished: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(10, "Testimonial content is required"),
  rating: z.number().min(1).max(5).optional(),
  avatar: z.string().url("Invalid URL").optional(),
  isPublished: z.boolean().default(true),
});

export const discountCodeSchema = z
  .object({
    code: z.string().min(3, "Code must be at least 3 characters").max(20),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.number().positive("Value must be positive"),
    minPurchase: z.number().positive().optional(),
    maxUses: z.number().positive().optional(),
    usedCount: z.number().default(0),
    courseId: z.string().optional(),
    expiresAt: z.string().datetime("Invalid date").optional(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) =>
      (data.type === "PERCENTAGE" && data.value <= 100) ||
      data.type === "FIXED",
    { message: "Percentage discount cannot exceed 100" }
  );

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type DiscountCodeInput = z.infer<typeof discountCodeSchema>;
