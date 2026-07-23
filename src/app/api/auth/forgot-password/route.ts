import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const rl = rateLimit(`forgot-password:${ip}`, 3, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "If an account with that email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    // Invalidate any existing reset tokens for this user
    await prisma.activityLog.deleteMany({
      where: {
        userId: user.id,
        action: "PASSWORD_RESET_TOKEN",
      },
    });

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.activityLog.create({
      data: {
        action: "PASSWORD_RESET_TOKEN",
        entity: "User",
        entityId: user.id,
        details: {
          token,
          expiresAt: expiresAt.toISOString(),
          userId: user.id,
        },
        userId: user.id,
      },
    });

    // TODO: Send email with reset link containing the token
    // For now, log the token for development
    console.log(`[PASSWORD RESET] Token for ${email}: ${token}`);
    console.log(`[PASSWORD RESET] Reset URL: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`);

    return NextResponse.json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
