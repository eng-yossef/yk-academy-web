import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { lessonId, courseId, status, progress } = body;

    if (!lessonId || !courseId || !status) {
      return NextResponse.json(
        { success: false, error: "lessonId, courseId, and status are required" },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Not enrolled in this course" },
        { status: 403 }
      );
    }

    const progressRecord = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        status: status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED",
        progress: progress ?? (status === "COMPLETED" ? 100 : 0),
        completedAt: status === "COMPLETED" ? new Date() : null,
        lastAccessedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        enrollmentId: enrollment.id,
        status: status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED",
        progress: progress ?? (status === "COMPLETED" ? 100 : 0),
        completedAt: status === "COMPLETED" ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });

    const totalLessonsInCourse = await prisma.lesson.count({
      where: {
        module: { courseId },
      },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        lesson: { module: { courseId } },
      },
    });

    const courseProgress =
      totalLessonsInCourse > 0
        ? Math.round((completedLessons / totalLessonsInCourse) * 100)
        : 0;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: courseProgress,
        status: courseProgress === 100 ? "COMPLETED" : enrollment.status,
        completedAt: courseProgress === 100 ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        progressRecord,
        courseProgress,
        completedLessons,
        totalLessons: totalLessonsInCourse,
      },
    });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      const record = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId,
          },
        },
      });
      return NextResponse.json({ success: true, data: record });
    }

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "courseId or lessonId is required" },
        { status: 400 }
      );
    }

    const records = await prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        lesson: { module: { courseId } },
      },
      include: {
        lesson: { select: { id: true, title: true, moduleId: true } },
      },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
