import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { message: "If an account exists, a verification email has been sent" },
        { status: 200 }
      );
    }

    const existingToken = await prisma.activityLog.findFirst({
      where: {
        userId: user.id,
        action: "EMAIL_VERIFICATION",
      },
    });

    if (existingToken) {
      await prisma.activityLog.delete({ where: { id: existingToken.id } });
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.activityLog.create({
      data: {
        action: "EMAIL_VERIFICATION",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        details: {
          token,
          userId: user.id,
          expiresAt: expiresAt.toISOString(),
        },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;
    console.log("Email verification URL:", verificationUrl);

    return NextResponse.json(
      { message: "If an account exists, a verification email has been sent" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
