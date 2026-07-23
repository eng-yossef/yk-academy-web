import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const courseId = searchParams.get("courseId");
    const dateFrom = searchParams.get("from");
    const dateTo = searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (courseId) where.courseId = courseId;
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { course: { title: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (dateFrom || dateTo) {
      where.enrolledAt = {};
      if (dateFrom) (where.enrolledAt as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.enrolledAt as Record<string, unknown>).lte = new Date(dateTo);
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
        payments: { select: { id: true, amount: true, status: true }, take: 1 },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const result = enrollments.map((e) => ({
      ...e,
      payment: e.payments[0] || null,
      payments: undefined,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "id and status are required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status,
        ...(status === "COMPLETED" && { completedAt: new Date() }),
      },
    });

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update enrollment" }, { status: 500 });
  }
}
