import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string | undefined) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const search = searchParams.get("search") || "";
  const isActive = searchParams.get("isActive");

  try {
    const where: Record<string, unknown> = {};

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const [subscribers, total, activeCount, inactiveCount] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscriber.count({ where }),
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.subscriber.count({ where: { isActive: false } }),
    ]);

    return NextResponse.json({
      success: true,
      data: subscribers,
      stats: { total, active: activeCount, inactive: inactiveCount },
      pagination: { page, limit, totalPages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    console.error("Subscribers GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, action, isActive, name } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    if (action === "delete") {
      await prisma.subscriber.delete({ where: { id } });
      return NextResponse.json({ success: true, data: { message: "Subscriber deleted" } });
    }

    const data: Record<string, unknown> = {};
    if (typeof isActive === "boolean") data.isActive = isActive;
    if (typeof name === "string") data.name = name;

    const subscriber = await prisma.subscriber.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: subscriber });
  } catch (error) {
    console.error("Subscribers PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update subscriber" }, { status: 500 });
  }
}
