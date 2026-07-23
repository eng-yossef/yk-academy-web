import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, data: { updated: result.count } });
  } catch (error) {
    console.error("Read all notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to mark notifications as read" }, { status: 500 });
  }
}
