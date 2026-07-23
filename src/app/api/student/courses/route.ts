import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            category: true,
            instructor: { select: { name: true } },
            modules: {
              include: {
                lessons: { select: { id: true } },
              },
            },
          },
        },
        progressRecords: {
          select: { lessonId: true, status: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const courses = enrollments.map((enrollment: (typeof enrollments)[number]) => {
      const totalLessons = enrollment.course.modules.reduce(
        (sum: number, mod: (typeof enrollment.course.modules)[number]) => sum + mod.lessons.length,
        0
      );
      const completedLessons = enrollment.progressRecords.filter(
        (p: (typeof enrollment.progressRecords)[number]) => p.status === "COMPLETED"
      ).length;

      return {
        id: enrollment.courseId,
        title: enrollment.course.title,
        thumbnail: enrollment.course.image,
        category: enrollment.course.category?.name ?? "General",
        instructor: enrollment.course.instructor?.name ?? "Unknown",
        progress: enrollment.progress,
        status: enrollment.status,
        lastAccessed: enrollment.updatedAt,
        totalLessons,
        completedLessons,
      };
    });

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
