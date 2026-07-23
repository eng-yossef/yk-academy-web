"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter, Clock, Play } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";

interface EnrolledCourse {
  id: string;
  title: string;
  thumbnail: string | null;
  category: string;
  instructor: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED";
  lastAccessed: string;
  totalLessons: number;
  completedLessons: number;
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("in-progress");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/student/courses");
        if (res.ok) {
          const json = await res.json();
          setCourses(json.data);
        }
      } catch {
        setCourses([
          { id: "1", title: "Advanced React Patterns", thumbnail: null, category: "Frontend", instructor: "Ahmed Ali", progress: 72, status: "ACTIVE", lastAccessed: "2026-07-22", totalLessons: 24, completedLessons: 17 },
          { id: "2", title: "TypeScript Mastery", thumbnail: null, category: "Language", instructor: "Sara Mohamed", progress: 45, status: "ACTIVE", lastAccessed: "2026-07-21", totalLessons: 30, completedLessons: 13 },
          { id: "3", title: "Node.js Backend Development", thumbnail: null, category: "Backend", instructor: "Omar Hassan", progress: 88, status: "ACTIVE", lastAccessed: "2026-07-22", totalLessons: 20, completedLessons: 17 },
          { id: "4", title: "CSS Fundamentals", thumbnail: null, category: "Frontend", instructor: "Fatima Youssef", progress: 100, status: "COMPLETED", lastAccessed: "2026-07-15", totalLessons: 16, completedLessons: 16 },
          { id: "5", title: "JavaScript Essentials", thumbnail: null, category: "Language", instructor: "Ahmed Ali", progress: 100, status: "COMPLETED", lastAccessed: "2026-07-10", totalLessons: 22, completedLessons: 22 },
          { id: "6", title: "Database Design", thumbnail: null, category: "Backend", instructor: "Omar Hassan", progress: 30, status: "ACTIVE", lastAccessed: "2026-07-20", totalLessons: 18, completedLessons: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    let list = courses;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }
    return list;
  }, [courses, search]);

  const inProgress = filtered.filter((c) => c.status === "ACTIVE");
  const completed = filtered.filter((c) => c.status === "COMPLETED");

  const CourseItem = ({ course }: { course: EnrolledCourse }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-xl border border-light-gray bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex h-40 w-full items-center justify-center bg-gradient-to-br from-electric-blue/5 to-cyan/5 sm:h-auto sm:w-48">
          <BookOpen className="h-10 w-10 text-electric-blue/40" />
          {course.status === "COMPLETED" && (
            <Badge className="absolute left-2 top-2 bg-emerald-500">Completed</Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Badge variant="outline" className="mb-1 text-xs">
                {course.category}
              </Badge>
              <h3 className="text-base font-semibold text-navy group-hover:text-electric-blue transition-colors">
                {course.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">by {course.instructor}</p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
              <span className="font-medium text-navy">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last accessed {new Date(course.lastAccessed).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <Link href={`/student/courses/${course.id}`}>
              <Button size="sm" variant={course.status === "COMPLETED" ? "outline" : "default"}>
                <Play className="mr-1 h-3 w-3" />
                {course.status === "COMPLETED" ? "Review" : "Continue"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        subtitle="Track your learning progress across all enrolled courses"
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "My Courses" }]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search courses..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-72"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="in-progress">
            In Progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filtered.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="mt-6 space-y-4">
          {inProgress.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-8 w-8" />}
              title="No courses in progress"
              description="Enroll in a course to start learning"
            />
          ) : (
            inProgress.map((course) => <CourseItem key={course.id} course={course} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {completed.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-8 w-8" />}
              title="No completed courses yet"
              description="Keep learning to complete your first course"
            />
          ) : (
            completed.map((course) => <CourseItem key={course.id} course={course} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-8 w-8" />}
              title="No courses found"
              description="Try a different search or enroll in a new course"
            />
          ) : (
            filtered.map((course) => <CourseItem key={course.id} course={course} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
