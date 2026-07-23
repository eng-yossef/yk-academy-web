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
    const discount = await prisma.discountCode.findUnique({ where: { id } });

    if (!discount) {
      return NextResponse.json({ success: false, error: "Discount not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: discount });
  } catch (error) {
    console.error("Discount [id] GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch discount" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json({ success: false, error: "Content-Type must be application/json" }, { status: 415 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.type && !["PERCENTAGE", "FIXED"].includes(body.type)) {
      return NextResponse.json({ success: false, error: "Type must be PERCENTAGE or FIXED" }, { status: 400 });
    }

    if (body.code) {
      body.code = body.code.toUpperCase();
    }

    if (body.expiresAt) {
      body.expiresAt = new Date(body.expiresAt);
    }

    const discount = await prisma.discountCode.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: discount });
  } catch (error) {
    console.error("Discount [id] PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update discount" }, { status: 500 });
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
    await prisma.discountCode.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { message: "Discount deleted" } });
  } catch (error) {
    console.error("Discount [id] DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete discount" }, { status: 500 });
  }
}
