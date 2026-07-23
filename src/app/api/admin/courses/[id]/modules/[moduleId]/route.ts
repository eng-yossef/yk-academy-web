import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateModuleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
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
      include: {
        lessons: { orderBy: { order: "asc" } },
      },
    });

    if (!mod) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: mod });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch module" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, moduleId } = await params;

    const existing = await prisma.module.findFirst({
      where: { id: moduleId, courseId: id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateModuleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const mod = await prisma.module.update({
      where: { id: moduleId },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: mod });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update module" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, moduleId } = await params;

    const existing = await prisma.module.findFirst({
      where: { id: moduleId, courseId: id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    await prisma.lesson.deleteMany({ where: { moduleId } });
    await prisma.module.delete({ where: { id: moduleId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete module" }, { status: 500 });
  }
}
