import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [
      totalUsers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      enrollmentsThisMonth,
      completedEnrollments,
      revenueResult,
      revenueThisMonthResult,
      newUsersThisMonth,
      pendingReviews,
      activeStudents,
      totalCertificates,
      recentEnrollments,
      recentPayments,
      recentUsers,
      recentActivity,
      monthlyRevenue,
      monthlyEnrollments,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.course.count({ where: { deletedAt: null } }),
      prisma.course.count({ where: { isPublished: true, deletedAt: null } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { enrolledAt: { gte: startOfMonth } } }),
      prisma.enrollment.count({ where: { status: "COMPLETED" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.user.count({
        where: {
          enrollments: { some: { status: "ACTIVE" } },
          deletedAt: null,
        },
      }),
      prisma.certificate.count(),
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { enrolledAt: "desc" },
        include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { status: "COMPLETED" },
        include: { user: { select: { name: true } } },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { deletedAt: null },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.activityLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),
      prisma.payment.groupBy({
        by: ["createdAt"],
        where: { status: "COMPLETED", createdAt: { gte: twelveMonthsAgo } },
        _sum: { amount: true },
      }),
      prisma.enrollment.groupBy({
        by: ["enrolledAt"],
        where: { enrolledAt: { gte: twelveMonthsAgo } },
        _count: { id: true },
      }),
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const revenueByMonth = monthNames.map((month, i) => {
      const year = now.getFullYear();
      const monthDate = new Date(year, i, 1);
      const nextMonth = new Date(year, i + 1, 1);
      const sum = monthlyRevenue
        .filter((p) => {
          const d = new Date(p.createdAt);
          return d >= monthDate && d < nextMonth;
        })
        .reduce((acc, p) => acc + (p._sum.amount || 0), 0);
      return { month, revenue: Math.round(sum) };
    });

    const enrollmentsByMonth = monthNames.map((month, i) => {
      const year = now.getFullYear();
      const monthDate = new Date(year, i, 1);
      const nextMonth = new Date(year, i + 1, 1);
      const count = monthlyEnrollments.filter((e) => {
        const d = new Date(e.enrolledAt);
        return d >= monthDate && d < nextMonth;
      }).length;
      return { month, enrollments: count };
    });

    const activityIcons: Record<string, string> = {
      ENROLLMENT: "UserPlus",
      PAYMENT: "DollarSign",
      COURSE_CREATE: "BookOpen",
      USER_REGISTER: "Users",
      ASSIGNMENT_SUBMIT: "PenTool",
      COURSE_COMPLETE: "GraduationCap",
      LESSON_COMPLETE: "CheckCircle",
      CERTIFICATE_ISSUE: "Award",
    };

    const formattedActivity = recentActivity.map((a) => ({
      id: a.id,
      action: a.action,
      detail: a.details ? (typeof a.details === "object" ? JSON.stringify(a.details) : String(a.details)) : a.entity,
      time: a.createdAt.toISOString(),
      user: a.user.name || "System",
      icon: activityIcons[a.action] || "Activity",
    }));

    const activity = [
      ...recentEnrollments.map((e) => ({
        id: `enroll-${e.id}`,
        action: "New enrollment",
        detail: `${e.user.name || "Student"} enrolled in ${e.course.title}`,
        time: e.enrolledAt.toISOString(),
        icon: "UserPlus",
      })),
      ...recentPayments.map((p) => ({
        id: `pay-${p.id}`,
        action: "Payment received",
        detail: `${formatAmount(p.amount)} from ${p.user.name || "Student"}`,
        time: p.createdAt.toISOString(),
        icon: "DollarSign",
      })),
      ...recentUsers.map((u) => ({
        id: `user-${u.id}`,
        action: "New user",
        detail: `${u.name || u.email} created an account`,
        time: u.createdAt.toISOString(),
        icon: "Users",
      })),
      ...formattedActivity,
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);

    const stats = {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue: revenueResult._sum.amount || 0,
      newUsersThisMonth,
      enrollmentsThisMonth,
      revenueThisMonth: revenueThisMonthResult._sum.amount || 0,
      publishedCourses,
      pendingReviews,
      activeStudents,
      totalCertificates,
      completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        charts: {
          revenue: revenueByMonth,
          enrollments: enrollmentsByMonth,
        },
        activity,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "SAR", minimumFractionDigits: 0 }).format(amount);
}
