"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Bell,
  FileText,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface DashboardData {
  user: { name: string };
  stats: {
    enrolledCourses: number;
    completedCourses: number;
    certificates: number;
    overallProgress: number;
  };
  recentCourses: {
    id: string;
    title: string;
    thumbnail: string | null;
    progress: number;
    nextLesson: string;
  }[];
  upcomingAssignments: {
    id: string;
    title: string;
    courseName: string;
    dueDate: string;
    type: string;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
  }[];
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/student/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch {
        // fallback demo data
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const stats = data?.stats ?? {
    enrolledCourses: 6,
    completedCourses: 2,
    certificates: 2,
    overallProgress: 68,
  };

  const recentCourses = data?.recentCourses ?? [
    { id: "1", title: "Advanced React Patterns", thumbnail: null, progress: 72, nextLesson: "Custom Hooks Deep Dive" },
    { id: "2", title: "TypeScript Mastery", thumbnail: null, progress: 45, nextLesson: "Generics & Utility Types" },
    { id: "3", title: "Node.js Backend Development", thumbnail: null, progress: 88, nextLesson: "REST API Best Practices" },
  ];

  const upcomingAssignments = data?.upcomingAssignments ?? [
    { id: "1", title: "React Performance Optimization", courseName: "Advanced React Patterns", dueDate: "2026-07-28", type: "PROJECT" },
    { id: "2", title: "TypeScript Quiz #4", courseName: "TypeScript Mastery", dueDate: "2026-07-30", type: "QUIZ" },
  ];

  const notifications = data?.notifications ?? [
    { id: "1", title: "Assignment Graded", message: "Your React quiz has been graded", type: "SUCCESS", createdAt: "2026-07-22T10:00:00Z" },
    { id: "2", title: "New Course Material", message: "New lesson added to TypeScript Mastery", type: "INFO", createdAt: "2026-07-21T14:30:00Z" },
  ];

  const displayName = data?.user?.name ?? "Student";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${displayName}`}
        subtitle="Here's what's happening with your learning journey"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            label="Enrolled Courses"
            value={stats.enrolledCourses}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={<GraduationCap className="h-6 w-6" />}
            label="Completed"
            value={stats.completedCourses}
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={<Award className="h-6 w-6" />}
            label="Certificates"
            value={stats.certificates}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Overall Progress"
            value={`${stats.overallProgress}%`}
            trend={{ value: 5, isPositive: true }}
          />
        </motion.div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Recent Courses</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/student/courses">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 rounded-lg border border-light-gray p-4 transition-colors hover:bg-light-gray/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-electric-blue/10 to-cyan/10">
                    <BookOpen className="h-6 w-6 text-electric-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-navy">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Next: {course.nextLesson}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress value={course.progress} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium text-navy">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                  <Link href={`/student/courses/${course.id}`}>
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Upcoming</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/student/assignments">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border border-light-gray p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-navy">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {assignment.courseName}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {assignment.type}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Due {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Notifications</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/student/notifications">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ScrollArea className="max-h-48">
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-3 rounded-lg p-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric-blue/10">
                      <Bell className="h-4 w-4 text-electric-blue" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-navy">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-light-gray bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-navy">Activity Feed</h2>
        <div className="relative ml-3 border-l-2 border-light-gray pl-6">
          {[
            { icon: <BookOpen className="h-4 w-4" />, text: "Started lesson \"Custom Hooks Deep Dive\"", time: "2 hours ago", color: "bg-electric-blue" },
            { icon: <FileText className="h-4 w-4" />, text: "Submitted assignment in React Patterns", time: "5 hours ago", color: "bg-cyan" },
            { icon: <Award className="h-4 w-4" />, text: "Earned certificate for CSS Fundamentals", time: "1 day ago", color: "bg-emerald-500" },
            { icon: <GraduationCap className="h-4 w-4" />, text: "Completed module \"TypeScript Basics\"", time: "2 days ago", color: "bg-amber-500" },
          ].map((activity, i) => (
            <div key={i} className="relative mb-6 last:mb-0">
              <div className={`absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full ${activity.color} text-white`}>
                {activity.icon}
              </div>
              <p className="text-sm text-navy">{activity.text}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
