"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  ArrowRight,
  Play,
  Users,
  BookOpen,
  Award,
  Code,
  Brain,
  Globe,
  Smartphone,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Zap,
  TrendingUp,
  Clock,
  Target,
  Headphones,
  Calendar,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { GradientText } from "@/components/shared/gradient-text";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/* ────────────────────────────────────────────
   Shared animation wrapper
   ──────────────────────────────────────────── */
function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const dirMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...dirMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   a) HERO SECTION
   ════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero-gradient">
      {/* Animated geometric shapes */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full border border-white/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -left-48 h-[700px] w-[700px] rounded-full border border-white/5"
        />
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[15%] top-[20%] h-3 w-3 rounded-full bg-electricBlue/40"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[20%] top-[30%] h-2 w-2 rounded-full bg-cyan/50"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[30%] bottom-[25%] h-4 w-4 rounded-full bg-brightBlue/30"
        />
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge className="mb-6 border-white/10 bg-white/10 text-white">
              <Zap className="mr-1 h-3 w-3" />
              Egypt&apos;s Premier Tech Academy
            </Badge>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Master{" "}
              <span className="text-gradient">
                Programming
              </span>{" "}
              &{" "}
              <span className="text-gradient">AI</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-300 sm:text-xl">
              Join Egypt&apos;s premier tech education platform and transform
              your career with expert-led courses in programming, AI, and modern
              technology.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="h-14 px-8 text-base" asChild>
                <Link href="/courses">
                  Browse Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10"
                asChild
              >
                <Link href="/courses">
                  <Play className="mr-2 h-5 w-5" />
                  Start Free
                </Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                { value: "500+", label: "Students" },
                { value: "50+", label: "Courses" },
                { value: "95%", label: "Success Rate" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[520px] w-full">
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-8 top-8 w-80 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electricBlue/20">
                    <Code className="h-5 w-5 text-electricBlue" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Full-Stack Dev</p>
                    <p className="text-xs text-gray-400">24 Lessons</p>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-electricBlue to-cyan"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">72% Complete</p>
              </motion.div>

              {/* Floating badge card */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute right-4 top-0 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Certificate Earned!
                    </p>
                    <p className="text-xs text-gray-400">AI Fundamentals</p>
                  </div>
                </div>
              </motion.div>

              {/* Students online card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-8 right-12 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electricBlue text-xs font-bold text-white">
                      A
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan text-xs font-bold text-white">
                      M
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brightBlue text-xs font-bold text-white">
                      S
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      120+ Online
                    </p>
                    <p className="text-xs text-gray-400">learning now</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

/* ════════════════════════════════════════════
   b) PARTNERS / TRUST BAR
   ════════════════════════════════════════════ */
function PartnersBar() {
  const partners = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Spotify",
    "Uber",
  ];

  return (
    <section className="border-b border-lightGray bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium text-mediumGray">
          Trusted by 500+ students from leading companies
        </p>
        <div className="relative overflow-hidden">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...partners, ...partners].map((name, i) => (
              <div
                key={i}
                className="mx-8 flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-mediumGray/40 transition-colors hover:text-mediumGray/70">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   c) FEATURES SECTION
   ════════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      icon: GraduationCap,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of real-world experience in top tech companies.",
    },
    {
      icon: Target,
      title: "Hands-on Projects",
      description:
        "Build real-world projects that showcase your skills to employers and strengthen your portfolio.",
    },
    {
      icon: Award,
      title: "Industry Certificates",
      description:
        "Earn recognized certificates that validate your skills and boost your career prospects.",
    },
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Benefit from personalized learning paths and intelligent feedback powered by AI technology.",
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description:
        "Study at your own pace with lifetime access to course materials, on any device, anytime.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Career Support",
      description:
        "Get career guidance, resume reviews, and direct connections to hiring partners.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge className="mb-4">Why Us</Badge>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              Why <GradientText>YK Academy</GradientText>?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-mediumGray sm:text-lg">
              We provide the tools, mentorship, and community you need to
              succeed in tech.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group h-full rounded-2xl border border-lightGray bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-electricBlue/10 to-cyan/10 transition-colors group-hover:from-electricBlue group-hover:to-cyan">
                  <feature.icon className="h-7 w-7 text-electricBlue transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-navy">
                  {feature.title}
                </h3>
                <p className="text-mediumGray">{feature.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   d) COURSE CATEGORIES
   ════════════════════════════════════════════ */
function CourseCategoriesSection() {
  const categories = [
    {
      title: "Programming",
      count: 18,
      icon: Code,
      color: "from-electricBlue to-brightBlue",
      description: "Python, JavaScript, C++, and more",
    },
    {
      title: "AI & Data Science",
      count: 12,
      icon: Brain,
      color: "from-cyan to-teal-400",
      description: "Machine Learning, Deep Learning, NLP",
    },
    {
      title: "Web Development",
      count: 15,
      icon: Globe,
      color: "from-violet-500 to-purple-500",
      description: "React, Next.js, Node.js, Full Stack",
    },
    {
      title: "Mobile Development",
      count: 8,
      icon: Smartphone,
      color: "from-amber-500 to-orange-500",
      description: "React Native, Flutter, iOS, Android",
    },
  ];

  return (
    <section className="bg-lightGray/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge className="mb-4">Programs</Badge>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              Our <GradientText>Programs</GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-mediumGray sm:text-lg">
              Explore our diverse range of programs designed to take you from
              beginner to professional.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <FadeIn key={cat.title} delay={i * 0.1}>
              <Link href={`/courses?category=${cat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color}`}
                  >
                    <cat.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-navy">
                    {cat.title}
                  </h3>
                  <p className="mb-4 text-sm text-mediumGray">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-electricBlue">
                      {cat.count} courses
                    </span>
                    <ArrowRight className="h-4 w-4 text-electricBlue transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   e) POPULAR COURSES
   ════════════════════════════════════════════ */
function PopularCoursesSection() {
  const courses = [
    {
      image: "/images/courses/fullstack.jpg",
      category: "Web Dev",
      title: "Complete Full-Stack Web Development Bootcamp",
      instructor: "Ahmed Youssef",
      rating: 4.9,
      reviewCount: 234,
      price: 49.99,
      originalPrice: 129.99,
      duration: "48h 30m",
      students: 1250,
    },
    {
      image: "/images/courses/python.jpg",
      category: "Programming",
      title: "Python for AI & Machine Learning Mastery",
      instructor: "Sara Mohamed",
      rating: 4.8,
      reviewCount: 189,
      price: 39.99,
      originalPrice: 99.99,
      duration: "36h 15m",
      students: 980,
    },
    {
      image: "/images/courses/react.jpg",
      category: "Web Dev",
      title: "Advanced React & Next.js — Production Ready",
      instructor: "Omar Hassan",
      rating: 4.9,
      reviewCount: 156,
      price: 44.99,
      originalPrice: 119.99,
      duration: "42h 00m",
      students: 870,
    },
    {
      image: "/images/courses/mobile.jpg",
      category: "Mobile",
      title: "Flutter & Dart — Build iOS & Android Apps",
      instructor: "Nour El-Din",
      rating: 4.7,
      reviewCount: 128,
      price: 34.99,
      originalPrice: 89.99,
      duration: "38h 45m",
      students: 650,
    },
    {
      image: "/images/courses/ai.jpg",
      category: "AI",
      title: "Deep Learning with TensorFlow & PyTorch",
      instructor: "Dr. Layla Abbas",
      rating: 4.8,
      reviewCount: 142,
      price: 59.99,
      originalPrice: 149.99,
      duration: "52h 20m",
      students: 720,
    },
    {
      image: "/images/courses/devops.jpg",
      category: "DevOps",
      title: "DevOps Masterclass — CI/CD, Docker & K8s",
      instructor: "Karim Mansour",
      rating: 4.7,
      reviewCount: 98,
      price: 29.99,
      originalPrice: 79.99,
      duration: "28h 10m",
      students: 430,
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge className="mb-4">Trending</Badge>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              <GradientText>Trending Courses</GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-mediumGray sm:text-lg">
              Our most popular courses chosen by students who are building their
              tech careers.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <FadeIn key={course.title} delay={i * 0.08}>
              <Link href={`/courses/${course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <div className="group h-full overflow-hidden rounded-2xl border border-lightGray bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                  <div className="relative aspect-video overflow-hidden bg-lightGray">
                    <div className="absolute inset-0 bg-gradient-to-br from-electricBlue/20 to-cyan/20" />
                    <div className="absolute left-3 top-3">
                      <Badge>{course.category}</Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-electricBlue opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-navy transition-colors group-hover:text-electricBlue">
                      {course.title}
                    </h3>
                    <p className="mb-3 text-sm text-mediumGray">
                      by {course.instructor}
                    </p>

                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${
                              j < Math.floor(course.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-navy">
                        {course.rating}
                      </span>
                      <span className="text-xs text-mediumGray">
                        ({course.reviewCount})
                      </span>
                    </div>

                    <div className="mb-4 flex items-center gap-4 text-xs text-mediumGray">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.students.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-lightGray pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-navy">
                          ${course.price}
                        </span>
                        <span className="text-sm text-mediumGray line-through">
                          ${course.originalPrice}
                        </span>
                      </div>
                      <Button size="sm">Enroll Now</Button>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   f) STATS SECTION
   ════════════════════════════════════════════ */
function StatsSection() {
  const stats = [
    { icon: Users, value: 500, suffix: "+", label: "Students" },
    { icon: BookOpen, value: 50, suffix: "+", label: "Courses" },
    { icon: GraduationCap, value: 20, suffix: "+", label: "Expert Instructors" },
    { icon: Award, value: 95, suffix: "%", label: "Success Rate" },
    { icon: TrendingUp, value: 1000, suffix: "+", label: "Certificates" },
    { icon: Star, value: 98, suffix: "%", label: "Satisfaction" },
  ];

  return (
    <section className="relative overflow-hidden bg-navy-gradient py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Numbers That Speak for{" "}
              <span className="text-gradient">Themselves</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400 sm:text-lg">
              Our achievements reflect our commitment to delivering world-class
              tech education.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-electricBlue/20">
                  <stat.icon className="h-7 w-7 text-electricBlue" />
                </div>
                <p className="text-4xl font-bold text-white sm:text-5xl">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-gray-400">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   g) TESTIMONIALS
   ════════════════════════════════════════════ */
function TestimonialsSection() {
  const [current, setCurrent] = React.useState(0);

  const testimonials = [
    {
      name: "Mohamed Ali",
      role: "Full-Stack Developer at Vodafone",
      content:
        "YK Academy transformed my career. I went from knowing nothing about coding to landing a developer job in just 6 months. The hands-on projects and mentorship made all the difference.",
      rating: 5,
      initials: "MA",
    },
    {
      name: "Fatma Hassan",
      role: "AI Engineer at Amazon",
      content:
        "The AI courses are world-class. The instructors break down complex concepts into digestible lessons. I built my first neural network in week 2. Absolutely incredible experience.",
      rating: 5,
      initials: "FH",
    },
    {
      name: "Youssef Ibrahim",
      role: "Mobile Developer at Startups",
      content:
        "I tried many online platforms before, but YK Academy is different. The community support, real-world projects, and career guidance helped me transition into tech successfully.",
      rating: 5,
      initials: "YI",
    },
    {
      name: "Nour Khaled",
      role: "Frontend Engineer at Fintech",
      content:
        "The React & Next.js course was a game-changer. I learned best practices, testing, deployment — everything I needed. The certificate opened doors I never thought possible.",
      rating: 5,
      initials: "NK",
    },
  ];

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="bg-lightGray/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              What Our <GradientText>Students</GradientText> Say
            </h2>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <div className="rounded-3xl border border-lightGray bg-white p-8 shadow-sm sm:p-12">
                <Quote className="mb-6 h-10 w-10 text-electricBlue/20" />

                <p className="mb-8 text-lg leading-relaxed text-navy sm:text-xl">
                  &ldquo;{testimonials[current].content}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-electricBlue to-cyan text-sm font-bold text-white">
                      {testimonials[current].initials}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">
                        {testimonials[current].name}
                      </p>
                      <p className="text-sm text-mediumGray">
                        {testimonials[current].role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: testimonials[current].rating,
                    }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-lightGray bg-white text-navy transition-colors hover:bg-electricBlue hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-2" role="group" aria-label="Testimonial navigation">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      aria-pressed={i === current}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-8 bg-electricBlue"
                          : "w-2 bg-mediumGray/30"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-lightGray bg-white text-navy transition-colors hover:bg-electricBlue hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   h) PRICING
   ════════════════════════════════════════════ */
function PricingSection() {
  const plans = [
    {
      name: "Basic",
      price: "29",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Access to 10 courses",
        "Basic projects",
        "Community forum access",
        "Email support",
        "Certificate of completion",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "79",
      period: "/month",
      description: "Most popular for serious learners",
      features: [
        "Access to all 50+ courses",
        "Hands-on real-world projects",
        "1-on-1 mentor sessions",
        "Priority support",
        "Industry-recognized certificates",
        "Career placement assistance",
        "Lifetime access to materials",
      ],
      cta: "Start Learning",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "199",
      period: "/month",
      description: "For teams and organizations",
      features: [
        "Everything in Professional",
        "Custom learning paths",
        "Team dashboard & analytics",
        "Dedicated account manager",
        "Custom course development",
        "API access",
        "White-label options",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              Invest in Your <GradientText>Future</GradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-mediumGray sm:text-lg">
              Choose the plan that fits your learning goals. All plans include a
              7-day free trial.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`relative h-full rounded-3xl border p-8 ${
                  plan.highlighted
                    ? "border-electricBlue bg-navy text-white shadow-xl shadow-electricBlue/10"
                    : "border-lightGray bg-white"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <h3
                  className={`text-xl font-bold ${
                    plan.highlighted ? "text-white" : "text-navy"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    plan.highlighted ? "text-gray-300" : "text-mediumGray"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span
                    className={`text-5xl font-bold ${
                      plan.highlighted ? "text-white" : "text-navy"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={
                      plan.highlighted ? "text-gray-400" : "text-mediumGray"
                    }
                  >
                    {plan.period}
                  </span>
                </div>

                <Separator
                  className={`my-6 ${
                    plan.highlighted ? "bg-white/10" : ""
                  }`}
                />

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          plan.highlighted ? "text-cyan" : "text-electricBlue"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted ? "text-gray-300" : "text-navy"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <Link href="/auth/signup">{plan.cta}</Link>
                </Button>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   i) FAQ SECTION
   ════════════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "Do I need prior programming experience?",
      answer:
        "No! We offer beginner-friendly courses designed for absolute beginners. Our structured curriculum takes you from zero to building real projects step by step.",
    },
    {
      question: "How long do I have access to the courses?",
      answer:
        "Once enrolled, you get lifetime access to all course materials, including future updates. You can learn at your own pace and revisit lessons anytime.",
    },
    {
      question: "Are the certificates recognized by employers?",
      answer:
        "Yes! Our certificates are recognized by leading tech companies in Egypt and the Middle East. Many of our graduates have been hired by top firms after completing our programs.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Absolutely. We offer flexible payment options including monthly installments, bank transfers, and mobile payment methods (Vodafone Cash, InstaPay, Fawry).",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "We offer a 30-day money-back guarantee on all courses. If you're not satisfied with the quality, simply contact our support team for a full refund.",
    },
    {
      question: "How does the mentorship program work?",
      answer:
        "Professional and Enterprise plan members get access to 1-on-1 mentor sessions with industry experts. You can schedule sessions, get code reviews, and receive personalized career guidance.",
    },
  ];

  return (
    <section className="bg-lightGray/50 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              Frequently Asked <GradientText>Questions</GradientText>
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="overflow-hidden rounded-2xl border border-lightGray bg-white">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="mr-4 text-lg font-semibold text-navy">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0 text-electricBlue" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === i ? "auto" : 0,
                    opacity: openIndex === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-mediumGray">{faq.answer}</p>
                </motion.div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   j) CTA SECTION
   ════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="relative overflow-hidden bg-navy py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-electricBlue/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Start Your{" "}
            <span className="text-gradient">Journey</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
            Join 500+ students already building their future in tech. Start
            your free trial today — no credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-14 px-10 text-base"
              asChild
            >
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-white/20 bg-white/5 px-10 text-base text-white hover:bg-white/10"
              asChild
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PartnersBar />
        <FeaturesSection />
        <CourseCategoriesSection />
        <PopularCoursesSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
