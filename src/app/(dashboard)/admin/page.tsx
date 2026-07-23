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

const revenueData = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 18200 },
  { month: "Mar", revenue: 15600 },
  { month: "Apr", revenue: 22100 },
  { month: "May", revenue: 28400 },
  { month: "Jun", revenue: 31200 },
  { month: "Jul", revenue: 26800 },
  { month: "Aug", revenue: 35600 },
  { month: "Sep", revenue: 32100 },
  { month: "Oct", revenue: 38900 },
  { month: "Nov", revenue: 42300 },
  { month: "Dec", revenue: 45800 },
];

const enrollmentData = [
  { month: "Jan", enrollments: 45 },
  { month: "Feb", enrollments: 62 },
  { month: "Mar", enrollments: 58 },
  { month: "Apr", enrollments: 78 },
  { month: "May", enrollments: 91 },
  { month: "Jun", enrollments: 85 },
  { month: "Jul", enrollments: 102 },
  { month: "Aug", enrollments: 118 },
  { month: "Sep", enrollments: 95 },
  { month: "Oct", enrollments: 132 },
  { month: "Nov", enrollments: 148 },
  { month: "Dec", enrollments: 160 },
];

const recentActivity = [
  { id: 1, action: "New enrollment", detail: "Ahmed enrolled in React Masterclass", time: "2 min ago", icon: UserPlus },
  { id: 2, action: "Payment received", detail: "SAR 199 from Sara Ali", time: "15 min ago", icon: DollarSign },
  { id: 3, action: "Course published", detail: "Advanced JavaScript launched", time: "1 hour ago", icon: BookOpen },
  { id: 4, action: "New user", detail: "Mohamed created an account", time: "2 hours ago", icon: Users },
  { id: 5, action: "Assignment submitted", detail: "Fatima submitted Week 4 project", time: "3 hours ago", icon: PenTool },
  { id: 6, action: "Course completed", detail: "Khalid completed HTML Fundamentals", time: "5 hours ago", icon: GraduationCap },
];

const quickActions = [
  { label: "Create Course", href: "/admin/courses", icon: BookOpen, color: "bg-electric-blue/10 text-electric-blue" },
  { label: "Manage Users", href: "/admin/users", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  { label: "View Payments", href: "/admin/payments", icon: DollarSign, color: "bg-amber-50 text-amber-600" },
  { label: "Blog Posts", href: "/admin/blog", icon: PenTool, color: "bg-violet-50 text-violet-600" },
  { label: "Discount Codes", href: "/admin/discounts", icon: Tag, color: "bg-rose-50 text-rose-600" },
  { label: "Settings", href: "/admin/settings", icon: Settings, color: "bg-cyan/10 text-cyan" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
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
          <Link href="/admin/courses">
            <Button className="gap-2 bg-gradient-to-r from-electric-blue to-cyan text-white shadow-lg shadow-electric-blue/25 hover:shadow-electric-blue/40">
              <BookOpen className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Students" value="1,284" trend={{ value: 12, isPositive: true }} />
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Revenue" value={formatCurrency(328400)} trend={{ value: 18, isPositive: true }} />
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Active Courses" value="24" trend={{ value: 4, isPositive: true }} />
          <StatCard icon={<UserPlus className="h-5 w-5" />} label="Enrollments This Month" value="160" trend={{ value: 22, isPositive: true }} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Completion Rate" value="87%" trend={{ value: 3, isPositive: true }} />
          <StatCard icon={<Clock className="h-5 w-5" />} label="Pending Tasks" value="8" trend={{ value: 15, isPositive: false }} />
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
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-light-gray">
                    <activity.icon className="h-4 w-4 text-navy/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{activity.action}</p>
                    <p className="truncate text-xs text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
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
          {[
            { label: "Pending Reviews", value: "5", icon: AlertCircle, color: "text-amber-500" },
            { label: "Active Subscriptions", value: "342", icon: TrendingUp, color: "text-emerald-500" },
            { label: "Avg. Rating", value: "4.7", icon: BarChart3, color: "text-electric-blue" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-light-gray bg-white p-4 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-light-gray ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-navy">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
