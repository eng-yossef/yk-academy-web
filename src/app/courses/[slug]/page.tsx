"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Users,
  Play,
  ChevronDown,
  Check,
  Share2,
  Heart,
  BookOpen,
  Award,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

const courseData = {
  title: "Complete Full-Stack Web Development Bootcamp",
  description:
    "Master modern web development from front-end to back-end. Learn React, Next.js, Node.js, PostgreSQL, and deploy production-ready applications. This comprehensive bootcamp takes you from absolute beginner to job-ready developer with hands-on projects and real-world scenarios.",
  image: "/images/courses/fullstack.jpg",
  category: "Web Development",
  level: "Beginner",
  rating: 4.9,
  reviewCount: 234,
  students: 1250,
  duration: "48h 30m",
  price: 49.99,
  originalPrice: 129.99,
  instructor: {
    name: "Ahmed Youssef",
    title: "Senior Full-Stack Engineer",
    bio: "10+ years of experience building web applications for startups and enterprises. Previously at Google and Vodafone.",
    initials: "AY",
  },
  lastUpdated: "June 2026",
  language: "English",
  learningOutcomes: [
    "Build full-stack applications with React and Next.js",
    "Design and implement RESTful and GraphQL APIs",
    "Work with PostgreSQL and Prisma ORM",
    "Implement authentication and authorization",
    "Deploy applications to production",
    "Write clean, tested, maintainable code",
  ],
  requirements: [
    "Basic computer literacy",
    "No programming experience needed",
    "A computer with internet access",
    "Willingness to learn and practice",
  ],
  modules: [
    {
      title: "Getting Started with Web Development",
      lessons: [
        { title: "How the Web Works", duration: "15m", isFree: true },
        { title: "Setting Up Your Development Environment", duration: "25m", isFree: true },
        { title: "HTML Fundamentals", duration: "45m", isFree: false },
        { title: "CSS Basics & Flexbox", duration: "50m", isFree: false },
      ],
    },
    {
      title: "JavaScript Deep Dive",
      lessons: [
        { title: "Variables, Types & Operators", duration: "40m", isFree: false },
        { title: "Functions & Scope", duration: "35m", isFree: false },
        { title: "Arrays & Objects", duration: "45m", isFree: false },
        { title: "DOM Manipulation", duration: "50m", isFree: false },
        { title: "Async JavaScript & Promises", duration: "55m", isFree: false },
      ],
    },
    {
      title: "React from Scratch",
      lessons: [
        { title: "JSX & Components", duration: "40m", isFree: false },
        { title: "State & Props", duration: "45m", isFree: false },
        { title: "Hooks In-Depth", duration: "50m", isFree: false },
        { title: "React Router & Navigation", duration: "35m", isFree: false },
        { title: "State Management with Context", duration: "40m", isFree: false },
      ],
    },
    {
      title: "Next.js & Full-Stack",
      lessons: [
        { title: "Next.js App Router", duration: "45m", isFree: false },
        { title: "Server Components & Actions", duration: "50m", isFree: false },
        { title: "Database Integration with Prisma", duration: "55m", isFree: false },
        { title: "API Routes & Middleware", duration: "40m", isFree: false },
        { title: "Authentication with NextAuth", duration: "50m", isFree: false },
      ],
    },
    {
      title: "Deployment & Production",
      lessons: [
        { title: "Git & GitHub Workflow", duration: "30m", isFree: false },
        { title: "Testing with Jest & Playwright", duration: "45m", isFree: false },
        { title: "CI/CD & Deployment", duration: "40m", isFree: false },
        { title: "Performance Optimization", duration: "35m", isFree: false },
      ],
    },
  ],
  reviews: [
    {
      name: "Mohamed Ali",
      rating: 5,
      date: "May 2026",
      comment:
        "This course is incredible. Ahmed explains everything so clearly and the projects are genuinely useful. I got my first dev job within 3 months of completing this!",
      initials: "MA",
    },
    {
      name: "Fatma Hassan",
      rating: 5,
      date: "April 2026",
      comment:
        "Best investment I've made in my career. The full-stack project at the end really ties everything together. Highly recommend!",
      initials: "FH",
    },
    {
      name: "Youssef Ibrahim",
      rating: 4,
      date: "March 2026",
      comment:
        "Great content and well structured. I would have liked more advanced topics in the last section, but overall fantastic.",
      initials: "YI",
    },
  ],
  relatedCourses: [
    {
      title: "Advanced React & Next.js",
      instructor: "Omar Hassan",
      rating: 4.9,
      price: 44.99,
      originalPrice: 119.99,
      category: "Web Dev",
    },
    {
      title: "Node.js & Express Masterclass",
      instructor: "Omar Hassan",
      rating: 4.7,
      price: 29.99,
      originalPrice: 79.99,
      category: "Web Dev",
    },
    {
      title: "TypeScript — Zero to Production",
      instructor: "Ahmed Youssef",
      rating: 4.8,
      price: 34.99,
      originalPrice: 89.99,
      category: "Programming",
    },
  ],
};

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CourseDetailPage() {
  const [openModule, setOpenModule] = React.useState(0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-navy-gradient pt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>/</span>
            <span className="text-white">{courseData.title}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Badge className="mb-4">{courseData.category}</Badge>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {courseData.title}
              </h1>
              <p className="mt-4 text-gray-300 sm:text-lg">
                {courseData.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-white">{courseData.rating}</span>
                  <span>({courseData.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{courseData.duration} total</span>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                  {courseData.level}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-electricBlue text-white">
                    {courseData.instructor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">
                    {courseData.instructor.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {courseData.instructor.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Left content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Learning Outcomes */}
              <FadeIn>
                <h2 className="mb-4 text-2xl font-bold text-navy">
                  What You&apos;ll Learn
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {courseData.learningOutcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-electricBlue" />
                      <span className="text-navy">{outcome}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Curriculum */}
              <FadeIn delay={0.1}>
                <h2 className="mb-4 text-2xl font-bold text-navy">
                  Course Curriculum
                </h2>
                <p className="mb-6 text-mediumGray">
                  {courseData.modules.length} modules ·{" "}
                  {courseData.modules.reduce(
                    (acc, m) => acc + m.lessons.length,
                    0
                  )}{" "}
                  lessons · {courseData.duration} total
                </p>

                <div className="space-y-3">
                  {courseData.modules.map((module, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border border-lightGray"
                    >
                      <button
                        onClick={() =>
                          setOpenModule(openModule === i ? -1 : i)
                        }
                        className="flex w-full items-center justify-between bg-lightGray/50 px-5 py-4 text-left"
                      >
                        <div>
                          <h3 className="font-semibold text-navy">
                            Module {i + 1}: {module.title}
                          </h3>
                          <p className="mt-0.5 text-sm text-mediumGray">
                            {module.lessons.length} lessons
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: openModule === i ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-mediumGray" />
                        </motion.div>
                      </button>
                      <motion.div
                        initial={false}
                        animate={{
                          height: openModule === i ? "auto" : 0,
                          opacity: openModule === i ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-lightGray">
                          {module.lessons.map((lesson, j) => (
                            <div
                              key={j}
                              className="flex items-center justify-between px-5 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <Play className="h-4 w-4 text-mediumGray" />
                                <span className="text-sm text-navy">
                                  {lesson.title}
                                </span>
                                {lesson.isFree && (
                                  <Badge
                                    variant="success"
                                    className="text-xs"
                                  >
                                    Free
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-mediumGray">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Requirements */}
              <FadeIn delay={0.2}>
                <h2 className="mb-4 text-2xl font-bold text-navy">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {courseData.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-electricBlue" />
                      <span className="text-mediumGray">{req}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Reviews */}
              <FadeIn delay={0.3}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-navy">Reviews</h2>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-bold text-navy">
                      {courseData.rating}
                    </span>
                    <span className="text-mediumGray">
                      ({courseData.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  {courseData.reviews.map((review) => (
                    <div
                      key={review.name}
                      className="rounded-xl border border-lightGray p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-electricBlue text-white">
                              {review.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-navy">
                              {review.name}
                            </p>
                            <p className="text-sm text-mediumGray">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star
                              key={j}
                              className="h-4 w-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-mediumGray">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Related Courses */}
              <FadeIn delay={0.4}>
                <h2 className="mb-4 text-2xl font-bold text-navy">
                  Related Courses
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {courseData.relatedCourses.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-xl border border-lightGray p-4 transition-shadow hover:shadow-md"
                    >
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {c.category}
                      </Badge>
                      <h3 className="mb-1 font-semibold text-navy">{c.title}</h3>
                      <p className="mb-2 text-sm text-mediumGray">
                        by {c.instructor}
                      </p>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-navy">{c.rating}</span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-bold text-navy">${c.price}</span>
                        <span className="text-sm text-mediumGray line-through">
                          ${c.originalPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-2xl border border-lightGray p-6 shadow-sm">
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-navy">
                      ${courseData.price}
                    </span>
                    <span className="text-lg text-mediumGray line-through">
                      ${courseData.originalPrice}
                    </span>
                    <Badge variant="destructive">
                      {Math.round(
                        ((courseData.originalPrice - courseData.price) /
                          courseData.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  </div>

                  <p className="mb-6 text-sm text-mediumGray">
                    7-day money-back guarantee
                  </p>

                  <Button className="w-full" size="lg">
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    size="lg"
                  >
                    Add to Wishlist
                  </Button>

                  <Separator className="my-6" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-navy">
                      <span className="text-mediumGray">Duration</span>
                      <span className="font-medium">{courseData.duration}</span>
                    </div>
                    <div className="flex justify-between text-navy">
                      <span className="text-mediumGray">Level</span>
                      <span className="font-medium">{courseData.level}</span>
                    </div>
                    <div className="flex justify-between text-navy">
                      <span className="text-mediumGray">Lessons</span>
                      <span className="font-medium">
                        {courseData.modules.reduce(
                          (acc, m) => acc + m.lessons.length,
                          0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-navy">
                      <span className="text-mediumGray">Language</span>
                      <span className="font-medium">{courseData.language}</span>
                    </div>
                    <div className="flex justify-between text-navy">
                      <span className="text-mediumGray">Certificate</span>
                      <span className="font-medium text-electricBlue">Yes</span>
                    </div>
                    <div className="flex justify-between text-navy">
                      <span className="text-mediumGray">Last Updated</span>
                      <span className="font-medium">
                        {courseData.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-mediumGray hover:text-electricBlue transition-colors">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                    <button className="flex items-center gap-2 text-sm text-mediumGray hover:text-electricBlue transition-colors">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
