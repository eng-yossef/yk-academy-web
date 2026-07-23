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
    ]);

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
      completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
