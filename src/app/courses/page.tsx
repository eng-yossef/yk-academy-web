"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Users,
  Play,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Web Development",
  "Programming",
  "AI & Data Science",
  "Mobile Development",
  "DevOps",
  "Design",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const priceRanges = ["All Prices", "Free", "Under $50", "$50 - $100", "Over $100"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const allCourses = [
  {
    image: "/images/courses/fullstack.jpg",
    category: "Web Development",
    title: "Complete Full-Stack Web Development Bootcamp",
    instructor: "Ahmed Youssef",
    rating: 4.9,
    reviewCount: 234,
    price: 49.99,
    originalPrice: 129.99,
    duration: "48h 30m",
    students: 1250,
    level: "Beginner",
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
    level: "Intermediate",
  },
  {
    image: "/images/courses/react.jpg",
    category: "Web Development",
    title: "Advanced React & Next.js — Production Ready",
    instructor: "Omar Hassan",
    rating: 4.9,
    reviewCount: 156,
    price: 44.99,
    originalPrice: 119.99,
    duration: "42h 00m",
    students: 870,
    level: "Advanced",
  },
  {
    image: "/images/courses/mobile.jpg",
    category: "Mobile Development",
    title: "Flutter & Dart — Build iOS & Android Apps",
    instructor: "Nour El-Din",
    rating: 4.7,
    reviewCount: 128,
    price: 34.99,
    originalPrice: 89.99,
    duration: "38h 45m",
    students: 650,
    level: "Beginner",
  },
  {
    image: "/images/courses/ai.jpg",
    category: "AI & Data Science",
    title: "Deep Learning with TensorFlow & PyTorch",
    instructor: "Dr. Layla Abbas",
    rating: 4.8,
    reviewCount: 142,
    price: 59.99,
    originalPrice: 149.99,
    duration: "52h 20m",
    students: 720,
    level: "Advanced",
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
    level: "Intermediate",
  },
  {
    image: "/images/courses/typescript.jpg",
    category: "Programming",
    title: "TypeScript — From Zero to Production",
    instructor: "Ahmed Youssef",
    rating: 4.8,
    reviewCount: 112,
    price: 34.99,
    originalPrice: 89.99,
    duration: "30h 00m",
    students: 540,
    level: "Beginner",
  },
  {
    image: "/images/courses/design.jpg",
    category: "Design",
    title: "UI/UX Design — Figma & Adobe XD Masterclass",
    instructor: "Mona Gamal",
    rating: 4.6,
    reviewCount: 87,
    price: 39.99,
    originalPrice: 99.99,
    duration: "34h 30m",
    students: 410,
    level: "Beginner",
  },
  {
    image: "/images/courses/node.jpg",
    category: "Web Development",
    title: "Node.js & Express — RESTful API Masterclass",
    instructor: "Omar Hassan",
    rating: 4.7,
    reviewCount: 95,
    price: 29.99,
    originalPrice: 79.99,
    duration: "26h 00m",
    students: 380,
    level: "Intermediate",
  },
];

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

export default function CoursesPage() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedLevel, setSelectedLevel] = React.useState("All Levels");
  const [selectedPrice, setSelectedPrice] = React.useState("All Prices");
  const [sortBy, setSortBy] = React.useState("popular");
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const coursesPerPage = 6;

  const filteredCourses = React.useMemo(() => {
    let result = [...allCourses];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedLevel !== "All Levels") {
      result = result.filter((c) => c.level === selectedLevel);
    }

    if (selectedPrice === "Free") result = result.filter((c) => c.price === 0);
    else if (selectedPrice === "Under $50")
      result = result.filter((c) => c.price > 0 && c.price < 50);
    else if (selectedPrice === "$50 - $100")
      result = result.filter((c) => c.price >= 50 && c.price <= 100);
    else if (selectedPrice === "Over $100")
      result = result.filter((c) => c.price > 100);

    switch (sortBy) {
      case "newest":
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.students - a.students);
    }

    return result;
  }, [search, selectedCategory, selectedLevel, selectedPrice, sortBy]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const activeFilters =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedLevel !== "All Levels" ? 1 : 0) +
    (selectedPrice !== "All Prices" ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-navy-gradient py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Explore Our Courses
              </h1>
              <p className="mt-3 max-w-xl text-gray-300 sm:text-lg">
                Discover courses designed to launch or advance your tech career.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-8 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-mediumGray" />
                  <Input
                    placeholder="Search courses, instructors, topics..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-12 border-white/10 bg-white/10 pl-10 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button
                  variant="outline"
                  className="h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Sidebar */}
              <aside
                className={cn(
                  "w-64 shrink-0 space-y-6",
                  "lg:block",
                  showFilters ? "block" : "hidden"
                )}
              >
                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedLevel("All Levels");
                      setSelectedPrice("All Prices");
                      setCurrentPage(1);
                    }}
                    className="flex items-center gap-1 text-sm text-electricBlue hover:underline"
                  >
                    <X className="h-3 w-3" />
                    Clear all filters
                  </button>
                )}

                {/* Category */}
                <div>
                  <h3 className="mb-3 font-semibold text-navy">Category</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          selectedCategory === cat
                            ? "bg-electricBlue/10 font-medium text-electricBlue"
                            : "text-mediumGray hover:bg-lightGray hover:text-navy"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Level */}
                <div>
                  <h3 className="mb-3 font-semibold text-navy">Level</h3>
                  <div className="space-y-1">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setSelectedLevel(level);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          selectedLevel === level
                            ? "bg-electricBlue/10 font-medium text-electricBlue"
                            : "text-mediumGray hover:bg-lightGray hover:text-navy"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price */}
                <div>
                  <h3 className="mb-3 font-semibold text-navy">Price</h3>
                  <div className="space-y-1">
                    {priceRanges.map((price) => (
                      <button
                        key={price}
                        onClick={() => {
                          setSelectedPrice(price);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          selectedPrice === price
                            ? "bg-electricBlue/10 font-medium text-electricBlue"
                            : "text-mediumGray hover:bg-lightGray hover:text-navy"
                        )}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main content */}
              <div className="flex-1">
                {/* Sort bar */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-mediumGray">
                    Showing{" "}
                    <span className="font-medium text-navy">
                      {filteredCourses.length}
                    </span>{" "}
                    courses
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-mediumGray">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-lg border border-lightGray bg-white px-3 py-2 text-sm text-navy focus:border-electricBlue focus:outline-none focus:ring-2 focus:ring-electricBlue/20"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grid */}
                {paginatedCourses.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-lg font-medium text-navy">
                      No courses found
                    </p>
                    <p className="mt-1 text-mediumGray">
                      Try adjusting your filters or search query.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedCourses.map((course, i) => (
                      <FadeIn key={course.title} delay={i * 0.05}>
                        <Link href={`/courses/${course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                          <div className="group h-full overflow-hidden rounded-2xl border border-lightGray bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                            <div className="relative aspect-video overflow-hidden bg-lightGray">
                              <div className="absolute inset-0 bg-gradient-to-br from-electricBlue/20 to-cyan/20" />
                              <div className="absolute left-3 top-3">
                                <Badge>{course.category}</Badge>
                              </div>
                              <div className="absolute right-3 top-3">
                                <Badge variant="secondary">{course.level}</Badge>
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
                                      className={cn(
                                        "h-4 w-4",
                                        j < Math.floor(course.rating)
                                          ? "fill-amber-400 text-amber-400"
                                          : "fill-gray-200 text-gray-200"
                                      )}
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
                                  {course.originalPrice && (
                                    <span className="text-sm text-mediumGray line-through">
                                      ${course.originalPrice}
                                    </span>
                                  )}
                                </div>
                                <Button size="sm">Enroll Now</Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </FadeIn>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                          currentPage === i + 1
                            ? "bg-electricBlue text-white"
                            : "border border-lightGray text-navy hover:bg-lightGray"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
