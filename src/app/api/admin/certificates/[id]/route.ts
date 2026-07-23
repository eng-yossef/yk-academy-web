import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        course: { select: { id: true, title: true, description: true } },
      },
    });

    if (!certificate) {
      return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: certificate });
  } catch (error) {
    console.error("Certificate [id] GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch certificate" }, { status: 500 });
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
    await prisma.certificate.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { message: "Certificate deleted" } });
  } catch (error) {
    console.error("Certificate [id] DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete certificate" }, { status: 500 });
  }
}
