import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const grades = await prisma.grade.findMany({
      where: { userId: session.user.id },
      include: {
        course: { select: { id: true, title: true } },
        assignment: { select: { id: true, title: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: grades });
  } catch (error) {
    console.error("Grades GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch grades" }, { status: 500 });
  }
}
