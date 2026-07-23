import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const verificationLog = await prisma.activityLog.findFirst({
      where: {
        action: "EMAIL_VERIFICATION",
        details: {
          path: ["token"],
          equals: token,
        },
      },
    });

    if (!verificationLog) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    const details = verificationLog.details as Record<string, string>;

    if (details.expiresAt && new Date(details.expiresAt) < new Date()) {
      await prisma.activityLog.delete({ where: { id: verificationLog.id } });
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: verificationLog.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      await prisma.activityLog.delete({ where: { id: verificationLog.id } });
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.activityLog.delete({ where: { id: verificationLog.id } });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
