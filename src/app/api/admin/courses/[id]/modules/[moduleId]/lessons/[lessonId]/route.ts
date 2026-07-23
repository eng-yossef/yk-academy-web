import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().nullable(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, moduleId, lessonId } = await params;

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, moduleId, module: { courseId: id } },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lesson });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch lesson" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, moduleId, lessonId } = await params;

    const existing = await prisma.lesson.findFirst({
      where: { id: lessonId, moduleId, module: { courseId: id } },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateLessonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: lesson });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, moduleId, lessonId } = await params;

    const existing = await prisma.lesson.findFirst({
      where: { id: lessonId, moduleId, module: { courseId: id } },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    await prisma.lesson.delete({ where: { id: lessonId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete lesson" }, { status: 500 });
  }
}
