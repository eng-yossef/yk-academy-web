import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        instructor: { select: { id: true, name: true, email: true } },
        modules: {
          include: { lessons: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
        enrollments: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { enrolledAt: "desc" },
          take: 50,
        },
      },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const course = await prisma.course.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        shortDescription: body.shortDescription,
        level: body.level,
        price: body.price,
        discountPrice: body.discountPrice,
        isPublished: body.isPublished,
        isFeatured: body.isFeatured,
        tags: body.tags,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete course" }, { status: 500 });
  }
}
