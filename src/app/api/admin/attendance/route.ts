import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string | undefined) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  try {
    const where: Record<string, unknown> = {};
    if (courseId) where.courseId = courseId;

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Admin attendance GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json({ success: false, error: "Content-Type must be application/json" }, { status: 415 });
  }

  try {
    const body = await request.json();
    const { courseId, date, records } = body;

    if (!courseId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json({ success: false, error: "courseId, date, and records array are required" }, { status: 400 });
    }

    const results = await prisma.$transaction(
      records.map((record: { userId: string; status: string; note?: string }) =>
        prisma.attendance.upsert({
          where: {
            userId_courseId_date: {
              userId: record.userId,
              courseId,
              date: new Date(date),
            },
          },
          update: {
            status: record.status as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
            note: record.note,
          },
          create: {
            userId: record.userId,
            courseId,
            date: new Date(date),
            status: record.status as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
            note: record.note,
          },
        })
      )
    );

    return NextResponse.json({ success: true, data: results }, { status: 201 });
  } catch (error) {
    console.error("Admin attendance POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to mark attendance" }, { status: 500 });
  }
}
