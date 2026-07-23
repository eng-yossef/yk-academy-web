import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: session.user.id },
      include: {
        course: { select: { id: true, title: true, image: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: certificates });
  } catch (error) {
    console.error("Certificates GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 });
  }
}
