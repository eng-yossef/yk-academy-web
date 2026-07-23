"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  BookOpen,
  UserPlus,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Calendar,
  GraduationCap,
  AlertCircle,
  PenTool,
  BarChart3,
  Settings,
  Tag,
  CheckCircle,
  Award,
  Activity,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus,
  DollarSign,
  BookOpen,
  Users,
  PenTool,
  GraduationCap,
  CheckCircle,
  Award,
  Activity,
  Clock,
  AlertCircle,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface DashboardStats {
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
  totalCertificates: number;
  completionRate: number;
}

interface ChartData {
  month: string;
  revenue?: number;
  enrollments?: number;
}

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  time: string;
  icon: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = React.useState<ChartData[]>([]);
  const [enrollmentData, setEnrollmentData] = React.useState<ChartData[]>([]);
  const [activity, setActivity] = React.useState<ActivityItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data.stats);
          setRevenueData(data.data.charts.revenue);
          setEnrollmentData(data.data.charts.enrollments);
          setActivity(data.data.activity);
        } else {
          setError(data.error || "Failed to load dashboard");
        }
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-lg font-medium text-navy">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const quickActions = [
    { label: "Create Course", href: "/admin/courses/new", icon: BookOpen, color: "bg-electric-blue/10 text-electric-blue" },
    { label: "Manage Users", href: "/admin/users", icon: Users, color: "bg-emerald-50 text-emerald-600" },
    { label: "View Payments", href: "/admin/payments", icon: DollarSign, color: "bg-amber-50 text-amber-600" },
    { label: "Blog Posts", href: "/admin/blog", icon: PenTool, color: "bg-violet-50 text-violet-600" },
    { label: "Discount Codes", href: "/admin/discounts", icon: Tag, color: "bg-rose-50 text-rose-600" },
    { label: "Settings", href: "/admin/settings", icon: Settings, color: "bg-cyan/10 text-cyan" },
  ];

  return (
    <DashboardLayout role="admin">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy">Welcome back, Admin</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(new Date())}
            </p>
          </div>
          <Link href="/admin/courses/new">
            <Button className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white shadow-lg shadow-electric-blue/25 hover:shadow-electric-blue/40">
              <BookOpen className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Students" value={stats?.totalUsers?.toLocaleString() || "0"} />
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Revenue" value={formatCurrency(stats?.totalRevenue || 0)} />
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Active Courses" value={stats?.publishedCourses || 0} />
          <StatCard icon={<UserPlus className="h-5 w-5" />} label="Enrollments This Month" value={stats?.enrollmentsThisMonth || 0} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Completion Rate" value={`${stats?.completionRate || 0}%`} />
          <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Certificates" value={stats?.totalCertificates || 0} />
        </motion.div>

        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-navy">Revenue Overview</h3>
              <span className="text-xs text-muted-foreground">Last 12 months</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                  formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#1976FF" strokeWidth={3} dot={{ fill: "#1976FF", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-navy">Student Enrollments</h3>
              <span className="text-xs text-muted-foreground">Last 12 months</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                  formatter={(value) => [value, "Enrollments"]}
                />
                <Bar dataKey="enrollments" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1976FF" />
                    <stop offset="100%" stopColor="#00C2FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-4 font-semibold text-navy">Recent Activity</h3>
            <div className="space-y-4">
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              ) : (
                activity.map((act) => {
                  const Icon = iconMap[act.icon] || Activity;
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-light-gray">
                        <Icon className="h-4 w-4 text-navy/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy">{act.action}</p>
                        <p className="truncate text-xs text-muted-foreground">{act.detail}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(act.time)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-xl border border-light-gray bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-navy">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg p-2.5 text-sm font-medium text-navy transition-colors hover:bg-light-gray"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  {action.label}
                  <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-light-gray bg-white p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-gray text-amber-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-navy">{stats?.pendingReviews || 0}</p>
              <p className="text-xs text-muted-foreground">Pending Reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-light-gray bg-white p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-gray text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-navy">{stats?.activeStudents || 0}</p>
              <p className="text-xs text-muted-foreground">Active Students</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-light-gray bg-white p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-gray text-electric-blue">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-navy">{stats?.totalCourses || 0}</p>
              <p className="text-xs text-muted-foreground">Total Courses</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
