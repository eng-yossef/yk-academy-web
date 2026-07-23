import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);
    const now = new Date();

    const [assignments, attendance] = await Promise.all([
      prisma.assignment.findMany({
        where: {
          courseId: { in: courseIds },
          isPublished: true,
          dueDate: { gte: now },
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          type: true,
          course: { select: { id: true, title: true } },
        },
        orderBy: { dueDate: "asc" },
      }),
      prisma.attendance.findMany({
        where: { userId: session.user.id, date: { gte: now } },
        include: { course: { select: { id: true, title: true } } },
        orderBy: { date: "asc" },
      }),
    ]);

    const events = [
      ...assignments.map((a) => ({
        id: a.id,
        title: a.title,
        date: a.dueDate,
        type: "ASSIGNMENT",
        courseTitle: a.course.title,
        courseId: a.course.id,
      })),
      ...attendance.map((a) => ({
        id: a.id,
        title: `Attendance - ${a.course.title}`,
        date: a.date,
        type: "ATTENDANCE",
        courseTitle: a.course.title,
        courseId: a.course.id,
      })),
    ].sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Calendar GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch calendar" }, { status: 500 });
  }
}
