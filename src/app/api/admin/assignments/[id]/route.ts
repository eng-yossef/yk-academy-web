import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { id: true, name: true } },
        submissions: {
          include: {
            student: { select: { id: true, name: true, email: true } },
          },
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error("Assignment GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch assignment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ success: false, error: "Content-Type must be application/json" }, { status: 415 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
    }

    if (body.type) {
      const validTypes = ["HOMEWORK", "QUIZ", "PROJECT", "EXAM"];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { success: false, error: `Type must be one of: ${validTypes.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (body.dueDate) body.dueDate = new Date(body.dueDate);

    const assignment = await prisma.assignment.update({
      where: { id },
      data: body,
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error("Assignment PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update assignment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
    }

    await prisma.assignment.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { message: "Assignment deleted" } });
  } catch (error) {
    console.error("Assignment DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete assignment" }, { status: 500 });
  }
}
