import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function isAdmin(role: string | undefined) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `YKA-${timestamp}-${random}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: certificates });
  } catch (error) {
    console.error("Admin certificates GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 });
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
    const { userId, courseId, template, pdfUrl } = body;

    if (!userId || !courseId) {
      return NextResponse.json({ success: false, error: "userId and courseId are required" }, { status: 400 });
    }

    const existing = await prisma.certificate.findFirst({
      where: { userId, courseId },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: "Certificate already issued for this user and course" }, { status: 409 });
    }

    const certificateNumber = generateCertificateNumber();
    const verificationUrl = `https://ykacademy.com/verify/${certificateNumber}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateNumber,
        template,
        pdfUrl,
        verificationUrl,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, data: certificate }, { status: 201 });
  } catch (error) {
    console.error("Admin certificates POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to issue certificate" }, { status: 500 });
  }
}
