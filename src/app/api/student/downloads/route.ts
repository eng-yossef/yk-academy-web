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

    const resources = await prisma.resource.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: resources });
  } catch (error) {
    console.error("Downloads GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch downloads" }, { status: 500 });
  }
}
