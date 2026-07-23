import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

function isAdmin(role: string | undefined) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const media = await prisma.mediaLibrary.findUnique({
      where: { id },
      include: {
        uploader: { select: { id: true, name: true, email: true } },
      },
    });

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("Media [id] GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const media = await prisma.mediaLibrary.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", media.url);
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn("File not found on disk:", filePath);
    }

    await prisma.mediaLibrary.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { message: "Media deleted" } });
  } catch (error) {
    console.error("Media [id] DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete media" }, { status: 500 });
  }
}
