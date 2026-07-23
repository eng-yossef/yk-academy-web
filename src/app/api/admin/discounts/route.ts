import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function isAdmin(role: string | undefined) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: discounts });
  } catch (error) {
    console.error("Discounts GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch discounts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json({ success: false, error: "Content-Type must be application/json" }, { status: 415 });
  }

  try {
    const body = await request.json();
    const { code, description, type, value, maxUses, minAmount, expiresAt, isActive } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json({ success: false, error: "Code, type, and value are required" }, { status: 400 });
    }

    if (!["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json({ success: false, error: "Type must be PERCENTAGE or FIXED" }, { status: 400 });
    }

    if (type === "PERCENTAGE" && (value <= 0 || value > 100)) {
      return NextResponse.json({ success: false, error: "Percentage value must be between 1 and 100" }, { status: 400 });
    }

    const existing = await prisma.discountCode.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Discount code already exists" }, { status: 409 });
    }

    const discount = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        type,
        value,
        maxUses: maxUses ?? null,
        minAmount: minAmount ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, data: discount }, { status: 201 });
  } catch (error) {
    console.error("Discounts POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create discount" }, { status: 500 });
  }
}
