import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().nullable(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(0),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, moduleId } = await params;

    const mod = await prisma.module.findFirst({
      where: { id: moduleId, courseId: id },
    });

    if (!mod) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: lessons });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch lessons" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, moduleId } = await params;

    const mod = await prisma.module.findFirst({
      where: { id: moduleId, courseId: id },
    });

    if (!mod) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createLessonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        ...parsed.data,
        moduleId,
      },
    });

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create lesson" }, { status: 500 });
  }
}
