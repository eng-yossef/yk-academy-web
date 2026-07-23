import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  try {
    const where: Record<string, unknown> = { userId: session.user.id };
    if (courseId) where.courseId = courseId;

    const activityLogs = await prisma.activityLog.findMany({
      where: { ...where, action: "NOTE" },
      orderBy: { createdAt: "desc" },
    });

    const notes = activityLogs.map((log) => ({
      id: log.id,
      content: (log.details as Record<string, unknown>)?.content,
      lessonId: log.entityId,
      courseId: (log.details as Record<string, unknown>)?.courseId,
      createdAt: log.createdAt,
      updatedAt: log.createdAt,
    }));

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error("Notes GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json({ success: false, error: "Content-Type must be application/json" }, { status: 415 });
  }

  try {
    const body = await request.json();
    const { lessonId, courseId, content } = body;

    if (!lessonId || !content) {
      return NextResponse.json({ success: false, error: "lessonId and content are required" }, { status: 400 });
    }

    const log = await prisma.activityLog.create({
      data: {
        action: "NOTE",
        entity: "Lesson",
        entityId: lessonId,
        userId: session.user.id,
        details: { content, courseId },
      },
    });

    return NextResponse.json({ success: true, data: { id: log.id, content, lessonId, courseId, createdAt: log.createdAt } }, { status: 201 });
  } catch (error) {
    console.error("Notes POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save note" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json({ success: false, error: "Content-Type must be application/json" }, { status: 415 });
  }

  try {
    const body = await request.json();
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json({ success: false, error: "noteId is required" }, { status: 400 });
    }

    const note = await prisma.activityLog.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== session.user.id || note.action !== "NOTE") {
      return NextResponse.json({ success: false, error: "Note not found" }, { status: 404 });
    }

    await prisma.activityLog.delete({ where: { id: noteId } });

    return NextResponse.json({ success: true, data: { message: "Note deleted" } });
  } catch (error) {
    console.error("Notes DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete note" }, { status: 500 });
  }
}
