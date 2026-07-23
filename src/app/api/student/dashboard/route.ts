import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    const [enrollments, certificates, recentActivity] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: { id: true, title: true, image: true, modules: { include: { lessons: { select: { id: true } } } } },
          },
          progressRecords: { select: { lessonId: true, status: true } },
        },
      }),
      prisma.certificate.count({ where: { userId } }),
      prisma.lessonProgress.findMany({
        where: { userId, lastAccessedAt: { not: null } },
        include: { lesson: { select: { title: true } } },
        orderBy: { lastAccessedAt: "desc" },
        take: 10,
      }),
    ]);

    const enrolledCount = enrollments.length;
    const completedCount = enrollments.filter((e) => e.status === "COMPLETED").length;

    let totalLessons = 0;
    let completedLessons = 0;
    for (const e of enrollments) {
      const courseLessons = e.course.modules.reduce((s, m) => s + m.lessons.length, 0);
      totalLessons += courseLessons;
      completedLessons += e.progressRecords.length;
    }
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        enrolledCount,
        completedCount,
        certificatesCount: certificates,
        overallProgress,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
