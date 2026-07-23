import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        lesson: {
          include: {
            module: {
              include: { course: { select: { id: true, title: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: bookmarks });
  } catch (error) {
    console.error("Bookmarks GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bookmarks" }, { status: 500 });
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
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json({ success: false, error: "lessonId is required" }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Already bookmarked" }, { status: 409 });
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId: session.user.id, lessonId },
      include: { lesson: { select: { id: true, title: true } } },
    });

    return NextResponse.json({ success: true, data: bookmark }, { status: 201 });
  } catch (error) {
    console.error("Bookmark POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to add bookmark" }, { status: 500 });
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
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json({ success: false, error: "lessonId is required" }, { status: 400 });
    }

    await prisma.bookmark.delete({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
    });

    return NextResponse.json({ success: true, data: { message: "Bookmark removed" } });
  } catch (error) {
    console.error("Bookmark DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to remove bookmark" }, { status: 500 });
  }
}
